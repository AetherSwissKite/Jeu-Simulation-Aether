# Journal des prompts · Æther Swiss Kite Simulator

Suivi de chaque demande (prompt) et des modifications apportées, du plus ancien au plus récent. Le projet s'appelait « KiteCargo » jusqu'au prompt 10.

**Comment les heures sont mesurées**
- **Heure du prompt** : heure d'envoi du message, lue dans l'historique local de la session Claude Code (heure de Zurich).
- **Heure du résultat** : moment où le travail est livré. Quand le prompt se termine par la question « je pousse sur GitHub ? », c'est l'heure de cette question : l'attente de la réponse n'est pas comptée.
- **Temps de calcul** : écart entre les deux. Il comprend la réflexion, l'écriture du code et les tests automatiques.
- **Tokens** : non accessibles depuis l'environnement de travail, donc non indiqués.

| # | Prompt | Heure du prompt | Heure du résultat | Temps de calcul |
|---|---|---|---|---|
| 1 | Créer un jeu simple dans Streamlit | 10-09 15:53:31 | 10-09 15:53:46 | 15 s |
| 2 | Régler les problèmes | 10-09 15:54:03 | 10-09 15:54:59 | 56 s |
| 3 | Erreur de déploiement Streamlit Cloud | 10-09 15:57:55 | 10-09 15:58:35 | 40 s |
| 4 | Simulateur de traction d'un kite sur un cargo | 10-09 16:02:48 | 10-09 16:17:17 | 14 min 29 s |
| 5 | Bug de barre blanche et design plus clair | 10-09 16:26:34 | 10-09 16:33:02 | 6 min 28 s |
| 6 | Mise en page compacte, jeu au clavier, pseudo et classement | 10-10 00:29:15 | 10-10 00:47:12 | 17 min 57 s |
| 7 | Vues avant, mode pilote de kite, kite EPFL, équipes, pastel | 10-10 08:31:19 | 10-10 09:10:52 | 39 min 33 s |
| 8 | Journal, inscription aux équipes, kites et lignes, briefing | 10-10 09:33:39 | 10-10 09:43:06 | 9 min 27 s |
| 9 | Fluidité, repères en mer, pays à l'horizon, pilotage du cargo | 10-10 14:11:16 | 10-10 14:20:16 | 9 min 00 s |
| 10 | Sites de jeux en ligne pour s'inspirer | 10-10 15:41:42 | 10-10 15:42:23 | 41 s |
| 11 | Æther Swiss Kite Simulator : refonte complète | 10-10 16:47:06 | 10-10 17:49:13 | 1 h 02 min 07 s |
| 12 | Pages retirées, gréement expert, caméra, tableau de bord | 10-10 18:09:19 | 10-10 21:44:53 | 10 min 54 s |
| 13 | Score CO₂ × temps, tentatives datées, bleu marine, EPFL, pirate, italien | 10-10 21:46:38 | 10-10 22:06:08 | 19 min 30 s |
| 14 | Page Classements, visiteurs, pirate, bac à sable vivant, kite maniable, HUD | 10-11 08:21:44 | 10-11 08:38:06 | 16 min 22 s |
| 15 | Scène pleine hauteur, fin de partie défilable, menu principal / rejouer | 10-11 09:43:33 | 10-11 09:46:56 | 3 min 23 s |
| 16 | CO₂ nul moteur coupé, historique remis à zéro | 10-11 19:47:33 | 10-11 19:49:20 | 1 min 47 s |
| 17 | Scores perdus, classement en direct, taille de la scène stable | 10-11 20:49:25 | 10-11 20:52:43 | 3 min 18 s |
| 18 | Vent plus fort et plus de risées : environ 2× plus vite au kite | 10-11 23:25:14 | 10-11 23:40:38 | 15 min 24 s |
| 19 | Retour en arrière, vent juste assez fort pour +20 % au kite | 10-11 23:43:23 | 10-11 23:58:01 | 14 min 38 s |
| 20 | Retour à la version d'avant les changements de vent | 10-12 00:03:19 | 10-12 00:03:39 | 0 min 20 s |
| 21 | Retrait des temps de TJL en mode débutant | 10-12 00:06:47 | 10-12 00:07:23 | 0 min 36 s |
| 22 | Remise à zéro de tout l'historique de course | 10-12 00:09:24 | 10-12 00:09:50 | 0 min 26 s |
| 23 | Nouveau mode « Traversée SP80 » | 10-12 20:46:07 | 10-12 21:34:13 | 48 min 06 s |
| 24 | Vent propre au SP80 (50–80 nd tout le parcours), lac plat | 10-12 21:40:11 | 10-12 21:50:31 | 10 min 20 s |

---

