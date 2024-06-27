const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        const isHidden = entry.target.classList.contains('hidden');
        if (entry.isIntersecting && isHidden) {
            entry.target.classList.add('show');
        } else if (!entry.isIntersecting && !isHidden) {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
