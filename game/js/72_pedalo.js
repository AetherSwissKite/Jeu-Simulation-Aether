// ================================================================
//  TURBO-PÉDALO : pédalo de plage tracté par un kite de course, sans moteur, jusqu'à ~200 nœuds
//  Régime physique propre : flotteurs qui déjaugent puis hydrofoils sous les flotteurs, kite renforcé,
//  vue pilote secouée. Repère local comme la barge : lx tribord, ly avant, lz haut (m réels).
// ================================================================
// Kite de 25 m² sur 70 m de lignes. « edge » < 1 : l'aile, très rapide, garde de la puissance près des bords
// de la fenêtre, ce qui permet d'aller bien plus vite que le vent au largue (100–140° du vent).
// appK : fantaisie de jeu, la vitesse du pédalo ne compte que pour 35 % dans le vent apparent du kite (sinon impossible de tirer à 200 nd).
// Lignes en fibre renforcée : tension de rupture élevée pour encaisser les vitesses extrêmes.
const PEDALO_RIG = { area: 25, L: 70, Lvis: 34, tmax: 1600, agil: 1.0, edge: 0.45, omMax: 50, power: 2.7, appK: 0.35 };   // power : aile de course à haut coefficient de portance ; omMax : vitesse max dans la fenêtre (°/s)
const PEDALO_ANCHOR = [0, 1.1, 1.5];   // petit mât de remorquage à l'avant du siège
const PEDALO = { CD: 0.004, D0: 0.3, CHULL: 0.07, TAKEOFF0: 7, TAKEOFF1: 11, UMAX: 110 };   // traînées en kN, vitesses en m/s (110 m/s ≈ 214 nd)

// --- Maquette : deux flotteurs blancs, plateforme turquoise, deux sièges baquets jaunes, carter de roue à aubes,
// petit toboggan à l'arrière et mât de remorquage à l'avant.
const PEDALO_FACES = (() => {
  const F = [], WHITE = "#f4f6f8", TEAL = "#2bb3b1", YELLOW = "#f6c933", ORANGE = "#f08a3c", GREY = "#7d8794";
  for (const sx of [-1, 1]) {
    const x0 = sx * 0.95 - 0.32, x1 = sx * 0.95 + 0.32;
    F.push(...box(x0, x1, -1.7, 1.4, -0.05, 0.45, WHITE, { noBottom: true }));
    // étrave du flotteur en pointe relevée
    F.push(face([[x0, 1.4, 0.45], [x1, 1.4, 0.45], [sx * 0.95, 2.0, 0.55]], WHITE, [0, 0.4, 1]));
    F.push(face([[x0, 1.4, -0.05], [x0, 1.4, 0.45], [sx * 0.95, 2.0, 0.55]], WHITE, [-1, 0.5, 0]));
    F.push(face([[x1, 1.4, -0.05], [sx * 0.95, 2.0, 0.55], [x1, 1.4, 0.45]], WHITE, [1, 0.5, 0]));
    F.push(...box(x0 - 0.01, x1 + 0.01, -1.7, 1.4, 0.3, 0.36, ORANGE, { noBottom: true }));   // liseré orange
  }
  F.push(...box(-0.65, 0.65, -1.4, 1.0, 0.45, 0.6, TEAL, { noBottom: true }));             // plateforme
  F.push(...box(-0.3, 0.3, -0.75, 0.15, 0.6, 1.0, GREY, { noBottom: true, top: TEAL }));  // carter de la roue à aubes
  for (const sx of [-1, 1]) {
    F.push(...box(sx * 0.35 - 0.25, sx * 0.35 + 0.25, -0.7, -0.15, 0.6, 0.75, YELLOW, { noBottom: true }));   // assise
    F.push(...box(sx * 0.35 - 0.25, sx * 0.35 + 0.25, -0.85, -0.7, 0.6, 1.25, YELLOW, { noBottom: true }));   // dossier
  }
  F.push(face([[-0.3, -1.4, 0.6], [0.3, -1.4, 0.6], [0.3, -2.2, 0.15], [-0.3, -2.2, 0.15]], YELLOW, [0, -0.5, 1]));   // toboggan
  F.push(...box(-0.35, 0.35, -1.4, -1.2, 0.6, 1.4, YELLOW, { noBottom: true }));          // haut du toboggan
  F.push(...box(-0.05, 0.05, 1.05, 1.15, 0.6, 1.5, GREY, { noBottom: true }));            // mât de remorquage
  return F;
})();

