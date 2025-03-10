# João Milone Portfolio

A data-driven portfolio website for João Milone, a Senior Game Engineer specializing in Unity and Unreal Engine.

## Features

- **Data-Driven Architecture**: All content is stored in JSON files, making it easy to update and maintain.
- **Multi-language Support**: Seamlessly switch between English and Portuguese using URL parameters.
- **Automatic Language Detection**: Automatically detects the user's preferred language based on browser settings.
- **Responsive Design**: Works on all devices, from mobile to desktop.
- **Dynamic Content Rendering**: Content is rendered dynamically using JavaScript.

## Structure

- `index.html`: Main entry point for the website, handles both English and Portuguese versions
- `data/`: Contains JSON files with all the content
  - `portfolio.json`: English content
  - `portfolio_pt.json`: Portuguese content
- `assets/`: Contains CSS, JavaScript, and other assets
  - `js/portfolio.js`: Main JavaScript file for rendering the portfolio
- `images/`: Contains all images used in the portfolio
- `debug.html`: Debug panel for testing the portfolio

## How to Update

### Updating Content

To update the content of the portfolio, simply edit the JSON files in the `data/` directory:

1. For English content, edit `data/portfolio.json`
2. For Portuguese content, edit `data/portfolio_pt.json`

### Adding a New Project

To add a new project, add a new object to the `projects` array in both JSON files:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "image": "image-filename-without-extension",
  "links": [
    {
      "text": "Link Text",
      "url": "https://link-url.com"
    }
  ]
}
```

### Adding a New Experience

To add a new experience, add a new object to the `experience` array in both JSON files:

```json
{
  "company": "Company Name",
  "url": "https://company-website.com",
  "title": "Job Title",
  "period": "Start Date - End Date",
  "location": "Location",
  "description": "Job description",
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ]
}
```

### Adding a New Language

To add support for a new language:

1. Create a new JSON file in the `data/` directory (e.g., `portfolio_fr.json` for French)
2. Copy the structure from an existing language file and translate all content
3. Add the language code to the `supportedLanguages` array in `assets/js/portfolio.js`

```javascript
this.supportedLanguages = ['en', 'pt', 'fr']; // Add your new language code here
```

## Language Switching

The portfolio supports automatic language detection based on the user's browser settings. It will:

1. First check if a language is specified in the URL parameter (`?lang=en` or `?lang=pt`)
2. If not, detect the user's preferred language from browser settings
3. If the detected language is supported, use it
4. Otherwise, fall back to English as the default

You can also manually switch languages using the language selector in the UI or by using URL parameters:

- For English: `index.html?lang=en`
- For Portuguese: `index.html?lang=pt`

## Deployment

This portfolio is designed to be hosted on GitHub Pages. To deploy:

1. Push the changes to your GitHub repository
2. Enable GitHub Pages in the repository settings
3. Select the branch you want to deploy (usually `main` or `master`)

## Credits

- Design based on the Strata template by [HTML5 UP](https://html5up.net/)
- Icons by [Font Awesome](https://fontawesome.com/) 