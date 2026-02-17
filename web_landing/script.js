document.addEventListener('DOMContentLoaded', () => {

    // 1. Accessibility Button Interaction
    const a11yBtn = document.querySelector('.top-a11y button, .a11y-widget-btn');
    if (a11yBtn) {
        a11yBtn.addEventListener('click', () => {
            // Simulated professional accessibility menu
            console.info('Acessibilidade: Menu de ajustes disparado.');
            const msg = document.createElement('div');
            msg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2.5rem;
                border-radius: 12px;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                z-index: 10001;
                text-align: center;
                max-width: 400px;
                font-family: 'Inter', sans-serif;
            `;
            msg.innerHTML = `
                <h3 style="margin-bottom: 1rem; color: #002447;">Menu de Acessibilidade</h3>
                <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 2rem;">Esta demonstração simula a integração com tecnologias assistivas como EqualWeb e Hand Talk.</p>
                <button class="btn btn-primary" style="width: 100%;">Fechar</button>
            `;
            document.body.appendChild(msg);

            const closeBtn = msg.querySelector('button');
            closeBtn.onclick = () => msg.remove();
        });
    }

    // 2. Navbar Sticky Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // 3. Hover Tilt Effect for Dashboard Mockup
    const mockup = document.querySelector('.dashboard-mockup');
    if (mockup) {
        mockup.addEventListener('mousemove', (e) => {
            const rect = mockup.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            mockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        mockup.addEventListener('mouseleave', () => {
            mockup.style.transform = `perspective(1000px) rotateY(-10deg) rotateX(5deg) scale3d(1, 1, 1)`;
        });
    }

    // 5. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 6. Reveal on Scroll (Advanced Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            } else {
                // Remove class if you want animation to play every time
                // entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