// --- Physique : traction du kite contre la traînée ; les flotteurs déjaugent puis les foils prennent le relais
// vers 20 nœuds ; cap très sensible à haute vitesse
function pedaloDynamics(dt, w, B, C) {
  const u = Math.max(0, B.u), foil = smooth((u - PEDALO.TAKEOFF0) / (PEDALO.TAKEOFF1 - PEDALO.TAKEOFF0));
  const drag = PEDALO.D0 + PEDALO.CD * u * u + (1 - foil) * PEDALO.CHULL * u * u
    + 0.004 * RACE.rudder * RACE.rudder * u * u          // un coup de barre à haute vitesse freine fort
    + 0.00002 * KS.lat * KS.lat * (0.3 + 0.7 * foil);    // traînée induite des foils (très allongés) qui encaissent l'effort latéral
  RACE.Fe = 0;
  const acc = (KS.fwd - drag) / C.M;
  B.u = clamp(B.u + acc * dt, 0, PEDALO.UMAX);
  RACE.pedalo = { foil, acc, drag };
  // lacet : plus on va vite, plus le moindre coup de barre fait tourner (plafonné pour rester pilotable)
  const rT = RACE.rudder * C.RMAX * clamp(u / 6, 0.3, 1.8) + KS.lat * 0.003;
  B.r += (rT - B.r) * damp(1 / C.TAUR, dt);
  B.hdg = norm360(B.hdg + B.r * dt);
  // dérive : les foils tiennent le cap une fois en vol
  const vf = B.u / KN * VK(), vl = KS.lat * 0.0002 * VK() * (1 - 0.8 * foil);
  const h = rad(B.hdg);
  B.x += (Math.sin(h) * vf + Math.cos(h) * vl) * dt;
  B.y += (Math.cos(h) * vf - Math.sin(h) * vl) * dt;
  // assiette : quasi plat, vibrations qui croissent avec la vitesse, vagues en tempête
  const sea = seaState(w.kn, w.from + 180), buzz = Math.pow(clamp(u / 60, 0, 1.6), 2);
  B.heelR = lerp(B.heelR, rad(clamp(KS.lat * 0.004, -4, 4) + Math.sin(RACE.t * 9) * buzz * 0.6 + w.storm * Math.sin(RACE.t * 2.1) * 2), damp(6, dt));
  B.pitchR = lerp(B.pitchR, rad(-acc * 0.06 + 1.5 * foil + Math.sin(RACE.t * 13) * buzz * 0.5 + Math.sin(RACE.t * 1.4) * sea.A * 3), damp(8, dt));
  B.heave = 0.35 * foil + Math.sin(RACE.t * 1.6) * sea.A * 0.5;
}

