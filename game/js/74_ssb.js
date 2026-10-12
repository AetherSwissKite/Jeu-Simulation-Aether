// ================================================================
//  SSB : Lobst'Air, le « Renewable Energy Foiler » de l'équipe EPFL Swiss Solar Boat
//  (trois places, propulsion électrique solaire + pile à hydrogène, foils rétractables).
//  Régime physique propre : moteur électrique, vol sur foils, kite de secours de 25 m² sur 200 m de lignes.
//  Scénario : panne moteur à l'entrée de la tempête, puis poursuite du pirate jusqu'à la rade de Genève.
//  Repère local : lx tribord, ly avant, lz haut (m réels), origine à la flottaison.
// ================================================================
// Kite de 25 m² sur 200 m de lignes, attaché à l'étrave : fenêtre large, réponse plus lente et lissée (omMax bas)
const SSB_RIG = { area: 25, L: 200, Lvis: 72, tmax: 120, agil: 0.85, edge: 0.75, omMax: 38, power: 1.6 };
const SSB_ANCHOR = [0, 3.5, 1.15];
const SSB = { PMAX: 70, FMAX: 7, D0: 0.25, CWATER: 0.11, CFLY: 0.028, UTO: 6.2, RIDE: 0.7 };   // kW, kN, m/s, m
// la rade de Genève commence vers les Eaux-Vives : le pirate n'y entre pas
const SSB_RADE_F = courseProject(-32.0 * SCALE, -15.6 * SCALE).s / COURSE_LEN;
const SSB_BREAK_F = 0.47;   // entrée dans la tempête de Joran

// --- Maquette : coque blanche effilée, liston rouge, pont couvert de panneaux solaires, cockpit à trois places
// en tandem sous un pare-brise, deux jambes de foil (avant et arrière avec la nacelle du moteur).
const SSB_FACES = (() => {
  const F = [], WHITE = "#f1f3f6", RED = "#d23b2f", SOLAR = "#1f3550", GREY = "#3b4252", GLASS = "#5b7392";
  const sec = [[-3.7, 0.8, 0.85], [-2.2, 1.05, 0.95], [0, 1.1, 1.0], [2.0, 0.85, 0.95], [3.2, 0.45, 0.85], [3.9, 0.05, 0.7]];   // [ly, demi-largeur, hauteur du pont]
  for (let i = 0; i < sec.length - 1; i++) {
    const [y0, w0, h0] = sec[i], [y1, w1, h1] = sec[i + 1];
    const deck = (y0 >= -3.7 && y1 <= 2.0) ? SOLAR : WHITE;
    F.push(face([[-w0, y0, h0], [w0, y0, h0], [w1, y1, h1], [-w1, y1, h1]], deck, [0, 0, 1], deck === SOLAR ? "solar" : null));
    for (const sx of [-1, 1]) {
      // flanc blanc et liston rouge juste sous le pont
      F.push(face(sx > 0 ? [[w0, y0, -0.15], [w1, y1, -0.15], [w1, y1, h1 - 0.2], [w0, y0, h0 - 0.2]] : [[-w0, y0, -0.15], [-w0, y0, h0 - 0.2], [-w1, y1, h1 - 0.2], [-w1, y1, -0.15]], WHITE, [sx, 0, 0]));
      F.push(face(sx > 0 ? [[w0, y0, h0 - 0.2], [w1, y1, h1 - 0.2], [w1, y1, h1], [w0, y0, h0]] : [[-w0, y0, h0 - 0.2], [-w0, y0, h0], [-w1, y1, h1], [-w1, y1, h1 - 0.2]], RED, [sx, 0, 0]));
    }
  }
  F.push(face([[-0.8, -3.7, -0.15], [0.8, -3.7, -0.15], [0.8, -3.7, 0.85], [-0.8, -3.7, 0.85]], WHITE, [0, -1, 0]));
  // cockpit en creux (trois sièges en tandem) et pare-brise
  F.push(...box(-0.55, 0.55, -1.6, 1.0, 0.98, 1.06, GREY, { noBottom: true }));
  for (const y of [-1.2, -0.3, 0.6]) F.push(...box(-0.3, 0.3, y - 0.18, y + 0.18, 1.0, 1.45, "#2a2f3b", { noBottom: true }));
  F.push(face([[-0.6, 1.1, 1.02], [0.6, 1.1, 1.02], [0.45, 1.45, 1.45], [-0.45, 1.45, 1.45]], GLASS, [0, 0.7, 0.7]));
  return F;
})();

