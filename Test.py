"""Æther Swiss Kite Simulator — point d'entrée Streamlit.

Une seule page : le jeu (accueil, bac à sable, traversées débutant/expert, classements), sans onglets Streamlit.
Le jeu lui-même est dans game/ (HTML + modules JS), les services Python dans app/.
"""
import importlib
import os

import streamlit as st

import app.game
import app.i18n
import app.storage

# Après une mise en ligne, Streamlit Cloud peut garder en mémoire l'ancienne version des modules Python
# alors que le jeu (relu à chaque passage) est déjà à jour : on recharge un module dès que son fichier change.
for _mod in (app.i18n, app.storage, app.game):
    _mtime = os.path.getmtime(_mod.__file__)
    if getattr(_mod, "_loaded_mtime", _mtime) != _mtime:
        _mod = importlib.reload(_mod)
    _mod._loaded_mtime = _mtime

from app import storage  # noqa: E402
from app.game import game_page  # noqa: E402
from app.i18n import LANGS  # noqa: E402

st.set_page_config(page_title="Æther Swiss Kite Simulator", page_icon="🪁", layout="wide")
storage.init()

st.markdown(
    """
    <style>
      .stApp { background: #f4f6fa; }
      [data-testid="stHeader"] { display: none; }
      .block-container { padding: 0.4rem 0.4rem 0.5rem; max-width: 100%; }
    </style>
    """,
    unsafe_allow_html=True,
)

# Langue partagée avec le jeu (mémorisée dans l'adresse : ?lang=en)
if "lang" not in st.session_state:
    q = st.query_params.get("lang")
    st.session_state["lang"] = q if q in LANGS else "fr"

game_page()
