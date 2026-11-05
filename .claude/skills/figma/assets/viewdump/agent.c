// Copied unchanged from CyberLink-Team/rdqe-spec-contract-agent, branch feat/figma-android-ui-conformance @ 7282f65
// (skills/figma-phd-android-ui-conformance/assets/viewdump/src), with the user's approval (2026-11-04, REQ-085) as an
// exception to the repo's independence rule. Built and run by scripts/android-viewdump.ts.
// JVMTI attach agent：由 `cmd activity attach-agent <pkg> <this.so>=<dex>,<out>,<args>` 載入（逗號分隔，見 run()）。
// ActivityThread 會在 app 的 main thread 呼叫 Agent_OnAttach，所以這裡可以直接走訪 View tree。
// 流程：放寬 hidden API → 用 InMemoryDexClassLoader 載入 viewdumper.dex → 呼叫 ViewDumper.dump(out, args)。
#include <jni.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <android/log.h>

#define TAG "ViewDumpAgent"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

static int clear_exc(JNIEnv* env, const char* where) {
    if ((*env)->ExceptionCheck(env)) {
        LOGE("exception at %s", where);
        (*env)->ExceptionDescribe(env);
        (*env)->ExceptionClear(env);
        return 1;
    }
    return 0;
}

// JNI 的 hidden API 檢查以呼叫端 Java frame 判斷；此時呼叫端是 framework（ActivityThread/VMDebug），
// 所以可以呼叫 VMRuntime.setHiddenApiExemptions，讓之後 app domain 的反射也能讀 framework 私有欄位。
static void exempt_hidden_api(JNIEnv* env) {
    jclass vmr = (*env)->FindClass(env, "dalvik/system/VMRuntime");
    if (clear_exc(env, "FindClass VMRuntime") || !vmr) return;
    jmethodID getRuntime = (*env)->GetStaticMethodID(env, vmr, "getRuntime", "()Ldalvik/system/VMRuntime;");
    jmethodID setEx = (*env)->GetMethodID(env, vmr, "setHiddenApiExemptions", "([Ljava/lang/String;)V");
    if (clear_exc(env, "GetMethodID setHiddenApiExemptions") || !getRuntime || !setEx) return;
    jobject rt = (*env)->CallStaticObjectMethod(env, vmr, getRuntime);
    jclass strCls = (*env)->FindClass(env, "java/lang/String");
    jobjectArray arr = (*env)->NewObjectArray(env, 1, strCls, (*env)->NewStringUTF(env, "L"));
    (*env)->CallVoidMethod(env, rt, setEx, arr);
    if (!clear_exc(env, "setHiddenApiExemptions")) LOGI("hidden API exemptions set");
}

static void* read_file(const char* path, long* len) {
    FILE* f = fopen(path, "rb");
    if (!f) return NULL;
    fseek(f, 0, SEEK_END);
    *len = ftell(f);
    fseek(f, 0, SEEK_SET);
    void* buf = malloc(*len);
    if (buf && fread(buf, 1, *len, f) != (size_t)*len) { free(buf); buf = NULL; }
    fclose(f);
    return buf;
}

static jint run(JavaVM* vm, const char* options) {
    JNIEnv* env = NULL;
    if ((*vm)->GetEnv(vm, (void**)&env, JNI_VERSION_1_6) != JNI_OK) {
        LOGE("GetEnv failed");
        return JNI_ERR;
    }
    // options = <dexPath>,<outPath>,<args>
    char opt[4096];
    strncpy(opt, options ? options : "", sizeof(opt) - 1);
    opt[sizeof(opt) - 1] = 0;
    char* dexPath = opt;
    char* outPath = strchr(dexPath, ',');
    if (!outPath) { LOGE("bad options: %s", opt); return JNI_ERR; }
    *outPath++ = 0;
    char* args = strchr(outPath, ',');
    if (args) *args++ = 0; else args = "";

    exempt_hidden_api(env);

    long len = 0;
    void* dex = read_file(dexPath, &len);   // 不 free：ART 會複製，但保守起見保留
    if (!dex) { LOGE("cannot read %s", dexPath); return JNI_ERR; }
    jobject bb = (*env)->NewDirectByteBuffer(env, dex, len);

    // parent = app 的 ClassLoader（ActivityThread.currentApplication().getClassLoader()）
    jclass at = (*env)->FindClass(env, "android/app/ActivityThread");
    jmethodID curApp = (*env)->GetStaticMethodID(env, at, "currentApplication", "()Landroid/app/Application;");
    jobject app = (*env)->CallStaticObjectMethod(env, at, curApp);
    if (clear_exc(env, "currentApplication") || !app) { LOGE("no application"); return JNI_ERR; }
    jclass ctxCls = (*env)->FindClass(env, "android/content/Context");
    jmethodID getCL = (*env)->GetMethodID(env, ctxCls, "getClassLoader", "()Ljava/lang/ClassLoader;");
    jobject parent = (*env)->CallObjectMethod(env, app, getCL);

    jclass imdcl = (*env)->FindClass(env, "dalvik/system/InMemoryDexClassLoader");
    jmethodID ctor = (*env)->GetMethodID(env, imdcl, "<init>", "(Ljava/nio/ByteBuffer;Ljava/lang/ClassLoader;)V");
    jobject loader = (*env)->NewObject(env, imdcl, ctor, bb, parent);
    if (clear_exc(env, "new InMemoryDexClassLoader") || !loader) return JNI_ERR;

    jclass clCls = (*env)->FindClass(env, "java/lang/ClassLoader");
    jmethodID loadClass = (*env)->GetMethodID(env, clCls, "loadClass", "(Ljava/lang/String;)Ljava/lang/Class;");
    jclass dumper = (jclass)(*env)->CallObjectMethod(env, loader, loadClass, (*env)->NewStringUTF(env, "ViewDumper"));
    if (clear_exc(env, "loadClass ViewDumper") || !dumper) return JNI_ERR;

    jmethodID dump = (*env)->GetStaticMethodID(env, dumper, "dump", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;");
    if (clear_exc(env, "GetStaticMethodID dump") || !dump) return JNI_ERR;
    jstring res = (jstring)(*env)->CallStaticObjectMethod(env, dumper, dump,
            (*env)->NewStringUTF(env, outPath), (*env)->NewStringUTF(env, args));
    if (clear_exc(env, "ViewDumper.dump")) return JNI_ERR;
    if (res) {
        const char* s = (*env)->GetStringUTFChars(env, res, NULL);
        LOGI("dump result: %s", s);
        (*env)->ReleaseStringUTFChars(env, res, s);
    }
    return JNI_OK;
}

JNIEXPORT jint JNICALL Agent_OnAttach(JavaVM* vm, char* options, void* reserved) {
    (void)reserved;
    LOGI("Agent_OnAttach options=%s", options ? options : "(null)");
    return run(vm, options);
}