## 1. Créer un jeu simple dans Streamlit
- **Heure du prompt** : 2026-10-09 15:53:31 · **Heure du résultat** : 2026-10-09 15:53:46 · **Temps de calcul** : 15 s
- **Commit** : inclus dans `d9a4e70`
- **Demande** : modifier `Test.py`, relié à Streamlit, pour créer un jeu simple.
- **Modifications** :
  - `Test.py` : jeu « Devine le nombre » (1 à 100, indices plus/moins, compteur d'essais, meilleur score, bouton nouvelle partie).

## 2. Régler les problèmes
- **Heure du prompt** : 2026-10-09 15:54:03 · **Heure du résultat** : 2026-10-09 15:54:59 · **Temps de calcul** : 56 s
- **Commit** : inclus dans `d9a4e70`
- **Demande** : corriger les problèmes signalés par l'éditeur.
- **Modifications** :
  - Installation de Streamlit dans Python Anaconda (l'import ne fonctionnait pas).
  - `.vscode/settings.json` : VS Code utilise l'interpréteur Anaconda.

## 3. Erreur de déploiement Streamlit Cloud
- **Heure du prompt** : 2026-10-09 15:57:55 · **Heure du résultat** : 2026-10-09 15:58:35 · **Temps de calcul** : 40 s
- **Commit** : `d9a4e70`
- **Demande** : comprendre le message « not connected to a remote GitHub repository ».
- **Modifications** :
  - Récupération du commit `.devcontainer` créé sur GitHub.
  - `.gitignore` (ignore `.vscode/`), commit du jeu et push sur `theodorejl/5-Code`.

## 4. Simulateur de traction d'un kite sur un cargo
- **Heure du prompt** : 2026-10-09 16:02:48 · **Heure du résultat** : 2026-10-09 16:17:17 · **Temps de calcul** : 14 min 29 s
- **Commit** : `702be63`
- **Demande** : jeu avec visuels soignés, potards (vitesse et cap du bateau, vitesse et orientation du vent), jauges colorées de gains fuel et CO₂, kite qui fait des 8, et montrer que baisser la vitesse apporte environ 2/3 des gains.
- **Modifications** :
  - `kite_sim.html` : simulateur en HTML/JS (scène animée, kite en 8, fumée, boussole, potards rotatifs, 3 jauges, courbe CO₂ selon la vitesse, répartition du gain vitesse/kite, missions).
  - Modèle physique : résistance ∝ V², puissance ∝ V³, kite de 400 m², trajet Rotterdam → New York.
  - `Test.py` intègre le simulateur. Ajout de `requirements.txt` et `.streamlit/config.toml`.

## 5. Bug de barre blanche et design plus clair
- **Heure du prompt** : 2026-10-09 16:26:34 · **Heure du résultat** : 2026-10-09 16:33:02 · **Temps de calcul** : 6 min 28 s
- **Commit** : `a18fc8a`
- **Demande** : corriger la barre blanche qui apparaît en touchant les potards, et passer à un design clair, sérieux, style ingénieur.
- **Modifications** :
  - Correction : plus de défilement interne dans le cadre du simulateur, hauteurs stabilisées.
  - Nouveau thème clair (polices IBM Plex, panneaux numérotés, grille technique en fond).
  - Le kite se déplace en douceur quand le cap ou le vent change. Graphique rendu plus lisible.

## 6. Mise en page compacte, jeu au clavier, pseudo et classement
- **Heure du prompt** : 2026-10-10 00:29:15 · **Heure du résultat** : 2026-10-10 00:47:12 · **Temps de calcul** : 17 min 57 s
- **Commit** : `143d6cd`
- **Demande** : tout voir sans défiler, jouer avec les flèches et la barre espace, tutoriel des touches, pseudo avant chaque partie, classement de tous les joueurs, design inspiré de theclimatebrink.com et aetherswisskite.ch.
- **Modifications** :
  - Mise en page compacte qui tient sur un écran d'ordinateur.
  - Mode « Défi Atlantique » : traversée chronométrée avec météo imposée (dont une tempête), score = CO₂ évité − pénalités de retard et de kite arraché.
  - Commandes clavier : ↑ ↓ ← →, Espace, P, H, Entrée. Tutoriel, saisie du pseudo, compte à rebours, écran de fin.
  - Classement partagé : stocké côté serveur via un petit composant pont entre le jeu et Python.
  - Design sombre inspiré des sites de référence.

## 7. Vues avant, mode pilote de kite, kite EPFL, équipes, pastel
- **Heure du prompt** : 2026-10-10 08:31:19 · **Heure du résultat** : 2026-10-10 09:10:52 · **Temps de calcul** : 39 min 33 s
- **Commit** : `b7b8c6e`
- **Demande** : vue vers l'avant dans le défi (cabine ou 3e personne), kite blanc avec le logo EPFL rouge partout, nouveau mode pour piloter le kite (fenêtre de vol, longueur de ligne de 25 à 1000 m, taille de kite de 5 à 500 m²), couleurs pastel plus claires, grosses vagues pendant les tempêtes, classement par équipe.
- **Modifications** :
  - Vue avant en perspective : 3/4 arrière ou cabine avec console, touche V. Houle et moutons d'écume qui grossissent avec le vent, roulis et tangage.
  - Mode « Pilote de kite » : pilotage aux flèches maintenues, fenêtre de vol en 3D (touche F), surcharge et casse de ligne, crash dans l'eau, session de 90 s notée.
  - Kite blanc avec « EPFL » en rouge sur tous les rendus.
  - Classements par mode, onglets Joueurs et Équipes (moyenne des meilleurs scores des membres).
  - Thème pastel clair sur tout le site.

## 8. Journal, inscription aux équipes, kites et lignes, briefing
- **Heure du prompt** : 2026-10-10 09:33:39 · **Heure du résultat** : 2026-10-10 09:43:06 · **Temps de calcul** : 9 min 27 s
- **Commit** : `bd07f1c`
- **Demande** : tenir ce journal à jour à chaque prompt ; à l'inscription, pouvoir créer une équipe ou en rejoindre une via un menu déroulant ; mieux faire sentir la différence de maniabilité et de taille entre petits et grands kites et lignes ; mieux expliquer au début du jeu le but, les touches et les données affichées.
- **Modifications** :
  - `JOURNAL.md` créé, reprenant les prompts depuis le premier.
  - Inscription : menu déroulant avec les équipes existantes (et leur nombre de membres), « Sans équipe » ou « Créer une nouvelle équipe ». Si le nom créé existe déjà, le joueur rejoint l'équipe existante.
  - Maniabilité : un petit kite réagit en 0,2 s environ, un grand en 0,8 s, avec plus d'inertie. Une ligne longue ralentit encore les virages (environ 50°/s avec 25 m contre 11°/s avec 1000 m). Le tableau 07 affiche ces valeurs.
  - Taille à l'écran : surtout liée à la surface du kite, la ligne s'épaissit pour les grands kites. Boutons rapides plus contrastés (15 m² / 480 m², 40 m / 900 m).
  - Briefing en deux pages au début de chaque mode : but et touches, puis comment lire l'écran. Il s'ouvre aussi à la première arrivée dans le mode « Pilote de kite ».
  - Correction : la vue 3e personne n'affiche plus à tort les vitres de la cabine avec une ligne courte. Au repos, le kite se stabilise vers 45° au lieu de rester au zénith.

## 9. Fluidité, repères en mer, pays à l'horizon, pilotage du cargo
- **Heure du prompt** : 2026-10-10 14:11:16 · **Heure du résultat** : 2026-10-10 14:20:16 · **Temps de calcul** : 9 min 00 s
- **Commit** : `43f1d36`
- **Demande** : mouvements du bateau plus fluides et moins rapides ; repères visuels en mer (bateaux de pêche, voiliers, navires militaires, îles) pour situer sa progression dans le défi ; dans le mode kite, voir à l'horizon les destinations selon le cap du cargo (tour Eiffel et Mont Blanc vers la France, désert et palmiers vers l'Afrique, statue de la Liberté vers New York…), qui grossissent quand on s'approche ; pouvoir diriger le cargo pour aller chercher plus ou moins de vent.
- **Modifications** :
  - Fluidité : le cap, la vitesse et le vent affichés suivent les vraies valeurs en douceur (plus de saut de 5° à chaque appui). Roulis, tangage et pilonnement plus lents et plafonnés, faits de deux oscillations superposées.
  - Défi Atlantique : une vingtaine de repères le long de la route, dans une échelle visuelle compressée pour avoir le temps de les voir. On croise un parc éolien, un porte-conteneurs, les falaises de Douvres, le cap Gris-Nez, le phare de Bishop Rock, des voiliers, des chalutiers, des navires militaires, les icebergs des Grands Bancs, Terre-Neuve, le phare de Nantucket, puis New York avec la statue de la Liberté. Un message annonce chaque lieu nommé (à bâbord, à tribord ou droit devant).
  - Pilote de kite :
    - Carte schématique de l'Atlantique, avec 6 zones de vent : centre, vents d'ouest forts au nord, alizés au sud, calmes près de l'Afrique, petit vent d'est, dépression au nord-est.
    - Le cargo se pilote avec Q/A et D pour le cap, Z/W et S pour la vitesse, ou avec les potards cap et vitesse, désormais visibles dans ce mode. Le kite garde sa place dans le ciel quand le cargo tourne. Un conseil s'affiche quand le vent vient de face.
    - À l'horizon, selon le cap : France (tour Eiffel, Mont Blanc), Royaume-Uni (falaises, Big Ben), Islande (glacier, volcan), New York (gratte-ciel, statue de la Liberté), Afrique (dunes, pyramide, palmiers). Leur taille grandit quand on s'en approche et leur distance est affichée.
    - La boussole (02) montre la carte des vents autour du cargo, du vert (calme) au violet (fort), avec les icônes des destinations. Elle a maintenant le nord en haut.
  - Briefing du mode kite complété : touches du cargo, carte des vents, lecture de l'horizon.

## 10. Sites de jeux en ligne pour s'inspirer
- **Heure du prompt** : 2026-10-10 15:41:42 · **Heure du résultat** : 2026-10-10 15:42:23 · **Temps de calcul** : 41 s
- **Commit** : `424d9e6` (journal)
- **Demande** : 10 sites de jeux ou simulateurs en ligne proposant une expérience similaire, comme sources d'inspiration.
- **Modifications** : aucune modification du code. Liste fournie dans la conversation : En-ROADS, The Climate Game (Financial Times), PhET, Virtual Regatta, Sailonline, Windy, earth.nullschool.net, Ventusky, MarineTraffic, portfolio 3D de Bruno Simon.

## 11. Æther Swiss Kite Simulator : refonte complète
- **Heure du prompt** : 2026-10-10 16:47:06 · **Heure du résultat** : 2026-10-10 17:49:13 · **Temps de calcul** : 1 h 02 min 07 s
- **Commit** : voir l'historique git (commit « Æther Swiss Kite Simulator »)
- **Demande** : cahier des charges complet (rôle de développeur senior). Renommer le jeu, interface FR / EN / DE, page d'accueil, trois modes (bac à sable, traversée débutant d'environ 1 min, traversée expert d'environ 3 min), barge à gravier de 40 m de Villeneuve au Jet d'eau, météo rythmée identique pour tous, obstacles, cinématiques, podium, classements par période, page admin protégée, fantômes, grand kite en forme de parapente, physique prioritaire, schéma fonctionnel en PDF, 30 à 60 images/s, vérification finale.
- **Modifications** :
  - **Structure** : le jeu est découpé en `game/index.html` + 13 modules `game/js/*.js` + `game/leman_geo.json`, assemblés par Python. Services dans `app/` (`game.py`, `pages.py`, `storage.py`, `i18n.py`). `Test.py` ne fait plus que la navigation. L'ancien `kite_sim.html` est supprimé.
  - **Langues** : boutons FR / EN / DE dans le jeu et dans Streamlit, synchronisés dans les deux sens (≈ 280 textes par langue, tutoriels compris).
  - **Accueil** : scène 3D animée, texte de vision, trois cartes de mode illustrées avec tutoriel, classements.
  - **Pages Streamlit** : Résultats (routes de chaque joueur colorées selon la vitesse), Suivi des prompts (ce journal + téléchargement du PDF), Admin.
  - **Bac à sable** : barge vue de côté (Dents du Midi, Lavaux), kite parapente, explication du slow steaming conservée.
  - **Traversées** : barre et gaz à la souris ou au clavier (ZQSD), kite sorti / rentré (Espace), vue V, fenêtre de vol F, traces T. En expert, le kite se pilote aux flèches : ← → pour virer, ↓ border, ↑ choquer.
  - **Décor** : Léman à l'échelle (1 km = 60 m, relief ×1,3) : Chablais, Dents du Midi et Évian à gauche ; Chillon, Montreux, Lavaux, Lausanne, Nyon et Genève avec le Jet d'eau à droite, sans aucun nom écrit. Lumière du lever au coucher du soleil sur Genève.
  - **Météo** : vents successifs (Vaudaire, Vent, Joran en tempête, Bise), 46 risées et des zones de pétole visibles comme sur windy.app, gîte pendant la tempête. Le scénario est le même pour tous. Obstacles : vapeurs CGN (+5 s), jet-skis (+2 s), rives (+1,5 s). Des dauphins accompagnent la barge.
  - **Cinématiques** : compte à rebours 3-2-1 en travelling du lac vers le quai, où une pelle chargeait la barge. Arrivée en orbite au pied du Jet d'eau.
  - **Classements** : podium, temps au millième, histogramme des temps, onglets jour / semaine / historique et joueurs / équipes. Les traces des 3 meilleurs servent de fantômes (touche T).
  - **Stockage** : base SQLite (remplace `leaderboard.json`). Le serveur valide chaque course : un temps impossible est refusé et le total est recalculé.
  - **Admin** : accès par mot de passe (`admin_password` dans `.streamlit/secrets.toml`, jamais publié). On peut renommer un joueur ou une équipe, détacher une équipe et supprimer des courses ou tout l'historique.
  - **Kite** : grande aile en forme de parapente (caissons, profil, suspentes, logo EPFL).
  - **Physique** : inertie de la barge chargée, traction dans la fenêtre de vol, vent apparent et cisaillement, surcharge et casse.
  - **Performances** : qualité adaptative sur 3 niveaux pour tenir 30 à 60 images/s. La boucle d'animation résiste désormais à une erreur ponctuelle au lieu de se figer.
  - **Documentation** : `docs/schema_fonctionnel.pdf` (4 pages : boucle VS Code ↔ GitHub ↔ Streamlit, architecture, modèles physiques, rendu et outils), produit par `tools/make_schema_pdf.py`.
- **Vérification** (Chrome sans écran piloté automatiquement contre `streamlit run Test.py`) :
  - traversée débutant complète en français (73,5 s + 5 s de pénalité) ;
  - traversée expert complète en anglais (223,9 s + 15 s), avec le kite piloté aux flèches ;
  - bac à sable ; allemand à 1366 × 768 ;
  - changement de langue depuis le jeu puis depuis Streamlit ;
  - classements (podium, équipes), fantômes, pause ;
  - pages Résultats et Suivi des prompts ;
  - admin : mot de passe refusé puis accepté, renommage, déconnexion ;
  - tests de la base : validation, renommages, suppressions, purge.
  - Aucune erreur JavaScript à la fin des tests.
- **Corrections faites pendant la vérification** : mini-carte écrasée, textes qui débordaient dans la barre du bas, trait de vent qui traversait l'écran, gravier pixelisé en vue cabine, jauge du bac à sable qui figeait l'animation, temps de course trop courts acceptés par le serveur.
- **Reste fragile** :
  - Sur Streamlit Cloud, la base SQLite est remise à zéro à chaque redéploiement : il faudra une base externe pour un historique durable.
  - Le chrono est calculé dans le navigateur. Le serveur refuse les temps impossibles, mais un tricheur averti pourrait envoyer un temps plausible.
  - Les 60 images/s ont été mesurées sans écran : à confirmer sur un portable réel.
  - Une traversée « normale » dure environ 70 s en débutant et 200 à 220 s en expert, un peu plus que les durées cibles.

## 12. Pages retirées, gréement expert au choix, caméra qui suit le kite, tableau de bord
- **Heure du prompt** : 2026-10-10 18:09:19 · **Heure du résultat** : 2026-10-10 21:44:53 · **Temps de calcul** : 10 min 54 s (travail interrompu de 18:18 à 21:42, relancé par « fini ce que tu faisais » ; l'attente n'est pas comptée)
- **Demande** : retirer la page de suivi des prompts et l'administration ; en expert, proposer 3 tailles de kite (10, 25, 100 m²) et 3 longueurs de lignes (25, 100, 300 m) ; adapter la vue 3e personne pour voir le kite ; un tableau de données plus coloré sous la scène, avec potards et jauges.
- **Modifications** :
  - **Pages** : l'application n'a plus que Jeu et Résultats. Les pages Suivi des prompts et Admin sont supprimées, avec leurs textes et les fonctions d'administration de la base. Le mot de passe local n'existe plus. Ce fichier reste tenu à jour dans le dépôt.
  - **Gréement expert** : dans l'encadré du kite, choix de la surface (10, 25 ou 100 m²) et des lignes (25, 100 ou 300 m), mémorisé d'une partie à l'autre. On ne peut changer qu'avec le kite rentré.
    - La traction est proportionnelle à la surface. La tension de rupture dépend de la taille (≈ 1,15 kN par m²).
    - Un petit kite vire plus vite (×1,3 à 10 m², ×0,66 à 100 m²).
    - Des lignes courtes font traverser la fenêtre plus vite. Des lignes longues montent chercher un vent plus fort (loi en 1/7).
    - La taille de l'aile et la longueur des lignes se voient à l'écran. Le gréement apparaît sur l'écran d'arrivée.
  - **Caméra** : en expert, la vue 3e personne recule, pivote vers le côté du kite et dézoome automatiquement pour garder la barge et l'aile à l'écran, même avec 300 m de lignes.
  - **Tableau de bord** : la barre du bas devient 10 instruments colorés :
    - chrono avec anneau de progression ;
    - compteur de vitesse ;
    - potard des gaz ;
    - cadran du vent par rapport à la barge ;
    - jauge de tension avec zones orange et rouge ;
    - anneau de la part du kite dans la poussée ;
    - barres de CO₂ émis et évité ;
    - inclinomètre de gîte ;
    - pastilles de pénalités ;
    - courbe des images par seconde.
  - **PDF** : schéma fonctionnel mis à jour (pages retirées, gréement expert).
- **Vérification** : traversée expert en français puis en allemand (1366 × 768) avec les gréements 10 m²/25 m, 25/100, 100/300, 10/100 et 100/25. Le kite reste pilotable par un pilote automatique simple : il vole 65 à 97 % du temps. Le changement de gréement est bien refusé kite sorti. La navigation n'affiche plus que Jeu et Résultats. Aucune erreur JavaScript.

## 13. Score CO₂ × temps, tentatives datées, bleu marine, EPFL et essais Aether, pirate et requins, italien
- **Heure du prompt** : 2026-10-10 21:46:38 · **Heure du résultat** : 2026-10-10 22:06:08 · **Temps de calcul** : 19 min 30 s
- **Demande** : liste de 13 améliorations :
  - nouvelle échelle de classement CO₂ × temps (podium sur cet indice, tableau triable par indice, CO₂ ou temps) ;
  - garder toutes les tentatives d'une personne, datées ;
  - bleu marine à la place du bleu-violet ;
  - campus EPFL avec le Rolex Learning Center et les essais du prototype Aether devant Lausanne ;
  - montagnes sans trous et Valais au loin, Jet d'eau plus stylé ;
  - nouvelle phrase d'accueil et nouveaux sous-titres des modes ;
  - bateau pirate et requins dans la tempête ;
  - italien ;
  - bouton Pause ;
  - fenêtre de jeu plus grande ;
  - message « Espace pour lancer le kite » ;
  - onglets du classement qui ne marchaient pas.
- **Modifications** :
  - **Classement** :
    - Indice CO₂ × temps (t·s) = tonnes de CO₂ émises × temps total. Il classe toujours le podium. Le tableau se trie par indice, par CO₂ ou par temps.
    - Chaque tentative est une ligne datée, par exemple « TJL – Aether Alumni – 10/10/2026 22h05 ». Les équipes sont classées sur la meilleure tentative de chaque membre.
    - L'histogramme suit le critère choisi. L'écran d'arrivée affiche l'indice et le rang parmi toutes les tentatives. La page Résultats propose les mêmes tris.
  - **CO₂ du bord** : un groupe électrogène de bord de 60 kW tourne en permanence (treuil et pilote automatique du kite, timonerie). Ainsi, traîner sans moteur n'est pas gratuit : l'indice récompense le bon compromis entre vitesse, moteur et kite.
  - **Bug des onglets** : dans la fenêtre « Classements » et sur l'écran d'arrivée, les onglets ne redessinaient rien. Ces deux blocs sont maintenant enregistrés et redessinés à chaque clic.
  - **Couleurs** : tous les bleu-violet (accent, boutons, onglets, jauges, logo, thème Streamlit) passent au bleu marine. « Aether Swiss Kite » est écrit en bleu dans le titre d'accueil.
  - **Textes** : accueil « Bienvenue sur le simulateur Aether Swiss Kite ». Sous-titres des modes : « ≈ 1 min – pilote la barge uniquement » et « ≈ 3 min – pilote la barge et le kite ». Règles mises à jour (objectif = meilleur indice).
  - **Décor** :
    - Campus de l'EPFL : Rolex Learning Center (dalle blanche ondulée avec patios), bâtiments, logo EPFL.
    - Devant Lausanne, l'équipe Aether teste son prototype : un semi-rigide tracte en rond un petit catamaran portant la machine de contrôle. Le kite fait des 8, s'écrase, les bateaux s'arrêtent puis relancent l'aile (cycle de 40 s).
    - Montagnes : le Chablais rejoint les Dents du Midi et les Voirons, le haut Chablais relie le Môle aux Dents du Midi, le Jorat est prolongé. Ajout des Alpes vaudoises, du Muveran et des sommets valaisans au loin (Grand Combin).
    - Jet d'eau : plus haut, colonne à trois couches lumineuses, panache de gouttes poussé par le vent, halo de bruine et arc-en-ciel au soleil.
    - Dans la zone de tempête : un bateau pirate (voiles noires, pavillon à tête de mort ; abordage +5 s) et des requins qui tournent.
  - **Langues** : l'italien est ajouté partout (jeu, tutoriels, page Résultats, hypothèses du modèle).
  - **Jeu** :
    - Bouton Pause dans la barre d'outils (en plus de P et Échap).
    - Au départ, une bulle « Appuie sur la barre d'espace pour lancer le kite ! » reste affichée jusqu'à la sortie du kite.
    - La fenêtre de jeu prend toute la largeur et la hauteur visible de l'écran. Les marges de Streamlit sont réduites et le choix de langue Streamlit n'est plus que sur la page Résultats, le jeu ayant ses propres boutons.
  - **Corrections** : le drapeau suisse d'un vapeur CGN pouvait s'afficher en grand carré rouge près de la caméra.
- **Vérification** :
  - accueil ;
  - onglets du classement (équipes, semaine, expert, CO₂) ;
  - traversée débutant complète (bulle Espace, bouton Pause, arrivée, indice 146,392 t·s, 2 tentatives datées enregistrées) ;
  - vues EPFL, Valais, Jet d'eau et pirate en italien à 1366 × 768 ;
  - page Résultats en italien.
  - Aucune erreur JavaScript.

## 14. Page Classements, compteur de visiteurs, pirate qui chasse la CGN, bac à sable vivant, kite plus maniable, nouveau HUD
- **Heure du prompt** : 2026-10-11 08:21:44 · **Heure du résultat** : 2026-10-11 08:38:06 · **Temps de calcul** : 16 min 22 s
- **Demande** : liste de 13 améliorations :
  - supprimer les onglets Jeu / Résultats et mettre les résultats en bas d'une nouvelle page Classements ;
  - nombre de joueurs par catégorie ;
  - compteur de visiteurs ;
  - pirate qui poursuit et canonne un vapeur CGN ; vapeurs plus lents ;
  - bac à sable : décor qui défile avec la vitesse et suit le cap ;
  - bouton pour passer le tutoriel ;
  - vent portant sauf un peu de travers devant Lausanne et la tempête ;
  - kite expert maniable 70 % du temps ; plus d'amplitude de puissance ;
  - unité du podium mieux expliquée ;
  - scène de jeu 20 % moins haute ;
  - traces du top 3 en vert ;
  - instruments chrono, vitesse et vent en haut à gauche, graphiques d'évolution en bas, sans FPS.
- **Modifications** :
  - **Navigation** :
    - Plus d'onglets Streamlit ni de barre Streamlit en haut : l'application est une seule page, le jeu.
    - Nouvelle page « Classements » dans le menu du jeu : classement complet, puis carte des routes des 8 meilleures tentatives (colorées selon la vitesse) et petites cartes individuelles. Les routes suivent le mode, la période et le critère choisis.
    - Le bouton « Classements » ouvre cette page (ou la fenêtre de classement pendant une course). L'ancienne page Résultats (matplotlib) est supprimée.
  - **Classements** :
    - Pour chaque catégorie, nombre de joueurs et de tentatives enregistrées.
    - Sous le podium : « indice CO₂ × temps = tonnes de CO₂ émises × secondes de course (t·s) ». Les tableaux gardent la notation t·s.
  - **Compteur de visiteurs** : chaque navigateur tire un identifiant anonyme, compté une seule fois dans la base. Il s'affiche en petit sous l'accueil (« 👁 N visiteurs depuis le lancement »).
  - **Pirate et CGN** :
    - Les vapeurs CGN sont 1,4 fois plus lents.
    - Le bateau pirate prend en chasse le vapeur qui traverse la zone de tempête. Il se place sur son flanc et tire des bordées toutes les 3 à 4 s : éclair, fumée sur le flanc, boulets en cloche, gerbes d'eau autour du vapeur.
  - **Bac à sable** :
    - On regarde à bâbord. Le panorama du Léman tourne avec le cap : Alpes au sud, Valais à l'est, Jura au nord-ouest, Salève, horizon plat vers Genève.
    - Un ruban de cap gradué en haut montre la direction regardée.
    - Montagnes, collines (vignes côté nord), bouées et voiliers au mouillage défilent d'autant plus vite que la barge va vite. Le soleil se déplace avec le cap.
  - **Tutoriel** : bouton « Passer le tutoriel ⏭ » sur chaque page du tutoriel.
  - **Vent** : vent portant au départ et vers Genève. Un passage de vent de travers (sud / sud-ouest) devant Lausanne. Le coup de Joran est inchangé.
  - **Kite expert** :
    - Vitesse dans la fenêtre compressée : environ 20°/s au bord (l'aile ne reste plus coincée), 75°/s au plus au centre (au lieu de 130). Virages plus francs (80 à 130°/s).
    - L'aile ne retombe que si elle est vraiment trop lente.
    - Puissance réglable de 0 à 100 % (au lieu de 30 à 100 %), aux flèches ou en glissant la barre « Puissance » à la souris.
    - Avec le pilote automatique de test, le grand kite (100 m², 300 m) vole 97 % du temps au lieu de 69 %, et le 25 m² sur 100 m 83 % du temps.
  - **Affichage** :
    - Scène de traversée environ 20 % moins haute, mesurée une fois la vue affichée. Sur un écran de 1440 × 900, tout le tableau de bord est visible.
    - Traces du top 3 en vert, sur l'eau et sur la mini-carte.
    - En haut à gauche, 4 instruments au design du tableau de bord : chrono avec anneau de progression, compteur de vitesse, cadran du vent, poussée du kite.
    - En bas, ces 3 instruments et le FPS sont remplacés par deux graphiques des 30 dernières secondes : tension et poussée du kite, vitesse et vent.
  - **Dépendances** : `requirements.txt` ne contient plus que Streamlit (matplotlib ne sert plus qu'au PDF, en local).
- **Vérification** (Chrome sans écran, 1440 × 900) :
  - plus d'onglets Streamlit ;
  - compteur de visiteurs affiché ;
  - bac à sable à deux caps ;
  - bouton Passer le tutoriel ;
  - traversée débutant complète (indice 145,993 t·s) ;
  - page Classements (nombre de joueurs, podium expliqué, carte des routes) ;
  - pirate qui canonne le vapeur ;
  - maniabilité du kite avec trois gréements.
  - Aucune erreur JavaScript.

## 15. Scène pleine hauteur, fin de partie défilable, boutons menu principal / rejouer
- **Heure du prompt** : 2026-10-11 09:43:33 · **Heure du résultat** : 2026-10-11 09:46:56 · **Temps de calcul** : 3 min 23 s
- **Demande** : la scène des traversées est trop petite en hauteur par rapport à l'écran. En fin de partie, le classement bloque l'écran et le bas de la fenêtre ne s'affiche pas. Il faut un bouton menu principal ou rejouer.
- **Modifications** :
  - **Scène** : elle reprend 97 % de la hauteur libre (au lieu de 80 %), le tableau de bord restant visible en bas. Mesures :
    - 1366 × 768 : scène de 1345 × 570, bas du tableau de bord à 743 px ;
    - 1920 × 1080 : scène de 1899 × 873, bas du tableau de bord à 1046 px.
  - **Fenêtres** (fin de partie, classements, tutoriel, pause) : elles ne dépassent plus jamais la partie visible de l'écran et défilent à la molette si leur contenu est plus long.
  - **Fin de partie** : barre de boutons collée en bas, toujours visible : « Menu principal » et « Rejouer ». Raccourcis : Entrée = rejouer, Échap = menu principal. Textes traduits en FR / EN / DE / IT.
- **Vérification** : traversée débutant complète en 1366 × 768. La fenêtre de fin défile, ses boutons sont visibles (bas à 750 px sur 768) et « Menu principal » ramène à l'accueil. Aucune erreur JavaScript.

## 16. CO₂ nul moteur coupé, historique des performances remis à zéro
- **Heure du prompt** : 2026-10-11 19:47:33 · **Heure du résultat** : 2026-10-11 19:49:20 · **Temps de calcul** : 1 min 47 s
- **Demande** : en traversée, le CO₂ continue d'augmenter même avec le moteur à 0 %. Corriger, puis remettre à zéro l'historique de tout le monde.
- **Cause** : le groupe électrogène de bord de 60 kW, toujours allumé, ajouté au prompt 13.
- **Modifications** :
  - Groupe de bord supprimé : seul le moteur émet du CO₂. Moteur à 0 % (ou en marche arrière) = 0 kg.
  - Textes « CO₂ émis par le moteur » et hypothèses du modèle mis à jour dans les 4 langues.
  - **Égalités** : à indice CO₂ × temps égal (par exemple 0 t·s pour une traversée au kite seul), le plus rapide passe devant. Ce départage existait déjà, il est maintenant expliqué.
  - **Historique remis à zéro** :
    - Côté serveur, la base porte un numéro de version des données (v2). Au démarrage, une base d'une version antérieure voit toutes ses courses effacées. Le compteur de visiteurs est conservé.
    - Côté navigateur (jeu ouvert sans serveur), les classements et traces stockés localement changent de clé et repartent de zéro.
- **Vérification** :
  - En course, moteur à 0 % pendant 5 s : le carburant reste exactement à 1,765 kg, puis augmente dès qu'on remet les gaz.
  - Test de la base : une base v1 contenant une course est vidée au démarrage, les visiteurs sont gardés ; une course v2 est conservée aux redémarrages suivants ; une traversée au kite seul obtient bien un indice de 0.
  - Aucune erreur JavaScript.

## 17. Scores qui n'apparaissent pas, classement en direct, taille de la scène stable
- **Heure du prompt** : 2026-10-11 20:49:25 · **Heure du résultat** : 2026-10-11 20:52:43 · **Temps de calcul** : 3 min 18 s
- **Demande** : les temps du joueur MCN n'apparaissent pas ; la taille de la scène en traversée est aléatoire ; expliquer où sont stockés les résultats.
- **Causes trouvées** :
  - Au chargement, le jeu n'envoyait qu'un seul message de prise de contact à Streamlit. S'il partait avant que le pont soit prêt, le jeu se croyait hors ligne et gardait les scores dans le navigateur, sans les envoyer au serveur.
  - Les autres joueurs ne recevaient le classement qu'au chargement de leur page.
  - La taille de la scène n'était mesurée qu'à l'entrée dans la traversée, parfois avant que la page Streamlit ait fini de se placer.
  - Autre cause possible pour MCN : une course jouée juste avant la mise en ligne du prompt 16 a été effacée par la remise à zéro voulue.
- **Modifications** :
  - Prise de contact répétée chaque seconde jusqu'à la réponse du serveur. Le compteur de visiteurs n'est envoyé qu'une fois la liaison établie.
  - **File d'attente des scores** : chaque score est gardé dans le navigateur tant que le serveur ne l'a pas renvoyé dans son classement. Il est renvoyé automatiquement (6 essais au plus, même après un rechargement). Le serveur ignore les doublons.
  - **Classement en direct** : le pont Streamlit se rafraîchit toutes les 15 s (`st.fragment`), sans recharger le jeu. Chacun voit arriver les scores des autres.
  - **Taille de la scène** : revérifiée chaque seconde et quand les polices finissent de charger. La mise en page n'est retouchée que si la taille change vraiment.
- **Vérification** : deux onglets (un spectateur ouvert d'abord, un joueur « MCN »). La course de MCN est arrivée dans la base, sa file d'attente s'est vidée, et le spectateur l'a vue apparaître en moins de 17 s sans recharger. Taille de la scène identique avant et après la course (569 px en 1366 × 768). Aucune erreur JavaScript.

## 18. Vent plus fort et plus de risées : environ 2× plus vite avec le kite
- **Heure du prompt** : 2026-10-11 23:25:14 · **Heure du résultat** : 2026-10-11 23:40:38 · **Temps de calcul** : 15 min 24 s
- **Demande** : augmenter la force du vent et le nombre de risées pour aller environ 2 fois plus vite avec le kite en traversée.
- **Analyse** : la résistance de la coque croît avec le carré de la vitesse. Doubler la vitesse demande donc environ 4 fois plus de poussée. Un calcul d'équilibre montrait qu'avec le kite d'avant, même 30 nœuds de vent ne donnaient qu'environ 11 nœuds. Il fallait renforcer le vent ET la traction du kite.
- **Modifications** :
  - **Vent de base** : 26 à 31 nœuds (au lieu de 12 à 18). Vent portant de grand largue (~140° de l'étrave) presque partout, vent de travers devant Lausanne, coup de Joran inchangé (22 à 24 nœuds, plus les rafales de tempête).
  - **Risées** : 110 au lieu de 46, plus fortes (+12 à +21 nœuds au lieu de +6 à +13). Leur fenêtre de temps couvre une barge lente comme une barge deux fois plus rapide : on en croise quelle que soit son allure.
  - **Kite** : traction de l'aile automatique (débutant) ×4, finesse de l'aile pilotée (expert) 4,2 → 6. Tension de rupture relevée : 520 kN en débutant, environ 4,5 kN par m² en expert (au lieu de 95 kN et 1,15 kN/m²).
  - **Kite expert** : vitesse dans la fenêtre recalibrée pour ce vent fort (65°/s au plus), et léger effet de sol (la descente ralentit sous 10° d'altitude). L'aile reste ainsi maniable.
  - **Serveur** : temps minimum accepté abaissé à 18 s en débutant et 55 s en expert (une barge très bien tractée va deux fois plus vite).
  - **Affichage** : compteur de vitesse et graphique jusqu'à 20 nœuds ; astuce du tutoriel et hypothèses du modèle mises à jour (4 langues).
- **Mesures** (pilote automatique de test, traversée débutant complète, plein gaz) :
  - moteur seul : 7,5 nœuds de moyenne, 77,2 s ;
  - avec le kite : 12,8 nœuds de moyenne, pointes à 19,1 nœuds, 46,3 s (avant ce prompt : environ 8 nœuds, 72,5 s).
  - Le pilote automatique rentre le kite pendant la tempête : un joueur qui le garde en l'air dans les risées s'approche du doublement.
  - Kite expert : en vol 97 % du temps (100 m², lignes de 100 et 300 m) et 83 % (25 m², 100 m).
  - Aucune erreur JavaScript.
- **Note** : les temps ne sont plus comparables à ceux d'avant ; la mise en ligne efface de toute façon l'ancien classement.

## 19. Retour à la version d'avant, avec juste assez de vent pour aller ~20 % plus vite au kite
- **Heure du prompt** : 2026-10-11 23:43:23 · **Heure du résultat** : 2026-10-11 23:58:01 · **Temps de calcul** : 14 min 38 s
- **Demande** : le prompt 18 allait beaucoup trop loin. Revenir à la version d'avant, avec juste assez de vent pour aller environ 20 % plus vite avec le kite.
- **Modifications** :
  - **Retour en arrière** : tout le prompt 18 est annulé (`git revert`) : traction et finesse du kite d'origine, tensions, temps minimum du serveur, jauges et textes.
  - **Vent** : 20 à 28 nœuds de base au lieu de 12 à 18 (environ +60 %). Mêmes directions qu'avant (vent portant, travers devant Lausanne), Joran inchangé.
  - **Risées** : 80 au lieu de 46, un peu plus fortes (+8 à +15 nœuds au lieu de +6 à +13). Elles restent plus longtemps, pour qu'on les croise même en allant plus vite que l'allure nominale.
  - **Tension de rupture** : relevée modérément pour que ce vent reste utilisable : 140 kN en débutant (au lieu de 95), environ 1,6 kN par m² en expert (au lieu de 1,15).
  - **Kite expert** : on garde le réglage de maniabilité pour vent soutenu (65°/s au plus dans la fenêtre, effet de sol près de l'eau). Sans lui, le kite de 100 m² sur 100 m ne volait plus que 39 % du temps.
- **Mesures** (pilote automatique de test, traversée débutant complète avec kite, plein gaz) :
  - avant : 7,9 nœuds de moyenne, 72,8 s ;
  - maintenant : 9,3 nœuds de moyenne (+18 %), pointes à 12,3 nœuds, 62,5 s ;
  - étapes intermédiaires : +60 % de vent seul = +11 % de vitesse ; avec les risées = +18 %.
  - Kite expert : en vol 97 % du temps (100 m² sur 100 ou 300 m) et 83 % (25 m², 100 m).
  - Aucune erreur JavaScript.

## 20. Retour à la version d'avant les changements de vent
- **Heure du prompt** : 2026-10-12 00:03:19 · **Heure du résultat** : 2026-10-12 00:03:39 · **Temps de calcul** : 0 min 20 s
- **Demande** : revenir à la version d'avant la demande d'augmentation du vent (« c'était mieux avant »).
- **Modifications** :
  - Tout le code (jeu, services Python, outils, PDF) est remis exactement dans l'état du commit `6a538cb` (prompt 17). Les prompts 18 et 19 sont donc annulés.
  - On retrouve le vent de 12 à 18 nœuds, les 46 risées d'origine, le kite et les tensions d'origine (95 kN en débutant, environ 1,15 kN par m² en expert) et la maniabilité du kite expert du prompt 14.
  - Le journal garde la trace des prompts 18 et 19.
- **Vérification** : aucun écart entre le code et le commit `6a538cb` en dehors de ce journal ; cette version avait été testée au prompt 17.

## 21. Retrait des temps de TJL en mode débutant
- **Heure du prompt** : 2026-10-12 00:06:47 · **Heure du résultat** : 2026-10-12 00:07:23 · **Temps de calcul** : 0 min 36 s
- **Demande** : retirer tous les temps de TJL de l'historique du mode débutant.
- **Modifications** :
  - La base en ligne n'est pas accessible directement (page Admin retirée). On passe donc par un nettoyage ponctuel exécuté une seule fois au démarrage du serveur (`CLEANUPS` dans `app/storage.py`).
  - Il supprime toutes les courses du mode débutant au pseudo TJL, sans tenir compte des majuscules, puis le note dans la base pour ne jamais recommencer.
  - Les courses de TJL en expert, celles des autres joueurs et les futures courses de TJL ne sont pas touchées.
- **Vérification** : test sur une base de copie. TJL et tjl en débutant sont supprimés ; MCN et TJL en expert sont gardés ; une nouvelle course de TJL en débutant est conservée aux redémarrages suivants.

## 22. Remise à zéro de tout l'historique de course
- **Heure du prompt** : 2026-10-12 00:09:24 · **Heure du résultat** : 2026-10-12 00:09:50 · **Temps de calcul** : 0 min 26 s
- **Demande** : remettre à zéro tout l'historique de course.
- **Modifications** :
  - **Serveur** : version des données passée de 2 à 3. Au démarrage, la base en ligne efface toutes les courses (débutant et expert, tous les joueurs). Le compteur de visiteurs est conservé.
  - **Navigateur** : les clés de stockage local (classement hors ligne, traces, scores en attente d'envoi) passent en v3, pour qu'aucun ancien score en attente ne soit renvoyé après la remise à zéro.
- **Vérification** : test sur une base de copie en version 2 contenant deux courses : elles sont effacées au démarrage, le visiteur est gardé, et une nouvelle course est conservée aux redémarrages suivants.

## 23. Nouveau mode « Traversée SP80 »
- **Heure du prompt** : 2026-10-12 20:46:07 · **Heure du résultat** : 2026-10-12 21:34:13 · **Temps de calcul** : 48 min 06 s
- **Demande** : ajouter la « Traversée SP80 » sans toucher aux autres modes. Le SP80 est le trimaran de vitesse du projet sp80.ch (objectif 80 nœuds) avec son kite de 25 m². Même parcours, même météo, même carte, environ 1 min 30. Commandes : flèches pour le kite, Q/D pour le cap, Z/S désactivés (100 % voile). Vue 3ᵉ personne et vue pilote secouée. Physique réaliste mais jouable. Classement séparé au temps réel, intégré à la page Classements avec ses standards. Tutoriel dédié avec « Passer le tutoriel ». Toutes les langues. 30 à 60 images/s. Aucune perte de données.
- **Recherche** :
  - Le site sp80.ch était inaccessible (certificat expiré). J'ai utilisé la presse spécialisée : yacht.de, IEEE Spectrum, EPFL Actu, Mensgear, WatchPro.
  - Le SP80 est un trimaran d'environ 10 × 7,5 m pour environ 1 t, conçu par des ingénieurs et étudiants de l'EPFL.
  - Forme : coque centrale en goutte en carbone, deux cockpits en tandem sous verrière, bras courts en forme d'aile vers deux petits flotteurs, foil central ventilé, petit safran avant, bôme pivotante noire (« power module ») où s'attache le kite.
  - Livrée noire avec un bandeau rouge et la marque Richard Mille en blanc.
  - Kites de 12 à 40 m² (25 m² aux essais), lignes de 40 à 90 m. Navigation à 100–140° du vent. Coque qui déjauge vers 25 nœuds. Record du bateau : 58,3 nœuds ; record du monde visé : 65,45 nœuds.
- **Modifications** :
  - **Nouveau module `game/js/72_sp80.js`** (régime séparé, pas une adaptation du code de la barge) :
    - **Maquette 3D fidèle** : coque en goutte noire, bandeau rouge, verrières en tandem, bras et flotteurs, safran, bôme du power module orientée vers le kite, marquages « RICHARD MILLE » et « SP80 », gerbe d'eau du foil.
    - **Kite de 25 m²** noir au logo Richard Mille, sur 70 m de lignes.
    - **Physique** : pas de moteur ; traction du kite contre une traînée ∝ V², plus forte sur coque jusqu'au décollage du foil (~25 nœuds). Le foil encaisse l'effort latéral (dérive et gîte presque nulles en vol). Masse effective faible, donc accélérations violentes. Barre de plus en plus sensible avec la vitesse (×1,8) et coûteuse en vitesse.
    - **Kite du SP80** : aile très rapide qui garde de la puissance près du bord de la fenêtre et ralentit au bord sans s'y écraser. Coefficient de portance élevé (aile de course), vitesse dans la fenêtre plafonnée à 50°/s pour rester pilotable.
    - **Vue pilote** : dans le cockpit avant, secousses (lacet, tangage, roulis, hauteur) qui croissent avec le carré de la vitesse, l'état du lac et les chocs. Champ de vision élargi à haute vitesse. Habillage du cockpit (arceaux de verrière, nez noir au bandeau rouge, gouttes).
  - **Course partagée** :
    - La boucle de course appelle soit le régime barge, soit le régime SP80. La vitesse nominale par mode (20 nœuds pour le SP80) fixe la compression du temps.
    - La météo, les risées, la tempête, les vapeurs CGN, le pirate et les requins restent calés sur l'avancement : même scénario pour tous.
    - Collisions et sillage adaptés à la taille du bateau.
  - **Interface** :
    - Onglet « Traversée SP80 » entre Expert et Classements, et carte d'accueil illustrée.
    - En SP80 : levier des gaz masqué, réglage de puissance du kite visible, sélecteurs de gréement masqués.
    - HUD : compteur jusqu'à 90 nœuds avec repère du record (65,45). Tableau de bord : VMG et angle au vent, état du foil, vitesse max à la place du moteur, de la part du kite et du CO₂.
    - Le bouton 🏆 est réduit à son icône pour garder la barre du haut sur une ligne.
  - **Tutoriel** SP80 en 3 pages (objectif et règles, commandes, lecture de l'écran) avec « Passer le tutoriel ».
  - **Classements** :
    - Mode `sp80` ajouté côté serveur (temps accepté à partir de 30 s), aux fantômes et aux routes.
    - Classement SP80 au temps réel, sans indice CO₂ : podium, temps au millième, nombre de joueurs, jour / semaine / historique, joueurs / équipes, traces du top 3 en vert, routes.
    - Écran d'arrivée avec la vitesse max.
    - **Aucune migration** : la version des données est inchangée, les courses des modes barge restent intactes.
  - **Textes** : FR, EN, DE et IT (338 textes par langue), hypothèses du modèle et schéma PDF mis à jour.
- **Vérification** (Chrome sans écran, 1440 × 900) :
  - **SP80** :
    - Z sans effet (gaz à 0) et levier des gaz masqué.
    - Tutoriel affiché et passé.
    - Traversée complète en 110,8 s (+7 s de pénalités), pointe à 63,5 nœuds, 60 images/s minimum.
    - Lors d'un essai précédent, le bateau a atteint 72,3 nœuds.
    - Vue pilote capturée à 52–57 nœuds en pleine tempête.
    - Page Classements onglet SP80 : colonnes Tentative / Temps, podium au temps, tri CO₂ masqué.
  - **Non-régression** :
    - Traversée débutant complète en 72,7 s, comme avant.
    - Expert : sélecteurs de gréement, gaz et puissance visibles.
    - Bac à sable, menu en allemand et barre du haut sur une ligne en 1366 et 1440 px.
    - Test de la base : courses des anciens modes conservées après la mise à jour, course SP80 acceptée, temps trop court refusé.
    - Aucune erreur JavaScript.
- **Reste fragile** :
  - Le pilote automatique de test devait « tenir » l'aile du bon côté : il n'a pas validé la difficulté réelle pour un humain, et le réglage de vitesse et de durée mériterait un essai en main.
  - Le vent arrière du parcours oblige à empanner en zigzag : c'est fidèle au vrai SP80, mais exigeant.
  - Le classement en ligne reste stocké sur le disque éphémère de Streamlit Cloud.

## 24. Vent propre au SP80 : 50 à 80 nœuds tout le long du parcours, lac plat
- **Heure du prompt** : 2026-10-12 21:40:11 · **Heure du résultat** : 2026-10-12 21:50:31 · **Temps de calcul** : 10 min 20 s
- **Demande** : modifier le vent uniquement pour la traversée SP80, pour aller entre 50 et 80 nœuds tout le long du parcours, en gardant le lac assez plat.
- **Modifications** :
  - **Profil de vent par mode** (`WIND_PROFILE`, choisi au début de chaque traversée) : les modes barge gardent exactement leur vent ; le SP80 a le sien (`WIND_KEYS_SP80`).
  - **Vent du SP80** : 25 nœuds de travers, à environ 110° de la route du côté bâbord, qui tourne avec les virages du parcours. Le SP80 navigue donc toujours à son meilleur angle, sans avoir à zigzaguer. Risées et tempête conservées.
  - **Pétoles** : beaucoup plus faibles en SP80 (−25 % de vent au lieu de −78 %).
  - **Lac plat en SP80** : vagues limitées à quelques centimètres et pas de moutons, quel que soit le vent.
  - **Annonces de vent** (Vaudaire, Joran…) désactivées en SP80, car elles ne correspondent plus à ce vent.
  - **Compression du temps** recalée (vitesse nominale 52 nœuds) pour garder une traversée d'environ 1 min 30 malgré la vitesse plus élevée.
- **Mesures** (pilote de test, traversée SP80 complète) :
  - Réglages successifs :

    | Vent | Temps entre 50 et 80 nœuds | Vitesse moyenne |
    |---|---|---|
    | 14 nœuds à 105° | 11 % | 32 nœuds |
    | 18 nœuds | 29 % | 43 nœuds |
    | 22 nœuds à 110° | 52 % | 50 nœuds |
    | 25 nœuds à 110° | 87 % | 60 nœuds |

  - Avec 25 nœuds : 10 % sous 50 nœuds (départ et chocs) et 3 % au-dessus de 80 nœuds (pointe à 84 dans une rafale).
  - Traversée en 79,8 s.
  - **Non-régression** : vent de départ des modes débutant et expert toujours de 15 nœuds du 120°, celui du SP80 de 25 nœuds du 189°. Aucune erreur JavaScript.

