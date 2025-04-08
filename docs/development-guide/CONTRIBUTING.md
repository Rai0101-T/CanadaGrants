# Contributing to Canadian Grant Finder

Thank you for considering contributing to the Canadian Grant Finder project! This document provides guidelines and best practices for contributing to this project.

## Development Workflow

1. **Setup your development environment** as described in the main README
2. **Create a feature branch** for your changes
3. **Make your changes** following the coding standards below
4. **Test your changes** thoroughly
5. **Submit a pull request** with a clear description of your changes

## Directory Structure

Please maintain the project's directory structure as outlined in the README.md file. Place new files in the appropriate directories:

- Frontend components go in `client/src/components/`
- New pages go in `client/src/pages/`
- Backend routes go in `server/routes.ts`
- Database schema changes go in `shared/schema.ts`

## Coding Standards

### Frontend

- Use TypeScript for all React components
- Follow the component structure used throughout the project
- Use shadcn/ui components when possible
- Use React Query for data fetching
- Implement proper loading and error states
- Maintain the Netflix-inspired design theme

### Backend

- Use TypeScript for all server-side code
- Follow the RESTful API pattern for endpoints
- Use the storage interface for database operations
- Include proper error handling

### Database

- Add new models to `shared/schema.ts`
- Create appropriate insert schemas using `createInsertSchema`
- Define proper relations between models
- Always use migrations for schema changes

## Working with Grants

### Adding New Grants

To add new grants to the database:

1. Create a script in `scripts/grant_data_import/` following existing patterns
2. Ensure that grant data includes all required fields
3. Include proper image URLs for grants
4. Validate grant data before adding to the database

### Grant Data Validation

Scripts for validating grant data are located in `scripts/data_validation/`. Use these to:

- Check for duplicate grants
- Verify grant images
- Ensure data consistency

## Working with Images

- Ensure all grants have unique, contextually relevant images
- Avoid using generic placeholders
- Scripts for managing grant images are in `scripts/grant_image_management/`

## Running Scrapers

To run grant data scrapers:

1. Use the admin interface at `/admin/scraper`
2. Or run scrapers directly via scripts

## Questions?

If you have questions about contributing, please contact the project maintainers.