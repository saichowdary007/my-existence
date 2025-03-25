// Simple button click alert (for demo purposes)
document.getElementById('learnMoreBtn').addEventListener('click', () => {
    alert('Discover how AI can transform the future!');
});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});