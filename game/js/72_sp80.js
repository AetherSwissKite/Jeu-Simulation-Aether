// ================================================================
//  SP80 : trimaran de vitesse tracté par kite (projet EPFL / sp80.ch, objectif 80 nœuds)
//  Régime physique propre (pas de moteur), maquette 3D, vue pilote secouée et kite de 25 m².
//  Repère local comme la barge : lx vers tribord, ly vers l'avant, lz vers le haut (m réels).
// ================================================================
// Kite de 25 m² sur ~70 m de lignes. « edge » < 1 : l'aile, très rapide, garde de la puissance près des bords
// de la fenêtre, ce qui permet d'aller plus vite que le vent au largue (100–140° du vent, comme le vrai SP80).
const SP80_RIG = { area: 25, L: 70, Lvis: 34, tmax: 260, agil: 1.0, edge: 0.6, omMax: 50, power: 2.2 };   // power : aile de course à haut coefficient de portance   // omMax : vitesse max dans la fenêtre (°/s), garde l'aile pilotable
const SP80_ANCHOR = [0, -1.2, 2.3];   // pivot de la bôme du « power module », à l'arrière du cockpit
const SP80 = { CD: 0.02, D0: 0.3, CHULL: 0.08, TAKEOFF0: 8, TAKEOFF1: 12, UMAX: 50 };   // traînées en kN, vitesses en m/s

// --- Maquette : coque centrale en goutte (carbone noir, bandeau rouge), deux cockpits en tandem sous verrière,
// bras courts en aile vers deux petits flotteurs, bôme pivotante noire où s'attache le kite.
const SP80_FACES = (() => {
  const F = [], BLACK = "#1b1d23", RED = "#c8102e", GLASS = "#33435c", WHITE = "#eef0f4";
  const sec = [[-4.8, 0.3, 0.75], [-3.2, 0.7, 1.05], [-1.2, 0.86, 1.2], [0.8, 0.82, 1.18], [2.8, 0.55, 0.95], [4.9, 0.06, 0.45]];   // [ly, demi-largeur, hauteur]
  for (let i = 0; i < sec.length - 1; i++) {
    const [y0, w0, h0] = sec[i], [y1, w1, h1] = sec[i + 1], col = (y0 >= -1.6 && y1 <= 0.9) ? RED : BLACK, z0 = 0.12;
    F.push(face([[-w0, y0, h0], [w0, y0, h0], [w1, y1, h1], [-w1, y1, h1]], col, [0, 0, 1]));
    F.push(face([[w0, y0, z0], [w1, y1, z0], [w1, y1, h1], [w0, y0, h0]], col, [1, 0, 0]));
    F.push(face([[-w0, y0, z0], [-w0, y0, h0], [-w1, y1, h1], [-w1, y1, z0]], col, [-1, 0, 0]));
  }
  F.push(face([[-0.3, -4.8, 0.12], [0.3, -4.8, 0.12], [0.3, -4.8, 0.75], [-0.3, -4.8, 0.75]], BLACK, [0, -1, 0]));
  // verrières des deux pilotes (tandem)
  for (const [y, l] of [[1.4, 1.3], [-0.1, 1.2]]) F.push(...box(-0.42, 0.42, y - l / 2, y + l / 2, 1.18, 1.52, GLASS, { noBottom: true, top: "#46597a" }));
  // bras en aile et flotteurs
  for (const sx of [-1, 1]) {
    F.push(...box(sx > 0 ? 0.7 : -3.55, sx > 0 ? 3.55 : -0.7, -1.4, -0.3, 0.62, 0.74, BLACK, { noBottom: true }));
    F.push(...box(sx * 3.45 - 0.22, sx * 3.45 + 0.22, -2.7, 1.6, 0.04, 0.4, BLACK, { noBottom: true }));
    F.push(...box(sx * 3.45 - 0.2, sx * 3.45 + 0.2, 1.6, 2.2, 0.06, 0.32, RED, { noBottom: true }));
  }
  F.push(...box(-0.1, 0.1, 3.9, 4.6, 0.45, 0.62, WHITE, { noBottom: true }));   // petit safran avant (tête visible)
  return F;
})();

