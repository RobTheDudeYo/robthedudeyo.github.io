const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");

menuButton.addEventListener("click", () => {
  sideMenu.style.left = sideMenu.style.left === "0px" ? "-250px" : "0px";
});
