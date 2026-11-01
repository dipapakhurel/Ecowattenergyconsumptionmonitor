(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = s => s.replace(/[&<>"]/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[c]));
    const wide = matchMedia('(min-width:1181px)'), hov = matchMedia('(hover:hover)'), dds = $$('.dd');
    let t;
    function set(d, on) {
        dds.forEach(x => {
            if (x !== d || !on) {
                x.classList.remove('open');
                $('.nb', x).setAttribute('aria-expanded', 'false');
            }
        });
        if (on) {
            d.classList.add('open');
            $('.nb', d).setAttribute('aria-expanded', 'true');
        }
    }
    dds.forEach(d => {
        const b = $('.nb', d), ls = $$('.dm a', d);
        b.addEventListener('click', () => set(d, !d.classList.contains('open')));
        d.addEventListener('mouseenter', () => {
            if (wide.matches && hov.matches) {
                clearTimeout(t);
                set(d, true);
            }
        });
        d.addEventListener('mouseleave', () => {
            if (wide.matches && hov.matches) {
                t = setTimeout(() => set(d, false), 180);
            }
        });
        d.addEventListener('keydown', e => {
            const i = ls.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                set(d, true);
                ls[(i + 1) % ls.length].focus();
            }
            if (e.key === 'ArrowUp' && i >= 0) {
                e.preventDefault();
                ls[(i - 1 + ls.length) % ls.length].focus();
            }
            if (e.key === 'Escape' && d.classList.contains('open')) {
                set(d, false);
                b.focus();
            }
        });
        d.addEventListener('focusout', e => {
            if (e.relatedTarget && !d.contains(e.relatedTarget))
                set(d, false);
        });
    });
    const bg = $('#burger'), nv = $('#menu');
    bg.addEventListener('click', () => {
        const o = nv.classList.toggle('open');
        bg.setAttribute('aria-expanded', o);
    });
    wide.addEventListener('change', () => {
        nv.classList.remove('open');
        bg.setAttribute('aria-expanded', 'false');
        set(null, false);
    });
    const sp = $('#sp'), q = $('#q'), sr = $('#sr');
    let op;
    function show(o) {
        sp.hidden = !o;
        $$('.sbtn').forEach(b => b.setAttribute('aria-expanded', o));
        if (o)
            q.focus();
        else if (op)
            op.focus();
    }
    $$('.sbtn').forEach(b => b.addEventListener('click', () => {
        op = b;
        show(sp.hidden);
    }));
    $('#sx').addEventListener('click', () => {
        q.value = '';
        sr.innerHTML = '';
        show(false);
    });
    function run() {
        const v = q.value.trim().toLowerCase();
        if (!v) {
            sr.innerHTML = '';
            return;
        }
        const w = v.split(/\s+/), r = SEARCH.map(p => {
            let s = 0;
            w.forEach(x => {
                if (p.t.toLowerCase().includes(x))
                    s += 3;
                if (p.k.includes(x))
                    s += 2;
                if (p.d.toLowerCase().includes(x))
                    s += 1;
            });
            return [s, p];
        }).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 6);
        sr.innerHTML = r.length ? r.map(x => `<li><a href="${x[1].u}"><b>${x[1].t}</b><span>${x[1].s}</span><small>${x[1].d}</small></a></li>`).join('') : `<li class="none">No pages match "${esc(v)}". Try a word like "alerts", "tips" or "business".</li>`;
    }
    q.addEventListener('input', run);
    $('#sf').addEventListener('submit', e => {
        e.preventDefault();
        run();
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.dd'))
            set(null, false);
        if (!sp.hidden && !e.target.closest('header.site'))
            show(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !sp.hidden)
            show(false);
    });
})();
