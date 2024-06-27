const observe = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        const isHiddenRight = entry.target.classList.contains('hiddenright');
        if (entry.isIntersecting && isHiddenRight) {
            entry.target.classList.add('showright');
        } else if (!entry.isIntersecting && !isHiddenRight) {
            entry.target.classList.remove('showright');
        }
    });
});

const hiddenElementsRight = document.querySelectorAll('.hiddenright');
hiddenElementsRight.forEach((el) => observe.observe(el));
