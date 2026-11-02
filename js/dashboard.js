const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const ld = (k, d) => {
    try {
        const v = localStorage.getItem(k);
        return v === null ? d : v;
    }
    catch (e) {
        return d;
    }
}, sv = (k, v) => {
    try {
        localStorage.setItem(k, v);
    }
    catch (e) {
    }
};
const RATE = .32, CO2 = .7;
let thr = +ld('thr', 3000), tgt = +ld('tgt', 250), today = 7.8, over = false, hist = [], rng = 'd', u = '';
try {
    u = sessionStorage.getItem('em_demo') || '';
}
catch (e) {
}
$('#who').textContent = 'Demo account';
$('#out').onclick = () => {
    try {
        sessionStorage.removeItem('em_demo');
    }
    catch (e) {
    }
    location.href = 'index.html';
};
$$('[data-t]').forEach(b => b.onclick = () => {
    $$('[data-t]').forEach(x => x.setAttribute('aria-selected', x === b));
    $$('section').forEach(s => s.hidden = s.id !== 'p-' + b.dataset.t);
    if (b.dataset.t === 'an')
        draw();
});
const A = [
    {
        n: 'Air conditioner', w: 1400, v: .1, on: 1
    },
    {
        n: 'Electric heater', w: 1800, v: .05, on: 0
    },
    {
        n: 'Washing machine', w: 500, v: .3, on: 1
    },
    {
        n: 'Fridge', w: 130, v: .15, on: 1
    },
    {
        n: 'Lights', w: 160, v: .05, on: 1
    },
    {
        n: 'TV and console', w: 140, v: .2, on: 1
    },
    {
        n: 'Kettle', w: 1800, v: .03, on: 0
    }
];
$('#apps').innerHTML = A.map((a, i) => `<div class="app"><label><input type="checkbox" data-i="${i}" ${a.on ? 'checked' : ''}>${a.n}</label><b id="w${i}">0 W</b><div class="bar"><i id="b${i}"></i></div></div>`).join('');
$('#apps').onchange = e => {
    const i = e.target.dataset.i;
    if (i !== undefined) {
        A[i].on = e.target.checked ? 1 : 0;
        tick(0);
    }
};
function tick(adv = 1) {
    let t = 0;
    A.forEach((a, i) => {
        a.c = a.on ? Math.round(a.w * (1 + (Math.random() - .5) * 2 * a.v)) : 0;
        t += a.c;
        $('#w' + i).textContent = a.c + ' W';
        $('#b' + i).style.width = a.c / 18 + '%';
    });
    if (adv)
        today += t / 1000 * (2 / 3600) * 30;
    $('#sN').textContent = (t / 1000).toFixed(2) + ' kW';
    $('#sK').textContent = today.toFixed(2) + ' kWh';
    $('#sC').textContent = '$' + (today * RATE).toFixed(2);
    $('#sO').textContent = (today * CO2).toFixed(1) + ' kg';
    const b = $('#bn');
    if (t > thr) {
        b.className = 'note hi';
        b.textContent = 'High usage: ' + t + ' W is above your ' + thr + ' W limit. Switch something off.';
        if (!over) {
            over = true;
            hist.unshift(new Date().toLocaleTimeString() + ': ' + t + ' W, above your ' + thr + ' W limit');
            rh();
        }
    }
    else {
        over = false;
        b.className = 'note';
        b.textContent = 'Usage is within your ' + thr + ' W limit.';
    }
    goals();
}
function rh() {
    $('#hi').innerHTML = hist.length ? hist.map(h => '<li>' + h + '</li>').join('') : '<li>No alerts yet. Turn on the electric heater on the Overview tab to try one.</li>';
}
function goals() {
    const m = 148.2 + today, p = m / tgt * 100;
    $('#gu').textContent = m.toFixed(1) + ' kWh used this month';
    $('#gl').textContent = 'Target: ' + tgt + ' kWh (' + Math.round(p) + '% used)';
    const g = $('#gb');
    g.style.width = Math.min(p, 100) + '%';
    g.style.background = p > 100 ? '#C0392B' : p > 80 ? '#F0B323' : '#2F7D5B';
    $('#gm').textContent = p > 100 ? 'Over target. Check the saving tips on the home page.' : p > 80 ? 'Close to your limit. Ease off heavy appliances.' : 'On track. Keep it up.';
}
$('#th').value = thr;
$('#tg').value = tgt;
$('#sth').onclick = () => {
    const v = +$('#th').value;
    if (v < 500 || v > 10000) {
        $('#tm').textContent = 'Enter a limit between 500 and 10000 W.';
        return;
    }
    thr = v;
    sv('thr', v);
    $('#tm').textContent = 'Saved. You will be alerted above ' + v + ' W.';
    tick(0);
};
$('#stg').onclick = () => {
    const v = +$('#tg').value;
    if (v < 50 || v > 2000)
        return;
    tgt = v;
    sv('tgt', v);
    goals();
};
const rnd = (i, k) => {
    const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
};
function draw() {
    const n = {
        d: 24, w: 7, m: 30
    }[rng], D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], v = [], l = [];
    for (let i = 0; i < n; i++) {
        v.push(rng === 'd' ? .25 + .9 * Math.exp(-((i - 19) ** 2) / 10) + .5 * Math.exp(-((i - 7) ** 2) / 6) + rnd(i, n) * .15 : rng === 'w' ? 9 + (i > 4 ? 3 : 0) + rnd(i, n) * 3 : 8 + rnd(i, n) * 5);
        l.push(rng === 'd' ? i + 'h' : rng === 'w' ? D[i] : i + 1);
    }
    const mx = Math.max(...v), bw = 560 / n;
    let s = '';
    [0, .5, 1].forEach(f => {
        const y = 210 - f * 180;
        s += `<line x1="60" x2="620" y1="${y}" y2="${y}" stroke="#D9DDE0"/><text x="52" y="${y + 4}" text-anchor="end" font-size="12" fill="#5A6369">${(mx * f).toFixed(1)}</text>`;
    });
    v.forEach((x, i) => {
        const h = x / mx * 180;
        s += `<rect x="${62 + i * bw}" y="${210 - h}" width="${bw - 4}" height="${h}" fill="${x === mx ? '#F0B323' : '#394146'}"><title>${l[i]}: ${x.toFixed(2)} kWh</title></rect>`;
        if (n < 10 || i % (n > 24 ? 5 : 3) === 0)
            s += `<text x="${62 + i * bw + bw / 2 - 2}" y="230" text-anchor="middle" font-size="12" fill="#5A6369">${l[i]}</text>`;
    });
    s += `<text x="60" y="252" font-size="12" fill="#5A6369">${rng === 'd' ? 'kWh per hour' : 'kWh per day'} (gold bar is the peak)</text>`;
    $('#ch').innerHTML = s;
    const t = v.reduce((a, b) => a + b, 0);
    $('#sm').textContent = 'Total ' + t.toFixed(1) + ' kWh, average ' + (t / n).toFixed(2) + ' kWh, peak ' + mx.toFixed(2) + ' kWh at ' + l[v.indexOf(mx)] + '. Estimated cost $' + (t * RATE).toFixed(2) + '.';
}
$$('[data-r]').forEach(b => b.onclick = () => {
    rng = b.dataset.r;
    $$('[data-r]').forEach(x => x.setAttribute('aria-pressed', x === b));
    draw();
});
rh();
tick(0);
setInterval(tick, 2000);
