// main.js - Common logic for Freaky Fashion

async function loadMenu() {
    const navUl = document.querySelector('.main-nav ul');
    if (!navUl) return;

    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        navUl.innerHTML = categories.map(cat => `<li><a href="#">${cat.name}</a></li>`).join('');
    } catch (err) {
        console.error('Failed to load menu:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});
