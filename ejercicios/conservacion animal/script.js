// ===== VARIABLES GLOBALES =====
let currentTheme = 'light';

// ===== FUNCIONES DE TEMA (CLARO/OSCURO) =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche');
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// ===== FUNCIONES DEL MENÚ MÓVIL =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            document.body.style.overflow = navMenu.classList.contains('show') ? 'hidden' : '';
            
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.className = 'fas fa-times';
                menuToggle.setAttribute('aria-label', 'Cerrar menú');
            } else {
                icon.className = 'fas fa-bars';
                menuToggle.setAttribute('aria-label', 'Abrir menú');
            }
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.querySelector('i').className = 'fas fa-bars';
                menuToggle.setAttribute('aria-label', 'Abrir menú');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===== FUNCIONES DE FILTRADO DE PROYECTOS =====
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== FUNCIONES DE DONACIÓN =====
function initDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const donationForm = document.getElementById('donationForm');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            customAmountInput.value = '';
        });
    });
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            if (customAmountInput.value) {
                amountButtons.forEach(btn => btn.classList.remove('active'));
            }
        });
    }
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('donorName').value.trim();
            const email = document.getElementById('donorEmail').value.trim();
            let amount = 0;
            
            const activeAmountBtn = document.querySelector('.amount-btn.active');
            if (activeAmountBtn) {
                amount = activeAmountBtn.getAttribute('data-amount');
            }
            
            if (customAmountInput.value) {
                amount = customAmountInput.value;
            }
            
            if (!name || !email || amount <= 0) {
                showNotification('Por favor completa todos los campos correctamente', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            showNotification(`¡Gracias por tu donación de $${amount}! Te hemos enviado un email de confirmación.`, 'success');
            donationForm.reset();
            
            amountButtons.forEach(btn => btn.classList.remove('active'));
            const defaultBtn = document.querySelector('.amount-btn[data-amount="100"]');
            if (defaultBtn) defaultBtn.classList.add('active');
        });
    }
}

// ===== FUNCIONES DE ACCESIBILIDAD =====
function initAccessibilityControls() {
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const decreaseTextBtn = document.getElementById('decreaseText');
    const resetTextBtn = document.getElementById('resetText');
    const increaseTextBtn = document.getElementById('increaseText');
    const highContrastToggle = document.getElementById('highContrastToggle');
    
    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener('click', () => {
            accessibilityPanel.classList.toggle('show');
            
            if (accessibilityPanel.classList.contains('show')) {
                accessibilityToggle.setAttribute('aria-label', 'Cerrar opciones de accesibilidad');
            } else {
                accessibilityToggle.setAttribute('aria-label', 'Abrir opciones de accesibilidad');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!accessibilityToggle.contains(e.target) && !accessibilityPanel.contains(e.target)) {
                accessibilityPanel.classList.remove('show');
                accessibilityToggle.setAttribute('aria-label', 'Abrir opciones de accesibilidad');
            }
        });
    }
    
    if (decreaseTextBtn && resetTextBtn && increaseTextBtn) {
        let currentFontSize = 16;
        
        decreaseTextBtn.addEventListener('click', () => {
            if (currentFontSize > 12) {
                currentFontSize -= 2;
                updateFontSize();
                showNotification('Tamaño de texto disminuido', 'info');
            }
        });
        
        resetTextBtn.addEventListener('click', () => {
            currentFontSize = 16;
            updateFontSize();
            showNotification('Tamaño de texto restablecido', 'info');
        });
        
        increaseTextBtn.addEventListener('click', () => {
            if (currentFontSize < 24) {
                currentFontSize += 2;
                updateFontSize();
                showNotification('Tamaño de texto aumentado', 'info');
            }
        });
        
        function updateFontSize() {
            document.documentElement.style.fontSize = `${currentFontSize}px`;
            localStorage.setItem('fontSize', currentFontSize);
        }
        
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            updateFontSize();
        }
    }
    
    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('high-contrast');
                localStorage.setItem('highContrast', 'enabled');
                showNotification('Modo alto contraste activado', 'info');
            } else {
                document.body.classList.remove('high-contrast');
                localStorage.setItem('highContrast', 'disabled');
                showNotification('Modo alto contraste desactivado', 'info');
            }
        });
        
        const highContrastPref = localStorage.getItem('highContrast');
        if (highContrastPref === 'enabled') {
            highContrastToggle.checked = true;
            document.body.classList.add('high-contrast');
        }
    }
}

// ===== SLIDER DE ANIMALES =====
function initAnimalSlider() {
    const animalCards = document.querySelectorAll('.animal-card');
    let currentIndex = 0;
    
    if (animalCards.length > 0) {
        setInterval(() => {
            animalCards.forEach(card => card.classList.remove('active'));
            currentIndex = (currentIndex + 1) % animalCards.length;
            animalCards[currentIndex].classList.add('active');
        }, 3000);
    }
}

// ===== COMPARTIR EN REDES SOCIALES =====
function initShareButtons() {
    const shareBtn = document.querySelector('.share-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const shareText = '¡Únete a la conservación del Chocó! Cada acción cuenta para salvar esta biodiversidad única.';
            const shareUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Conservación del Chocó',
                    text: shareText,
                    url: shareUrl,
                });
            } else {
                navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                    showNotification('¡Enlace copiado! Compártelo en tus redes sociales.', 'success');
                });
            }
        });
    }
}

// ===== VALIDACIÓN DE FORMULARIO DE NEWSLETTER =====
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            showNotification('¡Gracias por suscribirte a nuestro boletín! Te hemos enviado un email de confirmación.', 'success');
            emailInput.value = '';
        });
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#d00000' : type === 'success' ? '#38b000' : '#1a759f'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== SCROLL SUAVE Y NAVEGACIÓN ACTIVA =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== INTERACCIONES CON LAS TARJETAS DE COLOR =====
function initColorCards() {
    const colorCards = document.querySelectorAll('.color-card');
    
    colorCards.forEach(card => {
        card.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const colorName = this.querySelector('span').textContent;
            
            navigator.clipboard.writeText(color).then(() => {
                showNotification(`Color "${colorName}" copiado: ${color}`, 'info');
            });
            
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initPortfolioFilter();
    initDonationForm();
    initAccessibilityControls();
    initAnimalSlider();
    initShareButtons();
    initNewsletterForm();
    initScrollSpy();
    initColorCards();
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2023', currentYear);
    }
    
    console.log('✅ Sitio web de Conservación del Chocó cargado correctamente');
    console.log('🌿 ¡Protegiendo la biodiversidad del Chocó!');
});

// ===== EFECTO DE LLUVIA (opcional, para fondo) =====
function createRainEffect() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || window.innerWidth < 768) return;
    
    for (let i = 0; i < 15; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain-drop';
        rainDrop.style.cssText = `
            position: absolute;
            width: 1px;
            height: ${20 + Math.random() * 30}px;
            background: linear-gradient(transparent, rgba(26, 117, 159, 0.3));
            top: -50px;
            left: ${Math.random() * 100}%;
            animation: fall ${1 + Math.random() * 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            opacity: ${0.2 + Math.random() * 0.3};
            z-index: 1;
        `;
        heroSection.appendChild(rainDrop);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to { transform: translateY(calc(100vh + 50px)); }
        }
    `;
    document.head.appendChild(style);
}

// Iniciar efecto de lluvia después de cargar la página
window.addEventListener('load', () => {
    setTimeout(createRainEffect, 1000);
});