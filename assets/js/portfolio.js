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
            this.projectImages = this.data.projects.map(project => ({
                full: `images/fulls/${project.image}.jpg`,
                thumb: `images/thumbs/${project.image}.jpg`,
                title: project.title,
                description: project.description
            }));
            
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
    }

    /**
     * Render hero section
     */
    renderHeroSection() {
        const heroName = document.getElementById('hero-name');
        const heroTitle = document.getElementById('hero-title');
        const heroLocation = document.getElementById('hero-location');
        const navTitle = document.getElementById('nav-title');
        
        if (heroName) heroName.textContent = this.data.intro.name;
        if (heroTitle) heroTitle.textContent = this.data.intro.title;
        if (heroLocation) heroLocation.textContent = this.data.intro.location;
        
        // Update navigation title
        if (navTitle) {
            const portfolioText = this.currentLanguage === 'pt' ? 'Portfólio' : 'Portfolio';
            navTitle.textContent = `${this.data.intro.name} - ${portfolioText}`;
        }
        
        // Update page title
        document.title = this.data.meta.title;
    }

    /**
     * Render social links
     */
    renderSocialLinks() {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer) return;
        
        const socialHTML = this.data.social.map(social => `
            <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link">
                <div class="social-icon">${this.getSocialIcon(social.icon)}</div>
                <div class="social-name">${social.name}</div>
            </a>
        `).join('');
        
        socialContainer.innerHTML = socialHTML;
    }

    /**
     * Get social media icon
     */
    getSocialIcon(iconName) {
        const icons = {
            'fa-linkedin': '💼',
            'fa-github': '🐙',
            'fa-app-store': '📱',
            'fa-google-play': '🎮',
            'fa-itch-io': '🎯',
            'fa-file-code': '💻',
            'fa-envelope': '✉️'
        };
        return icons[iconName] || '🔗';
    }

    /**
     * Render about section
     */
    renderAboutSection() {
        const aboutTitle = document.getElementById('about-title');
        const aboutContent = document.getElementById('about-content');
        
        if (aboutTitle) aboutTitle.textContent = this.data.about.title;
        if (aboutContent) aboutContent.textContent = this.data.about.content;
    }

    /**
     * Render projects section
     */
    renderProjectsSection() {
        const projectsTitle = document.getElementById('projects-title');
        const projectsGrid = document.getElementById('projects-grid');
        
        if (projectsTitle) {
            projectsTitle.textContent = this.currentLanguage === 'pt' ? 'Portfólio de Jogos' : 'Games Portfolio';
        }
        
        if (!projectsGrid) return;
        
        const projectsHTML = this.data.projects.map((project, index) => `
            <div class="project-card">
                <img 
                    src="images/thumbs/${project.image}.jpg" 
                    alt="${project.title}"
                    class="project-image"
                    data-index="${index}"
                >
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-links">
                        ${project.links.map(link => `
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
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
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-company">
                        ${exp.url ? `<a href="${exp.url}" target="_blank" rel="noopener noreferrer">${exp.company}</a>` : exp.company}
                    </div>
                    <div class="experience-title">${exp.title}</div>
                    <div class="experience-meta">
                        <span class="experience-period">${exp.period}</span>
                        ${exp.location ? `<span class="experience-location">${exp.location}</span>` : ''}
                    </div>
                </div>
                <div class="experience-description">${exp.description}</div>
                ${exp.achievements && exp.achievements.length > 0 ? `
                    <ul class="experience-achievements">
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
        
        const skillsHTML = this.data.skills.map(skill => `
            <div class="skill-item">
                <div class="skill-icon">${this.getSkillIcon(skill.name)}</div>
                <div class="skill-name">${skill.name}</div>
            </div>
        `).join('');
        
        skillsGrid.innerHTML = skillsHTML;
    }

    /**
     * Get skill icon
     */
    getSkillIcon(skillName) {
        const icons = {
            'Unity': '🎮',
            'Unreal Engine': '🚀',
            'C#': '💻',
            'C++': '⚡',
            'JavaScript': '🌐',
            'Python': '🐍',
            'Git': '📦',
            'Firebase': '🔥',
            'Networking': '🌐',
            'AI': '🤖',
            'Mobile': '📱',
            'PC': '🖥️',
            'Console': '🎮'
        };
        return icons[skillName] || '⚙️';
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
            <div class="education-item">
                <div class="education-school">
                    ${edu.url ? `<a href="${edu.url}" target="_blank" rel="noopener noreferrer">${edu.institution}</a>` : edu.institution}
                </div>
                <div class="education-degree">${edu.degree}</div>
                <div class="education-meta">
                    <span class="education-period">${edu.period}</span>
                    ${edu.location ? `<span class="education-location">${edu.location}</span>` : ''}
                </div>
            </div>
        `).join('');
        
        educationList.innerHTML = educationHTML;
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Project image clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-image')) {
                const index = parseInt(e.target.dataset.index);
                this.openImageModal(index);
            }
        });
        
        // Smooth scroll for internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    /**
     * Initialize image modal
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
    }

    /**
     * Open image modal
     */
    openImageModal(index) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        
        if (!modal || !modalImage) return;
        
        this.currentImageIndex = index;
        const image = this.projectImages[index];
        
        modalImage.src = image.full;
        modalImage.alt = image.title;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close image modal
     */
    closeImageModal() {
        const modal = document.getElementById('image-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Navigate to previous image
     */
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.projectImages.length) % this.projectImages.length;
        this.updateModalImage();
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.projectImages.length;
        this.updateModalImage();
    }

    /**
     * Update modal image
     */
    updateModalImage() {
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            const image = this.projectImages[this.currentImageIndex];
            modalImage.src = image.full;
            modalImage.alt = image.title;
        }
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
    new ModernPortfolioManager();
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

// Add touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const modal = document.getElementById('image-modal');
    if (!modal?.classList.contains('active')) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - previous image
            const portfolioManager = window.portfolioManager;
            if (portfolioManager) portfolioManager.previousImage();
        } else {
            // Swipe left - next image
            const portfolioManager = window.portfolioManager;
            if (portfolioManager) portfolioManager.nextImage();
        }
    }
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