function ssbState() { return RACE.ssb || (RACE.ssb = { h: 0, hv: 0, broken: false, chase: false, chaseDone: false, smokeT: 0, smoke: [], wet: 0, hits: 0 }); }

// --- Physique : moteur électrique (Z/S = puissance), traînée de carène puis de vol, foils, kite
function ssbDynamics(dt, w, B, C) {
  const S = ssbState(), u = Math.max(0, B.u);
  // panne moteur à l'entrée de la tempête : à partir de là, seul le kite propulse le bateau
  if (!S.broken && RACE.f >= SSB_BREAK_F) {
    S.broken = true; S.chase = true; RACE.throttle = 0;
    const sp = $("spacePop").querySelector("span"); sp.dataset.ih = "ssb_break_pop"; sp.innerHTML = T("ssb_break_pop"); $("spacePop").hidden = KS.deployed; RACE.popT = 0; RACE.popSticky = true;
    toast(T("ssb_break_toast"), "bad", null); RACE.shake = 0.8;
  }
  if (S.chase && !S.chaseDone && RACE.f >= SSB_RADE_F) { S.chase = false; S.chaseDone = true; toast(T("ssb_pirate_gone"), "good", null); }
  if (S.broken) RACE.throttle = 0;
  RACE.throttle = clamp(RACE.throttle, 0, 1);
  // vol sur foils : hauteur de vol visée selon la vitesse, ressort amorti, perturbé par les vagues et les risées
  const sea = seaState(w.kn, w.from + 180), fly = smooth(S.h / 0.4);
  const hT = u > SSB.UTO ? SSB.RIDE * smooth((u - SSB.UTO) / 2.5) : 0;
  const bump = (Math.sin(RACE.t * 2.3) * sea.A * 0.6 + Math.sin(RACE.t * 5.1) * w.gust * 0.08) * (0.4 + 0.6 * fly);
  S.hv += (9 * (hT - S.h) - 4.2 * S.hv + bump * 6) * dt;
  S.h = clamp(S.h + S.hv * dt, 0, 0.95);
  if (S.h <= 0 && S.hv < -0.6) { RACE.shake = Math.max(RACE.shake, 0.5); S.wet = 1; }   // retombée dans l'eau
  if (S.h <= 0) S.hv = Math.max(0, S.hv);
  // forces (kN) : moteur électrique à puissance limitée, traînée de carène qui chute une fois en vol
  const Fe = S.broken ? 0 : Math.min(SSB.FMAX, RACE.throttle * SSB.PMAX / Math.max(u, 1));
  const drag = SSB.D0 + lerp(SSB.CWATER, SSB.CFLY, fly) * u * u + 0.01 * RACE.rudder * RACE.rudder * u * u + 0.0006 * KS.lat * KS.lat;
  RACE.Fe = Fe;
  const acc = (Fe + KS.fwd - drag) / C.M;
  B.u = clamp(B.u + acc * dt, 0, 20);
  RACE.ssbInfo = { fly, h: S.h, kw: Fe * u, drag };
  // cap : plus sensible en vol (moins de surface mouillée)
  const rT = RACE.rudder * C.RMAX * clamp(u / 5, 0.3, 1.2) * (1 + 0.4 * fly) + KS.lat * 0.02;
  B.r += (rT - B.r) * damp(1 / C.TAUR, dt);
  B.hdg = norm360(B.hdg + B.r * dt);
  const vf = B.u / KN * VK(), vl = KS.lat * 0.002 * VK() * (1 - 0.7 * fly);
  const h = rad(B.hdg);
  B.x += (Math.sin(h) * vf + Math.cos(h) * vl) * dt;
  B.y += (Math.cos(h) * vf - Math.sin(h) * vl) * dt;
  // assiette : en vol le bateau s'incline dans les virages, dans l'eau il tape dans les vagues
  B.heelR = lerp(B.heelR, rad(clamp(-B.r * 0.35 * fly + KS.lat * 0.03, -12, 12) + Math.sin(RACE.t * 1.7) * sea.A * 4 * (1 - fly)), damp(4, dt));
  B.pitchR = lerp(B.pitchR, rad(-acc * 1.2 + 1.5 * fly + Math.sin(RACE.t * 2.1) * sea.A * 5 * (1 - fly)), damp(5, dt));
  B.heave = S.h + Math.sin(RACE.t * 1.6) * sea.A * 0.5 * (1 - fly);
  S.wet = Math.max(0, S.wet - dt * 0.6);
  // fumée qui s'échappe du capot après la panne
  if (S.broken) { S.smokeT += dt; if (S.smokeT > 0.25) { S.smokeT = 0; const p = bargeToWorld(B, 0.2, -2.9, 1.0); S.smoke.push({ x: p[0], y: p[1], z: p[2], age: 0 }); } }
  for (const s of S.smoke) { s.age += dt; s.z += 1.2 * dt; }
  S.smoke = S.smoke.filter(s => s.age < 3);
}

