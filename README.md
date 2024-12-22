# Static Site with Dynamic Data Loading

This project demonstrates a static website that dynamically loads data from GitHub releases. It uses GitHub Actions to automatically generate sample data, create releases, and deploy the site to GitHub Pages.

## Features

- Static site hosted on GitHub Pages
- Dynamic data loading from GitHub releases
- Automated data generation and deployment pipeline
- Sample data generation with 1000 random entries

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Kreijstal/github-pages-test.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate sample data:
   ```bash
   npm run generate
   ```

4. Build the site:
   ```bash
   npm run build
   ```

## How It Works

- GitHub Actions workflow triggers on push to main branch
- Generates sample data and creates a zip file
- Creates a new GitHub release with the data
- Deploys the static site to GitHub Pages
- Frontend JavaScript fetches and displays the latest data

## Development

The project structure:
- `src/` - Contains the website source files
- `scripts/` - Contains data generation scripts
- `.github/workflows/` - Contains GitHub Actions workflow
