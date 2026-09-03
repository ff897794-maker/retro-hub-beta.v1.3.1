export const UI = {
  modal: {
    el: null,

    show(contentHTML) {
      // Si une modal existe déjà → on la supprime
      if (this.el) this.el.remove();

      // Création du conteneur
      this.el = document.createElement("div");
      this.el.id = "dynamicModal";
      this.el.className =
        "fixed inset-0 flex items-center justify-center bg-black/60 z-40";

      // Contenu
      const box = document.createElement("div");
      box.className = "bg-slate-800 p-4 rounded w-80 shadow-xl relative z-30";
      box.innerHTML = contentHTML;

      this.el.appendChild(box);
      document.body.appendChild(this.el);

      // Fermeture si clic sur overlay
      this.el.addEventListener("click", (e) => {
        if (e.target === this.el) this.hide();
      });
    },

    hide() {
      if (this.el) {
        this.el.remove();
        this.el = null;
      }
    },
  },

  // MESSAGE AU LANCEMENT JEU
  toast(message, duration = 2500) {
    const toast = document.getElementById("toast");
    toast.textContent = message;

    // Force reflow (indispensable dans Electron)
    void toast.offsetWidth;

    toast.style.opacity = "1";

    setTimeout(() => {
      toast.style.opacity = "0";
    }, duration);
  },
  //OVERLAY JEU INSTALLER
  addPlayOverlay(container, game, onLaunch) {
    const overlay = document.createElement("div");
    overlay.className = overlay.className =
      "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-80";
    const btn = document.createElement("button");
    btn.textContent = "LANCER";
    btn.className =
      "px-4 py-2 bg-black/80 text-white rounded text-lg shadow-lg hover:bg-black transition border-2 cursor-pointer";
    btn.onclick = () => {
      this.toast(`Lancement de ${game.name}…`);
      onLaunch(game);
    };
    overlay.appendChild(btn);
    container.appendChild(overlay);
  },
  // OVERLAY JEU NON INSTALLER
  addUnavailableOverlay(container) {
    const overlay = document.createElement("div");
    overlay.className =
      "absolute inset-0 flex items-center justify-center pointer-events-none";
    overlay.innerHTML = ` <div style=" position:absolute; left:-40%; top:45%; width:180%; background:rgba(200,0,0,0.8); color:white; padding:6px 0; text-align:center; transform:rotate(-20deg); font-weight:bold; "> Non installé ! </div> `;
    container.appendChild(overlay);
  },

  addDeleteButton(container, game, onDelete) {
    const btn = document.createElement("button");
    btn.className =
      "delete-button card-action absolute top-1 right-1 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-10";
    btn.textContent = "✖";

    btn.onclick = (e) => {
      e.stopPropagation();
      onDelete(game);
    };

    container.appendChild(btn);
  },
  addSettingsButton(card, game, onClick) {
    const btn = document.createElement("button");
    btn.className = ` settings-button card-action absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white text-xs shadow-lg z-40 hover:bg-black/90 transition `;
    // btn.innerHTML = ` <svg width="14" height="14" viewBox="0 0 24 24" fill="white"> <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.35 19.43 11.03L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.28 4.97 19.06 5.05L16.56 6.05C16.04 5.66 15.47 5.34 14.85 5.1L14.5 2.42C14.47 2.18 14.27 2 14.03 2H9.97C9.73 2 9.53 2.18 9.5 2.42L9.15 5.1C8.53 5.34 7.96 5.66 7.44 6.05L4.94 5.05C4.72 4.97 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.03C4.53 11.35 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.72 19.03 4.94 18.95L7.44 17.95C7.96 18.34 8.53 18.66 9.15 18.9L9.5 21.58C9.53 21.82 9.73 22 9.97 22H14.03C14.27 22 14.47 21.82 14.5 21.58L14.85 18.9C15.47 18.66 16.04 18.34 16.56 17.95L19.06 18.95C19.28 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z"/> </svg> `;
    btn.textContent = "⚙️";
    btn.onclick = (e) => {
      e.stopPropagation();
      onClick(game);
    };
    card.appendChild(btn);
  },
};