// --- Rendu du bateau : jambes de foil visibles quand il vole, gerbe à la poupe, fumée du capot
function drawSSB(ctx, cam, b, light, dt) {
  const S = ssbState(), sc = cam.k * 57.3 / Math.max(1, Math.hypot(cam.x - b.x, cam.y - b.y));
  const anchor = bargeToWorld(b, ...SSB_ANCHOR), anchorScreen = cam.p(...anchor);
  if (RACE.view === "cabin" && RACE.state === "run") return { anchor, anchorScreen, exhaust: null };   // vue pilote : maquette non dessinée
  // jambes de foil : de la coque jusqu'à la surface (visibles seulement quand la coque vole)
  if (S.h > 0.05) {
    ctx.strokeStyle = "#2a2f3b"; ctx.lineWidth = Math.max(1, sc * 0.12);
    for (const [ly, lx] of [[2.6, 0], [-3.0, 0]]) {
      const a = cam.p(...bargeToWorld(b, lx, ly, -0.1)), wpt = bargeToWorld(b, lx, ly, -0.1);
      const c = cam.p(wpt[0], wpt[1], 0);
      if (Math.abs(a[3]) < 100 && Math.abs(c[3]) < 100) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
    }
  }
  // gerbe d'eau à l'arrière (hélice / foil) quand il avance
  if (b.u > 3) {
    const t = performance.now() / 1000, n = QUALITY.level > 0 ? 10 : 5;
    for (let i = 0; i < n; i++) {
      const ph = (t * 2.5 + i / n) % 1, p = cam.p(...bargeToWorld({ ...b, heelR: 0, pitchR: 0, heave: 0 }, Math.sin(i * 5.1) * 0.4, -3.3 - ph * 6, 0.1 + Math.sin(ph * Math.PI) * clamp(b.u / 12, 0, 1.2)));
      if (Math.abs(p[3]) > 100) continue;
      const s = cam.k * 57.3 / Math.max(1, p[2]);
      ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.arc(p[0], p[1], (0.2 + ph * 0.6) * s, 0, Math.PI * 2); ctx.fill();
    }
  }
  drawModel(ctx, cam, b, SSB_FACES, light, (tag, pp) => {
    if (tag !== "solar" || sc < 2.5) return;
    // quadrillage des cellules solaires
    const [a, b2, c, d] = pp, at = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
    ctx.strokeStyle = "rgba(160,190,230,.35)"; ctx.lineWidth = 0.6; ctx.beginPath();
    for (let k = 1; k < 4; k++) { const p1 = at(a, b2, k / 4), p2 = at(d, c, k / 4); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); }
    for (let k = 1; k < 3; k++) { const p1 = at(a, d, k / 3), p2 = at(b2, c, k / 3); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); }
    ctx.stroke();
  });
  // nom sur le flanc
  if (sc > 3.5) {
    const side = Math.sin(rad(norm180(deg(Math.atan2(cam.x - b.x, cam.y - b.y)) - b.hdg))) >= 0 ? 1 : -1;
    const m = cam.p(...bargeToWorld(b, side * 1.12, 0.6, 0.45));
    if (Math.abs(m[3]) < 100) { ctx.fillStyle = "#d23b2f"; ctx.font = `800 ${clamp(sc * 0.3, 6, 20)}px "Inter Tight", Arial, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("LOBST'AIR", m[0], m[1]); }
  }
  drawSSBSmoke(ctx, cam);
  return { anchor, anchorScreen, exhaust: null };
}
function drawSSBSmoke(ctx, cam) {
  for (const s of ssbState().smoke) {
    const p = cam.p(s.x, s.y, s.z); if (Math.abs(p[3]) > 100) continue;
    const r = cam.k * 57.3 / Math.max(1, p[2]) * (0.3 + s.age * 0.5);
    ctx.fillStyle = `rgba(90,94,104,${0.35 * (1 - s.age / 3)})`; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
  }
}

// --- Vue pilote : assis dans le cockpit ; la caméra monte avec le vol, les secousses s'apaisent une fois sur les foils
function ssbPilotCam(w, h, dt) {
  const B = RACE.boat, S = ssbState(), fly = smooth(S.h / 0.4), p = bargeToWorld(B, 0, 0.4, 1.35), t = performance.now() / 1000;
  const sea = seaState(RACE.wind.kn || 10, (RACE.wind.from || 0) + 180), k = Math.pow(clamp(B.u / 13, 0, 1.4), 2);
  const amp = (0.2 + k * 1.3 + sea.A * 3) * (1 - 0.75 * fly) + 0.12 * fly + (RACE.shake || 0) * 2;
  const n = (f, ph) => Math.sin(t * f + ph) * 0.6 + Math.sin(t * f * 2.17 + ph * 1.9) * 0.4;
  return makeCam(w, h, p[0], p[1], p[2] + n(13, 1) * amp * 0.015, B.hdg + n(11, 2) * amp * 0.4, -4 + deg(B.pitchR) + n(17, 3) * amp, B.heelR + rad(n(9, 4) * amp * 0.6), 56);
}
// habillage du cockpit : pare-brise, tableau de bord (écran de puissance), nez blanc au liston rouge, embruns
function drawSSBCockpit(ctx, w, h, storm, t) {
  const S = ssbState(), info = RACE.ssbInfo || { kw: 0, h: 0 };
  ctx.fillStyle = "#eef0f4";
  ctx.beginPath(); ctx.moveTo(w * 0.3, h); ctx.quadraticCurveTo(w * 0.46, h * 0.8, w * 0.5, h * 0.76); ctx.quadraticCurveTo(w * 0.54, h * 0.8, w * 0.7, h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#d23b2f"; ctx.fillRect(w * 0.3, h * 0.985, w * 0.4, h * 0.015);
  // montants du pare-brise
  ctx.strokeStyle = "#2a2f3b"; ctx.lineWidth = Math.max(3, w * 0.006);
  ctx.beginPath(); ctx.moveTo(w * 0.18, h * 0.86); ctx.lineTo(w * 0.32, h * 0.5); ctx.lineTo(w * 0.68, h * 0.5); ctx.lineTo(w * 0.82, h * 0.86); ctx.stroke();
  // tableau de bord
  ctx.fillStyle = "#2a2f3b"; ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h * 0.88); ctx.quadraticCurveTo(w * 0.5, h * 0.8, w, h * 0.88); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  const sx = w * 0.4, sy = h * 0.9, sw = w * 0.2, sh = h * 0.07;
  ctx.fillStyle = S.broken ? "#5a1d1d" : "#0f2236"; ctx.fillRect(sx, sy, sw, sh);
  ctx.fillStyle = S.broken ? "#ff6b6b" : "#7fe0b5"; ctx.font = `700 ${Math.round(sh * 0.42)}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(S.broken ? T("ssb_motor_off") : `${fmt0(info.kw)} kW · ${fmt0(info.h * 100)} cm`, sx + sw / 2, sy + sh / 2);
  // embruns et pluie sur le pare-brise
  const wet = Math.max(S.wet, storm);
  if (wet > 0.05) {
    ctx.fillStyle = `rgba(235,242,255,${0.4 * wet})`;
    for (let i = 0; i < 30; i++) { const x = w * 0.3 + (i * 131.7) % (w * 0.4), y = h * 0.52 + ((i * 53.3 + t * 90) % (h * 0.3)); ctx.beginPath(); ctx.ellipse(x, y, 1.5, 3.5, 0.15, 0, Math.PI * 2); ctx.fill(); }
  }
}
