/**
 * Portfolio Data Manager
 * Handles loading and rendering of portfolio data based on selected language
 */

class PortfolioManager {
    constructor() {
        this.data = null;
        this.defaultLanguage = 'en';
        this.currentLanguage = this.defaultLanguage;
        this.supportedLanguages = ['en', 'pt']; // Add more languages here as needed
        this.init();
    }

    /**
     * Initialize the portfolio manager
     */
    init() {
        // First check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && this.supportedLanguages.includes(langParam)) {
            // If URL parameter is set and supported, use it
            this.currentLanguage = langParam;
            console.log(`Language set from URL parameter: ${this.currentLanguage}`);
        } else {
            // Otherwise, try to detect from browser settings
            this.detectBrowserLanguage();
        }
        
        // Load data for the current language
        this.loadData();
    }

    /**
     * Detect the user's preferred language from browser settings
     */
    detectBrowserLanguage() {
        try {
            // Get browser languages
            const browserLanguages = navigator.languages || 
                                    [navigator.language || 
                                     navigator.userLanguage || 
                                     this.defaultLanguage];
            
            console.log('Browser languages:', browserLanguages);
            
            // Find the first supported language
            for (const browserLang of browserLanguages) {
                // Get the language code (first 2 characters)
                const langCode = browserLang.substring(0, 2).toLowerCase();
                
                if (this.supportedLanguages.includes(langCode)) {
                    this.currentLanguage = langCode;
                    console.log(`Language detected from browser: ${this.currentLanguage}`);
                    
                    // Update URL with the detected language
                    if (!window.location.search.includes('lang=')) {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('lang', this.currentLanguage);
                        window.history.replaceState({}, '', newUrl.toString());
                        console.log(`Updated URL with detected language: ${newUrl.toString()}`);
                    }
                    
                    return;
                }
            }
            
            // If no supported language found, use default
            console.log(`No supported language detected, using default: ${this.defaultLanguage}`);
            this.currentLanguage = this.defaultLanguage;
            
        } catch (error) {
            console.error('Error detecting browser language:', error);
            this.currentLanguage = this.defaultLanguage;
        }
    }

    /**
     * Load portfolio data for the current language
     */
    async loadData() {
        try {
            // Determine which data file to load based on the current language
            let dataFile;
            
            // Check if we have a specific file for this language
            if (this.currentLanguage === 'pt') {
                dataFile = 'data/portfolio_pt.json';
            } else if (this.currentLanguage === 'en') {
                dataFile = 'data/portfolio.json';
            } else {
                // For any other language, default to English
                dataFile = 'data/portfolio.json';
                // Update current language to match the file we're loading
                this.currentLanguage = 'en';
            }
            
            console.log(`Loading data from: ${dataFile}`);
            const response = await fetch(dataFile);
            
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status}`);
            }
            
            this.data = await response.json();
            
            // Ensure the role is properly set
            if (!this.data.intro.title || this.data.intro.title.trim() === '') {
                this.data.intro.title = 'Senior Game Engineer | Unity & Unreal';
                console.log('Role was missing, set default value');
            }
            
            console.log('Data loaded successfully:', this.data);
            this.renderPortfolio();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to default language if there's an error
            if (this.currentLanguage !== this.defaultLanguage) {
                this.currentLanguage = this.defaultLanguage;
                this.loadData();
            }
        }
    }

    /**
     * Render the entire portfolio based on loaded data
     */
    renderPortfolio() {
        if (!this.data) {
            console.error('No data available for rendering');
            return;
        }

        console.log('Rendering portfolio...');
        this.updateMetadata();
        this.renderHeader();
        this.renderIntro();
        this.renderAbout();
        this.renderProjects();
        this.renderExperience();
        this.renderSkills();
        this.renderEducation();
        this.renderLanguageSelector();
        this.renderFooter();
        
        // Initialize lightbox gallery after rendering projects
        this.initLightboxGallery();
        console.log('Portfolio rendering complete');
    }

    /**
     * Update page metadata (title, description, favicon)
     */
    updateMetadata() {
        document.title = this.data.meta.title;
        console.log(`Updated page title to: ${document.title}`);
        
        // Update favicon
        const faviconLink = document.querySelector('link[rel="favicon"]');
        if (faviconLink) {
            faviconLink.setAttribute('src', this.data.meta.favicon);
        }
        
        // Update meta description if it exists
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', this.data.meta.description);
        }
    }

    /**
     * Render the header section
     */
    renderHeader() {
        const header = document.getElementById('header');
        if (!header) {
            console.error('Header element not found');
            return;
        }

        const inner = header.querySelector('.inner');
        if (!inner) {
            console.error('Header inner element not found');
            return;
        }

        // Update avatar
        const avatar = inner.querySelector('.avatar img');
        if (avatar) {
            avatar.setAttribute('src', this.data.header.avatar);
            avatar.setAttribute('alt', this.data.intro.name);
        }

        // Update tagline
        const tagline = inner.querySelector('h1');
        if (tagline) {
            tagline.innerHTML = `<strong>${this.data.header.tagline}</strong><br /><br />`;
            console.log(`Updated header tagline to: ${this.data.header.tagline}`);
        }
    }

    /**
     * Render the introduction section
     */
    renderIntro() {
        const introSection = document.querySelector('#two header.major');
        if (!introSection) {
            console.error('Intro section not found');
            return;
        }

        // Log the intro data to verify it's correct
        console.log('Rendering intro section with:', {
            name: this.data.intro.name,
            title: this.data.intro.title,
            location: this.data.intro.location
        });

        // Ensure the intro section has the correct order: name, role, location, social links
        introSection.innerHTML = `
            <h1><strong>${this.data.intro.name}</strong></h1>
            <h2><em>${this.data.intro.title}</em></h2>
            <h3><em>${this.data.intro.location}</em></h3>
            <div id="menu">
                <ul>
                    ${this.renderSocialLinks()}
                </ul>
            </div>
            <br>
        `;
        
        // Verify the HTML was set correctly
        console.log('Intro HTML set:', introSection.innerHTML);
    }

    /**
     * Generate HTML for social links
     */
    renderSocialLinks() {
        return this.data.social.map(item => {
            const iconClass = item.isRegular ? 'icon regular' : (item.isSolid ? 'icon solid' : 'icon brands');
            return `
                <li>
                    <a href="${item.url}" target="_blank" class="${iconClass} ${item.icon}">
                        <span class="label">${item.name}</span>
                    </a>
                </li>
            `;
        }).join('');
    }

    /**
     * Render the about section
     */
    renderAbout() {
        // Find the about section title
        const aboutSection = document.querySelector('#two h2:first-of-type');
        if (!aboutSection) {
            console.error('About section title not found');
            return;
        }

        console.log('Rendering about section with title:', this.data.about.title);
        console.log('About content:', this.data.about.content);

        // Update about title
        aboutSection.textContent = this.data.about.title;
        
        // Update about content
        const aboutContent = aboutSection.nextElementSibling;
        if (aboutContent && aboutContent.tagName === 'P') {
            aboutContent.textContent = this.data.about.content;
            // Ensure the font size matches the original
            aboutContent.style.fontSize = '1em';
            console.log('Updated existing about content paragraph');
        } else {
            console.error('About content paragraph not found');
            // If the paragraph doesn't exist, create it
            const newParagraph = document.createElement('p');
            newParagraph.textContent = this.data.about.content;
            newParagraph.style.fontSize = '1em';
            aboutSection.after(newParagraph);
            console.log('Created new about content paragraph');
        }
    }

    /**
     * Render the projects section
     */
    renderProjects() {
        const projectsTitle = document.querySelector('#two h2:nth-of-type(2)');
        if (!projectsTitle) return;

        // Set projects section title
        projectsTitle.textContent = this.currentLanguage === 'pt' ? 'Portfolio de Games' : 'Games Portfolio';
        
        // Get the projects container
        const projectsContainer = projectsTitle.nextElementSibling;
        if (!projectsContainer || !projectsContainer.classList.contains('row')) return;
        
        // Clear existing projects
        projectsContainer.innerHTML = '';
        
        // Add projects
        this.data.projects.forEach(project => {
            const projectHTML = `
                <article class="col-6 col-12-xsmall work-item">
                    <a href="images/fulls/${project.image}.jpg" class="image fit thumb">
                        <img src="images/thumbs/${project.image}.jpg" alt="${project.title}" />
                    </a>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <strong>
                        ${project.links.map((link, index) => `
                            ${index > 0 ? ' | ' : ''}
                            <a href='${link.url}' target="_blank">${link.text}</a>
                        `).join('')}
                    </strong><br>
                </article>
            `;
            projectsContainer.innerHTML += projectHTML;
        });
    }

    /**
     * Initialize the lightbox gallery for project images
     */
    initLightboxGallery() {
        // Wait for DOM to be fully updated
        setTimeout(() => {
            if (window.jQuery && jQuery.fn.poptrox) {
                jQuery('#two').poptrox({
                    caption: function($a) { return $a.next('h3').text(); },
                    overlayColor: '#2c2c2c',
                    overlayOpacity: 0.85,
                    popupCloserText: '',
                    popupLoaderText: '',
                    selector: '.work-item a.image',
                    usePopupCaption: true,
                    usePopupDefaultStyling: false,
                    usePopupEasyClose: false,
                    usePopupNav: true,
                    windowMargin: (window.breakpoints && breakpoints.active('<=small') ? 0 : 50)
                });
            }
        }, 100);
    }

    /**
     * Render the experience section
     */
    renderExperience() {
        const experienceSection = document.querySelector('#three');
        if (!experienceSection) return;
        
        // Clear existing content
        experienceSection.innerHTML = '';
        
        // Add experience title
        const experienceTitle = document.createElement('h2');
        experienceTitle.textContent = this.currentLanguage === 'pt' ? 'Experiência Profissional' : 'Professional Experience';
        experienceSection.appendChild(experienceTitle);
        
        // Add experience content
        const experienceContent = document.createElement('p');
        
        // Build experience HTML
        let experienceHTML = '';
        this.data.experience.forEach(exp => {
            experienceHTML += `
                <strong>${exp.title} - ${exp.url ? `<a href='${exp.url}' target="_blank">${exp.company}</a>` : exp.company}:</strong>
                (${exp.period})
                ${exp.location ? `<br>${exp.location}` : ''}
                <br>
                ${exp.description}
                <br>
            `;
            
            // Add achievements if any
            if (exp.achievements && exp.achievements.length > 0) {
                exp.achievements.forEach(achievement => {
                    experienceHTML += `- ${achievement}<br>`;
                });
            }
            
            experienceHTML += '<br>';
        });
        
        experienceContent.innerHTML = experienceHTML;
        experienceSection.appendChild(experienceContent);
    }

    /**
     * Render the skills section
     */
    renderSkills() {
        const experienceSection = document.querySelector('#three');
        if (!experienceSection) return;
        
        // Add skills title
        const skillsTitle = document.createElement('h2');
        skillsTitle.textContent = this.currentLanguage === 'pt' ? 'Habilidades' : 'Skills';
        experienceSection.appendChild(skillsTitle);
        
        // Add skills content
        const skillsContent = document.createElement('p');
        
        // Build skills HTML
        let skillsHTML = '';
        this.data.skills.forEach(skill => {
            skillsHTML += `<strong>- ${skill.name}</strong> - ${skill.level}<br>`;
        });
        
        skillsContent.innerHTML = skillsHTML;
        experienceSection.appendChild(skillsContent);
    }

    /**
     * Render the education section
     */
    renderEducation() {
        const experienceSection = document.querySelector('#three');
        if (!experienceSection) return;
        
        // Add education title
        const educationTitle = document.createElement('h2');
        educationTitle.textContent = this.currentLanguage === 'pt' ? 'Educação' : 'Education';
        experienceSection.appendChild(educationTitle);
        
        // Add education content
        const educationContent = document.createElement('p');
        
        // Build education HTML
        let educationHTML = '';
        this.data.education.forEach(edu => {
            educationHTML += `
                <strong>- ${edu.institution}: ${edu.url ? `<a href='${edu.url}' target="_blank">${edu.degree}</a>` : edu.degree}</strong>, 
                (${edu.period}) - ${edu.location}
                <br>
            `;
        });
        
        educationContent.innerHTML = educationHTML;
        experienceSection.appendChild(educationContent);
    }

    /**
     * Render the language selector
     */
    renderLanguageSelector() {
        const experienceSection = document.querySelector('#three');
        if (!experienceSection) return;
        
        // Get the other language
        const otherLang = Object.keys(this.data.language.selector)[0];
        const langSelector = this.data.language.selector[otherLang];
        
        // Add language selector
        const langLink = document.createElement('a');
        langLink.href = langSelector.url;
        langLink.innerHTML = `<span class="image fit thumb">${langSelector.text}</span>`;
        experienceSection.appendChild(langLink);
        
        // Add spacing
        const spacing = document.createElement('br');
        experienceSection.appendChild(spacing);
    }

    /**
     * Render the footer section
     */
    renderFooter() {
        const footer = document.getElementById('footer');
        if (!footer) return;
        
        const socialIcons = footer.querySelector('ul.icons');
        if (socialIcons) {
            socialIcons.innerHTML = this.renderSocialLinks();
        }
    }
}

// Initialize the portfolio manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
}); 