// --- Rendu du pédalo, gerbes d'eau et nom
function drawPedalo(ctx, cam, b, light, dt) {
  const u = b.u, d = Math.max(1, Math.hypot(cam.x - b.x, cam.y - b.y)), sc = cam.k * 57.3 / d;
  const anchor = bargeToWorld(b, ...PEDALO_ANCHOR), anchorScreen = cam.p(...anchor);
  // vue pilote : la caméra est sur le siège, la maquette n'est pas dessinée (l'habillage du cockpit la remplace)
  if (RACE.view === "cabin" && RACE.state === "run") return { anchor, anchorScreen, exhaust: null };
  // gerbes des deux flotteurs : d'autant plus hautes que la vitesse est grande
  if (u > 5) {
    const n = QUALITY.level > 0 ? 12 : 6, t = performance.now() / 1000;
    for (const sx of [-0.95, 0.95]) for (let i = 0; i < n; i++) {
      const ph = (t * 3 + i / n) % 1;
      const p = cam.p(...bargeToWorld({ ...b, heelR: 0, pitchR: 0, heave: 0 }, sx + Math.sin(i * 7.3) * 0.3, -1.8 - ph * 10, 0.1 + Math.sin(ph * Math.PI) * clamp(u / 25, 0, 2.6)));
      if (Math.abs(p[3]) > 100) continue;
      const s = cam.k * 57.3 / Math.max(1, p[2]);
      ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(p[0], p[1], (0.18 + ph * 0.8) * s, 0, Math.PI * 2); ctx.fill();
    }
  }
  // jambes des foils, visibles quand les flotteurs volent
  if (b.heave > 0.12) {
    ctx.strokeStyle = "#3a4258"; ctx.lineWidth = Math.max(1, sc * 0.06);
    for (const sx of [-0.95, 0.95]) for (const ly of [0.9, -1.2]) {
      const a = cam.p(...bargeToWorld(b, sx, ly, -0.05)), wpt = bargeToWorld(b, sx, ly, -0.05), c = cam.p(wpt[0], wpt[1], 0);
      if (Math.abs(a[3]) < 100 && Math.abs(c[3]) < 100) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
    }
  }
  drawModel(ctx, cam, b, PEDALO_FACES, light);
  // nom sur le flotteur tourné vers la caméra
  if (sc > 4) {
    const side = Math.sin(rad(norm180(deg(Math.atan2(cam.x - b.x, cam.y - b.y)) - b.hdg))) >= 0 ? 1 : -1;
    const m = cam.p(...bargeToWorld(b, side * 1.28, 0, 0.2));
    if (Math.abs(m[3]) < 100) {
      ctx.fillStyle = "#f08a3c"; ctx.font = `800 ${clamp(sc * 0.2, 6, 18)}px "Inter Tight", Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("TURBO", m[0], m[1]);
    }
  }
  return { anchor, anchorScreen, exhaust: null };
}
// kite de plage : aile jaune et orange, logo AETHER
function drawPedaloKite(ctx, x, y, span, roll, trim) {
  drawParagliderFront(ctx, x, y, span, roll, trim, { top: "#ffd84a", bot: "#f6a13c", logo: "AETHER", logoCol: "#1f3a68", logoSize: 0.09 });
}

// --- Vue pilote : assis sur le siège du pédalo, secoué selon la vitesse et l'état du lac
function pedaloPilotCam(w, h, dt) {
  const B = RACE.boat, p = bargeToWorld(B, 0.35, -0.3, 1.35), t = performance.now() / 1000;
  const sea = seaState(RACE.wind.kn || 10, (RACE.wind.from || 0) + 180), k = Math.pow(clamp(B.u / 60, 0, 1.6), 2);
  const amp = 0.12 + k * 1.4 + sea.A * 2.2 + (RACE.shake || 0) * 2;   // degrés
  const n = (f, ph) => Math.sin(t * f + ph) * 0.6 + Math.sin(t * f * 2.31 + ph * 1.7) * 0.4;   // bruit doux et déterministe
  const half = 54 + 12 * clamp(B.u / 100, 0, 1);   // champ élargi à haute vitesse
  return makeCam(w, h, p[0], p[1], p[2] + n(23, 1) * amp * 0.012,
    B.hdg + n(17, 2) * amp * 0.5, -3 + deg(B.pitchR) + n(29, 3) * amp, B.heelR + rad(n(19, 4) * amp * 0.7), half);
}
// habillage : guidon du pédalo, genoux sur les pédales, avant des flotteurs, embruns
function drawPedaloCockpit(ctx, w, h, storm, t) {
  const u = RACE.boat.u, sh = Math.sin(t * 31) * Math.pow(clamp(u / 60, 0, 1.6), 2) * 3;
  ctx.save(); ctx.translate(0, sh);
  // pointes des deux flotteurs
  ctx.fillStyle = "#f4f6f8";
  for (const cx of [0.2, 0.8]) { ctx.beginPath(); ctx.moveTo(w * (cx - 0.13), h); ctx.quadraticCurveTo(w * cx, h * 0.78, w * (cx + 0.02), h * 0.74); ctx.quadraticCurveTo(w * (cx + 0.06), h * 0.8, w * (cx + 0.13), h); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = "#f08a3c"; for (const cx of [0.2, 0.8]) ctx.fillRect(w * (cx - 0.12), h * 0.94, w * 0.25, h * 0.012);
  // plateforme turquoise et genoux
  ctx.fillStyle = "#2bb3b1"; ctx.beginPath(); ctx.moveTo(w * 0.3, h); ctx.lineTo(w * 0.36, h * 0.86); ctx.lineTo(w * 0.64, h * 0.86); ctx.lineTo(w * 0.7, h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#e9b48a"; for (const kx of [0.42, 0.58]) { ctx.beginPath(); ctx.ellipse(w * kx, h * (0.9 + 0.02 * Math.sin(t * 9 + kx * 10)), w * 0.035, h * 0.05, 0, 0, Math.PI * 2); ctx.fill(); }
  // guidon
  ctx.strokeStyle = "#3a4258"; ctx.lineWidth = Math.max(4, w * 0.008); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(w * 0.5, h); ctx.lineTo(w * 0.5, h * 0.8); ctx.moveTo(w * 0.43, h * 0.8); ctx.lineTo(w * 0.57, h * 0.8); ctx.stroke(); ctx.lineCap = "butt";
  // embruns
  if (u > 15 || storm > 0.1) {
    ctx.fillStyle = "rgba(235,242,255,.35)";
    const nDrops = 18 + Math.round(storm * 40 + clamp(u / 10, 0, 20));
    for (let i = 0; i < nDrops; i++) { const x = (i * 197.3) % w, y = (i * 83.1 + t * (160 + u * 3)) % (h * 0.7); ctx.beginPath(); ctx.ellipse(x, y, 1.2, 4, 0.2, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
}

// --- Effets de vitesse : traits qui jaillissent du point de fuite, plus nombreux et plus longs avec la vitesse,
// et léger voile sur les bords de l'écran (seulement au-delà de ~40 nd ; nombre de traits réduit en qualité basse)
function drawSpeedLines(ctx, cam, B, t) {
  const k = clamp((B.u / KN - 30) / 110, 0, 1);
  if (k <= 0 || RACE.state !== "run") return;
  const w = cam.w, h = cam.h, vp = cam.p(B.x + Math.sin(rad(B.hdg)) * 2000, B.y + Math.cos(rad(B.hdg)) * 2000, 0);
  const cx = Math.abs(vp[3]) < 90 ? vp[0] : w / 2, cy = clamp(Math.abs(vp[3]) < 90 ? vp[1] : h * 0.45, h * 0.2, h * 0.7);
  const n = Math.round((QUALITY.level > 0 ? 110 : 55) * (0.3 + 0.7 * k)), R = Math.hypot(w, h) / 2;
  ctx.save(); ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const a = i * 2.39996 + Math.sin(i * 12.9898) * 0.3;            // angles répartis (nombre d'or)
    const ph = (t * (1.2 + 2.2 * k) + (i * 0.618) % 1) % 1;          // avance le long du rayon
    const r0 = R * (0.18 + ph * 0.9), r1 = r0 + R * (0.06 + 0.22 * k) * ph;
    const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0, x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1;
    // trait sombre dessous (visible sur le ciel clair) puis trait blanc dessus (visible sur l'eau)
    ctx.strokeStyle = `rgba(20,40,70,${(0.12 + 0.3 * k) * ph})`; ctx.lineWidth = 2.5 + 3 * ph * k;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${(0.25 + 0.6 * k) * ph})`; ctx.lineWidth = 1.2 + 2 * ph * k;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy, R * 0.45, cx, cy, R * 1.15);
  g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, `rgba(215,232,248,${0.45 * k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
