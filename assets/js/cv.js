/**
 * CV Page Manager
 * Loads portfolio data and renders a clean, ATS-friendly CV
 * with language toggle (EN/PT), version toggle (compact/full), and print-to-PDF
 */

class CVManager {
    constructor() {
        this.data = null;
        this.currentLanguage = 'en';
        this.currentVersion = 'full';
        this.supportedLanguages = ['en', 'pt'];

        /** Font size slider config: id suffix -> CSS custom property */
        this.fontSizeSliders = {
            'name':          { prop: '--fs-name',          defaultVal: 20 },
            'subtitle':      { prop: '--fs-subtitle',      defaultVal: 11 },
            'contact':       { prop: '--fs-contact',       defaultVal: 9.5 },
            'section-title': { prop: '--fs-section-title', defaultVal: 11 },
            'role':          { prop: '--fs-role',          defaultVal: 10 },
            'description':   { prop: '--fs-description',   defaultVal: 9.5 },
            'achievements':  { prop: '--fs-achievements',  defaultVal: 9 },
            'education':     { prop: '--fs-education',     defaultVal: 10 }
        };

        this.init();
    }

    /**
     * Initialize the CV manager
     */
    async init() {
        try {
            this.initializeLanguage();
            this.initializeVersion();
            await this.loadData();
            this.renderCV();
            this.initializeEventListeners();
        } catch (error) {
            console.error('Failed to initialize CV:', error);
        }
    }

    /**
     * Check URL params for initial language
     */
    initializeLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');

