/**
 * Modern Portfolio Manager
 * Handles loading and rendering of portfolio data with localization support
 * Following the GamerDesign dark theme system
 */

class ModernPortfolioManager {
    constructor() {
        this.data = null;
        this.currentLanguage = 'en'; // Default to English
        this.supportedLanguages = ['en', 'pt'];
        this.projectImages = [];
        this.currentImageIndex = 0;
        this.carouselLanguage = null; // Language the carousel slides were built for
        this.currentTheme = 'dark'; // Default to dark mode
        this.scrollPosition = 0; // Store scroll position when modal opens
        
        console.log('🚀 Initializing Modern Portfolio Manager...');
        this.init();
    }

    /**
     * Initialize the portfolio manager
     */
    async init() {
        try {
            // Show loading indicator
            this.showLoading();
            
            // Initialize theme (before language to ensure proper styling)
            this.initializeTheme();
            
            // Initialize language
            this.initializeLanguage();
            
            // Load portfolio data
            await this.loadData();
            
            // Initialize UI
            this.initializeUI();
            
            // Hide loading indicator
            this.hideLoading();
            
            console.log('✅ Portfolio initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize portfolio:', error);
            this.hideLoading();
        }
    }

    /**
     * Initialize language settings
     */
    initializeLanguage() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && this.supportedLanguages.includes(langParam)) {
            this.currentLanguage = langParam;
            console.log(`🌐 Language set from URL: ${this.currentLanguage}`);
        } else {
            // Default to English
            this.currentLanguage = 'en';
            console.log(`🌐 Using default language: ${this.currentLanguage}`);
        }
    }

    /**
     * Initialize theme settings
     */
    initializeTheme() {
        // Check saved theme preference or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme');
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = 'dark'; // Default to dark mode
        }
        
        // Apply the theme
        this.applyTheme();
        console.log(`🎨 Theme initialized: ${this.currentTheme}`);
    }

    /**
     * Apply the current theme
     */
    applyTheme() {
        if (this.currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Update theme toggle button icon
        this.updateThemeToggleIcon();
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        
        // Save theme preference
        localStorage.setItem('portfolio-theme', this.currentTheme);
        
        // Apply the new theme
        this.applyTheme();
        
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    /**
     * Update theme toggle button icon
     */
    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
        themeToggle.title = this.currentTheme === 'dark'
            ? 'Switch to light mode'
            : 'Switch to dark mode';
    }

    /**
     * Load portfolio data for current language
     */
    async loadData() {
        try {
            const dataFile = this.currentLanguage === 'pt' ? 'data/portfolio_pt.json' : 'data/portfolio.json';
            console.log(`📂 Loading data from: ${dataFile}`);
            
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error(`Failed to load ${dataFile}: ${response.status}`);
            }
            
            this.data = await response.json();
            console.log(`✅ Successfully loaded ${this.currentLanguage} data`);
            
            // Initialize project images array
            this.projectImages = this.data.projects.map(project => {
                const ext = project.imageExtension || 'jpg';
                const thumbImage = project.imageThumb || project.image;
                const fullImage = project.imageFull || project.image;
                
                return {
                    full: `images/fulls/${fullImage}.${ext}`,
                    thumb: `images/thumbs/${thumbImage}.${ext}`,
                    title: project.title,
                    description: project.description
                };
            });
            
            console.log('📚 Project images initialized:', this.projectImages);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            // Fallback to English if Portuguese fails
            if (this.currentLanguage === 'pt') {
                console.log('🔄 Falling back to English...');
                this.currentLanguage = 'en';
                return this.loadData();
            }
            throw error;
        }
    }

    /**
     * Initialize UI components and event listeners
     */
    initializeUI() {
        // Render all sections
        this.renderAllSections();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Initialize image modal
        this.initializeImageModal();

        // Initialize scroll-driven UI (reveal animations + nav scrollspy)
        this.initializeScrollEffects();
    }

    /**
     * Initialize scroll reveal animations and nav scrollspy.
     * Falls back to fully-visible content when IntersectionObserver is unavailable.
     */
    initializeScrollEffects() {
        const revealElements = document.querySelectorAll('.reveal');

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('in-view'));
            return;
        }

        // Reveal sections as they enter the viewport
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

        revealElements.forEach(el => revealObserver.observe(el));

        // Scrollspy: highlight the nav link of the section in view
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        const sections = Array.from(navLinks)
            .map(link => document.getElementById(link.dataset.section))
            .filter(Boolean);

        if (sections.length === 0) return;

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(section => spyObserver.observe(section));
    }

    /**
     * Render all portfolio sections
     */
    renderAllSections() {
        this.renderHeroSection();
        this.renderSocialLinks();
        this.renderAboutSection();
        this.renderProjectsSection();
        this.renderExperienceSection();
        this.renderSkillsSection();
        this.renderEducationSection();
        this.updateCVLink();
    }

    /**
     * Update the CV link to pass current language
     */
    updateCVLink() {
        const cvLink = document.getElementById('cv-link');
        if (cvLink) {
            const langParam = this.currentLanguage === 'pt' ? '?lang=pt' : '';
            cvLink.href = `cv.html${langParam}`;
            cvLink.title = this.currentLanguage === 'pt' ? 'Baixar CV' : 'Download CV';
        }

        const cvLabel = document.getElementById('cv-link-label');
        if (cvLabel) {
            cvLabel.textContent = this.currentLanguage === 'pt' ? 'CV' : 'CV';
        }

        const languageLabel = document.getElementById('language-label');
        if (languageLabel) {
            languageLabel.textContent = this.currentLanguage.toUpperCase();
        }

        const footerYear = document.getElementById('footer-year');
        if (footerYear) {
            footerYear.textContent = String(new Date().getFullYear());
        }

        const footerText = document.getElementById('footer-text');
        if (footerText && this.data?.intro?.name) {
            const year = new Date().getFullYear();
            const builtCopy = this.currentLanguage === 'pt'
                ? 'Construído com cuidado.'
                : 'Built with care.';
            footerText.textContent = `© ${year} ${this.data.intro.name}. ${builtCopy}`;
        }

        const projectsSubtitle = document.getElementById('projects-subtitle');
        if (projectsSubtitle) {
            projectsSubtitle.textContent = this.currentLanguage === 'pt'
                ? 'Títulos lançados e projetos experimentais'
                : 'Shipped titles & experimental builds';
        }

        // Localize nav section links
        const navLabels = this.currentLanguage === 'pt'
            ? { work: 'Trabalhos', experience: 'Experiência', skills: 'Habilidades', education: 'Educação' }
            : { work: 'Work', experience: 'Experience', skills: 'Skills', education: 'Education' };

        Object.entries(navLabels).forEach(([section, label]) => {
            const link = document.getElementById(`nav-link-${section}`);
            if (link) link.textContent = label;
        });

        const backToTopLabel = document.getElementById('back-to-top-label');
        if (backToTopLabel) {
            backToTopLabel.textContent = this.currentLanguage === 'pt' ? 'Topo' : 'Top';
        }
    }

    /**
     * Render hero section
     */
    renderHeroSection() {
        const heroName = document.getElementById('hero-name');
        const heroEyebrow = document.getElementById('hero-eyebrow');
        const heroTitle = document.getElementById('hero-title');
        const heroLocation = document.getElementById('hero-location');
        const navTitle = document.getElementById('nav-title');

        if (heroName) heroName.textContent = this.data.intro.name;

        // "Senior Game Engineer | Unity & Unreal" -> eyebrow, with the tagline as supporting copy
        const titleParts = this.data.intro.title.split('|').map(part => part.trim());
        if (heroEyebrow) heroEyebrow.textContent = titleParts[0];
        if (heroTitle) {
            heroTitle.textContent = this.data.header?.tagline
                || this.data.intro.title.replace(/\s*\|\s*/g, ' · ');
        }

        if (heroLocation) {
            const locationLabel = heroLocation.querySelector('span');
            if (locationLabel) {
                locationLabel.textContent = this.data.intro.location;
            } else {
                heroLocation.textContent = this.data.intro.location;
            }
        }

        if (navTitle) {
            const shortName = this.data.intro.name.split(' ').slice(0, 1).concat(this.data.intro.name.split(' ').slice(-1)).join(' ');
            navTitle.textContent = shortName;
        }

        document.title = this.data.meta.title;
    }

    /**
     * Render social links as a compact branded icon grid
     */
    renderSocialLinks() {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer) return;

        const socialHTML = this.data.social.map(social => {
            const meta = this.getSocialMeta(social);
            const isMail = social.url.startsWith('mailto:');
            const rel = isMail ? '' : 'rel="noopener noreferrer"';
            const target = isMail ? '' : 'target="_blank"';
            return `
                <a href="${social.url}" ${target} ${rel}
                   class="social-chip"
                   data-brand="${meta.brand}"
                   title="${social.name}"
                   aria-label="${social.name}">
                    <i class="${meta.icon}" aria-hidden="true"></i>
                </a>
            `;
        }).join('');

        socialContainer.innerHTML = socialHTML;
    }

    /**
     * Map a social entry to its Font Awesome class + brand identifier.
     * The brand key drives hover color via CSS [data-brand] selectors.
     */
    getSocialMeta(social = {}) {
        const map = {
            'fa-linkedin':    { icon: 'fab fa-linkedin-in',    brand: 'linkedin' },
            'fa-github':      { icon: 'fab fa-github',         brand: 'github' },
            'fa-gamepad':     { icon: 'fas fa-gamepad',        brand: 'studio' },
            'fa-app-store':   { icon: 'fab fa-app-store-ios',  brand: 'appstore' },
            'fa-google-play': { icon: 'fab fa-google-play',    brand: 'playstore' },
            'fa-itch-io':     { icon: 'fab fa-itch-io',        brand: 'itch' },
            'fa-file-code':   { icon: 'far fa-file-code',      brand: 'unity' },
            'fa-envelope':    { icon: 'fas fa-envelope',       brand: 'email' }
        };

        const entry = map[social.icon];
        if (entry) return entry;

        let icon = 'fas fa-link';
        if (social.isSolid) icon = `fas ${social.icon}`;
        else if (social.isRegular) icon = `far ${social.icon}`;
        return { icon, brand: 'default' };
    }

    /**
     * Render about section
     */
    renderAboutSection() {
        const aboutTitle = document.getElementById('about-title');
        const aboutContent = document.getElementById('about-content');

        if (aboutTitle) {
            aboutTitle.textContent = this.currentLanguage === 'pt' ? 'Sobre' : 'About';
        }
        if (aboutContent) aboutContent.textContent = this.data.about.content;
    }

    /**
     * Render projects section
     */
    renderProjectsSection() {
        const projectsTitle = document.getElementById('projects-title');
        const projectsGrid = document.getElementById('projects-grid');

        if (projectsTitle) {
            projectsTitle.textContent = this.currentLanguage === 'pt' ? 'Trabalhos Selecionados' : 'Selected Work';
        }

        if (!projectsGrid) return;

        const featuredLabel = this.currentLanguage === 'pt' ? 'Destaque' : 'Featured';

        const projectsHTML = this.data.projects.map((project, index) => {
            const ext = project.imageExtension || 'jpg';
            const thumbImage = project.imageThumb || project.image;
            const featuredClass = project.featured ? ' featured' : '';
            const eyebrow = project.featured
                ? `<div class="project-eyebrow">${featuredLabel}</div>`
                : '';

            return `
                <article class="project-card${featuredClass}">
                    <div class="project-image-wrap" data-index="${index}" role="button" tabindex="0" aria-label="${project.title} — expand image">
                        <img
                            src="images/thumbs/${thumbImage}.${ext}"
                            alt="${project.title}"
                            class="project-image"
                            loading="lazy"
                        >
                        <div class="project-image-overlay">
                            <i class="fas fa-expand" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="project-content">
                        ${eyebrow}
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-links">
                            ${project.links.map(link => `
                                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                                    <span>${link.text}</span>
                                    <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        projectsGrid.innerHTML = projectsHTML;
    }

    /**
     * Render experience section
     */
    renderExperienceSection() {
        const experienceTitle = document.getElementById('experience-title');
        const experienceList = document.getElementById('experience-list');
        
        if (experienceTitle) {
            experienceTitle.textContent = this.currentLanguage === 'pt' ? 'Experiência' : 'Experience';
        }
        
        if (!experienceList || !this.data.experience) return;
        
        const experienceHTML = this.data.experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-top">
                    <h3 class="timeline-role">${exp.title}</h3>
                    <span class="timeline-period">${exp.period}</span>
                </div>
                <div class="timeline-company">
                    ${exp.url ? `<a href="${exp.url}" target="_blank" rel="noopener noreferrer">${exp.company}</a>` : `<span>${exp.company}</span>`}
                    ${exp.location ? `<span class="timeline-location">${exp.location}</span>` : ''}
                </div>
                <p class="timeline-desc">${exp.description}</p>
                ${exp.achievements && exp.achievements.length > 0 ? `
                    <ul class="timeline-achievements">
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('');
        
        experienceList.innerHTML = experienceHTML;
    }

    /**
     * Render skills section
     */
    renderSkillsSection() {
        const skillsTitle = document.getElementById('skills-title');
        const skillsGrid = document.getElementById('skills-grid');
        
        if (skillsTitle) {
            skillsTitle.textContent = this.currentLanguage === 'pt' ? 'Habilidades' : 'Skills';
        }
        
        if (!skillsGrid || !this.data.skills) return;
        
        const skillsHTML = this.data.skills.map(skill => {
            const levelKey = this.normalizeSkillLevel(skill.level);
            const filledDots = levelKey === 'advanced' ? 3 : levelKey === 'intermediate' ? 2 : 1;
            const dots = [1, 2, 3]
                .map(dot => `<span class="skill-dot${dot <= filledDots ? ' on' : ''}"></span>`)
                .join('');
            const levelMeta = skill.level
                ? `
                    <span class="skill-meta">
                        <span class="skill-dots" aria-hidden="true">${dots}</span>
                        <span class="skill-level">${skill.level}</span>
                    </span>
                `
                : '';
            return `
                <div class="skill-card" data-level="${levelKey}">
                    <span class="skill-name">${skill.name}</span>
                    ${levelMeta}
                </div>
            `;
        }).join('');

        skillsGrid.innerHTML = skillsHTML;
    }

    /**
     * Normalize a localized skill level label ("Advanced"/"Avançado", etc.)
     * into a language-agnostic key used for styling.
     */
    normalizeSkillLevel(level = '') {
        const normalized = level.toLowerCase();
        if (normalized.startsWith('adv') || normalized.startsWith('avan')) return 'advanced';
        if (normalized.startsWith('inter')) return 'intermediate';
        return normalized ? 'basic' : 'none';
    }

    /**
     * Render education section
     */
    renderEducationSection() {
        const educationTitle = document.getElementById('education-title');
        const educationList = document.getElementById('education-list');
        
        if (educationTitle) {
            educationTitle.textContent = this.currentLanguage === 'pt' ? 'Educação' : 'Education';
        }
        
        if (!educationList || !this.data.education) return;
        
        const educationHTML = this.data.education.map(edu => `
            <div class="education-card">
                <span class="education-period">${edu.period}</span>
                <div class="education-school">
                    ${edu.url ? `<a href="${edu.url}" target="_blank" rel="noopener noreferrer">${edu.institution}</a>` : edu.institution}
                </div>
                <div class="education-degree">${edu.degree}</div>
                ${edu.location ? `<span class="education-location">${edu.location}</span>` : ''}
            </div>
        `).join('');
        
        educationList.innerHTML = educationHTML;
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Project image clicks (entire image area is clickable)
        document.addEventListener('click', (e) => {
            const imageWrap = e.target.closest('.project-image-wrap');
            if (imageWrap) {
                const index = parseInt(imageWrap.dataset.index);
                console.log(`🖼️ Opening image modal for project ${index}:`, this.projectImages[index]);
                this.openImageModal(index);
            }
        });

        // Keyboard activation for project images (role="button")
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('project-image-wrap')) {
                e.preventDefault();
                this.openImageModal(parseInt(e.target.dataset.index));
            }
        });
        
        // Smooth scroll for internal links
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            const href = anchor?.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();

            // Bare "#" or "#top" scrolls to the top of the page
            if (href.length <= 1 || href === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /**
     * Initialize the slideshow modal: buttons, keyboard navigation
     * and pointer-based drag/swipe on the carousel track.
     */
    initializeImageModal() {
        const modal = document.getElementById('image-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeImageModal());
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeImageModal());
        }
        
        if (modalPrev) {
            modalPrev.addEventListener('click', () => this.previousImage());
        }
        
        if (modalNext) {
            modalNext.addEventListener('click', () => this.nextImage());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal?.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeImageModal();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        this.initializeCarouselDrag();
    }

    /**
     * Wire up pointer events so the slideshow can be dragged/swiped
     * with mouse, touch or pen. Snaps to the nearest slide on release,
     * with velocity-based flicking and rubber-band resistance at the edges.
     */
    initializeCarouselDrag() {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        const drag = {
            active: false,
            pointerId: null,
            startX: 0,
            deltaX: 0,
            startTime: 0
        };

        track.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;

            drag.active = true;
            drag.pointerId = e.pointerId;
            drag.startX = e.clientX;
            drag.deltaX = 0;
            drag.startTime = performance.now();

            track.classList.add('dragging');
            try {
                track.setPointerCapture(e.pointerId);
            } catch {
                // Pointer may already be released (e.g. synthetic events) — drag still works
            }
        });

        track.addEventListener('pointermove', (e) => {
            if (!drag.active || e.pointerId !== drag.pointerId) return;

            drag.deltaX = e.clientX - drag.startX;

            // Rubber-band resistance when dragging past the first/last slide
            const atStart = this.currentImageIndex === 0 && drag.deltaX > 0;
            const atEnd = this.currentImageIndex === this.projectImages.length - 1 && drag.deltaX < 0;
            const effectiveDelta = (atStart || atEnd) ? drag.deltaX / 3 : drag.deltaX;

            this.setTrackPosition(this.currentImageIndex, effectiveDelta, false);
        });

        const endDrag = (e) => {
            if (!drag.active || e.pointerId !== drag.pointerId) return;

            drag.active = false;
            track.classList.remove('dragging');

            const elapsed = Math.max(performance.now() - drag.startTime, 1);
            const velocity = drag.deltaX / elapsed; // px per ms
            const viewportWidth = track.parentElement?.clientWidth || window.innerWidth;

            // A tap (no meaningful movement) on the empty area closes the modal
            if (Math.abs(drag.deltaX) < 6) {
                if (e.target.classList?.contains('carousel-slide')) {
                    this.closeImageModal();
                } else {
                    this.goToSlide(this.currentImageIndex);
                }
                return;
            }

            // Navigate when dragged past 18% of the viewport or flicked quickly
            const passedThreshold = Math.abs(drag.deltaX) > viewportWidth * 0.18;
            const flicked = Math.abs(velocity) > 0.45 && Math.abs(drag.deltaX) > 24;

            if ((passedThreshold || flicked) && drag.deltaX < 0) {
                this.goToSlide(this.currentImageIndex + 1);
            } else if ((passedThreshold || flicked) && drag.deltaX > 0) {
                this.goToSlide(this.currentImageIndex - 1);
            } else {
                this.goToSlide(this.currentImageIndex); // snap back
            }
        };

        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
    }

    /**
     * Build the carousel slides and dots for the current language data.
     * Images are lazy-loaded per slide when they come into range.
     */
    buildCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.getElementById('carousel-dots');
        if (!track) return;

        track.innerHTML = this.projectImages.map((image, index) => `
            <figure class="carousel-slide" data-index="${index}">
                <div class="slide-spinner" aria-hidden="true"></div>
                <img data-src="${image.full}" alt="${image.title}" draggable="false">
            </figure>
        `).join('');

        if (dots) {
            dots.innerHTML = this.projectImages.map((image, index) => `
                <button class="carousel-dot" data-index="${index}" aria-label="${image.title}"></button>
            `).join('');

            dots.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => this.goToSlide(parseInt(dot.dataset.index)));
            });
        }

        this.carouselLanguage = this.currentLanguage;
    }

    /**
     * Position the carousel track on a given slide, optionally with
     * an extra drag offset and with/without animation.
     */
    setTrackPosition(index, dragOffset = 0, animate = true) {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        track.style.transition = animate
            ? 'transform 0.4s cubic-bezier(0.22, 0.8, 0.3, 1)'
            : 'none';
        track.style.transform = `translateX(calc(${-index * 100}% + ${dragOffset}px))`;
    }

    /**
     * Navigate the slideshow to a slide index (clamped to valid range)
     */
    goToSlide(index, instant = false) {
        const clamped = Math.max(0, Math.min(index, this.projectImages.length - 1));
        this.currentImageIndex = clamped;

        this.setTrackPosition(clamped, 0, !instant);
        this.loadSlidesAround(clamped);
        this.updateCarouselUI();
    }

    /**
     * Lazy-load the image of the current slide and its neighbors
     */
    loadSlidesAround(index) {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        [index - 1, index, index + 1].forEach(i => {
            const slide = track.querySelector(`.carousel-slide[data-index="${i}"]`);
            const img = slide?.querySelector('img[data-src]');
            if (!img) return;

            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                slide.classList.add('slide-loaded');
            }, { once: true });
            img.addEventListener('error', () => {
                console.error(`❌ Failed to load image: ${img.src}`);
                slide.classList.add('slide-loaded');
            }, { once: true });
        });
    }

    /**
     * Sync caption, counter, dots and arrow states with the current slide
     */
    updateCarouselUI() {
        const image = this.projectImages[this.currentImageIndex];

        const caption = document.getElementById('modal-caption');
        if (caption) caption.textContent = image?.title || '';

        const counter = document.getElementById('modal-counter');
        if (counter) counter.textContent = `${this.currentImageIndex + 1} / ${this.projectImages.length}`;

        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
            dot.classList.toggle('active', parseInt(dot.dataset.index) === this.currentImageIndex);
        });

        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');
        if (modalPrev) modalPrev.disabled = this.currentImageIndex === 0;
        if (modalNext) modalNext.disabled = this.currentImageIndex === this.projectImages.length - 1;
    }

    /**
     * Open the slideshow modal at a given project index
     */
    openImageModal(index) {
        const modal = document.getElementById('image-modal');
        if (!modal) {
            console.error('❌ Modal elements not found');
            return;
        }

        // (Re)build slides on first open or after a language switch
        if (this.carouselLanguage !== this.currentLanguage) {
            this.buildCarousel();
        }

        modal.classList.add('active');
        this.goToSlide(index, true);

        // Save current scroll position
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Prevent page scrolling on mobile and maintain scroll position
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
    }

    /**
     * Close image modal
     */
    closeImageModal() {
        const modal = document.getElementById('image-modal');
        if (modal) {
            modal.classList.remove('active');
            
            // Restore body styles and scroll position
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Restore scroll position
            window.scrollTo(0, this.scrollPosition);
        }
    }

    /**
     * Navigate to previous image
     */
    previousImage() {
        this.goToSlide(this.currentImageIndex - 1);
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        this.goToSlide(this.currentImageIndex + 1);
    }

    /**
     * Toggle language
     */
    async toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'pt' : 'en';
        
        try {
            this.showLoading();
            
            // Update URL without refreshing page
            const url = new URL(window.location);
            url.searchParams.set('lang', newLanguage);
            window.history.pushState({}, '', url);
            
            // Update current language
            this.currentLanguage = newLanguage;
            
            // Reload data and re-render
            await this.loadData();
            this.renderAllSections();
            
            this.hideLoading();
            
            console.log(`🌐 Language switched to: ${newLanguage}`);
        } catch (error) {
            console.error('❌ Failed to switch language:', error);
            this.hideLoading();
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('active');
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.remove('active');
        }
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new ModernPortfolioManager();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 Page hidden - pausing animations');
        // Pause any heavy animations or processes
    } else {
        console.log('📱 Page visible - resuming animations');
        // Resume animations or refresh data if needed
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Back online');
    // Could refresh data or show notification
});

window.addEventListener('offline', () => {
    console.log('📴 Gone offline');
    // Could show offline notification
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log(`⚡ Page loaded in ${entry.loadEventEnd - entry.loadEventStart}ms`);
        }
    }
});

observer.observe({ entryTypes: ['navigation'] }); 