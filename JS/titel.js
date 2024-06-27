let docTitel = document.title;
window.addEventListener("blur", () =>{
document.title = "Come back😥 - L-Studio";
})
window.addEventListener("focus", () =>{
    document.title = docTitel
})