// --- Physique : traction du kite contre la traînée ; décollage sur le foil vers 25 nœuds ; cap très sensible à haute vitesse
function sp80Dynamics(dt, w, B, C) {
  const u = Math.max(0, B.u), foil = smooth((u - SP80.TAKEOFF0) / (SP80.TAKEOFF1 - SP80.TAKEOFF0));
  const drag = SP80.D0 + SP80.CD * u * u + (1 - foil) * SP80.CHULL * u * u
    + 0.012 * RACE.rudder * RACE.rudder * u * u          // un coup de barre à haute vitesse freine fort
    + 0.0004 * KS.lat * KS.lat * (0.3 + 0.7 * foil);     // traînée induite du foil qui encaisse l'effort latéral
  RACE.Fe = 0;
  const acc = (KS.fwd - drag) / C.M;
  B.u = clamp(B.u + acc * dt, 0, SP80.UMAX);
  RACE.sp80 = { foil, acc, drag };
  // lacet : plus on va vite, plus le moindre coup de barre fait tourner (jusqu'à ×1,8)
  const rT = RACE.rudder * C.RMAX * clamp(u / 6, 0.3, 1.8) + KS.lat * 0.01;
  B.r += (rT - B.r) * damp(1 / C.TAUR, dt);
  B.hdg = norm360(B.hdg + B.r * dt);
  // dérive : le foil tient le cap une fois en vol
  const vf = B.u / KN * VK(), vl = KS.lat * 0.0006 * VK() * (1 - 0.8 * foil);
  const h = rad(B.hdg);
  B.x += (Math.sin(h) * vf + Math.cos(h) * vl) * dt;
  B.y += (Math.cos(h) * vf - Math.sin(h) * vl) * dt;
  // assiette : quasi plat (le power module renvoie l'effort sur le foil), vibrations à haute vitesse, vagues en tempête
  const sea = seaState(w.kn, w.from + 180), buzz = Math.pow(u / 40, 2);
  B.heelR = lerp(B.heelR, rad(clamp(KS.lat * 0.01, -4, 4) + Math.sin(RACE.t * 9) * buzz * 0.6 + w.storm * Math.sin(RACE.t * 2.1) * 2), damp(6, dt));
  B.pitchR = lerp(B.pitchR, rad(-acc * 0.25 + Math.sin(RACE.t * 13) * buzz * 0.5 + Math.sin(RACE.t * 1.4) * sea.A * 3), damp(8, dt));
  B.heave = 0.18 * foil + Math.sin(RACE.t * 1.6) * sea.A * 0.5;
}

