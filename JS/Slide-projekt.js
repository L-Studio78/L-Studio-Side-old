let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.left = '100%';
        slides[i].classList.remove("active-slide");
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = 'block';
    setTimeout(function() {
        slides[slideIndex-1].classList.add("active-slide");
    }, 20); // Delay to ensure transition works
    setTimeout(showSlides, 3000); // Ändert das Bild alle 3 Sekunden
}
