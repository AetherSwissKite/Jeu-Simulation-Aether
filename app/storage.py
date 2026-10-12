"""Stockage des courses (SQLite).

Remplace l'ancien fichier leaderboard.json : une base SQLite permet les classements par période,
et garde le tracé de chaque course (page Résultats et fantômes). Les écritures passent par un verrou
pour rester sûres quand plusieurs joueurs terminent en même temps.

Sur Streamlit Community Cloud, le disque est remis à zéro à chaque redéploiement : pour un historique
permanent, il faudra brancher une base externe (voir JOURNAL.md).
"""
import json
import math
import re
import sqlite3
import threading
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "aether_scores.db"
MODES = ("beginner", "expert", "sp80", "ssb")   # sp80 et ssb : classement au temps réel (pas de CO₂)
# temps de course plausibles (s) : en dessous, la course est refusée (vitesse impossible pour la barge)
TIME_RANGE = {"beginner": (35, 1800), "expert": (105, 1800), "sp80": (30, 1800), "ssb": (40, 1800)}
_LOCK = threading.Lock()
_CTRL = re.compile(r"[\x00-\x1f\x7f]")
SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  name TEXT NOT NULL,
  team TEXT NOT NULL DEFAULT '',
  time_s REAL NOT NULL,
  pen_s REAL NOT NULL DEFAULT 0,
  total_s REAL NOT NULL,
  co2_kg REAL,
  saved_kg REAL,
  collisions INTEGER,
  ts INTEGER NOT NULL,
  track TEXT
);
CREATE INDEX IF NOT EXISTS runs_mode_total ON runs(mode, total_s);
CREATE INDEX IF NOT EXISTS runs_ts ON runs(ts);
CREATE TABLE IF NOT EXISTS visits (vid TEXT PRIMARY KEY, ts INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
"""
# à incrémenter quand le calcul des scores change : toutes les courses enregistrées sont alors effacées
DATA_VERSION = "3"   # v2 : le CO₂ ne compte plus que le moteur ; v3 : remise à zéro demandée le 12.10.2026
# (clé unique, mode, pseudo) : retire tout l'historique d'un joueur dans un mode, une seule fois
CLEANUPS = [("cleanup_tjl_beginner_2026_10_12", "beginner", "TJL")]


def _conn():
    c = sqlite3.connect(DB_PATH, timeout=10)
    c.row_factory = sqlite3.Row
    return c


def init():
    with _LOCK, _conn() as c:
        c.executescript(SCHEMA)
        row = c.execute("SELECT value FROM meta WHERE key = 'data_version'").fetchone()
        if not row or row[0] != DATA_VERSION:
            c.execute("DELETE FROM runs")
            c.execute("INSERT OR REPLACE INTO meta VALUES ('data_version', ?)", (DATA_VERSION,))
        # colonne ajoutée sans perte de données : vitesse max de pointe (classement SP80) ; les anciennes courses
        # la reprennent de leur trace (échantillonnée toutes les 0,5 s)
        cols = {r[1] for r in c.execute("PRAGMA table_info(runs)").fetchall()}
        if "max_kn" not in cols:
            c.execute("ALTER TABLE runs ADD COLUMN max_kn REAL")
            for rid, track in c.execute("SELECT id, track FROM runs").fetchall():
                speeds = [q[2] for q in json.loads(track or "[]") if isinstance(q, list) and len(q) >= 3]
                c.execute("UPDATE runs SET max_kn = ? WHERE id = ?", (max(speeds) if speeds else None, rid))
        # nettoyages ponctuels demandés : exécutés une seule fois par base (les nouvelles courses ne sont pas touchées)
        for key, mode, name in CLEANUPS:
            if not c.execute("SELECT 1 FROM meta WHERE key = ?", (key,)).fetchone():
                c.execute("DELETE FROM runs WHERE mode = ? AND lower(name) = ?", (mode, name.lower()))
                c.execute("INSERT INTO meta VALUES (?, 'done')", (key,))


def clean_text(value, max_len):
    """Texte libre choisi par le joueur : on retire les caractères de contrôle et on limite la longueur."""
    return " ".join(_CTRL.sub("", str(value or "")).split())[:max_len]


def _num(value, lo, hi):
    x = float(value)
    if not math.isfinite(x):
        raise ValueError("nombre invalide")
    return min(hi, max(lo, x))


def add_run(entry):
    """Valide une course envoyée par le navigateur et l'enregistre. Renvoie True si elle a été ajoutée."""
    if not isinstance(entry, dict) or entry.get("mode") not in MODES:
        return False
    name = clean_text(entry.get("name"), 16)
    if not name:
        return False
    try:
        time_s = float(entry["time"])
        lo, hi = TIME_RANGE[entry["mode"]]
        if not lo <= time_s <= hi:
            return False
        pen_s = _num(entry.get("pen", 0), 0, 600)
        track = []
        for q in (entry.get("track") or [])[:4000]:
            if isinstance(q, (list, tuple)) and len(q) >= 3:
                track.append([round(_num(q[0], -1e5, 1e5), 1), round(_num(q[1], -1e5, 1e5), 1), round(_num(q[2], -20, 120), 2)])
        speeds = [q[2] for q in track]
        max_kn = round(max(_num(entry.get("maxKn", 0) or 0, 0, 120), max(speeds) if speeds else 0), 2)
        row = (
            clean_text(entry.get("id"), 40) or f"run-{time.time_ns()}",
            entry["mode"], name, clean_text(entry.get("team"), 20),
            round(time_s, 3), round(pen_s, 3), round(time_s + pen_s, 3),
            round(_num(entry.get("co2", 0), 0, 1e6), 1), round(_num(entry.get("saved", 0), 0, 1e6), 1),
            int(_num(entry.get("coll", 0), 0, 999)), int(time.time()), json.dumps(track, separators=(",", ":")), max_kn,
        )
    except (KeyError, TypeError, ValueError):
        return False
    with _LOCK, _conn() as c:
        cur = c.execute("INSERT OR IGNORE INTO runs (id, mode, name, team, time_s, pen_s, total_s, co2_kg, saved_kg, collisions, ts, track, max_kn) "
                        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", row)
        return cur.rowcount == 1


def list_runs(limit=6000):
    """Résumé des courses (sans tracé) pour les classements du jeu."""
    with _conn() as c:
        rows = c.execute("SELECT id, mode, name, team, total_s, co2_kg, ts, max_kn FROM runs ORDER BY ts DESC LIMIT ?", (limit,)).fetchall()
    return [{"id": r["id"], "mode": r["mode"], "name": r["name"], "team": r["team"], "total": r["total_s"], "co2": r["co2_kg"], "ts": r["ts"], "vmax": r["max_kn"]} for r in rows]


def score(total_s, co2_kg):
    """Indice CO₂ × temps (t·s) : plus il est petit, mieux c'est. C'est lui qui classe le podium."""
    return round((co2_kg or 0) / 1000 * total_s, 3)


def best_runs(mode, since_ts=0, limit=None, with_track=False):
    """Meilleure course de chaque joueur (pseudo + équipe), triée par temps."""
    cols = "id, mode, name, team, time_s, pen_s, total_s, co2_kg, saved_kg, collisions, ts" + (", track" if with_track else "")
    with _conn() as c:
        rows = c.execute(f"SELECT {cols} FROM runs WHERE mode = ? AND ts >= ? ORDER BY total_s", (mode, since_ts)).fetchall()
    seen, out = set(), []
    for r in rows:
        key = (r["name"].lower(), r["team"].lower())
        if key in seen:
            continue
        seen.add(key)
        d = dict(r)
        if with_track:
            d["track"] = json.loads(d["track"] or "[]")
        out.append(d)
        if limit and len(out) >= limit:
            break
    return out


def ghosts():
    """Tracés des 3 meilleurs joueurs historiques de chaque mode (traces sur l'eau dans le jeu)."""
    return {m: [{"name": r["name"], "total": r["total_s"], "track": r["track"]} for r in best_runs(m, limit=3, with_track=True)] for m in MODES}



def ranked_runs(mode, since_ts=0, sort="score", limit=None, with_track=False):
    """Toutes les tentatives (chaque course compte, datée), classées par indice CO₂ × temps, par CO₂ ou par temps."""
    cols = "id, mode, name, team, time_s, pen_s, total_s, co2_kg, saved_kg, collisions, ts, max_kn" + (", track" if with_track else "")
    with _conn() as c:
        rows = [dict(r) for r in c.execute(f"SELECT {cols} FROM runs WHERE mode = ? AND ts >= ?", (mode, since_ts)).fetchall()]
    for d in rows:
        d["score"] = score(d["total_s"], d["co2_kg"])
        if with_track:
            d["track"] = json.loads(d["track"] or "[]")
    if sort == "vmax":   # vitesse de pointe : la plus haute d'abord
        rows.sort(key=lambda d: (-(d["max_kn"] or 0), d["total_s"]))
        return rows[:limit] if limit else rows
    key = {"score": "score", "co2": "co2_kg", "time": "total_s"}.get(sort, "score")
    rows.sort(key=lambda d: (d[key] if d[key] is not None else 1e18, d["total_s"]))
    return rows[:limit] if limit else rows


def add_visit(vid):
    """Compte un visiteur (identifiant anonyme tiré au hasard par le navigateur), une seule fois."""
    vid = re.sub(r"[^a-z0-9]", "", str(vid or "").lower())[:40]
    if len(vid) < 8:
        return False
    with _LOCK, _conn() as c:
        return c.execute("INSERT OR IGNORE INTO visits VALUES (?, ?)", (vid, int(time.time()))).rowcount == 1


def visits():
    with _conn() as c:
        return c.execute("SELECT COUNT(*) FROM visits").fetchone()[0]


def routes(limit=24):
    """Routes des meilleures tentatives de chaque mode (indice CO₂ × temps), pour la page Classements du jeu."""
    out = {}
    for m in MODES:
        rows = ranked_runs(m, sort="score", limit=limit, with_track=True)
        if m == "sp80":   # SP80 : aussi les meilleures vitesses de pointe (second classement)
            seen = {r["id"] for r in rows}
            rows += [r for r in ranked_runs(m, sort="vmax", limit=limit, with_track=True) if r["id"] not in seen]
        out[m] = [{"id": r["id"], "name": r["name"], "team": r["team"], "ts": r["ts"], "total": r["total_s"], "co2": r["co2_kg"], "vmax": r["max_kn"], "track": r["track"]}
                  for r in rows]
    return out
