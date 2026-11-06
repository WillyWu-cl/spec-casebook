// Shared by the casebook pages (scripts/lib/page-shared.ts puts it at the top of each page's script).
// Times: every page shows Taipei time and says so (user, 2026-11-06), whatever the viewer's or the data's zone. Input is
// an ISO time or the pages' older `YYYY-MM-DD HH:mm UTC`.
const cbDate = s => { if (!s) return null; const d = new Date(/ UTC$/.test(s) ? String(s).replace(' UTC', 'Z').replace(' ', 'T') : s); return isNaN(d) ? null : d; };
const cbParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const cbWhen = s => { const d = cbDate(s); if (!d) return String(s ?? ''); const p = Object.fromEntries(cbParts.formatToParts(d).map(x => [x.type, x.value])); return `${p.month}-${p.day} ${p.hour}:${p.minute}`; };
const cbZone = lang => lang === 'zh' ? '台北時間' : 'Taipei time';
const cbWhenZ = (s, lang) => s ? `${cbWhen(s)} ${cbZone(lang)}` : '';
const cbSpan = (a, b, lang) => `${cbWhen(a)} → ${cbWhen(b)} ${cbZone(lang)}`;
const cbEsc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cbHm = ms => `${Math.floor(ms / 3600000)}h ${String(Math.round(ms / 60000) % 60).padStart(2, '0')}m`;
const cbTok = n => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n);
const cbPct = v => v < 9.95 ? `${v.toFixed(1)}%` : `${Math.round(v)}%`;
// The usage strip: time, tokens, the two estimates, then the account's shared total, muted. A seat other than 1× Pro
// also gets the estimate as a share of that seat, which is what the meter fills to.
// o: { wall, test, idle, gaps, tokens, tokensTitle, wt, est5, estW, noTokens, seat, acct5, acctW, approx, out5, outW, outLabel }
function cbUsageTiles(o, lang) {
  const zh = lang === 'zh', tx = (en, z) => zh ? z : en, m = o.seat && o.seat !== 1 ? o.seat : null;
  const pctA = v => v == null ? '—' : `${o.approx ? '≈' : ''}${Math.round(v)}%`;
  const est = (label, v, approx, title) => {
    const none = v == null ? `<span class="uv unone" style="font-size:1rem">${o.noTokens ? tx('no token data yet', '尚無 token 資料') : '—'}</span>` : '';
    const share = v != null && m ? v / m : v;
    return `<div class="ut" title="${cbEsc(title)}"><span class="ul">${label}</span>${none || `<span class="uv est">${approx ? '~' : ''}${cbPct(v)}</span>`}`
      + (v != null ? `<span class="us">${tx('of 1× Pro', '（1× Pro）')}${m ? tx(` · ${cbPct(share)} of the ${m}× seat`, ` · ${m}× 席位的 ${cbPct(share)}`) : ''}</span><span class="um"><span style="width:${Math.min(100, share)}%"></span></span>` : '') + '</div>';
  };
  const on = o.wall ? Math.min(100, o.test / o.wall * 100) : 0;
  return `<div class="ustrip">
    <div class="ut"><span class="ul">${tx('Test time', '測試時間')}</span><span class="uv">${cbHm(o.test)}</span>
      <span class="us">${tx(`of ${cbHm(o.wall)} wall`, `總時長 ${cbHm(o.wall)}`)}${o.idle ? tx(` · ${cbHm(o.idle)} idle`, ` · 閒置 ${cbHm(o.idle)}`) : ''}${o.gaps ? tx(` (${o.gaps} gap${o.gaps > 1 ? 's' : ''})`, `（${o.gaps} 段）`) : ''}</span>
      <span class="um" title="${cbEsc(tx('Test time against idle time', '測試時間與閒置時間'))}"><span style="width:${on}%"></span><span class="idle" style="width:${100 - on}%"></span></span></div>
    <div class="ut" title="${cbEsc(o.tokensTitle ?? '')}"><span class="ul">${tx('Claude tokens', 'Claude token')}</span><span class="uv">${cbTok(o.tokens)}</span>${o.wt != null ? `<span class="us">${tx(`${cbTok(o.wt)} weighted`, `加權 ${cbTok(o.wt)}`)}</span>` : ''}</div>
    ${est(tx('5-hour estimate', '5 小時估計'), o.est5, false, tx('Weighted tokens × the calibrated rate', '加權 token × 校準後的比率'))}
    ${est(tx('Weekly estimate (rough)', '每週估計（粗估）'), o.estW, true, tx('5-hour estimate × the weekly ÷ 5-hour ratio', '5 小時估計 × 每週 ÷ 5 小時比'))}
    <div class="ut acct" title="${cbEsc(tx('Snapshot increments while this was active, including other users of the account', '這段期間帳號用量快照的增加量，包含帳號的其他使用者'))}"><span class="ul">${tx('Account total (shared)', '帳號合計（共用）')}</span>
      <span class="uv">${o.acct5 == null && o.acctW == null ? tx('no readings', '無讀數') : `${pctA(o.acct5)} / ${pctA(o.acctW)}`}</span><span class="us">${o.acct5 == null && o.acctW == null ? '' : tx('5-hour / weekly', '5 小時 / 每週')}${o.out5 != null || o.outW != null ? `${o.acct5 == null && o.acctW == null ? '' : ' · '}${cbEsc(o.outLabel)}: ${pctA(o.out5)} / ${pctA(o.outW)}` : ''}</span></div>
  </div>`;
}
