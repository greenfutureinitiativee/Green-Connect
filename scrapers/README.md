# Green Connect Scraper System

This directory contains the scraping pipeline for Green Connect.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    Create a `.env` file in this directory or the root with:
    ```
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ```

3.  **Playwright**:
    Install Playwright browsers:
    ```bash
    playwright install chromium
    ```

## Running the Scraper

Run the orchestrator to start the scraping process:

```bash
python orchestrator.py
```

## Structure

-   `orchestrator.py`: Main entry point. Manages the scraping jobs.
-   `writer.py`: Handles database interactions (Supabase).
-   `workers/fetcher.py`: Handles HTTP requests and browser interactions using Playwright.
-   `workers/html_parsers/`: Contains parser logic for specific websites.

## Adding a New Source

1.  Add a new parser in `workers/html_parsers/`.
2.  Update `SOURCES` list in `orchestrator.py` with the new source configuration.
