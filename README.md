# Canadian Grant Finder

A comprehensive Canadian grant discovery platform that simplifies and personalizes government funding opportunity searches through advanced AI and intelligent matching technologies.

## Overview

Canadian Grant Finder helps businesses and entrepreneurs easily discover grants, loans, tax credits, and other funding opportunities across federal, provincial, and private sources in Canada. The platform features a Netflix-inspired design with intuitive navigation and personalized recommendations based on business profiles.

## Key Features

- **Comprehensive Grant Database**: Access to over 250 unique grants across federal, provincial, and private funding sources
- **AI-Powered Grant Matching**: Compatibility scores based on business profiles to find the most relevant opportunities
- **GrantScribe Assistance**: AI service for application assistance, plagiarism checking, and idea generation
- **Industry Filtering**: Browse grants by specific industries and sectors
- **Personalized "My List"**: Save and organize grants for future reference
- **Multi-criteria Search**: Find grants based on location, industry, funding amount, and more
- **Automated Grant Updating**: Weekly background scraping to ensure all information is current

## Technical Stack

### Frontend
- TypeScript React
- Tailwind CSS with shadcn/ui components
- React Query for data fetching
- React Hook Form for form handling
- Wouter for client-side routing

### Backend
- Node.js/Express
- PostgreSQL with Drizzle ORM
- Passport.js for authentication
- OpenAI API integration for grant recommendations and GrantScribe
- Node-cron for scheduled background tasks

### Infrastructure
- Database backup and migration tools
- Automated web scraping infrastructure
- Image optimization and diversification system

## Grant Categories

The platform organizes grants into three main categories:

1. **Federal Grants**: Programs offered by the Government of Canada and federal agencies
2. **Provincial Grants**: Programs specific to each Canadian province and territory
3. **Private Grants**: Corporate and foundation funding opportunities from private organizations

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
```

4. Run the database migrations
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

## Administration

The platform includes administrative tools for:
- Adding new grants
- Updating grant information
- Managing user accounts
- Running and scheduling scrapers
- Checking and optimizing grant images

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
