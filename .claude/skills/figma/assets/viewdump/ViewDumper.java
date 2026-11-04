// Copied unchanged from CyberLink-Team/rdqe-spec-contract-agent, branch feat/figma-android-ui-conformance @ 7282f65
// (skills/figma-phd-android-ui-conformance/assets/viewdump/src), with the user's approval (2026-11-04, REQ-085) as an
// exception to the repo's independence rule. Built and run by scripts/android-viewdump.ts.
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.Outline;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.ColorStateListDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.DrawableContainer;
import android.graphics.drawable.DrawableWrapper;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.InsetDrawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.NinePatchDrawable;
import android.graphics.drawable.RippleDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.StateListDrawable;
import android.graphics.drawable.VectorDrawable;
import android.os.Build;
import android.os.SystemClock;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.BackgroundColorSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.RelativeSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.TypefaceSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewOutlineProvider;
import android.view.WindowManager;
import android.view.inspector.WindowInspector;
import android.widget.CompoundButton;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.FileOutputStream;
import java.lang.ref.Reference;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 在 app process 的 main thread 執行，輸出所有 window 的 View tree 與視覺屬性成 JSON。
 * 只輸出「非預設值」（0 / false / null 會省略），以降低雜訊。
 * 被 R8 混淆的類別與欄位名稱原樣輸出，由 PC 端 capture-android-viewdump.mjs 依 R8 mapping 還原。
 */
public final class ViewDumper {
    private static final String TAG = "ViewDumper";

    private static Resources res;
    private static float density = 1f, scaledDensity = 1f;
    private static final Map<Integer, String> STATE_NAMES = new HashMap<>();
    private static final Map<Integer, String> ATTR_NAMES = new HashMap<>();
    private static final Map<Integer, String> RES_NAME_CACHE = new HashMap<>();
    private static int reflectBudget;
    private static boolean lpMode;   // LayoutParams 模式：-1/MIN_VALUE 為 UNSET、0 可能是 PARENT_ID、int 可能是 view id
    private static boolean withAttrs = true, withFields = true, onlyShown = true;

    private static final String SECURE_CLEAR = "secure=clear";
    private static final String SECURE_RESTORE = "secure=restore:";

    public static String dump(String outPath, String args) {
        long t0 = SystemClock.uptimeMillis();
        try {
            Set<String> tokens = new HashSet<>(Arrays.asList(args == null ? new String[0] : args.split(",")));
            String restoreToken = null;
            for (String t : tokens) if (t.startsWith(SECURE_RESTORE)) restoreToken = t.substring(SECURE_RESTORE.length());
            if (restoreToken != null) return restoreSecure(outPath, restoreToken);
            withAttrs = !tokens.contains("noattrs");
            withFields = !tokens.contains("nofields");
            onlyShown = !tokens.contains("all");
            initStateNames();
            List<View> roots = WindowInspector.getGlobalWindowViews();
            JSONObject out = new JSONObject();
            out.put("timestamp", System.currentTimeMillis());
            out.put("sdk", Build.VERSION.SDK_INT);
            out.put("device", Build.MANUFACTURER + " " + Build.MODEL);
            JSONArray windows = new JSONArray();
            int count = 0;
            for (View root : roots) {
                if (res == null) {
                    res = root.getResources();
                    density = res.getDisplayMetrics().density;
                    scaledDensity = res.getDisplayMetrics().scaledDensity;
                    out.put("density", density);
                    out.put("scaledDensity", scaledDensity);
                    out.put("package", root.getContext().getPackageName());
                }
                if (onlyShown && !root.isShown()) continue;
                JSONObject w = new JSONObject();
                ViewGroup.LayoutParams lp = root.getLayoutParams();
                if (lp instanceof WindowManager.LayoutParams) {
                    WindowManager.LayoutParams wlp = (WindowManager.LayoutParams) lp;
                    w.put("title", String.valueOf(wlp.getTitle()));
                    w.put("type", wlp.type);
                    w.put("flags", "0x" + Integer.toHexString(wlp.flags));
                    if (wlp.dimAmount > 0 && (wlp.flags & WindowManager.LayoutParams.FLAG_DIM_BEHIND) != 0) w.put("dimAmount", wlp.dimAmount);
                }
                Object act = activityOf(root.getContext());
                View content = root.findViewById(android.R.id.content);
                if (act == null && content != null) act = activityOf(content.getContext());
                if (act == null && root instanceof ViewGroup && ((ViewGroup) root).getChildCount() > 0)
                    act = activityOf(((ViewGroup) root).getChildAt(0).getContext());
                if (act != null) w.put("activity", act.getClass().getName());
                w.put("hasWindowFocus", root.hasWindowFocus());
                int[] n = new int[1];
                w.put("root", dumpView(root, n));
                count += n[0];
                windows.put(w);
            }
            out.put("windows", windows);
            out.put("debugViewAttributes", String.valueOf(getStaticField(View.class, "sDebugViewAttributes")));
            if (xmlAttrError != null) out.put("xmlAttrError", xmlAttrError);
            if (tokens.contains(SECURE_CLEAR)) out.put("secureFlag", clearSecure(roots));
            byte[] bytes = out.toString().getBytes(StandardCharsets.UTF_8);
            try (FileOutputStream fos = new FileOutputStream(outPath)) {
                fos.write(bytes);
            }
            String msg = "OK windows=" + windows.length() + " views=" + count + " bytes=" + bytes.length
                    + " ms=" + (SystemClock.uptimeMillis() - t0) + " out=" + outPath;
            Log.i(TAG, msg);
            return msg;
        } catch (Throwable t) {
            Log.e(TAG, "dump failed", t);
            try (FileOutputStream fos = new FileOutputStream(outPath + ".err")) {
                fos.write(Log.getStackTraceString(t).getBytes(StandardCharsets.UTF_8));
            } catch (Throwable ignored) {
            }
            return "ERR " + t;
        }
    }

    // ---------------------------------------------------------------- FLAG_SECURE

    // 螢幕截圖對 FLAG_SECURE 視窗回傳空內容。只在截圖那一瞬間拿掉旗標：複製 LayoutParams、清掉 bit、
    // updateViewLayout；之後由 restoreSecure 依 root 的 identity hash 補回去。
    private static String hashOf(View root) {
        return Integer.toHexString(System.identityHashCode(root));
    }

