const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
}

function updateThemeIcon() {
  if (!themeToggle) return;

  const isLight = document.body.classList.contains("light");
  themeToggle.innerHTML = isLight ? "🌙" : "☀";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "다크 모드로 변경" : "화이트 모드로 변경",
  );
}

if (themeToggle) {
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light") ? "light" : "dark",
    );
    updateThemeIcon();
  });
}
