"""Textes Streamlit autour du jeu (le jeu a ses propres traductions dans game/js/06_strings.js)."""
import streamlit as st

LANGS = {"fr": "FR", "en": "EN", "de": "DE", "it": "IT"}

STRINGS = {
    "fr": {
        "lang": "Langue",
        "model_title": "📐 Hypothèses physiques du modèle",
        "model_md": """
- **Barge à gravier** : 40 m, chargée. Résistance de carène ∝ V² (4,2 kN par (m/s)²), moteur de 500 kW (80 kN de poussée, environ 8,5 nœuds sans kite).
  Dans les traversées, l'inertie est réglée par une *masse effective* (80 t en débutant, 190 t en expert) : le temps est compressé pour qu'une traversée dure 1 ou 3 minutes.
- **Classement** : indice CO₂ × temps (tonnes de CO₂ émises × secondes) : le moteur coûte du CO₂, la lenteur coûte du temps ; le kite fait baisser les deux. À indice égal (par exemple 0 au kite seul), le plus rapide passe devant.
- **Kite** : 150 m² et 200 m de lignes en traversée débutant ; en expert, tu choisis 10, 25 ou 100 m² et des lignes de 25, 100 ou 300 m ; 90 m² dans le bac à sable. Vent à l'altitude du kite selon une loi en puissance 1/7, puis vent apparent (on retranche la vitesse de la barge).
  Traction = ½·ρ·S·C_L·Va², où Va combine le vent apparent et la vitesse propre de l'aile en travers du vent (d'où l'intérêt des 8). Fenêtre de vol : puissance ∝ cos(élévation)·cos(écart au centre).
- **Pilotage expert** : les lignes arrière font virer l'aile, les lignes avant règlent l'incidence (choquer/border). Un petit kite vire vite mais tire peu ; des lignes longues montent chercher plus de vent mais l'aile traverse la fenêtre plus lentement. Au-delà d'environ 1,15 kN par m² de kite, la ligne casse.
- **Turbo-Pédalo** : pédalo de plage (~250 kg avec pilote) monté sur hydrofoils, sans moteur, kite de course de 25 m² sur 70 m de lignes renforcées. Traînée ∝ V², plus forte sur les flotteurs jusqu'au décollage des foils (~20 nd) ; l'aile garde de la puissance près du bord de la fenêtre, d'où des vitesses de plus de 5 fois le vent au largue (100–140° du vent), jusqu'à ~200 nd. Mode de jeu volontairement fantaisiste. Classement au temps réel ou à la vitesse de pointe.
- **SSB (Lobst'Air)** : foiler électrique solaire + hydrogène (~70 kW), décollage sur foils vers 12 nd, ~25 nd en vol ; panne moteur à l'entrée de la tempête, fin de traversée au kite de 25 m² sur 200 m de lignes (fenêtre large, réponse plus lente). Classement au temps réel.
- **Météo** : même scénario pour tous (Vaudaire, Vent, coup de Joran, Bise ; risées et pétole), qui se déroule selon le temps de course normalisé.
- **Bac à sable** : puissance ∝ V³, gazole par traversée ∝ V² ; répartition du gain = moyenne des deux ordres (ralentir puis kite, kite puis ralentir).
""",
        "none": "—",
    },
    "en": {
        "lang": "Language",
        "model_title": "📐 Physical assumptions of the model",
        "model_md": """
- **Gravel barge**: 40 m, loaded. Hull resistance ∝ V² (4.2 kN per (m/s)²), 500 kW engine (80 kN thrust, about 8.5 knots without kite).
  In the crossings, inertia is set by an *effective mass* (80 t beginner, 190 t expert): time is compressed so that a crossing lasts 1 or 3 minutes.
- **Ranking**: CO₂ × time index (tonnes of CO₂ emitted × seconds): the engine costs CO₂, slowness costs time; the kite lowers both. On equal index (e.g. 0 on kite alone), the fastest ranks first.
- **Kite**: 150 m² on 200 m lines in the beginner crossing; in expert you pick 10, 25 or 100 m² and 25, 100 or 300 m lines; 90 m² in the sandbox. Wind at kite altitude from a 1/7 power law, then apparent wind (barge speed subtracted).
  Pull = ½·ρ·S·C_L·Va², where Va combines the apparent wind and the wing's own crosswind speed (hence figure-eights). Wind window: power ∝ cos(elevation)·cos(offset from centre).
- **Expert flying**: back lines turn the wing, front lines set the angle of attack (depower/power). A small kite turns fast but pulls little; long lines reach stronger wind but the wing crosses the window more slowly. Above about 1.15 kN per m² of kite the line snaps.
- **Turbo Pedalo**: beach pedal boat (~250 kg with pilot) on hydrofoils, no engine, 25 m² racing kite on 70 m reinforced lines. Drag ∝ V², higher on the floats until the foils take off (~20 kn); the wing keeps power near the window edge, giving over 5 times the wind speed on a reach (100–140° to the wind), up to ~200 kn. A deliberately fanciful game mode. Ranked by real time or by peak speed.
- **SSB (Lobst'Air)**: solar + hydrogen electric foiler (~70 kW), foil take-off near 12 kn, ~25 kn flying; motor failure entering the storm, finish under a 25 m² kite on 200 m lines (wide window, slower response). Ranked by real time.
- **Weather**: the same scenario for everyone (Vaudaire, Vent, Joran squall, Bise; gusts and calm patches), driven by normalised race time.
- **Sandbox**: power ∝ V³, diesel per crossing ∝ V²; share of the gain = average of both orders (slow down then kite, kite then slow down).
""",
        "none": "—",
    },
    "de": {
        "lang": "Sprache",
        "model_title": "📐 Physikalische Annahmen des Modells",
        "model_md": """
- **Kiesschiff**: 40 m, beladen. Rumpfwiderstand ∝ V² (4,2 kN pro (m/s)²), 500-kW-Motor (80 kN Schub, etwa 8,5 Knoten ohne Kite).
  Bei den Überfahrten wird die Trägheit über eine *effektive Masse* eingestellt (80 t Einsteiger, 190 t Profi): die Zeit ist komprimiert, damit eine Überfahrt 1 bzw. 3 Minuten dauert.
- **Wertung**: Index CO₂ × Zeit (Tonnen CO₂ × Sekunden): der Motor kostet CO₂, Langsamkeit kostet Zeit; der Kite senkt beides. Bei gleichem Index (z. B. 0 nur mit Kite) liegt der Schnellere vorn.
- **Kite**: 150 m² an 200-m-Leinen bei der Einsteiger-Überfahrt; als Profi wählst du 10, 25 oder 100 m² und Leinen von 25, 100 oder 300 m; 90 m² im Sandkasten. Wind in Kite-Höhe nach einem 1/7-Potenzgesetz, dann scheinbarer Wind (Schiffsgeschwindigkeit abgezogen).
  Zug = ½·ρ·S·C_L·Va², wobei Va den scheinbaren Wind und die Eigengeschwindigkeit des Schirms quer zum Wind kombiniert (daher die Achten). Windfenster: Leistung ∝ cos(Höhe)·cos(Abweichung von der Mitte).
- **Profi-Steuerung**: die hinteren Leinen lenken den Schirm, die vorderen stellen den Anstellwinkel ein (fieren/dichtholen). Ein kleiner Kite dreht schnell, zieht aber wenig; lange Leinen erreichen stärkeren Wind, doch der Schirm quert das Fenster langsamer. Ab etwa 1,15 kN pro m² Kite reisst die Leine.
- **Turbo-Tretboot**: Strand-Tretboot (~250 kg mit Pilot) auf Hydrofoils, ohne Motor, 25-m²-Rennkite an 70 m verstärkten Leinen. Widerstand ∝ V², auf den Schwimmern höher bis zum Abheben der Foils (~20 kn); der Schirm behält Leistung am Fensterrand, daher über 5-fache Windgeschwindigkeit raumschots (100–140° zum Wind), bis ~200 kn. Ein bewusst fantasievoller Spielmodus. Wertung nach Zeit oder Spitzentempo.
- **SSB (Lobst'Air)**: solar- und wasserstoffelektrischer Foiler (~70 kW), Abheben auf den Foils bei ~12 kn, ~25 kn im Flug; Motorschaden beim Eintritt in den Sturm, Ziel am 25-m²-Kite an 200 m Leinen (breites Fenster, trägere Reaktion). Wertung nach echter Zeit.
- **Wetter**: dasselbe Szenario für alle (Vaudaire, Vent, Joran-Bö, Bise; Böen und Flautenfelder), gesteuert durch die normierte Fahrzeit.
- **Sandkasten**: Leistung ∝ V³, Diesel pro Überfahrt ∝ V²; Anteile am Gewinn = Mittel beider Reihenfolgen (erst langsamer, dann Kite und umgekehrt).
""",
        "none": "—",
    },
    "it": {
        "lang": "Lingua",
        "model_title": "📐 Ipotesi fisiche del modello",
        "model_md": """
- **Chiatta di ghiaia**: 40 m, carica. Resistenza dello scafo ∝ V² (4,2 kN per (m/s)²), motore da 500 kW (80 kN di spinta, circa 8,5 nodi senza kite).
  Nelle traversate l'inerzia è data da una *massa efficace* (80 t principiante, 190 t esperto): il tempo è compresso perché una traversata duri 1 o 3 minuti.
- **Classifica**: indice CO₂ × tempo (tonnellate di CO₂ × secondi): il motore costa CO₂, la lentezza costa tempo; il kite abbassa entrambi. A parità di indice (per esempio 0 col solo kite), passa davanti il più veloce.
- **Kite**: 150 m² e 200 m di cavi nella traversata principiante; da esperto scegli 10, 25 o 100 m² e cavi da 25, 100 o 300 m; 90 m² nella sandbox. Vento alla quota del kite secondo una legge di potenza 1/7, poi vento apparente (si sottrae la velocità della chiatta).
  Trazione = ½·ρ·S·C_L·Va², dove Va combina il vento apparente e la velocità propria dell'ala trasversale al vento (da qui l'interesse degli 8). Finestra di volo: potenza ∝ cos(elevazione)·cos(scarto dal centro).
- **Pilotaggio esperto**: i cavi posteriori fanno virare l'ala, quelli anteriori regolano l'incidenza (lascare/cazzare). Un kite piccolo vira in fretta ma tira poco; cavi lunghi raggiungono vento più forte ma l'ala attraversa la finestra più lentamente. Oltre circa 1,15 kN per m² di kite il cavo si rompe.
- **Turbo-Pedalò**: pedalò da spiaggia (~250 kg col pilota) su idrofoil, senza motore, kite da corsa di 25 m² su cavi rinforzati di 70 m. Resistenza ∝ V², maggiore sui galleggianti fino al decollo dei foil (~20 nd); l'ala mantiene potenza vicino al bordo della finestra, da cui velocità oltre 5 volte il vento al lasco (100–140° dal vento), fino a ~200 nd. Una modalità volutamente fantasiosa. Classifica al tempo o alla velocità di punta.
- **SSB (Lobst'Air)**: foiler elettrico solare + idrogeno (~70 kW), decollo sui foil verso 12 nd, ~25 nd in volo; guasto al motore all'ingresso della tempesta, arrivo col kite di 25 m² su cavi di 200 m (finestra ampia, risposta più lenta). Classifica al tempo reale.
- **Meteo**: stesso scenario per tutti (Vaudaire, Vent, colpo di Joran, Bise; raffiche e bonacce), che si svolge secondo il tempo di gara normalizzato.
- **Sandbox**: potenza ∝ V³, gasolio per traversata ∝ V²; ripartizione del guadagno = media dei due ordini (prima rallentare poi kite, e viceversa).
""",
        "none": "—",
    },
}


def lang():
    return st.session_state.get("lang", "fr")


def t(key, **kw):
    s = STRINGS.get(lang(), STRINGS["fr"]).get(key) or STRINGS["fr"].get(key, key)
    return s.format(**kw) if kw else s