// --- Rendu du bateau, gerbes d'eau et marquages
function drawSP80(ctx, cam, b, light, dt) {
  const u = b.u, d = Math.max(1, Math.hypot(cam.x - b.x, cam.y - b.y)), sc = cam.k * 57.3 / d;
  const az = rad(KS.azRel || 180), tip = [Math.sin(az) * 2.6, -1.2 + Math.cos(az) * 2.6, 2.6];
  // vue pilote : la caméra est dans le cockpit, la maquette n'est pas dessinée (l'habillage du cockpit la remplace)
  if (RACE.view === "cabin" && RACE.state === "run") return { anchor: bargeToWorld(b, ...tip), anchorScreen: cam.p(...bargeToWorld(b, ...tip)), exhaust: null };
  // gerbe d'eau du foil (« queue de coq ») et des flotteurs : d'autant plus haute que la vitesse est grande
  if (u > 6) {
    const n = QUALITY.level > 0 ? 14 : 7, t = performance.now() / 1000;
    for (let i = 0; i < n; i++) {
      const k = i / n, ph = (t * 3 + k) % 1;
      const p = cam.p(...bargeToWorld({ ...b, heelR: 0, pitchR: 0 }, Math.sin(i * 7.3) * 0.5, -4.6 - ph * 9, 0.2 + Math.sin(ph * Math.PI) * clamp(u / 20, 0, 2.2)));
      if (Math.abs(p[3]) > 100) continue;
      const s = cam.k * 57.3 / Math.max(1, p[2]);
      ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(p[0], p[1], (0.25 + ph * 0.9) * s, 0, Math.PI * 2); ctx.fill();
    }
  }
  drawModel(ctx, cam, b, SP80_FACES, light);
  // bôme pivotante du power module : orientée vers le kite
  const p0 = cam.p(...bargeToWorld(b, ...SP80_ANCHOR)), p1 = cam.p(...bargeToWorld(b, ...tip));
  ctx.strokeStyle = "#0d0e12"; ctx.lineWidth = Math.max(1.2, sc * 0.18); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); ctx.lineCap = "butt";
  // marquages blancs sur le flanc tourné vers la caméra
  if (sc > 3.5) {
    const side = Math.sin(rad(norm180(deg(Math.atan2(cam.x - b.x, cam.y - b.y)) - b.hdg))) >= 0 ? 1 : -1;
    const m = cam.p(...bargeToWorld(b, side * 0.88, 2.2, 0.7));
    if (Math.abs(m[3]) < 100) {
      ctx.fillStyle = "#ffffff"; ctx.font = `700 ${clamp(sc * 0.32, 6, 22)}px "Inter Tight", Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("RICHARD MILLE", m[0], m[1]);
      const n = cam.p(...bargeToWorld(b, side * 0.8, -3.2, 0.8));
      if (Math.abs(n[3]) < 100) { ctx.fillStyle = "#c8102e"; ctx.font = `800 ${clamp(sc * 0.4, 6, 26)}px "Inter Tight", Arial, sans-serif`; ctx.fillText("SP80", n[0], n[1]); }
    }
  }
  const anchor = bargeToWorld(b, ...tip);
  return { anchor, anchorScreen: p1, exhaust: null };
}
// kite de 25 m² : aile noire, logo RICHARD MILLE rouge
function drawSP80Kite(ctx, x, y, span, roll, trim) {
  drawParagliderFront(ctx, x, y, span, roll, trim, { top: "#2a2c33", bot: "#14151a", logo: "RICHARD MILLE", logoCol: "#e0203a", logoSize: 0.07 });
}

// --- Vue pilote : dans le cockpit avant, secouée selon la vitesse et l'état du lac
function sp80PilotCam(w, h, dt) {
  const B = RACE.boat, p = bargeToWorld(B, 0, 1.6, 1.42), t = performance.now() / 1000;
  const sea = seaState(RACE.wind.kn || 10, (RACE.wind.from || 0) + 180), k = Math.pow(clamp(B.u / 40, 0, 1.3), 2);
  const amp = 0.12 + k * 1.6 + sea.A * 2.2 + (RACE.shake || 0) * 2;   // degrés
  const n = (f, ph) => Math.sin(t * f + ph) * 0.6 + Math.sin(t * f * 2.31 + ph * 1.7) * 0.4;   // bruit doux et déterministe
  const half = 54 + 8 * clamp(B.u / 45, 0, 1);   // champ élargi à haute vitesse
  return makeCam(w, h, p[0], p[1], p[2] + n(23, 1) * amp * 0.012,
    B.hdg + n(17, 2) * amp * 0.5, -3 + deg(B.pitchR) + n(29, 3) * amp, B.heelR + rad(n(19, 4) * amp * 0.7), half);
}
// habillage du cockpit : arceaux de la verrière en carbone, nez noir et bandeau rouge
function drawSP80Cockpit(ctx, w, h, storm, t) {
  const sh = Math.sin(t * 31) * Math.pow(clamp(RACE.boat.u / 40, 0, 1.3), 2) * 3;   // le cockpit vibre aussi
  ctx.save(); ctx.translate(0, sh);
  ctx.fillStyle = "#16171c";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.16, 0); ctx.quadraticCurveTo(w * 0.05, h * 0.35, 0, h * 0.62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(w * 0.84, 0); ctx.quadraticCurveTo(w * 0.95, h * 0.35, w, h * 0.62); ctx.closePath(); ctx.fill();
  ctx.fillRect(0, 0, w, h * 0.04);
  // nez de la coque
  ctx.fillStyle = "#1b1d23";
  ctx.beginPath(); ctx.moveTo(w * 0.36, h); ctx.quadraticCurveTo(w * 0.47, h * 0.78, w * 0.5, h * 0.72); ctx.quadraticCurveTo(w * 0.53, h * 0.78, w * 0.64, h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c8102e"; ctx.fillRect(w * 0.497, h * 0.74, w * 0.006, h * 0.26);
  // reflets et gouttes sur la verrière
  ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.beginPath(); ctx.ellipse(w * 0.3, h * 0.2, w * 0.18, h * 0.05, -0.3, 0, Math.PI * 2); ctx.fill();
  if (RACE.boat.u > 12 || storm > 0.1) {
    ctx.fillStyle = "rgba(235,242,255,.35)";
    const nDrops = 18 + Math.round(storm * 40);
    for (let i = 0; i < nDrops; i++) { const x = (i * 197.3) % w, y = (i * 83.1 + t * 160) % (h * 0.7); ctx.beginPath(); ctx.ellipse(x, y, 1.2, 4, 0.2, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
}
