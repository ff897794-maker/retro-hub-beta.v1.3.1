let games = {};
let categories = [];

export function loadGames() {
  const data = localStorage.getItem("retroGames");
  games = data ? JSON.parse(data) : {};
}

export function saveGames() {
  localStorage.setItem("retroGames", JSON.stringify(games));
}

export function loadCategories() {
  const defaults = ["Plateforme", "Arcade", "RPG", "TPS"];
  const saved = localStorage.getItem("retroCategories");
  categories = saved ? JSON.parse(saved) : [];

  defaults.forEach((def) => {
    if (!categories.includes(def)) categories.push(def);
  });

  localStorage.setItem("retroCategories", JSON.stringify(categories));
}

export function syncCategories() {
  categoryFilter.innerHTML = '<option value="all">Toutes</option>';

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

export function addCategory() {
  const input = document.getElementById("newCategoryInput");
  const newCat = input.value.trim();

  if (!newCat) return;

  let categories = JSON.parse(localStorage.getItem("retroCategories")) || [];

  if (!categories.includes(newCat)) {
    categories.push(newCat);
    localStorage.setItem("retroCategories", JSON.stringify(categories));
  }

  loadCategories();
  syncCategories();

  const select = document.getElementById("editCategory");
  if (select) {
    select.innerHTML = "";
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
  }

  input.value = "";
}
