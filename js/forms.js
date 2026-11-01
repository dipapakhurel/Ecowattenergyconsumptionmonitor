(() => {
    const m = document.getElementById('fm');
    ['lf', 'rf'].forEach(id => {
        const f = document.getElementById(id);
        if (f)
            f.addEventListener('submit', e => {
                e.preventDefault();
                m.textContent = id === 'lf' ? "Sign-in isn't connected yet. This prototype has no backend, so nothing was sent or saved." : "Registration isn't connected yet. This prototype has no backend, so nothing was sent or saved.";
            });
    });
    const d = document.getElementById('demo');
    if (d)
        d.addEventListener('click', () => {
            try {
                sessionStorage.setItem('em_demo', '1');
            }
            catch (e) {
            }
            location.href = 'dashboard.html';
        });
    const c = document.getElementById('calc');
    if (c)
        c.addEventListener('submit', e => {
            e.preventDefault();
            const w = +c.w.value, h = +c.h.value, r = +c.r.value, k = w * h / 1000;
            document.getElementById('co').textContent = k.toFixed(2) + ' kWh per day, about $' + (k * r).toFixed(2) + ' per day and $' + (k * r * 30).toFixed(2) + ' per 30 days.';
        });
})();