        if (langParam && this.supportedLanguages.includes(langParam)) {
            this.currentLanguage = langParam;
        }
    }

    /**
     * Check URL params for initial version
     */
    initializeVersion() {
        const urlParams = new URLSearchParams(window.location.search);
        const versionParam = urlParams.get('version');

        if (versionParam === 'compact' || versionParam === 'full') {
            this.currentVersion = versionParam;
        }
    }

    /**
     * Load portfolio data for current language
     */
    async loadData() {
        const dataFile = this.currentLanguage === 'pt'
            ? 'data/portfolio_pt.json'
            : 'data/portfolio.json';

        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`Failed to load ${dataFile}: ${response.status}`);
        }

        this.data = await response.json();
    }

    /**
     * Render the full CV based on current data and version
     */
    renderCV() {
        if (!this.data) return;

        this.renderHeader();
        this.renderAbout();
        this.renderExperience();
        this.renderSkills();
        this.renderEducation();
        this.updateToolbar();
        this.updatePageClass();
        this.updatePageTitle();
    }

    /**
     * Render CV header with name, title, and contact info
     */
    renderHeader() {
        const header = document.getElementById('cv-header');
        if (!header) return;

        const intro = this.data.intro;
        const social = this.data.social;

        const linkedIn = social.find(s => s.icon === 'fa-linkedin');
        const github = social.find(s => s.icon === 'fa-github');
        const email = social.find(s => s.icon === 'fa-envelope');

        const emailAddress = email ? email.url.replace('mailto: ', '').replace('mailto:', '') : '';
        const sep = '<span class="cv-contact-separator">|</span>';

        const contactParts = [];
        contactParts.push(intro.location);
        if (emailAddress) {
            contactParts.push(`<a href="mailto:${emailAddress}">${emailAddress}</a>`);
        }
        contactParts.push('<a href="https://playjoa.github.io">Portfolio</a>');
        if (github) {
            contactParts.push(`<a href="${github.url}">GitHub</a>`);
        }
        if (linkedIn) {
            contactParts.push(`<a href="${linkedIn.url}">LinkedIn</a>`);
        }

        header.innerHTML = `
            <h1 class="cv-name">${intro.name}</h1>
            <p class="cv-title">${intro.title}</p>
            <p class="cv-contact">${contactParts.join(sep)}</p>
        `;
    }

    /**
     * Render About Me section
     */
    renderAbout() {
        const section = document.getElementById('cv-about');
        if (!section) return;

        const aboutTitle = this.currentLanguage === 'pt' ? 'Sobre Mim' : 'About Me';
        let aboutText = this.getAboutText();

        section.innerHTML = `
            <h2 class="cv-section-title">${aboutTitle}</h2>
            <p class="cv-about-text">${aboutText}</p>
        `;
    }

    /**
     * Get about text sized appropriately for the current CV version.
     * Full version: first 4 sentences. Compact: first 2 sentences.
     */
    getAboutText() {
        const content = this.data.about.content;
        const sentences = content.split('. ');
        const limit = this.currentVersion === 'compact' ? 2 : 4;

        if (sentences.length > limit) {
            return sentences.slice(0, limit).join('. ') + '.';
        }
        return content;
    }

    /**
     * Render Work Experience section
     */
    renderExperience() {
        const section = document.getElementById('cv-experience');
        if (!section || !this.data.experience) return;

        const expTitle = this.currentLanguage === 'pt' ? 'Experiencia Profissional' : 'Work Experience';
        const isCompact = this.currentVersion === 'compact';

        const experienceHTML = this.data.experience.map(exp => {
            const companyLink = exp.url
                ? `<a href="${exp.url}">${exp.company}</a>`
                : exp.company;

            // Strip HTML tags from description for clean CV text
            const cleanDescription = this.stripHtmlTags(exp.description);

            let achievementsHTML = '';
            if (!isCompact && exp.achievements && exp.achievements.length > 0) {
                const items = exp.achievements
                    .map(a => `<li>${this.stripHtmlTags(a)}</li>`)
                    .join('');
                achievementsHTML = `<ul class="cv-exp-achievements">${items}</ul>`;
            }

            return `
                <div class="cv-exp-item">
                    <div class="cv-exp-header">
                        <span class="cv-exp-role">${exp.title} - <span class="cv-exp-company">${companyLink}</span></span>
                        <span class="cv-exp-meta">${exp.period}, ${exp.location}</span>
                    </div>
                    <p class="cv-exp-description">${cleanDescription}</p>
                    ${achievementsHTML}
                </div>
            `;
        }).join('');

        section.innerHTML = `
            <h2 class="cv-section-title">${expTitle}</h2>
            ${experienceHTML}
        `;
    }

    /**
     * Render Skills section (full version only)
     */
    renderSkills() {
        const section = document.getElementById('cv-skills');
        if (!section || !this.data.skills) return;

        if (this.currentVersion === 'compact') {
            section.innerHTML = '';
            section.style.display = 'none';
            return;
        }

        section.style.display = '';
        const skillsTitle = this.currentLanguage === 'pt' ? 'Habilidades' : 'Skills';

        // One line per category keeps the CV dense, keyword-rich and ATS-friendly.
        // Falls back to a flat pipe-joined list if data still uses the old {name} format.
        const groups = this.data.skills.filter(s => s.items && s.items.length > 0);

        const skillsHTML = groups.length > 0
            ? groups.map(group => `
                <p class="cv-skills-line">
                    <strong class="cv-skills-category">${group.category}:</strong> ${group.items.join(', ')}
                </p>
              `).join('')
            : `<p class="cv-skills-list">${this.data.skills.map(s => s.name).join(' | ')}</p>`;

        section.innerHTML = `
            <h2 class="cv-section-title">${skillsTitle}</h2>
            ${skillsHTML}
        `;
    }

    /**
     * Render Education section
     */
    renderEducation() {
        const section = document.getElementById('cv-education');
        if (!section || !this.data.education) return;

        const eduTitle = this.currentLanguage === 'pt' ? 'Educacao' : 'Education';

        const educationHTML = this.data.education.map(edu => {
            const institutionLink = edu.url
                ? `<a href="${edu.url}">${edu.institution}</a>`
                : edu.institution;

            const locationText = edu.location ? `, ${edu.location}` : '';

            return `
                <div class="cv-edu-item">
                    <div class="cv-edu-header">
                        <span class="cv-edu-institution">${institutionLink}</span>
                        <span class="cv-edu-meta">${edu.period}${locationText}</span>
                    </div>
                    <span class="cv-edu-degree">${edu.degree}</span>
                </div>
            `;
        }).join('');

        section.innerHTML = `
            <h2 class="cv-section-title">${eduTitle}</h2>
            ${educationHTML}
        `;
    }

    /**
     * Update toolbar button labels based on current state
     */
    updateToolbar() {
        const languageLabel = document.getElementById('language-label');
        const versionLabel = document.getElementById('version-label');
        const toolbarLabel = document.getElementById('toolbar-label');

        if (languageLabel) {
            languageLabel.textContent = this.currentLanguage === 'en' ? 'PT-BR' : 'EN';
        }

        if (versionLabel) {
            if (this.currentLanguage === 'pt') {
                versionLabel.textContent = this.currentVersion === 'full' ? 'Compacto' : 'Completo';
            } else {
                versionLabel.textContent = this.currentVersion === 'full' ? 'Compact' : 'Full';
            }
        }

        if (toolbarLabel) {
            toolbarLabel.textContent = this.currentLanguage === 'pt' ? 'Visualizar CV' : 'CV Preview';
        }

        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.textContent = this.currentLanguage === 'pt' ? 'Baixar PDF' : 'Download PDF';
        }

        const backLink = document.querySelector('.toolbar-back');
        if (backLink) {
            const langParam = this.currentLanguage === 'pt' ? '?lang=pt' : '';
            backLink.href = `index.html${langParam}`;
        }
    }

    /**
     * Add or remove the compact class on the CV page
     */
    updatePageClass() {
        const page = document.getElementById('cv-page');
        if (page) {
            if (this.currentVersion === 'compact') {
                page.classList.add('compact');
            } else {
                page.classList.remove('compact');
            }
        }
    }

    /**
     * Update the page title based on language
     */
    updatePageTitle() {
        const name = this.data.intro.name;
        const label = this.currentLanguage === 'pt' ? 'CV' : 'CV';
        document.title = `${label} - ${name}`;
    }

    /**
     * Update URL params without reloading
     */
    updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLanguage);
        url.searchParams.set('version', this.currentVersion);
        window.history.replaceState({}, '', url);
    }

    /**
     * Initialize event listeners for toolbar buttons and settings sliders
     */
    initializeEventListeners() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }

        const versionToggle = document.getElementById('version-toggle');
        if (versionToggle) {
            versionToggle.addEventListener('click', () => this.toggleVersion());
        }

        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPDF());
        }

        // Settings panel toggle
        const settingsToggle = document.getElementById('settings-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => this.toggleSettings());
        }

        // Settings reset
        const settingsReset = document.getElementById('settings-reset');
        if (settingsReset) {
            settingsReset.addEventListener('click', () => this.resetFontSizes());
        }

        // Font size sliders
        this.initializeFontSizeSliders();
    }

    /**
     * Toggle the settings panel visibility
     */
    toggleSettings() {
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    /**
     * Initialize all font size slider listeners and load saved values
     */
    initializeFontSizeSliders() {
        const cvPage = document.getElementById('cv-page');
        if (!cvPage) return;

        for (const [key, config] of Object.entries(this.fontSizeSliders)) {
            const slider = document.getElementById(`size-${key}`);
            const valueDisplay = document.getElementById(`val-${key}`);
            if (!slider || !valueDisplay) continue;

            // Load saved value or use default
            const saved = localStorage.getItem(`cv-fs-${key}`);
            const value = saved !== null ? parseFloat(saved) : config.defaultVal;

            slider.value = value;
            valueDisplay.textContent = value;
            cvPage.style.setProperty(config.prop, `${value}px`);

            // Listen for changes
            slider.addEventListener('input', () => {
                const newValue = parseFloat(slider.value);
                valueDisplay.textContent = newValue;
                cvPage.style.setProperty(config.prop, `${newValue}px`);
                localStorage.setItem(`cv-fs-${key}`, newValue);
            });
        }
    }

    /**
     * Reset all font sizes to defaults
     */
    resetFontSizes() {
        const cvPage = document.getElementById('cv-page');
        if (!cvPage) return;

        for (const [key, config] of Object.entries(this.fontSizeSliders)) {
            const slider = document.getElementById(`size-${key}`);
            const valueDisplay = document.getElementById(`val-${key}`);
            if (!slider || !valueDisplay) continue;

            slider.value = config.defaultVal;
            valueDisplay.textContent = config.defaultVal;
            cvPage.style.setProperty(config.prop, `${config.defaultVal}px`);
            localStorage.removeItem(`cv-fs-${key}`);
        }
    }

    /**
     * Toggle between English and Portuguese
     */
    async toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'pt' : 'en';
        await this.loadData();
        this.renderCV();
        this.updateURL();
    }

    /**
     * Toggle between compact and full CV versions
     */
    toggleVersion() {
        this.currentVersion = this.currentVersion === 'full' ? 'compact' : 'full';
        this.renderCV();
        this.updateURL();
    }

    /**
     * Trigger the browser print dialog for PDF download
     */
    downloadPDF() {
        window.print();
    }

    /**
     * Strip HTML tags from a string for clean CV text
     */
    stripHtmlTags(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cvManager = new CVManager();
});
