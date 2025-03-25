// Button click alert with a twist
document.getElementById('learnMoreBtn').addEventListener('click', () => {
    alert('Ready to explore the universe with AI?');
});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Trigger animations on scroll (optional enhancement)
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('orbit');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.capability-card').forEach(card => {
    observer.observe(card);
});