
# Civic Incident Dashboard Template
BUS5001 – Cloud Platforms & Analytics

This is a minimal starting template for the dashboard component of Assessment 1.

Your dashboard should display:

- Key metrics
- A chart summarising incidents
- A table of recent records

The dashboard reads a curated JSON file produced by your cloud workflow.

## Expected data file

Location:

data/summary.json

This file should be produced by your Logic App or processing workflow.

## Running locally

You can open `index.html` directly in a browser.

If fetch errors occur, run a simple local server:

python -m http.server

Then visit:

http://localhost:8000

## Deployment

Your final solution should be deployed to:

Azure Static Website Hosting or Azure Static Web Apps.

## Important

This template is intentionally minimal.

You are expected to:

- modify the layout
- add your own improvements
- explain the design in your report
