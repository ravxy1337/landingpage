// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');

function showSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="/${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    history.pushState(null, '', `/${targetId}`);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

window.addEventListener('popstate', () => {
    const path = window.location.pathname.substring(1) || 'about';
    showSection(path);
});

document.addEventListener('DOMContentLoaded', () => {
    const initialPath = window.location.pathname.substring(1) || 'about';
    showSection(initialPath);
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-icon');
        
        answer.classList.toggle('active');
        icon.classList.toggle('active');
        
        document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
            if (otherAnswer !== answer && otherAnswer.classList.contains('active')) {
                otherAnswer.classList.remove('active');
                otherAnswer.previousElementSibling.querySelector('.faq-icon').classList.remove('active');
            }
        });
    });
});

// Mobile menu toggle functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('show');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('show');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(26, 26, 46, 1)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(26, 26, 46, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Testimoni functionality
function loadTestimonies() {
    console.log('Loading testimonies...');
    fetch('/testimonies.json') // Ganti ./testimonies.json menjadi /testimonies.json
        .then(response => {
            if (!response.ok) {
                console.log('Fetch failed:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            const testiList = document.getElementById('testiList');
            if (!testiList) {
                console.log('Element #testiList not found');
                return;
            }
            data.forEach(testi => {
                const testiItem = document.createElement('div');
                testiItem.className = 'testi-item';
                testiItem.innerHTML = `
                    <img src="assets/${testi.image}" alt="Invoice ${testi.id}" class="testi-invoice">
                    <p class="testi-detail">${testi.product} - ${testi.date}</p>
                `;
                testiList.appendChild(testiItem);
            });
        })
        .catch(error => console.error('Error loading testimonies:', error));
}