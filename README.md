### Product Requirements Document (PRD)

**Product Name:** Multilingual Subtitle Publisher
**Platform:** Next.js front-end, AWS backend (JavaScript Lambdas)

---

#### 1. Objective

Enable users to upload a video, generate subtitles in multiple languages using AWS services, and publish video and subtitles automatically to YouTube as *unlisted*, with confirmation via webhook.

---

#### 2. High-Level Flow

1. User logs into front-end (protected by auth).
2. User uploads a video via web UI.
3. Video saved to Amazon S3.
4. S3 upload triggers AWS Transcribe job for English subtitles.
5. Generate EN subtitles (SRT) via Transcribe.
6. Translate SRT subtitle file into:

   * Brazilian Portuguese (pt-BR)
   * Spanish (es)
7. Store translated SRTs back to S3.
8. Upload video file from S3 to YouTube:

   * Publish as *unlisted*
   * Attach both subtitle tracks
9. YouTube sends webhook confirming video status.
10. App listens to YouTube webhook and records status in DB.

---

#### 3. Functional Requirements

##### Front-end (Next.js)

* File upload UI
* OAuth2 login (Google Login)
* YouTube account linking via OAuth
* Progress/status display
* Basic dashboard (list history)

##### Backend (AWS)

* **S3 Bucket**

  * Stores raw videos and generated captions
* **Lambda: Upload Handler**

  * Triggered by API to save video to S3
* **Lambda: Transcribe Trigger**

  * Triggered by S3 `put` event
* **Transcribe Job**

  * Outputs SRT for English
* **Lambda: Subtitle Translator**

  * Translating .srt using AWS Translate
* **Lambda: YouTube Uploader**

  * Uploads video + subtitles via YouTube API
* **REST API Gateway**

  * Interfaces Next.js with Lambda
* **DynamoDB**

  * Store metadata (videoId, status, timestamps, etc.)
* **Webhook Endpoint**

  * Exposes URL for YouTube PubSub push notification

##### Authentication

* Use NextAuth.js with Google Provider
* Token-based API auth between front-end and backend

---

#### 4. Non-Functional Requirements

* Video max size: 2GB
* Subtitle accuracy depends on AWS Transcribe
* Time to publish depends on video size and AWS job durations
* Secure handling of OAuth tokens via AWS Secrets Manager

---

#### 5. Tech Stack Summary

| Component       | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | Next.js + TailwindCSS          |
| Auth            | NextAuth.js (Google OAuth)     |
| Backend runtime | AWS Lambda (Node.js)           |
| File Storage    | Amazon S3                      |
| Subtitles       | AWS Transcribe + AWS Translate |
| Database        | DynamoDB                       |
| Video Publisher | YouTube Data API v3            |

---

#### 6. Feature Breakdown & Prioritization

| Priority | Feature                | Description                                        |
| -------- | ---------------------- | -------------------------------------------------- |
| P0       | Auth                   | Basic Google OAuth login + YouTube account linking |
| P0       | Video Upload           | Upload video to S3 via front-end                   |
| P0       | Transcribe Integration | Generate EN subtitles (SRT)                        |
| P1       | Subtitle Translation   | Translate EN SRT to pt-BR and es                   |
| P1       | YouTube Uploader       | Upload video and attach subtitles                  |
| P2       | Webhook Listener       | Track upload status from YouTube                   |
| P2       | Dashboard              | View past upload jobs/status                       |

---

#### 7. Development Plan

1. **Week 1**:
   Set up infrastructure (S3, DynamoDB, API Gateway, Lambda skeletons)
   Implement front-end auth

2. **Week 2**:
   Build video upload flow from UI to S3
   Trigger lambda for AWS Transcribe on S3 put event

3. **Week 3**:
   Implement subtitle translation
   Store translated SRTs to S3

4. **Week 4**:
   Integrate YouTube API: upload video, attach subtitles
   Handle webhook consumption and record results

5. **Final Polishing**:
   Dashboards, cleanup, logs, testing, deployment automation

---

#### 8. AWS Cost Considerations (Rough)

* S3 storage
* Transcribe per video (English)
* Translate per character for subtitle conversion
* Lambda compute time
* DynamoDB read/write units
  Suitable for low to moderate workloads; scalable as needed.

---
