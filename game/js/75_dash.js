// ================================================================
//  INSTRUMENTS DE BORD : en haut à gauche de la scène (chrono, vitesse, vent, poussée du kite)
//  et tableau de bord sous la scène (potards, jauges, graphiques d'évolution), rafraîchis 10 fois par seconde
// ================================================================
const DASH_CELLS = [
  { id: "time", tone: "lilac", label: "d_time", hud: true },
  { id: "speed", tone: "sky", label: "d_speed", hud: true },
  { id: "wind", tone: "mint", label: "d_wind", hud: true },
  { id: "thrust", tone: "rose", label: "d_kite", hud: true },
  { id: "engine", tone: "peach", label: "d_engine", no: "sp80" },
  { id: "vmg", tone: "peach", label: "d_vmg", only: "sp80" },
  { id: "kite", tone: "rose", label: "kb_tension" },
  { id: "share", tone: "lilac", label: "d_share", no: "sp80" },
  { id: "foil", tone: "lilac", label: "d_foil", only: "sp80" },
  { id: "co2", tone: "sand", label: "d_co2", no: "sp80" },
  { id: "vmax", tone: "sand", label: "d_vmax", only: "sp80" },
  { id: "heel", tone: "sky", label: "d_heel" },
  { id: "pen", tone: "peach", label: "d_pen" },
  { id: "tchart", tone: "rose", label: "d_thrust_chart", chart: true },
  { id: "schart", tone: "sky", label: "d_speed_chart", chart: true }
];
const DASH = { cv: {}, hist: [] };
function initDash() {
  const cell = c => c.chart
    ? `<div class="inst chart t-${c.tone}"><div class="tx"><small data-i="${c.label}"></small><em id="s_${c.id}"></em></div><canvas id="g_${c.id}"></canvas></div>`
    : `<div class="inst t-${c.tone}${c.hud ? " glass hudinst" : ""}${c.only ? " only-" + c.only : ""}${c.no ? " no-" + c.no : ""}"><canvas id="g_${c.id}"></canvas><div class="tx"><small data-i="${c.label}"></small><b id="v_${c.id}">–</b><em id="s_${c.id}"></em></div></div>`;
  $("hudTl").innerHTML = DASH_CELLS.filter(c => c.hud).map(cell).join("");
  $("databar").innerHTML = DASH_CELLS.filter(c => !c.hud).map(cell).join("");
  for (const c of DASH_CELLS) DASH.cv[c.id] = setupCanvas($("g_" + c.id));
}
const GTRACK = "rgba(38,43,69,.09)", GINK = "#262b45";
// arc de 270° (de 135° à 405°) rempli jusqu'à « frac », couleur prise dans « stops », aiguille optionnelle
function gArc(g, frac, stops, opt = {}) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h / 2 + 2, r = Math.min(w, h) / 2 - 5, a0 = Math.PI * 0.75, sw = Math.PI * 1.5;
  ctx.lineCap = "round"; ctx.lineWidth = opt.lw || 5;
  ctx.strokeStyle = GTRACK; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + sw); ctx.stroke();
  for (const [f0, f1, col] of opt.zones || []) { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r + 4, a0 + sw * f0, a0 + sw * f1); ctx.stroke(); }
  ctx.lineWidth = opt.lw || 5;
  const f = clamp(frac, 0, 1), N = Math.max(1, Math.ceil(f * 24));
  for (let i = 0; i < N; i++) {
    const u0 = f * i / N, u1 = f * (i + 1) / N;
    ctx.strokeStyle = colorAt(stops, (u0 + u1) / 2); ctx.beginPath(); ctx.arc(cx, cy, r, a0 + sw * u0, a0 + sw * u1 + 0.01); ctx.stroke();
  }
  if (opt.needle) {
    const a = a0 + sw * f;
    ctx.strokeStyle = GINK; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (r - 3), cy + Math.sin(a) * (r - 3)); ctx.stroke();
    ctx.fillStyle = GINK; ctx.beginPath(); ctx.arc(cx, cy, 2.4, 0, Math.PI * 2); ctx.fill();
  }
  if (opt.text) { ctx.fillStyle = GINK; ctx.font = `600 ${Math.round(r * 0.55)}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(opt.text, cx, cy + 1); }
}
// potard : bouton rond avec un repère, entouré d'un arc coloré
function gKnob(g, frac, stops) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h / 2 + 2, r = Math.min(w, h) / 2 - 5;
  gArc(g, frac, stops, { lw: 4 });
  const grd = ctx.createRadialGradient(cx - 3, cy - 4, 1, cx, cy, r * 0.62);
  grd.addColorStop(0, "#ffffff"); grd.addColorStop(1, "#d8dee9");
  ctx.fillStyle = grd; ctx.strokeStyle = "rgba(38,43,69,.25)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const a = Math.PI * 0.75 + Math.PI * 1.5 * clamp(frac, 0, 1);
  ctx.strokeStyle = "#1f3a68"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18); ctx.lineTo(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55); ctx.stroke();
}
// cadran de vent : la barge pointe vers le haut, la flèche montre d'où vient le vent
function gWind(g, relFrom, kn) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 3, col = windColor(kn);
  ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.strokeStyle = "rgba(38,43,69,.18)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * (r - 1), cy - Math.cos(a) * (r - 1)); ctx.lineTo(cx + Math.sin(a) * (r - (i % 2 ? 3 : 5)), cy - Math.cos(a) * (r - (i % 2 ? 3 : 5))); ctx.stroke(); }
  ctx.fillStyle = "#5d6a7e"; ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.42); ctx.lineTo(cx + r * 0.15, cy + r * 0.3); ctx.lineTo(cx - r * 0.15, cy + r * 0.3); ctx.closePath(); ctx.fill();
  const a = rad(relFrom), x0 = cx + Math.sin(a) * (r - 3), y0 = cy - Math.cos(a) * (r - 3), x1 = cx + Math.sin(a) * r * 0.2, y1 = cy - Math.cos(a) * r * 0.2;
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  const ha = Math.atan2(y1 - y0, x1 - x0);
  ctx.beginPath(); ctx.moveTo(x1 + Math.cos(ha) * 4, y1 + Math.sin(ha) * 4); ctx.lineTo(x1 + Math.cos(ha + 2.5) * 6, y1 + Math.sin(ha + 2.5) * 6); ctx.lineTo(x1 + Math.cos(ha - 2.5) * 6, y1 + Math.sin(ha - 2.5) * 6); ctx.fill();
}
// anneau (donut) : part d'un total
function gDonut(g, frac, col, text) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 6;
  ctx.lineWidth = 7; ctx.lineCap = "butt";
  ctx.strokeStyle = "#ffc9a8"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(frac, 0, 1)); ctx.stroke();
  ctx.fillStyle = GINK; ctx.font = `600 ${Math.round(r * 0.62)}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, cx, cy + 1);
}
// deux barres verticales : CO2 émis (rose) et évité (menthe)
function gBars(g, a, b) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, top = 6, bot = h - 6, H = bot - top, m = Math.max(a, b, 1);
  ctx.fillStyle = GTRACK; ctx.fillRect(w * 0.18, top, w * 0.26, H); ctx.fillRect(w * 0.56, top, w * 0.26, H);
  const ha = H * a / m, hb = H * b / m;
  ctx.fillStyle = "#f58ea8"; ctx.fillRect(w * 0.18, bot - ha, w * 0.26, ha);
  ctx.fillStyle = "#5fc9a8"; ctx.fillRect(w * 0.56, bot - hb, w * 0.26, hb);
}
// inclinomètre : demi-cercle gradué et barge qui gîte
function gHeel(g, deg_) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h * 0.68, r = Math.min(w / 2, h * 0.62) - 3;
  ctx.lineWidth = 4; ctx.lineCap = "butt";
  [[-1, -0.5, "#f58ea8"], [-0.5, -0.2, "#f7e3a1"], [-0.2, 0.2, "#a8e6d3"], [0.2, 0.5, "#f7e3a1"], [0.5, 1, "#f58ea8"]].forEach(([u0, u1, c]) => {
    ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + u0 * Math.PI / 2, -Math.PI / 2 + u1 * Math.PI / 2); ctx.stroke();
  });
  const a = clamp(deg_ / 12, -1, 1) * Math.PI / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
  ctx.fillStyle = "#3d4a6b"; ctx.beginPath(); ctx.moveTo(-r * 0.62, -2); ctx.lineTo(r * 0.62, -2); ctx.lineTo(r * 0.45, 5); ctx.lineTo(-r * 0.45, 5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#e05a5a"; ctx.fillRect(-r * 0.5, 1, r, 2);
  ctx.strokeStyle = GINK; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, -r + 2); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "rgba(60,120,170,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - r, cy + 5); ctx.lineTo(cx + r, cy + 5); ctx.stroke();
}
// pénalités : une pastille par collision, et un anneau qui rougit avec les secondes perdues
function gPen(g, pen, coll) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 6;
  const col = pen <= 0 ? "#5fc9a8" : pen < 6 ? "#f2c14e" : "#f07d9c";
  ctx.lineWidth = 5; ctx.strokeStyle = GTRACK; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(pen / 20, 0, 1)); ctx.stroke();
  for (let i = 0; i < Math.min(coll, 6); i++) { const a = -Math.PI / 2 + i * Math.PI / 3; ctx.fillStyle = "#e05a5a"; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45, 2.6, 0, Math.PI * 2); ctx.fill(); }
  if (!coll) { ctx.fillStyle = col; ctx.font = `700 ${Math.round(r * 0.8)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(pen > 0 ? "!" : "✓", cx, cy + 1); }
}
// courbes défilantes : première série en aire pleine, les suivantes en traits
function gChart(g, series, vmax) {
  if (g.w < 20 || g.h < 20) return;   // instrument masqué dans ce mode
  const { ctx, w, h } = g, n = 300, pad = 2, X = i => pad + (w - 2 * pad) * i / (n - 1), Y = v => h - 3 - (h - 6) * clamp(v / vmax, 0, 1.05);
  ctx.strokeStyle = GTRACK; ctx.lineWidth = 1;
  for (const f of [0.5, 1]) { ctx.beginPath(); ctx.moveTo(pad, Y(vmax * f)); ctx.lineTo(w - pad, Y(vmax * f)); ctx.stroke(); }
  ctx.fillStyle = "rgba(38,43,69,.45)"; ctx.font = '500 8.5px "JetBrains Mono", monospace'; ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(fmt0(vmax), pad + 2, 1);
  series.forEach((sr, k) => {
    const v = sr.vals, off = n - v.length;
    if (v.length < 2) return;
    ctx.beginPath(); v.forEach((y, i) => i ? ctx.lineTo(X(off + i), Y(y)) : ctx.moveTo(X(off + i), Y(y)));
    if (k === 0) {
      ctx.lineTo(X(n - 1), h - 3); ctx.lineTo(X(off), h - 3); ctx.closePath();
      const gr = ctx.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, sr.col + "88"); gr.addColorStop(1, sr.col + "10");
      ctx.fillStyle = gr; ctx.fill();
      ctx.beginPath(); v.forEach((y, i) => i ? ctx.lineTo(X(off + i), Y(y)) : ctx.moveTo(X(off + i), Y(y)));
    }
    ctx.strokeStyle = sr.col; ctx.lineWidth = k === 0 ? 1.6 : 1.4; ctx.setLineDash(sr.dash || []); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = sr.col; ctx.beginPath(); ctx.arc(X(n - 1), Y(v[v.length - 1]), 2.4, 0, Math.PI * 2); ctx.fill();
  });
}
const SPEED_STOPS = [[0, "#6271b7"], [0.35, "#39a0c8"], [0.6, "#4cbf7f"], [0.8, "#e1c54a"], [1, "#e08a3c"]];
const THR_STOPS = [[0, "#f6a6bd"], [0.3, "#e2e7f0"], [0.5, "#bfeee0"], [1, "#5fc9a8"]];
const TENS_STOPS = [[0, "#a8e6d3"], [0.55, "#f7e3a1"], [0.75, "#ffc9a8"], [1, "#f07d9c"]];
function updateDash() {
  if (!DASH.cv.time) return;
  for (const id in DASH.cv) { const g = DASH.cv[id]; g.ctx.clearRect(0, 0, g.w, g.h); }
  const B = RACE.boat, wd = RACE.wind, kn = B.u / KN, rig = kiteRig(), f = clamp(RACE.f, 0, 1);
  const set = (id, v, sub) => { const vb = $("v_" + id); if (vb) vb.textContent = v; $("s_" + id).textContent = sub || ""; };
  // en haut à gauche
  gArc(DASH.cv.time, f, [[0, "#a8e6d3"], [1, "#3d5f94"]], { text: `${fmt0(f * 100)}` });
  set("time", fmtClock(RACE.t), `${RACE.pen ? `+${fmt1(RACE.pen)} s · ` : ""}${fmt1((1 - f) * COURSE_LEN / SCALE)} km`);
  const sp = RACE.mode === "sp80", vScale = sp ? 90 : 12;
  // SP80 : cadran jusqu'à 90 nd, repère au record du monde à la voile (65,45 nd)
  gArc(DASH.cv.speed, kn / vScale, SPEED_STOPS, { needle: true, zones: sp ? [[65.45 / 90, 1, "#c8102e"]] : [[8.5 / 12, 1, "#3d5f94"]] });
  set("speed", `${fmt1(kn)} ${T("u_kn")}`, sp ? `${fmt0(kn * 1.852)} km/h` : `⚙ ${fmt0(Math.max(0, RACE.Fe || 0))} kN`);
  gWind(DASH.cv.wind, norm180(wd.from - B.hdg), wd.kn);
  set("wind", `${fmt0(wd.kn)} ${T("u_kn")} ${cardinal(wd.from)}`, wd.gust > 0.3 ? `💨 ${T("d_gust")}` : wd.storm > 0.3 ? `⛈ ${T("d_storm")}` : "");
  gArc(DASH.cv.thrust, Math.max(0, KS.fwd) / Math.max(rig.tmax * 0.8, 1), [[0, "#c9d6ec"], [1, "#5fc9a8"]], { needle: true });
  set("thrust", `${fmt0(KS.fwd)} kN`, T("d_thrust"));
  // tableau du bas
  gKnob(DASH.cv.engine, (RACE.throttle + 0.4) / 1.4, THR_STOPS);
  set("engine", `${fmt0(RACE.throttle * 100)} %`, `${fmt0(Math.max(0, RACE.throttle) * BARGE.PMAX)} kW`);
  gArc(DASH.cv.kite, KS.T / (rig.tmax * 1.2), TENS_STOPS, { needle: true, zones: [[0.7, 0.83, "#f2c14e"], [0.83, 1, "#f07d9c"]] });
  set("kite", `${fmt0(KS.T)} kN`, `max ${fmt0(rig.tmax)}`);
  const share = KS.fwd > 0 ? KS.fwd / (KS.fwd + Math.max(1, RACE.Fe || 0)) : 0;
  gDonut(DASH.cv.share, share, "#3d5f94", `${fmt0(share * 100)}`);
  set("share", `${fmt0(share * 100)} %`, RACE.mode === "expert" ? `${rig.area} m² · ${rig.L} m` : `${KITE.area} m²`);
  const co2 = RACE.fuel * BARGE.CO2F;
  gBars(DASH.cv.co2, co2, RACE.saved);
  set("co2", `${fmt0(co2)} kg`, `${fmt0(RACE.saved)} kg ${T("d_avoided")}`);
  const heel = deg(B.heelR);
  gHeel(DASH.cv.heel, heel);
  set("heel", `${fmt1(Math.abs(heel))}°`, heel > 0.3 ? "↘" : heel < -0.3 ? "↙" : "");
  gPen(DASH.cv.pen, RACE.pen, RACE.coll);
  set("pen", `+${fmt1(RACE.pen)} s`, `💥 ${RACE.coll}`);
  if (sp) {
    const c = coursePoint(clamp(RACE.f, 0, 1) * COURSE_LEN), vmg = kn * Math.cos(rad(B.hdg - c.bearing));
    gArc(DASH.cv.vmg, Math.max(0, vmg) / 60, SPEED_STOPS, { needle: true });
    set("vmg", `${fmt1(vmg)} ${T("u_kn")}`, `${fmt0(Math.abs(norm180(wd.from - B.hdg)))}° ${T("d_twa")}`);
    const foil = (RACE.sp80 && RACE.sp80.foil) || 0;
    gDonut(DASH.cv.foil, foil, "#c8102e", `${fmt0(foil * 100)}`);
    set("foil", T(foil > 0.5 ? "foil_on" : "foil_off"), T("foil_note"));
    gArc(DASH.cv.vmax, RACE.maxKn / 90, SPEED_STOPS, { zones: [[65.45 / 90, 1, "#c8102e"]], text: `${fmt0(RACE.maxKn)}` });
    set("vmax", `${fmt1(RACE.maxKn)} ${T("u_kn")}`, `${T("record")} 65,45`);
  }
  // graphiques d'évolution (30 dernières secondes, seulement pendant la course)
  if (RACE.state === "run") { DASH.hist.push([KS.T, Math.max(0, KS.fwd), kn, wd.kn]); if (DASH.hist.length > 300) DASH.hist.shift(); }
  else if (RACE.state === "intro") DASH.hist.length = 0;
  const col = i => DASH.hist.map(r => r[i]);
  const tMax = Math.max(10, rig.tmax * 0.6, ...col(0));
  gChart(DASH.cv.tchart, [{ vals: col(0), col: "#f07d9c" }, { vals: col(1), col: "#3d5f94" }], tMax);
  $("s_tchart").innerHTML = `<i style="color:#f07d9c">● ${T("d_tension")} ${fmt0(KS.T)}</i> <i style="color:#3d5f94">● ${T("d_thrust")} ${fmt0(Math.max(0, KS.fwd))}</i> kN`;
  gChart(DASH.cv.schart, [{ vals: col(2), col: "#39a0c8" }, { vals: col(3), col: "#4cbf7f", dash: [4, 3] }], Math.max(sp ? 40 : 12, ...col(2), ...col(3)));
  $("s_schart").innerHTML = `<i style="color:#39a0c8">● ${fmt1(kn)}</i> <i style="color:#4cbf7f">● ${T("d_wind").toLowerCase()} ${fmt0(wd.kn)}</i> ${T("u_kn")}`;
}
