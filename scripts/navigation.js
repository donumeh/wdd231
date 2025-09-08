const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.contains("open");

  navigation.classList.toggle("open");
  menuButton.textContent = isOpen ? "☰" : "✖";
  menuButton.setAttribute("aria-expanded", isOpen ? "false" : "true");
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation menu" : "Close navigation menu",
  );
});
