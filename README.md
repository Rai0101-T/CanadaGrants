
# Canadian Grant Finder

A comprehensive Canadian grant discovery platform that simplifies and personalizes government funding opportunity searches through advanced AI and intelligent matching technologies.

## Overview

Canadian Grant Finder helps businesses and entrepreneurs easily discover grants, loans, tax credits, and other funding opportunities across federal, provincial, and private sources in Canada. The platform features a Netflix-inspired design with intuitive navigation and personalized recommendations based on business profiles.

## Key Features

- **Comprehensive Grant Database**: Access to over 250 unique grants across federal, provincial, and private funding sources
- **AI-Powered Grant Matching**: Compatibility scores based on business profiles to find the most relevant opportunities
- **GrantScribe Assistance**: AI service for application assistance, plagiarism checking, and idea generation that leverages user business profiles
- **Dynamic Filtering**: Toggle filters for Featured, Federal, and Provincial grants by type, industry, or region
- **Personalized "My List"**: Save and organize grants for future reference with application status tracking
- **Multi-criteria Search**: Find grants based on location, industry, funding amount, and more
- **Automated Grant Updating**: Weekly background scraping to ensure all information is current
- **Contextually Relevant Images**: Each grant features a unique, industry-appropriate image to enhance recognition

## Technical Stack

### Frontend
- TypeScript React for UI components
- Tailwind CSS with shadcn/ui for Netflix-inspired UI
- TanStack Query (React Query) for data fetching and state management
- React Hook Form with Zod validation for form handling
- Wouter for lightweight client-side routing
- Responsive layouts for mobile, tablet, and desktop viewing

### Backend
- Node.js/Express with TypeScript for the API server
- PostgreSQL with Drizzle ORM for database operations
- Passport.js for authentication and session management
- OpenAI GPT-4o integration for AI-powered features
- Puppeteer for automated web scraping 
- Node-cron for scheduled background tasks

### Infrastructure
- Robust error handling with fallback mechanisms
- Database backup and migration tools
- Automated grant updating through web scraping
- Image optimization and classification system
- Protected routes with authentication middleware

## Grant Categories

The platform organizes grants into three main categories:

1. **Federal Grants**: Programs offered by the Government of Canada and federal agencies
2. **Provincial Grants**: Programs specific to each Canadian province and territory
3. **Private Grants**: Corporate and foundation funding opportunities from private organizations

## Project Structure

The project is organized into the following directory structure:

```
canadian-grant-finder/
├── assets/                     # Static assets and resources
│   ├── images/                 # Image assets for the application
│   └── documents/              # Documentation and reference materials
├── backups/                    # Backup versions of important files
├── client/                     # Frontend code
│   └── src/
│       ├── components/         # React components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Utility libraries
│       └── pages/              # Page components
├── data/                       # Data-related files
│   ├── raw_data/               # Raw data from scrapers
│   └── temp/                   # Temporary data storage
├── docs/                       # Project documentation
│   ├── api/                    # API documentation
│   └── development-guide/      # Development guides and standards
├── scripts/                    # Utility scripts
│   ├── data_validation/        # Scripts for validating grant data
│   ├── grant_data_import/      # Scripts for importing grant data
│   └── grant_image_management/ # Scripts for managing grant images
├── server/                     # Backend code
│   ├── scrapers/               # Web scrapers for grant data
│   └── services/               # Server-side services
└── shared/                     # Shared code between client and server
    └── schema.ts               # Database schema definitions
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- OpenAI API key for AI features

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/canadian-grant-finder.git
cd canadian-grant-finder
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables by creating a `.env` file with:
```
DATABASE_URL=postgresql://username:password@localhost:5432/grant_finder_db
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_secure_session_secret
```

4. Run the database migrations
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

## Key Features in Detail

### Dynamic Grant Filtering 
The application features toggle buttons that enable users to filter:
- Featured grants by Federal/Provincial type
- Federal grants by Industry or Region
- Provincial grants by Industry or Province

### GrantScribe AI Assistant
The GrantScribe feature offers three specialized tools:
1. **Application Assistant**: Analyzes grant application drafts and provides personalized feedback based on business profiles
2. **Plagiarism Checker**: Examines text for potential plagiarism with robust detection that works even when AI services are unavailable
3. **Idea Generator**: Creates personalized project ideas for grant applications using business profile information

### Business Profile Integration
User business profiles are deeply integrated throughout the platform:
- Grant compatibility scores are calculated based on business details
- Grant recommendations are personalized to industry and region
- GrantScribe tools tailor suggestions to the specific business context

## Administration

The platform includes administrative tools for:
- Adding new grants through the admin interface
- Updating grant information and images
- Managing user accounts and permissions
- Running and scheduling scrapers for fresh data
- Validating and optimizing grant images for relevancy

## Recent Updates

### April 2025 Updates
- **Fixed GrantScribe Features**: Enhanced idea generator and application assistant to incorporate business profile information for more personalized suggestions
- **Improved Plagiarism Checker**: Implemented robust analysis that works reliably with direct text processing
- **Enhanced Image Relevance**: Updated images for grants to ensure contextual relevance, particularly for specialized grants like the "Indigenous Skills and Employment Training Program"
- **Implemented Toggle Filtering**: Added intuitive toggle buttons to filter grants by type, industry, region, or province
- **Added Fallback Mechanisms**: Ensured all AI-powered features have reliable fallbacks for uninterrupted service
- **Optimized Database Queries**: Improved performance for faster grant discovery and matching

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