    private static JSONObject clearSecure(List<View> roots) throws Exception {
        JSONObject result = new JSONObject();
        JSONArray cleared = new JSONArray();
        try {
            for (View root : roots) {
                if (!(root.getLayoutParams() instanceof WindowManager.LayoutParams)) continue;
                WindowManager.LayoutParams lp = (WindowManager.LayoutParams) root.getLayoutParams();
                if ((lp.flags & WindowManager.LayoutParams.FLAG_SECURE) == 0) continue;
                String title = String.valueOf(lp.getTitle());
                WindowManager.LayoutParams copy = new WindowManager.LayoutParams();
                copy.copyFrom(lp);
                copy.flags &= ~WindowManager.LayoutParams.FLAG_SECURE;
                windowManagerOf(root).updateViewLayout(root, copy);
                cleared.put(new JSONObject().put("hash", hashOf(root)).put("title", title));
            }
        } catch (Throwable t) {
            result.put("error", String.valueOf(t));
        }
        result.put("cleared", cleared);
        return result;
    }

    private static String restoreSecure(String outPath, String hashList) throws Exception {
        Set<String> wanted = new HashSet<>(Arrays.asList(hashList.split("[.]")));
        JSONArray restored = new JSONArray();
        for (View root : WindowInspector.getGlobalWindowViews()) {
            String hash = hashOf(root);
            if (!(root.getLayoutParams() instanceof WindowManager.LayoutParams) || !wanted.remove(hash)) continue;
            WindowManager.LayoutParams lp = (WindowManager.LayoutParams) root.getLayoutParams();
            WindowManager.LayoutParams copy = new WindowManager.LayoutParams();
            copy.copyFrom(lp);
            copy.flags |= WindowManager.LayoutParams.FLAG_SECURE;
            windowManagerOf(root).updateViewLayout(root, copy);
            restored.put(new JSONObject().put("hash", hash).put("title", String.valueOf(lp.getTitle())));
        }
        JSONArray missing = new JSONArray();
        for (String h : wanted) if (!h.isEmpty()) missing.put(h);
        JSONObject out = new JSONObject().put("secureFlag", new JSONObject().put("restored", restored).put("missing", missing));
        byte[] bytes = out.toString().getBytes(StandardCharsets.UTF_8);
        try (FileOutputStream fos = new FileOutputStream(outPath)) {
            fos.write(bytes);
        }
        return "OK restored=" + restored.length() + " missing=" + missing.length() + " out=" + outPath;
    }

    private static WindowManager windowManagerOf(View root) {
        return (WindowManager) root.getContext().getSystemService(Context.WINDOW_SERVICE);
    }

    // ---------------------------------------------------------------- View

    private static JSONObject dumpView(View v, int[] counter) throws Exception {
        counter[0]++;
        JSONObject o = new JSONObject();
        o.put("class", v.getClass().getName());
        String fw = frameworkSuper(v.getClass());
        if (!fw.equals(v.getClass().getName())) o.put("base", fw);
        o.put("hash", Integer.toHexString(System.identityHashCode(v)));
        if (v.getId() != View.NO_ID) o.put("id", resName(v.getId()));
        int layoutId = v.getSourceLayoutResId();
        if (layoutId != 0) o.put("layout", resName(layoutId));

        // 位置與大小
        int[] loc = new int[2];
        v.getLocationOnScreen(loc);
        o.put("screen", arr(loc[0], loc[1], loc[0] + v.getWidth(), loc[1] + v.getHeight()));
        o.put("size", v.getWidth() + "x" + v.getHeight() + "px (" + dp(v.getWidth()) + "x" + dp(v.getHeight()) + "dp)");
        if (v.getVisibility() != View.VISIBLE) o.put("visibility", v.getVisibility() == View.GONE ? "GONE" : "INVISIBLE");
        if (!v.isShown()) o.put("shown", false);
        if (v.getPaddingLeft() != 0 || v.getPaddingTop() != 0 || v.getPaddingRight() != 0 || v.getPaddingBottom() != 0)
            o.put("padding", arr(v.getPaddingLeft(), v.getPaddingTop(), v.getPaddingRight(), v.getPaddingBottom()));
        putLayoutParams(o, v.getLayoutParams());

        // 狀態
        JSONArray st = new JSONArray();
        if (v.isClickable()) st.put("clickable");
        if (v.isLongClickable()) st.put("longClickable");
        if (v.isFocusable()) st.put("focusable");
        if (v.isFocused()) st.put("focused");
        if (v.isSelected()) st.put("selected");
        if (v.isActivated()) st.put("activated");
        if (v.isPressed()) st.put("pressed");
        if (!v.isEnabled()) st.put("disabled");
        if (st.length() > 0) o.put("state", st);
        if (v.getContentDescription() != null) o.put("contentDescription", v.getContentDescription().toString());
        if (v.getTooltipText() != null) o.put("tooltip", v.getTooltipText().toString());
        if (v.getTag() instanceof CharSequence) o.put("tag", v.getTag().toString());

        // 外觀：透明度、transform
        putNz(o, "alpha", v.getAlpha(), 1f);
        putNz(o, "rotation", v.getRotation(), 0f);
        putNz(o, "scaleX", v.getScaleX(), 1f);
        putNz(o, "scaleY", v.getScaleY(), 1f);
        putNz(o, "translationX", v.getTranslationX(), 0f);
        putNz(o, "translationY", v.getTranslationY(), 0f);
        if (v.getScrollX() != 0 || v.getScrollY() != 0) o.put("scroll", arr(v.getScrollX(), v.getScrollY()));

        // 陰影：elevation / translationZ / outline / shadow color
        JSONObject sh = new JSONObject();
        putNz(sh, "elevation", v.getElevation(), 0f);
        putNz(sh, "translationZ", v.getTranslationZ(), 0f);
        if (v.getElevation() + v.getTranslationZ() != 0) {
            sh.put("ambientColor", color(v.getOutlineAmbientShadowColor()));
            sh.put("spotColor", color(v.getOutlineSpotShadowColor()));
        }
        if (sh.length() > 0) o.put("shadow", sh);
        JSONObject ol = outlineOf(v);
        if (ol != null) o.put("outline", ol);

        // 背景 / 前景 / tint
        Drawable bg = v.getBackground();
        if (bg != null) o.put("background", drawable(bg, 0));
        if (v.getBackgroundTintList() != null) o.put("backgroundTint", csl(v.getBackgroundTintList()));
        if (v.getBackgroundTintMode() != null) o.put("backgroundTintMode", v.getBackgroundTintMode().name());
        Drawable fg = v.getForeground();
        if (fg != null) o.put("foreground", drawable(fg, 0));

        if (v instanceof TextView) putText(o, (TextView) v);
        if (v instanceof ImageView) putImage(o, (ImageView) v);
        if (v instanceof CompoundButton) {
            o.put("checked", ((CompoundButton) v).isChecked());
            Drawable b = ((CompoundButton) v).getButtonDrawable();
            if (b != null) o.put("buttonDrawable", drawable(b, 1));
        }
        if (v instanceof ProgressBar) {
            ProgressBar p = (ProgressBar) v;
            o.put("progress", p.isIndeterminate() ? "indeterminate" : p.getProgress() + "/" + p.getMax());
        }
        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            if (!g.getClipChildren()) o.put("clipChildren", false);
            if (!g.getClipToPadding()) o.put("clipToPadding", false);
        }

