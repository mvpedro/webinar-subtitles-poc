# Secrets Setup Guide

This guide walks you through obtaining each secret required for the Multilingual Subtitle Publisher application.

## Required Secrets Overview

The application requires the following secrets:

1. **NextAuth Secrets** (2)
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

2. **Google OAuth Secrets** (2)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

3. **YouTube OAuth Secrets** (2)
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`

4. **AWS Secrets** (5)
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `API_GATEWAY_ENDPOINT`
   - `DYNAMODB_TABLE_NAME`

---

## 1. NextAuth Secrets

### NEXTAUTH_URL

**Value:** Your application's base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.com`

**How to get:** Just set this to your application URL.

### NEXTAUTH_SECRET

**How to generate:**

```bash
openssl rand -base64 32
```

Copy the output and use it as the value. This is a random secret used to encrypt JWT tokens.

---

## 2. Google OAuth Secrets (for User Authentication)

### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

**Note:** For basic Google OAuth authentication (sign-in), you do **NOT** need to enable any Google APIs. Google OAuth uses the standard OAuth 2.0 flow which only requires configuring the OAuth consent screen and creating OAuth credentials. The deprecated Google+ API (shut down in 2019) is not needed and should not be used.

**Steps to obtain:**

1. **Go to Google Cloud Console:**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create or select a project:**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name (e.g., "Subtitle Publisher")

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace account)
   - Fill in:
     - App name: (e.g., "Subtitle Publisher")
     - User support email: Your email
     - Developer contact information: Your email
   - Click "Save and Continue"
   - On "Scopes" page, click "Add or Remove Scopes"
   - Add these scopes: `email`, `profile`, `openid`
   - Click "Update" then "Save and Continue"
   - Add test users if needed (for development/testing)
   - Click "Save and Continue" through the rest

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Select "Web application"
   - Name it (e.g., "Subtitle Publisher Web Client")
   - Under "Authorized redirect URIs", add:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"

