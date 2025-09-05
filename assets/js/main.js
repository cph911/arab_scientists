// سنة الفوتر + تهيئة الثيم من التخزين
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // إدارة الثيم (Light/Dark)
  const root = document.documentElement; // <html>
  const toggle = document.getElementById("themeToggle");
  // اقرأ آخر خيار محفوظ
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else {
    // الوضع الافتراضي: light (تقدر تغيّره إلى auto لو تبغى احترام نظام الجهاز تلقائيًا)
    root.setAttribute("data-theme", "light");
  }
  setIcon();

  function setIcon(){
    if (!toggle) return;
    const now = root.getAttribute("data-theme");
    toggle.textContent = now === "dark" ? "☀️" : "🌙";
    toggle.title = now === "dark" ? "الوضع الفاتح" : "الوضع الداكن";
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      const now = root.getAttribute("data-theme");
      const next = now === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setIcon();
    });
  }
});

// بناء كروت العلماء في scientists.html
(function mountGrid(){
  const grid = document.getElementById("grid");
  if (!grid || !window.SCIENTISTS) return;

  const empty = document.getElementById("emptyState");

  function render(list){
    grid.innerHTML = "";
    list.forEach(s => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `scientist.html?slug=${s.slug}`;

      const avatar = document.createElement("div");
      avatar.className = "avatar";

      const img = document.createElement("img");
      img.alt = s.name;
      img.loading = "lazy";
      img.src = s.image ? `images/${s.image}` : "images/placeholder.jpg";
      avatar.appendChild(img);

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = s.name;

      const field = document.createElement("div");
      field.className = "field";
      field.textContent = s.field;

      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(field);
      grid.appendChild(card);
    });

    if (empty) {
      if (list.length === 0) empty.classList.remove("hidden");
      else empty.classList.add("hidden");
    }
  }

  render(window.SCIENTISTS);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = (e.target.value || "").trim();
      if (!q) { render(window.SCIENTISTS); return; }
      const norm = (t) => t.replace(/[\u064B-\u0652]/g, "").toLowerCase();
      const filtered = window.SCIENTISTS.filter(s =>
        norm(s.name).includes(norm(q)) || norm(s.field).includes(norm(q))
      );
      render(filtered);
    });
  }
})();

// عرض تفاصيل عالم في scientist.html
(function mountProfile(){
  const profile = document.getElementById("profile");
  if (!profile || !window.SCIENTISTS) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const s = window.SCIENTISTS.find(x => x.slug === slug);

  if (!s) {
    profile.innerHTML = `<p>العالم غير موجود.</p>`;
    return;
  }

  profile.innerHTML = `
    <div class="profile-card">
      <div class="avatar big">
        <img src="images/${s.image}" alt="${s.name}">
      </div>
      <h2 class="name">${s.name}</h2>
      <p class="field">${s.field}</p>
      <h3>نبذة</h3>
      <p>${s.bio || "لم تتم إضافة النبذة بعد."}</p>
      <h3>قصة</h3>
      <p>${s.story || "لم تتم إضافة القصة بعد."}</p>
      <h3>اكتشافات وإنجازات</h3>
      <ul>
        ${s.discoveries && s.discoveries.length ? s.discoveries.map(d => `<li>${d}</li>`).join("") : "<li>لم تتم إضافة الإنجازات بعد.</li>"}
      </ul>
    </div>
  `;
})();
