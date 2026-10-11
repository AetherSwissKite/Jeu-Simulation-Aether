"""Æther Swiss Kite Simulator — point d'entrée Streamlit.

Une seule page : le jeu (accueil, bac à sable, traversées débutant/expert, classements), sans onglets Streamlit.
Le jeu lui-même est dans game/ (HTML + modules JS), les services Python dans app/.
"""
import streamlit as st

from app import storage
from app.game import game_page
from app.i18n import LANGS

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