5. **Copy the credentials:**
   - You'll see a popup with your `Client ID` and `Client secret`
   - Copy both values immediately (you won't see the secret again)

---

## 3. YouTube OAuth Secrets (for YouTube Upload)

### YOUTUBE_CLIENT_ID & YOUTUBE_CLIENT_SECRET

**Steps to obtain:**

1. **In the same Google Cloud project:**
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and click "Enable"

2. **Create OAuth 2.0 Credentials for YouTube:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Select "Web application"
   - Name it (e.g., "YouTube Upload Client")
   - Under "Authorized redirect URIs", add:
     ```
     http://localhost:3000/api/youtube/callback
     ```
   - Click "Create"

3. **Copy the credentials:**
   - Copy the `Client ID` and `Client secret`

**Note:** You can use the same OAuth credentials for both Google auth and YouTube if you prefer, but it's recommended to use separate ones for better security isolation.

---

## 4. AWS Secrets

### ⚠️ Important: Use IAM User, NOT Root Account

**NEVER use your AWS root account credentials in applications.** Always create an IAM user with the minimum required permissions.

### AWS_REGION

**Value:** Your preferred AWS region

- Examples: `us-east-1`, `us-west-2`, `eu-west-1`, `ap-southeast-1`
- Choose based on your location and service availability

**How to get:** Just set this to your preferred region.

### AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY

**Steps to create IAM user and credentials:**

1. **Sign in to AWS Console:**
   - Go to [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
   - Sign in with your root account (you'll use this only for admin tasks)

2. **Navigate to IAM:**
   - Search for "IAM" in the top search bar
   - Click on "IAM" service

3. **Create a new IAM user:**
   - Click "Users" in the left sidebar
   - Click "Create user"
   - Enter a username (e.g., `subtitle-publisher-app`)
   - Click "Next"

4. **Set permissions:**
   - Select "Attach policies directly"
   - Click "Create policy"
   - Switch to JSON tab and paste this policy (adjust as needed):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::YOUR-BUCKET-NAME/*",
           "arn:aws:s3:::YOUR-BUCKET-NAME"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "transcribe:StartTranscriptionJob",
           "transcribe:GetTranscriptionJob",
           "transcribe:ListTranscriptionJobs"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "translate:TranslateText"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:PutItem",
           "dynamodb:GetItem",
           "dynamodb:UpdateItem",
           "dynamodb:Query",
           "dynamodb:Scan"
         ],
         "Resource": "arn:aws:dynamodb:*:*:table/YOUR-TABLE-NAME"
       },
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue",
           "secretsmanager:DescribeSecret"
         ],
         "Resource": "arn:aws:secretsmanager:*:*:secret:youtube-oauth-*"
       }
     ]
   }
   ```
   - Replace `YOUR-BUCKET-NAME` and `YOUR-TABLE-NAME` with your actual resource names
   - Name the policy (e.g., "SubtitlePublisherAppPolicy")
   - Click "Create policy"
   - Go back to user creation, refresh, and attach the policy you just created

5. **Complete user creation:**
   - Click "Next" through tags (optional)
   - Review and click "Create user"

6. **Create access keys:**
   - Click on the newly created user
   - Go to "Security credentials" tab
   - Scroll to "Access keys" section
   - Click "Create access key"
   - Select "Application running outside AWS" (or "Local code" for development)
   - Click "Next", add description (optional), click "Create access key"
   - **IMPORTANT:** Copy both the `Access key ID` and `Secret access key` immediately
     - You won't be able to see the secret again
     - Store them securely (use a password manager)

7. **Secure your credentials:**
   - Never commit these to git
   - Use environment variables or AWS Secrets Manager
   - Rotate keys periodically

### AWS_S3_BUCKET_NAME

**Steps to create S3 bucket:**

1. **Go to S3 Console:**
   - Search for "S3" in AWS Console
   - Click on "S3" service

2. **Create bucket:**
   - Click "Create bucket"
   - Enter a unique bucket name (e.g., `subtitle-publisher-videos-123456`)
     - Must be globally unique across all AWS accounts
   - Select your region
   - Keep default settings or configure as needed:
     - Block public access: Keep enabled (recommended)
   - Click "Create bucket"

3. **Copy the bucket name:**
   - Use the exact bucket name as the value

### DYNAMODB_TABLE_NAME

**Steps to create DynamoDB table:**

1. **Go to DynamoDB Console:**
   - Search for "DynamoDB" in AWS Console
   - Click on "DynamoDB" service

2. **Create table:**
   - Click "Create table"
   - Table name: `webinar-subtitles-poc` (or your preferred name)
   - Partition key: `jobId` (type: String)
   - Leave sort key empty
   - Use default settings for now
   - Click "Create table"

3. **Copy the table name:**
   - Use the exact table name as the value

### API_GATEWAY_ENDPOINT

**Steps to create API Gateway:**

1. **Go to API Gateway Console:**
   - Search for "API Gateway" in AWS Console
   - Click on "API Gateway" service

2. **Create REST API:**
   - Click "Create API"
   - Choose "REST API" → "Build"
   - Name it (e.g., "SubtitlePublisherAPI")
   - Description: Optional
   - Endpoint type: Regional (or Edge if you prefer)
   - Click "Create API"

3. **Create resources and methods:**

   **Create `/upload` resource:**
   - In the left sidebar, click on your API (root resource `/`)
   - Click "Actions" → "Create Resource"
   - Resource Name: `upload`
   - Resource Path: `/upload` (auto-filled)
   - Enable "Enable API Gateway CORS" (we'll configure CORS later)
   - Click "Create Resource"
   
   **Create POST method for `/upload`:**
   - Select the `/upload` resource in the left sidebar
   - Click "Actions" → "Create Method"
   - Select `POST` from the dropdown
   - Click the checkmark ✓
   - Integration type: Choose "Lambda Function"
   - Check "Use Lambda Proxy integration" (important for passing headers)
   - Lambda Region: Select your region
   - Lambda Function: Select your upload handler Lambda (or choose "Create a Lambda function" if you haven't created it yet)
   - Click "Save"
   - If prompted, click "OK" to grant API Gateway permission to invoke the Lambda
   
   **Configure `/upload` method settings:**
   - Click on the `POST` method under `/upload`
   - In "Method Request":
     - Authorization: Select "NONE" (or configure AWS IAM/API Key if needed)
     - Request Headers: Click "Add header" and add:
       - `X-File-Name` (required: false)
       - `X-User-Id` (required: false)
       - `X-User-Email` (required: false)
     - Request Body: Click "Add model" or leave empty for binary content
   - In "Integration Request":
     - Integration type should show "Lambda Function" with Proxy integration enabled
     - Content Handling: "Passthrough" (for binary video files)
     - Mapping Templates: Not needed with Lambda Proxy integration
   - In "Method Response":
     - Expand "200" response
     - Click "Add Header" and add: `Content-Type`
     - Expand "400", "500" responses if needed
   
   **Create `/jobs` resource:**
   - Click on the root resource `/` in the left sidebar
   - Click "Actions" → "Create Resource"
   - Resource Name: `jobs`
   - Resource Path: `/jobs`
   - Enable "Enable API Gateway CORS"
   - Click "Create Resource"
   
   **Create GET method for `/jobs`:**
   - Select the `/jobs` resource in the left sidebar
   - Click "Actions" → "Create Method"
   - Select `GET` from the dropdown
   - Click the checkmark ✓
   - Integration type: Choose "Lambda Function"
   - Check "Use Lambda Proxy integration"
   - Lambda Region: Select your region
   - Lambda Function: Select your jobs handler Lambda (or create later)
   - Click "Save"
   - Click "OK" to grant permissions if prompted
   
   **Configure `/jobs` method settings:**
   - Click on the `GET` method under `/jobs`
   - In "Method Request":
     - Authorization: Select "NONE"
     - URL Query String Parameters: Click "Add query string"
       - Name: `userId` (required: false)
     - Request Headers: Click "Add header" and add:
       - `X-User-Id` (required: false)
   - In "Integration Request":
     - Integration type should show "Lambda Function" with Proxy integration
   - In "Method Response":
     - Expand "200" response
     - Click "Add Header" and add: `Content-Type`
   
   **Configure CORS (if not already enabled):**
   - Select the `/upload` resource
   - Click "Actions" → "Enable CORS"
   - Allow Origins: `*` (or your specific domain for production)
   - Allow Headers: `Content-Type,X-File-Name,X-User-Id,X-User-Email`
   - Allow Methods: `POST,OPTIONS`
   - Click "Enable CORS and replace existing CORS headers"
   - Repeat for `/jobs` resource with methods: `GET,OPTIONS`
   
   **Note:** Lambda functions will be created in Week 1. For now, you can:
   - Create placeholder Lambda functions, or
   - Skip Lambda selection and configure integrations later

4. **Deploy the API:**
   - Click "Actions" → "Deploy API"
   - Deployment stage: Create a new stage (e.g., `dev` or `prod`)
   - Stage description: Optional (e.g., "Development environment")
   - Click "Deploy"
   - After deployment, you'll see the API Gateway endpoint URL

5. **Copy the endpoint URL:**
   - The endpoint will look like:
     ```
     https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
     ```
   - Use this base URL as the value for `API_GATEWAY_ENDPOINT`
   - The full endpoint paths will be:
     - Upload: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/upload`
     - Jobs: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/jobs`

6. **Test the endpoints (optional):**
   - Select the `POST` method under `/upload`
   - Click "TEST" button
   - Method: `POST`
   - Headers: Add test headers:
     ```
     X-File-Name: test-video.mp4
     X-User-Id: test-user-123
     X-User-Email: test@example.com
     Content-Type: video/mp4
     ```
   - Request Body: Leave empty or add test data
   - Click "Test" to see the response
   - Repeat for `/jobs` GET method with query parameter `userId=test-user-123`
   
   **Note:** If Lambda functions aren't created yet, tests will fail with "Internal server error" - this is expected until you set up the Lambda functions.

---

## Security Best Practices

1. **Never use root AWS credentials** - Always use IAM users
2. **Use least privilege** - Only grant the minimum permissions needed
3. **Rotate credentials regularly** - Especially access keys
4. **Use AWS Secrets Manager** - For storing sensitive tokens (like YouTube OAuth tokens)
5. **Never commit secrets to git** - Use `.env` files (already in `.gitignore`)
6. **Use environment variables** - Never hardcode secrets in code
7. **Enable MFA** - For your AWS root account and IAM users
8. **Use separate OAuth clients** - For Google auth vs YouTube upload

---

## Environment Variables File Template

Create a `.env` file in the root of your project with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth (User Authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# YouTube OAuth (Video Upload)
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-iam-access-key-id
AWS_SECRET_ACCESS_KEY=your-iam-secret-access-key
AWS_S3_BUCKET_NAME=your-bucket-name
DYNAMODB_TABLE_NAME=your-table-name
API_GATEWAY_ENDPOINT=https://your-api-id.execute-api.region.amazonaws.com/stage
```

---

## Troubleshooting

### AWS Credentials Issues
- **Error: "Invalid credentials"** - Verify your IAM user has the correct permissions
- **Error: "Access denied"** - Check that the IAM policy includes all required actions
- **Error: "Bucket not found"** - Ensure the bucket name matches exactly

### Google OAuth Issues
- **Error: "redirect_uri_mismatch"** - Ensure redirect URIs match exactly in Google Console
- **Error: "invalid_client"** - Verify client ID and secret are correct

### NextAuth Issues
- **Error: "NEXTAUTH_SECRET is missing"** - Generate a new secret using openssl
- **Session issues** - Ensure NEXTAUTH_URL matches your actual application URL

### API Gateway Issues
- **Error: "Missing Authentication Token"** - Check that the endpoint URL is correct and includes the stage name (e.g., `/dev/upload`)
- **Error: "Internal server error"** - Lambda function may not be configured or may have errors. Check CloudWatch logs for Lambda function
- **Error: "CORS error"** - Ensure CORS is enabled for both resources and includes the correct headers
- **Error: "Method not allowed"** - Verify the HTTP method (POST for `/upload`, GET for `/jobs`) matches what you're calling
- **Headers not received in Lambda** - Ensure "Use Lambda Proxy integration" is checked for both methods
- **Binary data corrupted** - Verify "Content Handling" is set to "Passthrough" for the `/upload` POST method
- **Query parameters not received** - Ensure `userId` is added as a query string parameter in Method Request settings
- **Endpoint not accessible** - Make sure the API is deployed to a stage. Re-deploy after making changes

---

## Next Steps

After setting up all secrets:

1. Verify all environment variables are set correctly
2. Test Google OAuth login
3. Test YouTube OAuth connection
4. Test AWS S3 upload
5. Verify API Gateway is accessible
6. Check DynamoDB table is accessible

For more information, see `SETUP.md` for the complete setup instructions.

