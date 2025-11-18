/**
 * Tornado.io 3 - Battle Arena
 * Game Page Manager with Localization Support
 */

class Tornado3GamePage {
    constructor() {
        this.data = null;
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'pt', 'es'];
        this.screenshots = [];
        this.currentImageIndex = 0;
        this.scrollPosition = 0;
        
        // Carousel state
        this.currentFeatureIndex = 0;
        this.autoPlayInterval = null;
        this.progressInterval = null;
        this.autoPlayDuration = 8000; // 8 seconds
        this.progressStart = 0;
        this.pausedProgress = 0; // Track progress when paused
        
        console.log('🌪️ Initializing Tornado.io 3 Game Page...');
        this.init();
    }

    /**
     * Initialize the game page
     */
    async init() {
        try {
            this.showLoading();
            
            // Initialize language
            this.initializeLanguage();
            
            // Load data
            await this.loadData();
            
            // Initialize UI
            this.initializeUI();
            
            // Initialize event listeners
            this.initializeEventListeners();
            
            // Initialize scroll animations
            this.initializeScrollAnimations();
            
            this.hideLoading();
            
            console.log('✅ Tornado.io 3 page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize page:', error);
            this.hideLoading();
        }
    }

    /**
     * Initialize language settings
     */
    initializeLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && this.supportedLanguages.includes(langParam)) {
            this.currentLanguage = langParam;
            console.log(`🌐 Language set from URL: ${this.currentLanguage}`);
        } else {
            this.currentLanguage = 'en';
            console.log(`🌐 Using default language: ${this.currentLanguage}`);
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * Load data for current language
     */
    async loadData() {
        try {
            let dataFile = '/data/tornado3.json'; // Default to English
            
            if (this.currentLanguage === 'pt') {
                dataFile = '/data/tornado3_pt.json';
            } else if (this.currentLanguage === 'es') {
                dataFile = '/data/tornado3_es.json';
            }
            
            console.log(`📂 Loading data from: ${dataFile}`);
            
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error(`Failed to load ${dataFile}: ${response.status}`);
            }
            
            this.data = await response.json();
            console.log(`✅ Successfully loaded ${this.currentLanguage} data`);
            
            // Store screenshots
            this.screenshots = this.data.screenshots.images;
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            if (this.currentLanguage !== 'en') {
                console.log('🔄 Falling back to English...');
                this.currentLanguage = 'en';
                return this.loadData();
            }
            throw error;
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        this.renderNavigation();
        this.renderHero();
        this.renderFeatures();
        this.renderGameModes();
        this.renderScreenshots();
        this.renderAbout();
        this.renderSocial();
        this.renderFooter();
        this.updateMetaTags();
    }

    /**
     * Update meta tags
     */
    updateMetaTags() {
        document.title = this.data.meta.title;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.data.meta.description;
        }
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = this.data.hero.title + ' - ' + this.data.hero.subtitle;
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = this.data.hero.tagline;
        }
    }

    /**
     * Render navigation
     */
    renderNavigation() {
        const brandName = document.getElementById('brand-name');
        const languageCurrent = document.getElementById('language-current');
        
        if (brandName) brandName.textContent = this.data.navigation.brandName;
        if (languageCurrent) {
            languageCurrent.textContent = this.currentLanguage.toUpperCase();
        }
        
        // Update active language option
        this.updateActiveLanguageOption();
    }
    
    /**
     * Update active language option in dropdown
     */
    updateActiveLanguageOption() {
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            if (option.dataset.lang === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Render hero section
     */
    renderHero() {
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroTagline = document.getElementById('hero-tagline');
        const heroDescription = document.getElementById('hero-description');
        const watchTrailerText = document.getElementById('watch-trailer-text');
        
        if (heroTitle) heroTitle.textContent = this.data.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = this.data.hero.subtitle;
        if (heroTagline) heroTagline.textContent = this.data.hero.tagline;
        if (heroDescription) heroDescription.textContent = this.data.hero.description;
        if (watchTrailerText) watchTrailerText.textContent = this.data.hero.watchTrailerText;
    }

    /**
     * Render features section
     */
    renderFeatures() {
        const featuresTitle = document.getElementById('features-title');
        const featuresSubtitle = document.getElementById('features-subtitle');
        const featuresTrack = document.getElementById('features-track');
        const featuresIndicators = document.getElementById('features-indicators');
        
        if (featuresTitle) featuresTitle.textContent = this.data.features.title;
        if (featuresSubtitle) featuresSubtitle.textContent = this.data.features.subtitle;
        
        if (featuresTrack) {
            const featuresHTML = this.data.features.items.map((feature, index) => `
                <div class="feature-card ${index === 0 ? 'center' : ''}" data-index="${index}">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p class="feature-description">${feature.description}</p>
                </div>
            `).join('');
            
            featuresTrack.innerHTML = featuresHTML;
        }
        
        // Create indicators
        if (featuresIndicators) {
            const totalFeatures = this.data.features.items.length;
            const indicatorsHTML = Array.from({ length: totalFeatures }, (_, i) => 
                `<button class="carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
            ).join('');
            
            featuresIndicators.innerHTML = indicatorsHTML;
        }
        
        // Initialize carousel
        this.initializeCarousel();
    }

    /**
     * Render game modes section
     */
    renderGameModes() {
        const modesTitle = document.getElementById('modes-title');
        const modesSubtitle = document.getElementById('modes-subtitle');
        const modesGrid = document.getElementById('modes-grid');
        
        if (modesTitle) modesTitle.textContent = this.data.gameModes.title;
        if (modesSubtitle) modesSubtitle.textContent = this.data.gameModes.subtitle;
        
        if (modesGrid) {
            const modesHTML = this.data.gameModes.modes.map(mode => `
                <div class="mode-card fade-in">
                    <div class="mode-header">
                        <span class="mode-icon">${mode.icon}</span>
                        <h3 class="mode-title">${mode.name}</h3>
                    </div>
                    <div class="mode-type">${mode.type}</div>
                    <p class="mode-description">${mode.description}</p>
                    <span class="mode-highlight">${mode.highlight}</span>
                </div>
            `).join('');
            
            modesGrid.innerHTML = modesHTML;
        }
    }

    /**
     * Render screenshots section
     */
    renderScreenshots() {
        const screenshotsTitle = document.getElementById('screenshots-title');
        const screenshotsSubtitle = document.getElementById('screenshots-subtitle');
        const screenshotsGrid = document.getElementById('screenshots-grid');
        
        if (screenshotsTitle) screenshotsTitle.textContent = this.data.screenshots.title;
        if (screenshotsSubtitle) screenshotsSubtitle.textContent = this.data.screenshots.subtitle;
        
        if (screenshotsGrid) {
            const screenshotsHTML = this.screenshots.map((screenshot, index) => `
                <div class="screenshot-item fade-in" data-index="${index}">
                    <img src="${screenshot.src}" alt="${screenshot.alt}" class="screenshot-image" loading="lazy">
                    <div class="screenshot-overlay">
                        <span class="screenshot-title">${screenshot.title}</span>
                    </div>
                </div>
            `).join('');
            
            screenshotsGrid.innerHTML = screenshotsHTML;
        }
    }

    /**
     * Render about section
     */
    renderAbout() {
        const aboutTitle = document.getElementById('about-title');
        const aboutDescription = document.getElementById('about-description');
        const aboutHighlights = document.getElementById('about-highlights');
        
        if (aboutTitle) aboutTitle.textContent = this.data.about.title;
        if (aboutDescription) aboutDescription.textContent = this.data.about.description;
        
        if (aboutHighlights) {
            const highlightsHTML = this.data.about.highlights.map(highlight => `
                <li>${highlight}</li>
            `).join('');
            
            aboutHighlights.innerHTML = highlightsHTML;
        }
    }

    /**
     * Render social section
     */
    renderSocial() {
        const socialTitle = document.getElementById('social-title');
        const socialSubtitle = document.getElementById('social-subtitle');
        const socialLinks = document.getElementById('social-links');
        const contactTitle = document.getElementById('contact-title');
        const contactDescription = document.getElementById('contact-description');
        const contactButtonText = document.getElementById('contact-button-text');
        
        if (socialTitle) socialTitle.textContent = this.data.social.title;
        if (socialSubtitle) socialSubtitle.textContent = this.data.social.subtitle;
        
        if (socialLinks) {
            const socialHTML = this.data.social.links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link">
                    <div class="social-icon">${this.getSocialIcon(link.icon)}</div>
                    <span class="social-name">${link.name}</span>
                </a>
            `).join('');
            
            socialLinks.innerHTML = socialHTML;
        }
        
        if (contactTitle) contactTitle.textContent = this.data.social.contact.title;
        if (contactDescription) contactDescription.textContent = this.data.social.contact.description;
        if (contactButtonText) contactButtonText.textContent = this.data.social.contact.buttonText;
    }

    /**
     * Get social media icon
     */
    getSocialIcon(iconName) {
        const icons = {
            'instagram': '📷',
            'youtube': '▶️',
            'twitter': '🐦',
            'facebook': '👍',
            'discord': '💬'
        };
        return icons[iconName] || '🔗';
    }

    /**
     * Render footer
     */
    renderFooter() {
        const footerCopyright = document.getElementById('footer-copyright');
        const footerDeveloper = document.getElementById('footer-developer');
        const footerLinks = document.getElementById('footer-links');
        const footerSocial = document.getElementById('footer-social');
        
        if (footerCopyright) footerCopyright.textContent = this.data.footer.copyright;
        if (footerDeveloper) footerDeveloper.textContent = this.data.footer.developer;
        
        if (footerLinks) {
            const linksHTML = this.data.footer.links.map(link => `
                <a href="${link.url}" class="footer-link">${link.text}</a>
            `).join('');
            
            footerLinks.innerHTML = linksHTML;
        }
        
        if (footerSocial) {
            const socialHTML = this.data.social.links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="${link.name}">
                    ${this.getSocialIcon(link.icon)}
                </a>
            `).join('');
            
            footerSocial.innerHTML = socialHTML;
        }
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Language dropdown
        this.initializeLanguageDropdown();
        
        // Navigation
        this.initializeNavigation();
        
        // Watch Trailer button
        const watchTrailerBtn = document.getElementById('watch-trailer-btn');
        if (watchTrailerBtn) {
            watchTrailerBtn.addEventListener('click', () => this.openVideoModal());
        }
        
        // Screenshot clicks
        document.addEventListener('click', (e) => {
            const screenshotItem = e.target.closest('.screenshot-item');
            if (screenshotItem) {
                const index = parseInt(screenshotItem.dataset.index);
                this.openModal(index);
            }
        });
        
        // Modal controls
        this.initializeModal();
        this.initializeVideoModal();
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav-header').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMobileNav();
                }
            });
        });
        
        // Scroll spy for active navigation
        this.initializeScrollSpy();
    }
    
    /**
     * Initialize navigation
     */
    initializeNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-header') && navMenu?.classList.contains('active')) {
                this.closeMobileNav();
            }
        });
    }
    
    /**
     * Close mobile navigation
     */
    closeMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    /**
     * Initialize scroll spy
     */
    initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Initialize language dropdown
     */
    initializeLanguageDropdown() {
        const languageButton = document.getElementById('language-button');
        const languageDropdown = document.getElementById('language-dropdown');
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Toggle dropdown
        if (languageButton) {
            languageButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = languageButton.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    this.closeLanguageDropdown();
                } else {
                    this.openLanguageDropdown();
                }
            });
        }
        
        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = option.dataset.lang;
                if (newLang !== this.currentLanguage) {
                    this.changeLanguage(newLang);
                }
                this.closeLanguageDropdown();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                this.closeLanguageDropdown();
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && languageDropdown?.classList.contains('active')) {
                this.closeLanguageDropdown();
            }
        });
    }
    
    /**
     * Open language dropdown
     */
    openLanguageDropdown() {
        const languageButton = document.getElementById('language-button');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (languageButton && languageDropdown) {
            languageButton.setAttribute('aria-expanded', 'true');
            languageDropdown.classList.add('active');
        }
    }
    
    /**
     * Close language dropdown
     */
    closeLanguageDropdown() {
        const languageButton = document.getElementById('language-button');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (languageButton && languageDropdown) {
            languageButton.setAttribute('aria-expanded', 'false');
            languageDropdown.classList.remove('active');
        }
    }
    
    /**
     * Change language
     */
    async changeLanguage(newLanguage) {
        if (newLanguage === this.currentLanguage) return;
        
        try {
            this.showLoading();
            
            // Pause carousel during language change
            this.pauseAutoPlay();
            
            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('lang', newLanguage);
            window.history.pushState({}, '', url);
            
            // Update current language
            this.currentLanguage = newLanguage;
            document.documentElement.lang = newLanguage;
            
            // Reset carousel state
            this.currentFeatureIndex = 0;
            
            // Reload data and re-render
            await this.loadData();
            this.initializeUI();
            
            this.hideLoading();
            
            console.log(`🌐 Language changed to: ${newLanguage}`);
        } catch (error) {
            console.error('❌ Failed to change language:', error);
            this.hideLoading();
        }
    }

    /**
     * Initialize modal
     */
    initializeModal() {
        const modal = document.getElementById('screenshot-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const modalPrev = document.getElementById('modal-prev');
        const modalNext = document.getElementById('modal-next');
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
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
                        this.closeModal();
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
        
        // Touch swipe support
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!modal?.classList.contains('active')) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Horizontal swipe detection
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            }
        });
    }

    /**
     * Open modal
     */
    openModal(index) {
        const modal = document.getElementById('screenshot-modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        
        if (!modal || !modalImage) return;
        
        // Pause carousel when opening screenshot modal
        this.pauseAutoPlay();
        
        this.currentImageIndex = index;
        const screenshot = this.screenshots[index];
        
        modalImage.src = screenshot.src;
        modalImage.alt = screenshot.alt;
        
        if (modalCaption) {
            modalCaption.textContent = screenshot.title;
        }
        
        modal.classList.add('active');
        
        // Prevent body scroll
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('screenshot-modal');
        if (modal) {
            modal.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }
    }

    /**
     * Previous image
     */
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.screenshots.length) % this.screenshots.length;
        this.updateModalImage();
    }

    /**
     * Next image
     */
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.screenshots.length;
        this.updateModalImage();
    }

    /**
     * Update modal image
     */
    updateModalImage() {
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        
        if (modalImage) {
            const screenshot = this.screenshots[this.currentImageIndex];
            modalImage.style.opacity = '0.5';
            
            setTimeout(() => {
                modalImage.src = screenshot.src;
                modalImage.alt = screenshot.alt;
                modalImage.style.opacity = '1';
                
                if (modalCaption) {
                    modalCaption.textContent = screenshot.title;
                }
            }, 150);
        }
    }

    /**
     * Initialize video modal
     */
    initializeVideoModal() {
        const videoModal = document.getElementById('video-modal');
        const videoModalOverlay = document.getElementById('video-modal-overlay');
        const videoModalClose = document.getElementById('video-modal-close');
        
        if (videoModalOverlay) {
            videoModalOverlay.addEventListener('click', () => this.closeVideoModal());
        }
        
        if (videoModalClose) {
            videoModalClose.addEventListener('click', () => this.closeVideoModal());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (videoModal?.classList.contains('active') && e.key === 'Escape') {
                this.closeVideoModal();
            }
        });
    }

    /**
     * Open video modal
     */
    openVideoModal() {
        const videoModal = document.getElementById('video-modal');
        const modalVideo = document.getElementById('modal-video');
        
        if (!videoModal || !modalVideo) return;
        
        // Pause carousel when opening video
        this.pauseAutoPlay();
        
        // Set video source with autoplay
        modalVideo.src = 'https://www.youtube.com/embed/OJDynpSvKDU?autoplay=1&rel=0';
        
        videoModal.classList.add('active');
        
        // Prevent body scroll
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
    }

    /**
     * Close video modal
     */
    closeVideoModal() {
        const videoModal = document.getElementById('video-modal');
        const modalVideo = document.getElementById('modal-video');
        
        if (videoModal) {
            videoModal.classList.remove('active');
            
            // Stop video by removing src
            if (modalVideo) {
                modalVideo.src = '';
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }
    }

    /**
     * Initialize carousel
     */
    initializeCarousel() {
        // Navigation buttons
        const prevBtn = document.getElementById('features-prev');
        const nextBtn = document.getElementById('features-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousFeature();
                this.resetProgress();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextFeature();
                this.resetProgress();
            });
        }
        
        // Card clicks
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                if (index !== this.currentFeatureIndex) {
                    this.goToFeature(index);
                    this.resetProgress();
                }
            });
        });
        
        // Indicator clicks
        document.querySelectorAll('.carousel-indicator').forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.dataset.index);
                this.goToFeature(index);
                this.resetProgress();
            });
        });
        
        // Touch swipe support
        const carousel = document.getElementById('features-carousel');
        if (carousel) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextFeature();
                    } else {
                        this.previousFeature();
                    }
                    this.resetProgress();
                }
            });
            
            // Pause on hover (stop both autoplay and progress)
            carousel.addEventListener('mouseenter', () => {
                this.pauseAutoPlayWithProgress();
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        }
        
        // Start autoplay and progress
        this.startAutoPlay();
        
        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateCarousel();
            }, 250);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            if (focusedElement.closest('.features-section')) {
                if (e.key === 'ArrowLeft') {
                    this.previousFeature();
                    this.resetProgress();
                } else if (e.key === 'ArrowRight') {
                    this.nextFeature();
                    this.resetProgress();
                }
            }
        });
    }
    
    /**
     * Previous feature
     */
    previousFeature() {
        const totalFeatures = this.data.features.items.length;
        this.currentFeatureIndex = (this.currentFeatureIndex - 1 + totalFeatures) % totalFeatures;
        this.updateCarousel();
    }
    
    /**
     * Next feature
     */
    nextFeature() {
        const totalFeatures = this.data.features.items.length;
        this.currentFeatureIndex = (this.currentFeatureIndex + 1) % totalFeatures;
        this.updateCarousel();
    }
    
    /**
     * Go to specific feature
     */
    goToFeature(index) {
        this.currentFeatureIndex = index;
        this.updateCarousel();
    }
    
    /**
     * Update carousel position and center card
     */
    updateCarousel() {
        const track = document.getElementById('features-track');
        if (!track) return;
        
        const cards = track.querySelectorAll('.feature-card');
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        
        // Determine gap based on screen size
        const width = window.innerWidth;
        const gap = width < 768 ? 16 : 24; // spacing-md or spacing-lg
        
        const offset = this.currentFeatureIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update card states
        cards.forEach((card, index) => {
            if (index === this.currentFeatureIndex) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }
        });
        
        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            if (index === this.currentFeatureIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    /**
     * Start autoplay with progress bar
     */
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing intervals
        
        this.progressStart = Date.now();
        this.pausedProgress = 0;
        
        // Update progress bar
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - this.progressStart;
            const progress = (elapsed / this.autoPlayDuration) * 100;
            
            const progressBar = document.getElementById('carousel-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            
            // Auto advance when reaching 100%
            if (progress >= 100) {
                this.nextFeature();
                this.resetProgress();
            }
        }, 50);
    }
    
    /**
     * Pause autoplay and save progress
     */
    pauseAutoPlayWithProgress() {
        // Save current progress
        const elapsed = Date.now() - this.progressStart;
        this.pausedProgress = elapsed;
        
        // Stop intervals
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        // Visual indicator
        const progressContainer = document.querySelector('.carousel-progress');
        if (progressContainer) {
            progressContainer.classList.add('paused');
        }
    }
    
    /**
     * Resume autoplay from saved progress
     */
    resumeAutoPlay() {
        if (this.progressInterval) return; // Already running
        
        // Remove paused indicator
        const progressContainer = document.querySelector('.carousel-progress');
        if (progressContainer) {
            progressContainer.classList.remove('paused');
        }
        
        // Calculate remaining time
        const remainingTime = this.autoPlayDuration - this.pausedProgress;
        
        // Adjust start time to account for paused duration
        this.progressStart = Date.now() - this.pausedProgress;
        
        // Resume progress bar updates
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - this.progressStart;
            const progress = (elapsed / this.autoPlayDuration) * 100;
            
            const progressBar = document.getElementById('carousel-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            
            // Auto advance when reaching 100%
            if (progress >= 100) {
                this.nextFeature();
                this.resetProgress();
                this.startAutoPlay();
            }
        }, 50);
    }
    
    /**
     * Pause autoplay and progress (for manual interactions)
     */
    pauseAutoPlay() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    /**
     * Reset progress bar
     */
    resetProgress() {
        this.progressStart = Date.now();
        this.pausedProgress = 0;
        const progressBar = document.getElementById('carousel-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    /**
     * Initialize scroll animations
     */
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tornado3GamePage = new Tornado3GamePage();
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📱 Page hidden - pausing animations');
    } else {
        console.log('📱 Page visible - resuming animations');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