        // XML 上寫的屬性（需要 debug_view_attributes_application_package）
        if (withAttrs) {
            JSONObject a = xmlAttributes(v);
            if (a != null) o.put("xmlAttrs", a);
        }
        // 自訂 View 的欄位（例如自己畫圓角的 View 常把 radius 存在欄位）
        if (withFields && !isFramework(v.getClass())) {
            reflectBudget = v instanceof ViewGroup ? 60 : 150;
            JSONObject f = fields(v, v instanceof ViewGroup ? 1 : 2, new IdentityHashMap<Object, Boolean>());
            if (f != null && f.length() > 0) o.put("fields", f);
        }

        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            JSONArray children = new JSONArray();
            for (int i = 0; i < g.getChildCount(); i++) {
                View c = g.getChildAt(i);
                if (onlyShown && c.getVisibility() == View.GONE) continue;
                children.put(dumpView(c, counter));
            }
            if (children.length() > 0) o.put("children", children);
        }
        return o;
    }

    private static void putLayoutParams(JSONObject o, ViewGroup.LayoutParams lp) throws Exception {
        if (lp == null || lp instanceof WindowManager.LayoutParams) return;
        JSONObject l = new JSONObject();
        l.put("width", lpSize(lp.width));
        l.put("height", lpSize(lp.height));
        if (lp instanceof ViewGroup.MarginLayoutParams) {
            ViewGroup.MarginLayoutParams m = (ViewGroup.MarginLayoutParams) lp;
            if (m.leftMargin != 0 || m.topMargin != 0 || m.rightMargin != 0 || m.bottomMargin != 0)
                l.put("margin", arr(m.leftMargin, m.topMargin, m.rightMargin, m.bottomMargin));
        }
        if (lp instanceof FrameLayout.LayoutParams && ((FrameLayout.LayoutParams) lp).gravity != -1)
            l.put("gravity", gravity(((FrameLayout.LayoutParams) lp).gravity));
        if (lp instanceof LinearLayout.LayoutParams) {
            LinearLayout.LayoutParams ll = (LinearLayout.LayoutParams) lp;
            if (ll.weight != 0) l.put("weight", ll.weight);
            if (ll.gravity != -1) l.put("gravity", gravity(ll.gravity));
        }
        if (!isFramework(lp.getClass()) && withFields) {
            // 例如 ConstraintLayout.LayoutParams：dimensionRatio、bias、constraint target id…
            reflectBudget = 200;
            lpMode = true;
            JSONObject f = fields(lp, 0, new IdentityHashMap<Object, Boolean>());
            lpMode = false;
            if (f != null && f.length() > 0) l.put("fields", f);
        }
        o.put("layoutParams", l);
    }

    private static String lpSize(int s) {
        if (s == ViewGroup.LayoutParams.MATCH_PARENT) return "match_parent";
        if (s == ViewGroup.LayoutParams.WRAP_CONTENT) return "wrap_content";
        return s + "px(" + dp(s) + "dp)";
    }

    private static JSONObject outlineOf(View v) throws Exception {
        ViewOutlineProvider p = v.getOutlineProvider();
        boolean interesting = v.getClipToOutline() || v.getElevation() + v.getTranslationZ() != 0
                || (p != null && p != ViewOutlineProvider.BACKGROUND);
        if (!interesting) return null;
        JSONObject o = new JSONObject();
        o.put("provider", p == null ? "none" : p == ViewOutlineProvider.BACKGROUND ? "BACKGROUND"
                : p == ViewOutlineProvider.BOUNDS ? "BOUNDS" : p == ViewOutlineProvider.PADDED_BOUNDS ? "PADDED_BOUNDS"
                : p.getClass().getName());
        if (v.getClipToOutline()) o.put("clipToOutline", true);
        if (p != null && v.getWidth() > 0 && v.getHeight() > 0) {
            Outline out = new Outline();
            try {
                p.getOutline(v, out);
                putOutline(o, out);
            } catch (Throwable t) {
                o.put("error", t.toString());
            }
        }
        return o;
    }

    private static void putOutline(JSONObject o, Outline out) throws Exception {
        if (out.isEmpty()) {
            o.put("empty", true);
            return;
        }
        Rect r = new Rect();
        if (out.getRect(r)) {
            o.put("rect", arr(r.left, r.top, r.right, r.bottom));
            o.put("radius", px(out.getRadius()));
        } else {
            o.put("shape", "path");   // 四角不同半徑或非矩形
        }
        putNz(o, "shadowAlpha", out.getAlpha(), 1f);
    }

    // ---------------------------------------------------------------- Text

    private static void putText(JSONObject o, TextView t) throws Exception {
        JSONObject x = new JSONObject();
        CharSequence text = t.getText();
        x.put("text", text == null ? "" : text.toString());
        if (text instanceof Spanned) {
            JSONArray spans = spans((Spanned) text);
            if (spans.length() > 0) x.put("spans", spans);
        }
        if (t.getHint() != null) {
            x.put("hint", t.getHint().toString());
            x.put("hintColor", color(t.getCurrentHintTextColor()));
        }
        x.put("color", color(t.getCurrentTextColor()));
        ColorStateList tc = t.getTextColors();
        if (tc != null && tc.isStateful()) x.put("colorStates", csl(tc));
        x.put("size", px(t.getTextSize()) + "px (" + round(t.getTextSize() / scaledDensity) + "sp)");
        Typeface tf = t.getTypeface();
        if (tf != null) {
            JSONObject f = new JSONObject();
            f.put("weight", tf.getWeight());
            f.put("style", tf.getStyle() == Typeface.BOLD ? "bold" : tf.getStyle() == Typeface.ITALIC ? "italic"
                    : tf.getStyle() == Typeface.BOLD_ITALIC ? "bold|italic" : "normal");
            String fam = systemFontName(tf);
            if (fam != null) f.put("family", fam);
            x.put("typeface", f);
        }
        if (t.getFontFeatureSettings() != null) x.put("fontFeatureSettings", t.getFontFeatureSettings());
        if (t.getFontVariationSettings() != null) x.put("fontVariationSettings", t.getFontVariationSettings());
        putNz(x, "letterSpacing", t.getLetterSpacing(), 0f);
        putNz(x, "lineSpacingExtra", t.getLineSpacingExtra(), 0f);
        putNz(x, "lineSpacingMultiplier", t.getLineSpacingMultiplier(), 1f);
        x.put("lineHeight", t.getLineHeight());
        x.put("gravity", gravity(t.getGravity()));
        if (t.getMaxLines() != Integer.MAX_VALUE && t.getMaxLines() != -1) x.put("maxLines", t.getMaxLines());
        if (t.getEllipsize() != null) x.put("ellipsize", t.getEllipsize().name());
        if (t.getLayout() != null) x.put("lineCount", t.getLineCount());
        if (!t.getIncludeFontPadding()) x.put("includeFontPadding", false);
        if (t.getTransformationMethod() != null)
            x.put("transformation", t.getTransformationMethod().getClass().getName());
        int pf = t.getPaintFlags();
        if ((pf & Paint.UNDERLINE_TEXT_FLAG) != 0) x.put("underline", true);
        if ((pf & Paint.STRIKE_THRU_TEXT_FLAG) != 0) x.put("strikeThrough", true);
        if (t.getAutoSizeTextType() != TextView.AUTO_SIZE_TEXT_TYPE_NONE)
            x.put("autoSize", t.getAutoSizeMinTextSize() + "-" + t.getAutoSizeMaxTextSize() + "px step " + t.getAutoSizeStepGranularity());
        if (t.getShadowRadius() != 0 || t.getShadowDx() != 0 || t.getShadowDy() != 0) {
            JSONObject s = new JSONObject();
            s.put("radius", px(t.getShadowRadius()));
            s.put("dx", px(t.getShadowDx()));
            s.put("dy", px(t.getShadowDy()));
            s.put("color", color(t.getShadowColor()));
            x.put("textShadow", s);
        }
        Drawable[] cd = t.getCompoundDrawablesRelative();
        String[] side = {"start", "top", "end", "bottom"};
        JSONObject c = new JSONObject();
        for (int i = 0; i < 4; i++) if (cd[i] != null) c.put(side[i], drawable(cd[i], 1));
        if (c.length() > 0) {
            c.put("padding", t.getCompoundDrawablePadding());
            if (t.getCompoundDrawableTintList() != null) c.put("tint", csl(t.getCompoundDrawableTintList()));
            x.put("compoundDrawables", c);
        }
        o.put("text", x);
    }

    private static JSONArray spans(Spanned s) throws Exception {
        JSONArray a = new JSONArray();
        for (Object span : s.getSpans(0, s.length(), Object.class)) {
            JSONObject j = new JSONObject();
            j.put("class", span.getClass().getName());
            j.put("range", arr(s.getSpanStart(span), s.getSpanEnd(span)));
            if (span instanceof ForegroundColorSpan) j.put("color", color(((ForegroundColorSpan) span).getForegroundColor()));
            if (span instanceof BackgroundColorSpan) j.put("bgColor", color(((BackgroundColorSpan) span).getBackgroundColor()));
            if (span instanceof AbsoluteSizeSpan) j.put("size", ((AbsoluteSizeSpan) span).getSize() + (((AbsoluteSizeSpan) span).getDip() ? "dp" : "px"));
            if (span instanceof RelativeSizeSpan) j.put("relSize", ((RelativeSizeSpan) span).getSizeChange());
            if (span instanceof StyleSpan) j.put("style", ((StyleSpan) span).getStyle());
            if (span instanceof TypefaceSpan && ((TypefaceSpan) span).getFamily() != null) j.put("family", ((TypefaceSpan) span).getFamily());
            a.put(j);
        }
        return a;
    }

    private static Map<Typeface, String> fontNames;

    @SuppressWarnings("unchecked")
    private static String systemFontName(Typeface tf) {
        try {
            if (fontNames == null) {
                fontNames = new IdentityHashMap<>();
                Field f = Typeface.class.getDeclaredField("sSystemFontMap");
                f.setAccessible(true);
                for (Map.Entry<String, Typeface> e : ((Map<String, Typeface>) f.get(null)).entrySet())
                    if (!fontNames.containsKey(e.getValue())) fontNames.put(e.getValue(), e.getKey());
            }
            String n = fontNames.get(tf);
            if (n != null) return n;
            if (tf == Typeface.DEFAULT) return "DEFAULT";
            if (tf == Typeface.DEFAULT_BOLD) return "DEFAULT_BOLD";
            return null;   // 自訂字型（res/font 或 assets）
        } catch (Throwable t) {
            return null;
        }
    }

    // ---------------------------------------------------------------- Image

    private static void putImage(JSONObject o, ImageView iv) throws Exception {
        JSONObject x = new JSONObject();
        if (iv.getDrawable() != null) x.put("drawable", drawable(iv.getDrawable(), 0));
        x.put("scaleType", iv.getScaleType().name());
        if (iv.getImageTintList() != null) x.put("tint", csl(iv.getImageTintList()));
        if (iv.getImageTintMode() != null) x.put("tintMode", iv.getImageTintMode().name());
        if (iv.getColorFilter() != null) x.put("colorFilter", iv.getColorFilter().getClass().getName());
        if (iv.getImageAlpha() != 255) x.put("imageAlpha", iv.getImageAlpha());
        if (iv.getAdjustViewBounds()) x.put("adjustViewBounds", true);
        o.put("image", x);
    }

    // ---------------------------------------------------------------- Drawable

    private static JSONObject drawable(Drawable d, int depth) throws Exception {
        JSONObject o = new JSONObject();
        o.put("class", d.getClass().getName());
        if (depth > 6) return o;
        Rect b = d.getBounds();
        if (!b.isEmpty()) o.put("bounds", arr(b.left, b.top, b.right, b.bottom));
        if (d.getIntrinsicWidth() > 0 || d.getIntrinsicHeight() > 0)
            o.put("intrinsic", d.getIntrinsicWidth() + "x" + d.getIntrinsicHeight());
        if (d.getAlpha() != 255) o.put("alpha", d.getAlpha());
        if (d.getColorFilter() != null) o.put("colorFilter", d.getColorFilter().getClass().getName());
        Rect pad = new Rect();
        if (d.getPadding(pad) && (pad.left | pad.top | pad.right | pad.bottom) != 0)
            o.put("padding", arr(pad.left, pad.top, pad.right, pad.bottom));

        if (d instanceof ColorDrawable) {
            o.put("color", color(((ColorDrawable) d).getColor()));
        } else if (d instanceof GradientDrawable) {
            putGradient(o, (GradientDrawable) d);
        } else if (d instanceof ShapeDrawable) {
            ShapeDrawable s = (ShapeDrawable) d;
            if (s.getShape() != null) {
                JSONObject shape = new JSONObject();
                shape.put("class", s.getShape().getClass().getName());
                putField(shape, "outerRadii", s.getShape(), "mOuterRadii");
                putField(shape, "innerRadii", s.getShape(), "mInnerRadii");
                o.put("shape", shape);
            }
            o.put("paint", paint(s.getPaint()));
        } else if (d instanceof ColorStateListDrawable) {
            o.put("colorStates", csl(((ColorStateListDrawable) d).getColorStateList()));
        } else if (d instanceof BitmapDrawable) {
            Bitmap bm = ((BitmapDrawable) d).getBitmap();
            if (bm != null) o.put("bitmap", bm.getWidth() + "x" + bm.getHeight());
            putField(o, "tint", d, "mBitmapState", "mTint");
        } else if (d instanceof VectorDrawable) {
            putField(o, "tint", d, "mVectorState", "mTint");
        } else if (d instanceof NinePatchDrawable) {
            o.put("ninePatch", true);
        }

        if (d instanceof RippleDrawable) {
            RippleDrawable r = (RippleDrawable) d;
            if (Build.VERSION.SDK_INT >= 31) o.put("rippleColor", csl(r.getEffectColor()));
            if (r.getRadius() != RippleDrawable.RADIUS_AUTO) o.put("rippleRadius", r.getRadius());
        }
        if (d instanceof LayerDrawable) {
            LayerDrawable l = (LayerDrawable) d;
            JSONArray layers = new JSONArray();
            for (int i = 0; i < l.getNumberOfLayers(); i++) {
                JSONObject layer = new JSONObject();
                if (l.getId(i) != View.NO_ID && l.getId(i) != 0) layer.put("id", resName(l.getId(i)));
                int il = l.getLayerInsetLeft(i), it = l.getLayerInsetTop(i), ir = l.getLayerInsetRight(i), ib = l.getLayerInsetBottom(i);
                if ((il | it | ir | ib) != 0) layer.put("inset", arr(il, it, ir, ib));
                if (l.getLayerGravity(i) != Gravity.NO_GRAVITY) layer.put("gravity", gravity(l.getLayerGravity(i)));
                if (l.getLayerWidth(i) > 0 || l.getLayerHeight(i) > 0) layer.put("size", l.getLayerWidth(i) + "x" + l.getLayerHeight(i));
                Drawable c = l.getDrawable(i);
                if (c != null) layer.put("drawable", drawable(c, depth + 1));
                layers.put(layer);
            }
            o.put("layers", layers);
        } else if (d instanceof StateListDrawable) {
            StateListDrawable s = (StateListDrawable) d;
            JSONArray states = new JSONArray();
            for (int i = 0; i < s.getStateCount(); i++) {
                JSONObject j = new JSONObject();
                j.put("when", stateSet(s.getStateSet(i)));
                Drawable c = s.getStateDrawable(i);
                if (c != null) j.put("drawable", c == d.getCurrent() ? new JSONObject().put("current", true).put("class", c.getClass().getName()) : drawable(c, depth + 1));
                states.put(j);
            }
            if (d.getCurrent() != null && d.getCurrent() != d) o.put("current", drawable(d.getCurrent(), depth + 1));
            o.put("states", states);
        } else if (d instanceof DrawableContainer) {
            if (d.getCurrent() != null && d.getCurrent() != d) o.put("current", drawable(d.getCurrent(), depth + 1));
        } else if (d instanceof DrawableWrapper) {
            if (d instanceof InsetDrawable) putField(o, "insetState", d, "mState");
            Drawable c = ((DrawableWrapper) d).getDrawable();
            if (c != null) o.put("wrapped", drawable(c, depth + 1));
        }

        // 所有 drawable 都嘗試取 outline：能拿到圓角矩形時就是實際繪製的 radius
        if (!b.isEmpty()) {
            try {
                Outline out = new Outline();
                d.getOutline(out);
                if (!out.isEmpty()) {
                    JSONObject j = new JSONObject();
                    putOutline(j, out);
                    o.put("outline", j);
                }
            } catch (Throwable ignored) {
            }
        }
        // 非 framework drawable（MaterialShapeDrawable、CardView 的 RoundRectDrawable、自訂 drawable）→ 反射欄位
        if (withFields && !isFramework(d.getClass())) {
            int saved = reflectBudget;
            reflectBudget = 250;
            JSONObject f = fields(d, 4, new IdentityHashMap<Object, Boolean>());
            reflectBudget = saved;
            if (f != null && f.length() > 0) o.put("fields", f);
        }
        return o;
    }

    private static void putGradient(JSONObject o, GradientDrawable g) throws Exception {
        String[] shapes = {"rectangle", "oval", "line", "ring"};
        o.put("shape", g.getShape() >= 0 && g.getShape() < 4 ? shapes[g.getShape()] : String.valueOf(g.getShape()));
        float[] radii = null;
        try {
            radii = g.getCornerRadii();
        } catch (Throwable ignored) {
        }
        if (radii != null) {
            JSONArray a = new JSONArray();
            for (float r : radii) a.put(px(r));
            o.put("cornerRadii", a);   // [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]
        } else if (g.getCornerRadius() != 0) {
            o.put("cornerRadius", px(g.getCornerRadius()) + "px (" + dp(g.getCornerRadius()) + "dp)");
        }
        if (g.getColor() != null) o.put("color", csl(g.getColor()));
        int[] colors = g.getColors();
        if (colors != null) {
            JSONArray a = new JSONArray();
            for (int c : colors) a.put(color(c));
            o.put("gradientColors", a);
            String[] types = {"linear", "radial", "sweep"};
            o.put("gradientType", types[Math.max(0, Math.min(2, g.getGradientType()))]);
            o.put("orientation", g.getOrientation().name());
            if (g.getGradientType() == GradientDrawable.RADIAL_GRADIENT) o.put("gradientRadius", g.getGradientRadius());
        }
        // stroke 沒有 public getter，從 GradientState 讀
        Object state = getField(g, "mGradientState");
        if (state != null) {
            Object w = getField(state, "mStrokeWidth");
            if (w instanceof Integer && (Integer) w > 0) {
                JSONObject s = new JSONObject();
                s.put("width", w + "px (" + dp((Integer) w) + "dp)");
                Object sc = getField(state, "mStrokeColors");
                if (sc instanceof ColorStateList) s.put("color", csl((ColorStateList) sc));
                Object dw = getField(state, "mStrokeDashWidth");
                if (dw instanceof Float && (Float) dw > 0) {
                    s.put("dashWidth", dw);
                    s.put("dashGap", getField(state, "mStrokeDashGap"));
                }
                o.put("stroke", s);
            }
            Object tint = getField(state, "mTint");
            if (tint instanceof ColorStateList) o.put("tint", csl((ColorStateList) tint));
            Object ir = getField(state, "mInnerRadius");
            if (g.getShape() == GradientDrawable.RING && ir != null) o.put("innerRadius", ir);
        }
    }

    // ---------------------------------------------------------------- 反射

    private static boolean isFramework(Class<?> c) {
        String n = c.getName();
        return n.startsWith("android.") || n.startsWith("java.") || n.startsWith("javax.") || n.startsWith("dalvik.")
                || n.startsWith("libcore.") || n.startsWith("com.android.") || n.startsWith("org.json.") || n.startsWith("sun.");
    }

    private static String frameworkSuper(Class<?> c) {
        Class<?> k = c;
        while (k != null && !isFramework(k)) k = k.getSuperclass();
        return k == null ? c.getName() : k.getName();
    }

    /** 反射輸出物件欄位；key 為「宣告類別.欄位」，PC 端依 mapping 還原成原始名稱。 */
    private static JSONObject fields(Object obj, int depth, IdentityHashMap<Object, Boolean> seen) {
        if (seen.containsKey(obj)) return null;
        seen.put(obj, true);
        JSONObject o = new JSONObject();
        try {
            for (Class<?> k = obj.getClass(); k != null && !isFramework(k); k = k.getSuperclass()) {
                for (Field f : k.getDeclaredFields()) {
                    if (Modifier.isStatic(f.getModifiers()) || f.isSynthetic()) continue;
                    if (reflectBudget-- <= 0) {
                        o.put("…", "truncated");
                        return o;
                    }
                    f.setAccessible(true);
                    Object val = f.get(obj);
                    Object j = value(val, depth, seen);
                    if (j != null) o.put(k.getName() + "." + f.getName(), j);
                }
            }
        } catch (Throwable t) {
            try {
                o.put("!error", t.toString());
            } catch (Throwable ignored) {
            }
        }
        return o;
    }

    /** 轉成 JSON 值；回傳 null 代表省略（預設值或不重要）。 */
    private static Object value(Object v, int depth, IdentityHashMap<Object, Boolean> seen) throws Exception {
        if (v == null) return null;
        if (v instanceof Boolean) return ((Boolean) v) ? Boolean.TRUE : null;
        if (v instanceof Float || v instanceof Double) {
            double d = ((Number) v).doubleValue();
            if (d == 0) return null;
            return Double.isNaN(d) || Double.isInfinite(d) ? String.valueOf(d) : round(d);
        }
        if (lpMode && v instanceof Integer) {
            int i = (Integer) v;
            if (i == -1 || i == Integer.MIN_VALUE) return null;
            if ((i >>> 24) == 0x7f || (i >>> 24) == 0x01) {
                String n = resName(i);
                if (!n.startsWith("0x")) return "@" + n;
            }
            return i;
        }
        if (v instanceof Number) return ((Number) v).longValue() == 0 ? null : v;
        if (v instanceof Character) return String.valueOf(v);
        if (v instanceof CharSequence) return TextUtils.isEmpty((CharSequence) v) ? null : v.toString();
        if (v instanceof Enum) return ((Enum<?>) v).name();
        if (v instanceof float[]) {
            float[] a = (float[]) v;
            if (a.length > 16) return "float[" + a.length + "]";
            JSONArray j = new JSONArray();
            for (float x : a) j.put(round(x));
            return j;
        }
        if (v instanceof int[]) {
            int[] a = (int[]) v;
            if (a.length > 16) return "int[" + a.length + "]";
            JSONArray j = new JSONArray();
            for (int x : a) j.put(x);
            return j;
        }
        if (v.getClass().isArray()) return v.getClass().getComponentType().getName() + "[]";
        if (v instanceof ColorStateList) return csl((ColorStateList) v);
        if (v instanceof Paint) return paint((Paint) v);
        if (v instanceof RectF) {
            RectF r = (RectF) v;
            return r.isEmpty() && r.left == 0 && r.top == 0 ? null : arr(r.left, r.top, r.right, r.bottom);
        }
        if (v instanceof Rect) {
            Rect r = (Rect) v;
            return (r.left | r.top | r.right | r.bottom) == 0 ? null : arr(r.left, r.top, r.right, r.bottom);
        }
        if (v instanceof Drawable) {
            if (seen.containsKey(v)) return "<" + v.getClass().getName() + " (seen)>";
            seen.put(v, true);
            return depth > 0 ? drawable((Drawable) v, 3) : "<" + v.getClass().getName() + ">";
        }
        if (v instanceof View) return "<view " + v.getClass().getName() + " @" + Integer.toHexString(System.identityHashCode(v)) + ">";
        if (v instanceof Context || v instanceof Reference || v instanceof Thread || v instanceof Bitmap
                || v instanceof Path || v instanceof Matrix || v instanceof Resources || v instanceof Resources.Theme)
            return null;
        if (v instanceof Collection) return depth > 0 && ((Collection<?>) v).size() > 0 ? collection((Collection<?>) v, depth, seen) : null;
        if (v instanceof Map) return ((Map<?, ?>) v).isEmpty() ? null : "Map(" + ((Map<?, ?>) v).size() + ")";
        if (isFramework(v.getClass())) return null;   // 其他 framework 物件（listener、handler…）略過
        if (depth <= 0) return "<" + v.getClass().getName() + ">";
        JSONObject f = fields(v, depth - 1, seen);
        if (f == null) return "<" + v.getClass().getName() + " (seen)>";
        JSONObject wrap = new JSONObject();
        wrap.put("@class", v.getClass().getName());
        for (java.util.Iterator<String> it = f.keys(); it.hasNext(); ) {
            String k = it.next();
            wrap.put(k, f.get(k));
        }
        return wrap;
    }

    private static Object collection(Collection<?> c, int depth, IdentityHashMap<Object, Boolean> seen) throws Exception {
        JSONArray a = new JSONArray();
        int i = 0;
        for (Object x : c) {
            if (i++ >= 8) {
                a.put("… total " + c.size());
                break;
            }
            Object j = value(x, depth - 1, seen);
            a.put(j == null ? JSONObject.NULL : j);
        }
        return a;
    }

    private static Object getField(Object obj, String name) {
        for (Class<?> k = obj.getClass(); k != null; k = k.getSuperclass()) {
            try {
                Field f = k.getDeclaredField(name);
                f.setAccessible(true);
                return f.get(obj);
            } catch (NoSuchFieldException e) {
                // 往父類別找
            } catch (Throwable t) {
                return null;
            }
        }
        return null;
    }

    private static void putField(JSONObject o, String key, Object obj, String... path) {
        try {
            Object cur = obj;
            for (String p : path) {
                if (cur == null) return;
                cur = getField(cur, p);
            }
            if (cur == null) return;
            Object j;
            if (!isFramework(cur.getClass()) || cur instanceof ColorStateList || cur instanceof float[] || cur.getClass().isPrimitive() || cur instanceof Number) {
                j = value(cur, 1, new IdentityHashMap<Object, Boolean>());
            } else {
                // framework 內部 state（例如 InsetDrawable.InsetState）：只列出基本型別欄位
                JSONObject s = new JSONObject();
                for (Class<?> k = cur.getClass(); k != null && k != Object.class; k = k.getSuperclass()) {
                    for (Field f : k.getDeclaredFields()) {
                        if (Modifier.isStatic(f.getModifiers())) continue;
                        f.setAccessible(true);
                        Object fv = f.get(cur);
                        if (fv == null) continue;
                        Class<?> t = f.getType();
                        if (t.isPrimitive() || fv instanceof ColorStateList) {
                            Object jv = value(fv, 0, new IdentityHashMap<Object, Boolean>());
                            if (jv != null) s.put(f.getName(), jv);
                        } else if (t.getName().endsWith("InsetValue")) {
                            Object fr = getField(fv, "mFraction"), dim = getField(fv, "mDimension");
                            if (!(fr instanceof Float && (Float) fr == 0f && dim instanceof Integer && (Integer) dim == 0))
                                s.put(f.getName(), "fraction=" + fr + " dimension=" + dim);
                        }
                    }
                }
                j = s;
            }
            if (j != null) o.put(key, j);
        } catch (Throwable ignored) {
        }
    }

    // ---------------------------------------------------------------- XML attributes

    private static Field attributesField;
    private static String xmlAttrError;

    private static JSONObject xmlAttributes(View v) {
        try {
            if (attributesField == null) {
                attributesField = View.class.getDeclaredField("mAttributes");   // debug_view_attributes 開啟時由 View 建構子填入
                attributesField.setAccessible(true);
            }
            String[] a = (String[]) attributesField.get(v);
            if (a == null || a.length == 0) return null;
            JSONObject o = new JSONObject();
            JSONObject resolved = null;
            for (int i = 0; i + 1 < a.length; i += 2) {
                if (a[i] == null) continue;
                String val = a[i + 1];
                if (val != null && val.startsWith("@") && val.length() > 1 && Character.isDigit(val.charAt(1))) {
                    try {
                        val = "@" + resName(Integer.parseInt(val.substring(1)));
                    } catch (Throwable ignored) {
                    }
                } else if (val != null && val.startsWith("?") && val.length() > 1 && Character.isDigit(val.charAt(1))) {
                    try {
                        val = "?" + resName(Integer.parseInt(val.substring(1)));
                    } catch (Throwable ignored) {
                    }
                }
                String key = a[i];
                if ("@0x0".equals(val)) val = "@null";
                if (key.indexOf('/') >= 0) {
                    // styleable 解析出的參照（key 是被參照的資源名稱、value 是檔案路徑），另外放
                    if (resolved == null) resolved = new JSONObject();
                    if (!resolved.has(key)) resolved.put(key, val == null ? JSONObject.NULL : val);
                    continue;
                }
                if (o.has(key)) continue;
                o.put(key, val == null ? JSONObject.NULL : val);
            }
            if (resolved != null && resolved.length() > 0) o.put("@resolved", resolved);
            // 每個屬性是由 layout 還是 style 設定的
            Map<Integer, Integer> src = v.getAttributeSourceResourceMap();
            if (src != null && !src.isEmpty()) {
                JSONObject s = new JSONObject();
                for (Map.Entry<Integer, Integer> e : src.entrySet())
                    if (e.getValue() != null && e.getValue() != 0) s.put(resName(e.getKey()), resName(e.getValue()));
                if (s.length() > 0) o.put("@source", s);
            }
            return o;
        } catch (Throwable t) {
            if (xmlAttrError == null) xmlAttrError = Log.getStackTraceString(t);
            return null;
        }
    }

    private static Object getStaticField(Class<?> c, String name) {
        try {
            Field f = c.getDeclaredField(name);
            f.setAccessible(true);
            return f.get(null);
        } catch (Throwable t) {
            return t.toString();
        }
    }

    // ---------------------------------------------------------------- 格式化

    private static JSONObject paint(Paint p) throws Exception {
        JSONObject o = new JSONObject();
        o.put("color", color(p.getColor()));
        o.put("style", p.getStyle().name());
        if (p.getStrokeWidth() != 0) o.put("strokeWidth", px(p.getStrokeWidth()));
        if (p.getShader() != null) o.put("shader", p.getShader().getClass().getName());
        if (p.getShadowLayerRadius() > 0) {
            o.put("shadowLayer", "radius=" + p.getShadowLayerRadius() + " dx=" + p.getShadowLayerDx() + " dy=" + p.getShadowLayerDy()
                    + " color=" + color(p.getShadowLayerColor()));
        }
        if (p.getMaskFilter() != null) o.put("maskFilter", p.getMaskFilter().getClass().getName());
        if (p.getPathEffect() != null) o.put("pathEffect", p.getPathEffect().getClass().getName());
        if (p.getXfermode() != null) o.put("xfermode", p.getXfermode().getClass().getName());
        if (p.getAlpha() != 255 && p.getAlpha() != Color_alpha(p.getColor())) o.put("alpha", p.getAlpha());
        return o;
    }

    private static int Color_alpha(int c) {
        return c >>> 24;
    }

    private static Object csl(ColorStateList c) throws Exception {
        if (c == null) return JSONObject.NULL;
        if (!c.isStateful()) return color(c.getDefaultColor());
        JSONObject o = new JSONObject();
        o.put("default", color(c.getDefaultColor()));
        Object specs = getField(c, "mStateSpecs");
        Object colors = getField(c, "mColors");
        if (specs instanceof int[][] && colors instanceof int[]) {
            int[][] s = (int[][]) specs;
            int[] cs = (int[]) colors;
            JSONArray a = new JSONArray();
            for (int i = 0; i < s.length && i < cs.length; i++) a.put(stateSet(s[i]) + " → " + color(cs[i]));
            o.put("states", a);
        }
        return o;
    }

    private static String stateSet(int[] set) {
        if (set == null || set.length == 0) return "[default]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < set.length; i++) {
            if (i > 0) sb.append(',');
            int s = set[i];
            String n = STATE_NAMES.get(Math.abs(s));
            sb.append(s < 0 ? "!" : "").append(n != null ? n : "0x" + Integer.toHexString(Math.abs(s)));
        }
        return sb.append(']').toString();
    }

    private static void initStateNames() {
        if (!STATE_NAMES.isEmpty()) return;
        for (Field f : android.R.attr.class.getFields()) {
            try {
                int v = f.getInt(null);
                ATTR_NAMES.put(v, f.getName());
                if (f.getName().startsWith("state_")) STATE_NAMES.put(v, f.getName().substring(6));
            } catch (Throwable ignored) {
            }
        }
    }

    private static String resName(int id) {
        String c = RES_NAME_CACHE.get(id);
        if (c != null) return c;
        String n;
        try {
            n = res.getResourceName(id);
            if (n.startsWith(res.getResourcePackageName(id) + ":") && !n.startsWith("android:")) {
                n = n.substring(n.indexOf(':') + 1);   // app 自己的資源省略 package
            }
        } catch (Throwable t) {
            n = "0x" + Integer.toHexString(id);
        }
        RES_NAME_CACHE.put(id, n);
        return n;
    }

    private static String color(int c) {
        return String.format("#%08X", c);
    }

    private static String gravity(int g) {
        StringBuilder sb = new StringBuilder();
        int h = g & Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK, v = g & Gravity.VERTICAL_GRAVITY_MASK;
        if (h == Gravity.CENTER_HORIZONTAL) sb.append("center_horizontal");
        else if (h == Gravity.START || h == Gravity.LEFT) sb.append("start");
        else if (h == Gravity.END || h == Gravity.RIGHT) sb.append("end");
        if (v == Gravity.CENTER_VERTICAL) sb.append(sb.length() > 0 ? "|" : "").append("center_vertical");
        else if (v == Gravity.TOP) sb.append(sb.length() > 0 ? "|" : "").append("top");
        else if (v == Gravity.BOTTOM) sb.append(sb.length() > 0 ? "|" : "").append("bottom");
        String s = sb.toString();
        if (s.equals("center_horizontal|center_vertical")) return "center";
        return s.isEmpty() ? "0x" + Integer.toHexString(g) : s;
    }

    private static double dp(float px) {
        return round(px / density);
    }

    private static double px(float v) {
        return round(v);
    }

    private static double round(double v) {
        return Math.round(v * 100) / 100.0;
    }

    private static void putNz(JSONObject o, String k, float v, float def) throws Exception {
        if (v != def && !Float.isNaN(v)) o.put(k, round(v));
    }

    private static JSONArray arr(int... v) {
        JSONArray a = new JSONArray();
        for (int x : v) a.put(x);
        return a;
    }

    private static JSONArray arr(float... v) throws Exception {
        JSONArray a = new JSONArray();
        for (float x : v) a.put(round(x));
        return a;
    }

    private static Object activityOf(Context c) {
        while (c instanceof ContextWrapper) {
            if (c instanceof android.app.Activity) return c;
            c = ((ContextWrapper) c).getBaseContext();
        }
        return null;
    }
}
