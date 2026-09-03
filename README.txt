///// FR
Retro Hub est une interface moderne permettant de gérer, organiser et lancer des applications rétro, avec une présentation inspirée des launchers comme Steam.

Il s’agit de l’un de mes premiers projets personnels. Il m’a permis d’apprendre énormément sur JavaScript, la structuration d’un projet, ainsi que sur la création d’applications desktop via Electron.

Grâce à Electron, Retro Hub peut être compilé et installé comme une application classique, avec lancement via une icône sur le bureau.
Toutes les données sont stockées en localStorage, ce qui permet une utilisation simple et entièrement locale.

Même si le projet comporte sûrement quelques incohérences (normal pour un premier projet), il représente une étape importante dans mon apprentissage et constitue une base solide pour de futures améliorations.

///// EN
Retro Hub is a modern interface designed to manage, organize, and launch retro applications, with a look and feel inspired by game launchers like Steam.

This is one of my first personal projects, and it naturally contains a few inconsistencies here and there. However, it has taught me a lot about JavaScript, project structure, and how to build desktop applications using Electron.

Thanks to Electron, Retro Hub can be compiled and installed like a regular desktop application, complete with a shortcut and a standalone executable.
All data is stored locally using localStorage, making the app simple, lightweight, and fully offline.

Even though the project is still experimental, it represents an important step in my learning journey and serves as a solid foundation for future improvements.

/////

/
├── dist/                 # Code source principal (équivalent de src/) // # Main source code (acts as src/)
│   ├── assets/
│   ├── covers/           # Jaquettes (non versionné) //  # Game covers (not versioned)
│   ├── Game.js
│   ├── GameCard.js
│   ├── Modal.js
│   ├── Render.js
│   ├── Storage.js
│   ├── UI.js             # Interface utilisateur // # User interface logic
│   ├── index.html
│   ├── index.js
│   └── styles.css
│
├── libs/                 # Modules internes / logique métier  // # Internal modules / business logic
│
├── release/              # Build compilé (non versionné) // # Compiled build (not versioned)
│
├── backup/               # Sauvegardes locales (non versionné) // # Local backups (not versioned)
│
├── .vscode/              # Config locale VS Code (non versionné) // # Local VS Code settings (not versioned)
│
├── default.css           # Styles additionnels / # Additional styles
├── style.css             # Styles globaux / # Global styles
├── tailwind.config.js    # Configuration Tailwind / # Tailwind configurati
├── main.js               # Point d’entrée / # Electron preload scrip
├── preload.js            # Initialisation / # Electron preload scrip
├── package.json          # Dépendances + scripts / # Dependencies & scripts
├── package-lock.json     # Verrouillage des versions / # Locked dependency versions
└── ddraw.ini             # Config locale Windows (non versionné) / # Windows compatibility config (not versioned)