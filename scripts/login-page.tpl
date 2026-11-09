<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Casebook</title>
<style>
/*__SHARED_CSS__*/
body { display: grid; place-items: center; min-height: 100dvh }
form { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 22px 24px; width: min(340px, 100%); display: grid; gap: 10px }
h1 { font: 700 1.3rem var(--display); margin: 0 }
p { margin: 0; color: var(--muted); font-size: 0.9rem }
input { font: 1rem var(--mono); color: inherit; background: var(--bg); border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; width: 100% }
button { font: 600 0.95rem var(--body); color: var(--bg); background: var(--accent); border: 0; border-radius: 6px; padding: 8px 12px; cursor: pointer }
#e { color: var(--fail) }
</style>
</head>
<body>
<form method="post" action="/__login">
  <h1>Casebook</h1>
  <p data-zh="請輸入啟動伺服器的終端機上顯示的通行碼。">Enter the passcode shown in the terminal that started the server.</p>
  <input name="passcode" aria-label="Passcode" autocomplete="off" autocapitalize="off" spellcheck="false" autofocus required>
  <input type="hidden" name="next" value="__NEXT__">
  <p id="e" role="alert"__HIDE__>__ERROR__</p>
  <button type="submit" data-zh="進入">Enter</button>
</form>
<script>
let zh = false; try { zh = localStorage.getItem('casebook-lang') === 'zh'; } catch (e) {}
if (zh) document.querySelectorAll('[data-zh]').forEach(e => e.textContent = e.dataset.zh);
// a link to a case or screen keeps its place through the sign-in
document.querySelector('form').onsubmit = () => { if (location.hash) document.querySelector('[name=next]').value += location.hash; };
</script>
</body>
</html>
