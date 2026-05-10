/* ===================================================================
   SITE VITRINE - DÉPARTEMENT INFORMATIQUE EFREI
   JavaScript principal — vanilla JS, aucune dépendance
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1. HEADER : effet de scroll (fond opaque après scroll)
       ============================================================ */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = function () {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ============================================================
       2. MENU MOBILE : ouverture / fermeture
       ============================================================ */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Fermer au clic sur un lien
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ============================================================
       3. CARROUSEL D'ACTUALITÉS (page d'accueil)
       ============================================================ */
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        let currentIndex = 0;
        const total = slides.length;
        let autoplayId = null;

        // Création des dots
        if (dotsContainer && total > 0) {
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
                dot.addEventListener('click', function () {
                    goToSlide(i);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

        function goToSlide(index) {
            currentIndex = (index + total) % total;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goToSlide(currentIndex - 1);
                resetAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goToSlide(currentIndex + 1);
                resetAutoplay();
            });
        }

        // Autoplay
        function startAutoplay() {
            autoplayId = setInterval(function () {
                goToSlide(currentIndex + 1);
            }, 6000);
        }

        function resetAutoplay() {
            if (autoplayId) clearInterval(autoplayId);
            startAutoplay();
        }

        startAutoplay();

        // Pause au survol
        carousel.addEventListener('mouseenter', function () {
            if (autoplayId) clearInterval(autoplayId);
        });
        carousel.addEventListener('mouseleave', startAutoplay);

        // Navigation clavier
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
                resetAutoplay();
            }
        });
    }

    /* ============================================================
       4. FAQ : accordéon
       ============================================================ */
    document.querySelectorAll('.faq-question').forEach(function (button) {
        button.addEventListener('click', function () {
            const item = button.parentElement;
            const isOpen = item.classList.contains('open');

            // Fermer tous les autres
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                if (openItem !== item) openItem.classList.remove('open');
            });

            // Toggle l'élément cliqué
            item.classList.toggle('open', !isOpen);
            button.setAttribute('aria-expanded', !isOpen);
        });
    });

    /* ============================================================
       5. ANIMATIONS AU SCROLL (reveal)
       ============================================================ */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback : tout afficher immédiatement
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ============================================================
       6. ANIMATION DES CHIFFRES CLÉS (count-up)
       ============================================================ */
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1800;
        const startTime = performance.now();
        const valueSpan = el.querySelector('.value') || el;
        const originalSuffix = valueSpan.textContent;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = (target * eased).toFixed(decimals);
            valueSpan.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                valueSpan.textContent = target.toFixed(decimals);
            }
        }

        requestAnimationFrame(step);
    }

    /* ============================================================
       7. VALIDATION DU FORMULAIRE DE CONTACT
       ============================================================ */
    const contactForm = document.querySelector('#contact-form');

    if (contactForm) {
        const successBox = contactForm.querySelector('.form-success');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Reset des erreurs
            contactForm.querySelectorAll('.form-group').forEach(function (g) {
                g.classList.remove('error');
            });

            let valid = true;

            // Champ nom
            const nameField = contactForm.querySelector('#name');
            if (!nameField.value.trim() || nameField.value.trim().length < 2) {
                showError(nameField, 'Veuillez saisir un nom valide (2 caractères min).');
                valid = false;
            }

            // Champ prénom
            const firstnameField = contactForm.querySelector('#firstname');
            if (firstnameField && (!firstnameField.value.trim() || firstnameField.value.trim().length < 2)) {
                showError(firstnameField, 'Veuillez saisir un prénom valide.');
                valid = false;
            }

            // Email
            const emailField = contactForm.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showError(emailField, 'Adresse email invalide.');
                valid = false;
            }

            // Téléphone (optionnel mais validé si rempli)
            const phoneField = contactForm.querySelector('#phone');
            if (phoneField && phoneField.value.trim()) {
                const phoneRegex = /^[+0-9\s().-]{8,20}$/;
                if (!phoneRegex.test(phoneField.value.trim())) {
                    showError(phoneField, 'Numéro de téléphone invalide.');
                    valid = false;
                }
            }

            // Sujet
            const subjectField = contactForm.querySelector('#subject');
            if (subjectField && !subjectField.value) {
                showError(subjectField, 'Veuillez sélectionner un sujet.');
                valid = false;
            }

            // Message
            const messageField = contactForm.querySelector('#message');
            if (!messageField.value.trim() || messageField.value.trim().length < 10) {
                showError(messageField, 'Le message doit contenir au moins 10 caractères.');
                valid = false;
            }

            // Consentement
            const consentField = contactForm.querySelector('#consent');
            if (consentField && !consentField.checked) {
                showError(consentField, 'Vous devez accepter la politique de confidentialité.');
                valid = false;
            }

            if (valid) {
                // Affichage du succès (simulation — en réel, envoyer via fetch)
                if (successBox) {
                    successBox.classList.add('visible');
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                contactForm.reset();
                setTimeout(function () {
                    if (successBox) successBox.classList.remove('visible');
                }, 6000);
            } else {
                // Scroll vers la première erreur
                const firstError = contactForm.querySelector('.form-group.error');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        // Reset de l'erreur quand l'utilisateur tape
        contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
            field.addEventListener('input', function () {
                field.closest('.form-group').classList.remove('error');
            });
            field.addEventListener('change', function () {
                field.closest('.form-group').classList.remove('error');
            });
        });
    }

    function showError(field, message) {
        const group = field.closest('.form-group');
        if (!group) return;
        group.classList.add('error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) errorEl.textContent = message;
    }

    /* ============================================================
       8. AGENDA INTERACTIF (page équipe)
       Affiche les permanences d'un enseignant au clic
       ============================================================ */
    const teacherCards = document.querySelectorAll('[data-teacher]');
    const agendaPanel = document.querySelector('#agenda-panel');

    if (teacherCards.length > 0 && agendaPanel) {
        // Permanences indicatives — basées sur les enseignants permanents EFREI
        const agendas = {
            'hamidi': [
                { jour: 'Lundi', creneau: '14h - 16h', salle: 'Bureau B-204' },
                { jour: 'Mercredi', creneau: '10h - 12h', salle: 'Lab Recherche' },
                { jour: 'Vendredi', creneau: '15h - 17h', salle: 'Bureau B-204' }
            ],
            'gabis': [
                { jour: 'Mardi', creneau: '13h - 15h', salle: 'Bureau A-118' },
                { jour: 'Jeudi', creneau: '09h - 11h', salle: 'Bureau A-118' }
            ],
            'wegrzyn': [
                { jour: 'Lundi', creneau: '10h - 12h', salle: 'Efrei Research Lab' },
                { jour: 'Jeudi', creneau: '14h - 17h', salle: 'Direction adjointe' }
            ],
            'sliman': [
                { jour: 'Mardi', creneau: '14h - 16h', salle: 'Bureau B-310' },
                { jour: 'Vendredi', creneau: '13h - 15h', salle: 'Lab Cyber' }
            ],
            'chakchouk': [
                { jour: 'Mercredi', creneau: '14h - 17h', salle: 'Bureau C-201' },
                { jour: 'Jeudi', creneau: '14h - 16h', salle: 'Lab Image &amp; VR' }
            ],
            'vieira': [
                { jour: 'Lundi', creneau: '09h - 11h', salle: 'Bureau A-302' },
                { jour: 'Vendredi', creneau: '10h - 12h', salle: 'Lab Réseaux' }
            ],
            'aitsalem': [
                { jour: 'Mardi', creneau: '10h - 12h', salle: 'Bureau A-205' },
                { jour: 'Jeudi', creneau: '15h - 17h', salle: 'Lab Cybersécurité' }
            ],
            'ghassany': [
                { jour: 'Mercredi', creneau: '09h - 11h', salle: 'Bureau B-150' },
                { jour: 'Vendredi', creneau: '14h - 16h', salle: 'Lab Data &amp; IA' }
            ]
        };

        teacherCards.forEach(function (card) {
            card.addEventListener('click', function () {
                const id = card.getAttribute('data-teacher');
                const nameEl = card.querySelector('h4, h3, .teacher-name');
                const name = nameEl ? nameEl.textContent : '';
                const data = agendas[id] || [];

                let html = '<div class="agenda-header">'
                    + '<span class="eyebrow">Permanences de</span>'
                    + '<h3>' + name + '</h3>'
                    + '</div>';

                if (data.length === 0) {
                    html += '<p>Aucune permanence renseignée pour le moment.</p>';
                } else {
                    html += '<table class="programme-table"><thead><tr>'
                        + '<th>Jour</th><th>Horaire</th><th>Lieu</th>'
                        + '</tr></thead><tbody>';
                    data.forEach(function (slot) {
                        html += '<tr><td><strong>' + slot.jour + '</strong></td>'
                            + '<td>' + slot.creneau + '</td>'
                            + '<td>' + slot.salle + '</td></tr>';
                    });
                    html += '</tbody></table>';
                }

                agendaPanel.innerHTML = html;
                agendaPanel.classList.add('visible');
                agendaPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

                teacherCards.forEach(function (c) { c.classList.remove('selected'); });
                card.classList.add('selected');
            });
        });
    }

    /* ============================================================
       9. NAVIGATION ACTIVE (highlight de la page courante)
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ============================================================
       10. ANNÉE COURANTE DANS LE FOOTER
       ============================================================ */
    const yearEl = document.querySelector('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});

