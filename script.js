let modal = document.getElementById("searchModal");
let openBtn = document.getElementById("openSearch");
let closeBtn = document.getElementById("closeSearch");
openBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};
