# Full Stack AI Career Coach with Next JS, Neon DB, Tailwind, Prisma, Inngest, Shadcn UI Tutorial 🔥🔥
## https://youtu.be/UbXpRv5ApKA

![sensai](https://github.com/user-attachments/assets/eee79242-4056-4d19-b655-2873788979e1)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- A Neon Database account
- A Clerk account
- A Google Cloud account (for Gemini API)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-career-coach.git
cd ai-career-coach
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up your environment variables**
Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🔑 API Configuration

### 1. Neon Database Setup
1. Create an account at [Neon](https://neon.tech)
2. Create a new project
3. Get your connection string from the project dashboard
4. Add it to your `.env` file as `DATABASE_URL`

### 2. Clerk Authentication Setup
1. Create an account at [Clerk](https://clerk.dev)
2. Create a new application
3. Get your API keys from the dashboard
4. Add them to your `.env` file:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 3. Google Gemini API Setup
1. Create a Google Cloud account
2. Enable the Gemini API
3. Create API credentials
4. Get your API key and add it to `.env` as `GEMINI_API_KEY`

## 🛠️ Tech Stack
- Next.js - React framework
- Neon DB - Serverless Postgres database
- Prisma - ORM
- Tailwind CSS - Styling
- Shadcn UI - Component library
- Inngest - Background job processing
- Clerk - Authentication
- Google Gemini - AI capabilities

## 🎯 Project Overview

### What is AI Career Coach?
AI Career Coach is a full-stack application designed to help users navigate their career development journey with the assistance of artificial intelligence. The platform provides personalized career guidance, skill assessment, and professional development recommendations.

### Key Features

#### 1. User Authentication & Profile Management
- Secure sign-up and login using Clerk authentication
- Customizable user profiles
- Career history and skill tracking

#### 2. AI-Powered Career Guidance
- Personalized career path recommendations using Google's Gemini AI
- Skill gap analysis
- Industry trend insights
- Career transition suggestions

#### 3. Interactive Dashboard
- Career progress tracking
- Skill development timeline
- Goal setting and achievement tracking
- Personalized learning recommendations

#### 4. Professional Development Tools
- Resume builder and analyzer
- Interview preparation assistance
- Networking strategy recommendations
- Job market insights

### Technical Architecture
- **Frontend**: Built with Next.js and Shadcn UI components for a modern, responsive interface
- **Backend**: Serverless architecture with Next.js API routes
- **Database**: Neon DB for scalable, serverless PostgreSQL database
- **Authentication**: Clerk for secure user management
- **AI Integration**: Google Gemini API for intelligent career recommendations
- **Background Jobs**: Inngest for handling asynchronous tasks
- **Styling**: Tailwind CSS for consistent and maintainable styling

### Project Structure
```
ai-career-coach/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication pages
│   └── (dashboard)/    # Dashboard and main application pages
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
├── prisma/            # Database schema and migrations
└── public/            # Static assets
```

### Contributing
We welcome contributions to the project! If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of your changes

### License
This project is licensed under the MIT License - see the LICENSE file for details.
