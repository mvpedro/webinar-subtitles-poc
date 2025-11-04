# Setup Instructions

This document provides step-by-step instructions to set up and run the Multilingual Subtitle Publisher application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud Console account (for OAuth)
- AWS account (for backend services)

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:

- `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `YOUTUBE_CLIENT_ID` & `YOUTUBE_CLIENT_SECRET`: From Google Cloud Console (YouTube API)
- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: Your AWS credentials
- `AWS_S3_BUCKET_NAME`: Your S3 bucket name
- `API_GATEWAY_ENDPOINT`: Your AWS API Gateway endpoint (set up in Week 1)
- `DYNAMODB_TABLE_NAME`: Your DynamoDB table name

3. **Set up Google OAuth:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Configure OAuth consent screen:
     - Go to "APIs & Services" → "OAuth consent screen"
     - Choose "External" (unless you have Google Workspace)
     - Fill in app name, user support email, developer email
     - Add scopes: `email`, `profile`, `openid`
     - Add test users if needed (for development)
   - Create OAuth 2.0 credentials:
     - Go to "APIs & Services" → "Credentials"
     - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
     - Select "Web application"
     - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
     - Click "Create"
   - Copy the Client ID and Client Secret

4. **Set up YouTube API:**

   - In Google Cloud Console, enable YouTube Data API v3
   - Create OAuth 2.0 credentials for YouTube
   - Add authorized redirect URI: `http://localhost:3000/api/youtube/callback`
   - Add scopes: `https://www.googleapis.com/auth/youtube.upload` and `https://www.googleapis.com/auth/youtube`

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Plan

### Week 1: Infrastructure Setup
- ✅ Front-end auth (NextAuth.js with Google OAuth)
- ⏳ AWS Infrastructure (S3, DynamoDB, API Gateway, Lambda skeletons)

### Week 2: Video Upload Flow
- ⏳ Build video upload flow from UI to S3
- ⏳ Trigger Lambda for AWS Transcribe on S3 put event

### Week 3: Subtitle Translation
- ⏳ Implement subtitle translation
- ⏳ Store translated SRTs to S3

### Week 4: YouTube Integration
- ⏳ Integrate YouTube API: upload video, attach subtitles
- ⏳ Handle webhook consumption and record results

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth.js configuration
│   │   ├── upload/                 # Video upload endpoint
│   │   ├── jobs/                   # Job status endpoint
│   │   ├── youtube/                # YouTube OAuth endpoints
│   │   └── webhook/youtube/        # YouTube webhook handler
│   ├── dashboard/                  # Dashboard page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── globals.css                 # Global styles
├── components/
│   ├── VideoUpload.tsx             # Video upload component
│   └── UploadHistory.tsx           # Upload history component
├── types/
│   └── index.ts                    # Shared TypeScript types
└── package.json
```

## Next Steps

1. Set up AWS infrastructure (S3 bucket, DynamoDB table, API Gateway, Lambda functions)
2. Implement Lambda functions for:
   - Upload handler (receives video from API Gateway)
   - Transcribe trigger (triggered by S3 put event)
   - Subtitle translator (translates SRT files)
   - YouTube uploader (uploads video and subtitles)
3. Configure webhook endpoint for YouTube PubSub notifications
4. Test the complete flow end-to-end

