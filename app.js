document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. EFECTO DE SCROLL EN ENCABEZADO
    // ==========================================
    const navbar = document.querySelector('.nav-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menú móvil
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animación del botón hamburguesa
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ==========================================
    // 2. HERO CAROUSEL (CROSS-FADE)
    // ==========================================
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }
    // Rotar cada 5 segundos
    setInterval(nextSlide, 5000);

    // ==========================================
    // 3. REVELACIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 4. FILTRADO DEL PORTAFOLIO
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Efecto de desvanecimiento
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'todos' || category === filterValue) {
                        item.classList.add('show');
                        item.style.display = 'block';
                        
                        // Pequeño delay para reactivar la animación CSS
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        item.classList.remove('show');
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // ==========================================
    // 5. LIGHTBOX DE DETALLES DEL PORTAFOLIO
    // ==========================================
    const lightbox = document.getElementById('portfolioLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxWood = document.getElementById('lightboxWood');
    const lightboxFinish = document.getElementById('lightboxFinish');
    const lightboxTools = document.getElementById('lightboxTools');
    const lightboxWarranty = document.getElementById('lightboxWarranty');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxCta = document.getElementById('lightboxCta');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.portfolio-img');
            const title = item.querySelector('.portfolio-overlay h3').innerText;
            const category = item.querySelector('.portfolio-overlay p').innerText.split('•')[0].trim();
            
            const wood = item.getAttribute('data-wood');
            const finish = item.getAttribute('data-finish');
            const tools = item.getAttribute('data-tools');
            const warranty = item.getAttribute('data-warranty');

            // Cargar datos
            lightboxImg.src = img.src;
            lightboxCategory.innerText = category;
            lightboxTitle.innerText = title;
            lightboxWood.innerText = wood;
            lightboxFinish.innerText = finish;
            lightboxTools.innerText = tools;
            lightboxWarranty.innerText = warranty;

            // Abrir modal
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Detener scroll de fondo
        });
    });

    // Cerrar Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Al hacer clic en el CTA del Lightbox, cerrar modal y llevar al formulario
    if (lightboxCta) {
        lightboxCta.addEventListener('click', () => {
            closeLightbox();
        });
    }

    // ==========================================
    // 6. FORMULARIO DE CALIFICACIÓN MULTIPASOS
    // ==========================================
    const form = document.getElementById('qualifyingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.getElementById('progressBar');
    
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    const disqualificationScreen = document.getElementById('disqualificationScreen');
    const successScreen = document.getElementById('successScreen');
    const budgetGrid = document.getElementById('budgetGrid');
    
    let currentStepIndex = 0;

    // Actualizar progreso visual
    function updateProgress() {
        // Barra de progreso
        const progressPercent = (currentStepIndex / (progressSteps.length - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Clases de pasos
        progressSteps.forEach((step, idx) => {
            if (idx === currentStepIndex) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else if (idx < currentStepIndex) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    }

    // Mostrar el paso correcto
    function showStep(index) {
        steps.forEach(step => step.classList.remove('active'));
        steps[index].classList.add('active');
        currentStepIndex = index;
        updateProgress();
    }

    // Generar opciones de presupuesto dinámicas y premium según el proyecto
    function populateBudgetOptions() {
        const projectType = form.querySelector('input[name="project_type"]:checked').value;
        budgetGrid.innerHTML = '';
        
        let options = [];
        
        if (projectType === 'mobiliario') {
            options = [
                { value: 'mob_mid', label: '$4.500.000 - $8.500.000 COP', desc: 'Mobiliario singular de diseño de autor en madera maciza y noble.' },
                { value: 'mob_high', label: '$8.500.000 - $18.000.000 COP', desc: 'Conjunto coordinado de ebanistería artística y acabados premium.' },
                { value: 'mob_legacy', label: '$18.000.000+ COP', desc: 'Proyecto integral de carpintería arquitectónica y diseño para toda la residencia.' }
            ];
        } else if (projectType === 'biodinamica') {
            options = [
                { value: 'bio_mid', label: '$35.000.000 - $75.000.000 COP', desc: 'Pabellones ecológicos, glampings premium o estructuras habitables medianas.' },
                { value: 'bio_high', label: '$75.000.000 - $180.000.000 COP', desc: 'Residencia modular o cabaña ecológica construida bajo principios biodinámicos.' },
                { value: 'bio_legacy', label: '$180.000.000+ COP', desc: 'Obras arquitectónicas monumentales autosostenibles y de gran legado estructural.' }
            ];
        } else { // Fincas
            options = [
                { value: 'fincas_mid', label: '$8.000.000 - $18.000.000 COP', desc: 'Terrazas voladas, pórticos y pérgolas monumentales para intemperie.' },
                { value: 'fincas_high', label: '$18.000.000 - $45.000.000 COP', desc: 'Adecuaciones exteriores, portones reforzados y estructuras de paisajismo de lujo.' },
                { value: 'fincas_legacy', label: '$45.000.000+ COP', desc: 'Infraestructura ecuestre premium, establos de autor y obras a gran escala para fincas.' }
            ];
        }
        
        options.forEach((opt, idx) => {
            const card = document.createElement('label');
            card.className = 'option-card';
            card.innerHTML = `
                <input type="radio" name="budget" value="${opt.value}" ${idx === 0 ? 'checked' : ''}>
                <span class="option-content">
                    <span class="option-icon">⚜️</span>
                    <span class="option-title">${opt.label}</span>
                    <span class="option-desc">${opt.desc}</span>
                </span>
            `;
            budgetGrid.appendChild(card);
        });
    }

    // Botones Siguiente
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Filtro de Filosofía (Paso 2)
            if (currentStepIndex === 1) {
                const philosophy = form.querySelector('input[name="philosophy"]:checked').value;
                
                // FILTRO DIRECTO: Si escoge "lowcost", descalificar de inmediato
                if (philosophy === 'lowcost') {
                    steps[1].classList.remove('active');
                    disqualificationScreen.style.display = 'block';
                    // Ocultar barra de progreso
                    document.querySelector('.form-progress').style.opacity = '0';
                    return;
                }
            }

            // Preparar paso de presupuesto antes de mostrarlo
            if (currentStepIndex === 1) {
                populateBudgetOptions();
            }

            if (currentStepIndex < steps.length - 1) {
                showStep(currentStepIndex + 1);
            }
        });
    });

    // Botones Atrás
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                showStep(currentStepIndex - 1);
            }
        });
    });

    // Reiniciar Formulario (tanto en descarte como en éxito)
    document.querySelectorAll('.restart-form').forEach(btn => {
        btn.addEventListener('click', () => {
            form.reset();
            disqualificationScreen.style.display = 'none';
            successScreen.style.display = 'none';
            document.querySelector('.form-progress').style.opacity = '1';
            
            // Mostrar todos los pasos como no completados
            progressSteps.forEach(step => {
                step.classList.remove('active', 'completed');
            });
            
            showStep(0);
        });
    });

    // Envío del Formulario (Paso 4)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulación de envío premium a través del taller
        const btnSubmit = document.getElementById('btnSubmitForm');
        btnSubmit.innerText = "Procesando Postulación...";
        btnSubmit.disabled = true;

        setTimeout(() => {
            steps[3].classList.remove('active');
            successScreen.style.display = 'block';
            document.querySelector('.form-progress').style.opacity = '0';
            btnSubmit.innerText = "Postular Mi Proyecto";
            btnSubmit.disabled = false;
        }, 1500);
    });

    // Permitir clic en pasos de progreso si ya han sido completados
    progressSteps.forEach((step, idx) => {
        step.addEventListener('click', () => {
            // Solo permitir navegar si es un paso anterior o si estamos en la interfaz normal
            if (disqualificationScreen.style.display !== 'block' && successScreen.style.display !== 'block') {
                if (idx < currentStepIndex || step.classList.contains('completed')) {
                    showStep(idx);
                }
            }
        });
    });

});
