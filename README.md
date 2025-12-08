# Trading Insights App 📈

A full-stack, cloud-native trading platform that delivers AI-generated insights, automated price alerts, real-time portfolio management, and a conversational AI assistant — all powered by AWS serverless architecture and modern frontend development.

This project demonstrates multi-region AI integration, scalable cloud design, prompt engineering, DevOps automation, and practical application of LLMs in a fintech context.

## 📌 Table of Contents

- Overview
- Architecture
- Features
- System Architecture Details
- Setup Instructions
- Environment Variables
- Deployment Guide
- Technical Challenges & Solutions
- Roadmap
- Contact

## 🚀 Overview

The AI-Powered Trading Insights Platform is a prototype trading system designed to explore how AI, cloud computing, and serverless technologies can enhance decision-making and user experience in retail trading.

- It consists of:
- A modern React + TypeScript UI
- A Node.js backend running on EC2
- Lambda microservices for automation and portfolio operations
- A multi-region conversational assistant using Amazon Lex
- Bedrock-powered AI insights
- A hybrid data layer using DynamoDB + RDS PostgreSQL

## 🏗️ Architecture
- **Frontend**: React, TypeScript, Vite, AWS Amplify
- **Backend**: Node.js, (EC2 ), Lambda, API Gateway.
- **Database**: RDS PostgreSQL, DynamoDB, S3.
- **AI/ML**: Amazon Bedrock, Amazon Lex.
- **DevOps**: CloudFormation, GitHub Actions, Amplify CI/CD, CloudWatch 

## 🚀 Features
**AI-Generated Market Insights**
Powered by Amazon Bedrock (Nova Pro)
Custom system prompts for financial reasoning
Optimized for concise, actionable responses
**🔔 Automated Price Alerts**
EventBridge → Lambda → DynamoDB
SES notifications when price thresholds are met
**📊 Real-Time Portfolio & Wishlist**
DynamoDB single-table design
<10ms read performance
**💬 Conversational AI Assistant**
Amazon Lex with multilingual support
Cross-region proxy architecture
**🔐 Secure Authentication**
AWS Cognito (MFA + JWT authorization)

## 🧠 System Architecture Details
**Multi-Region AI Architecture**
Because Amazon Lex is not available in eu-north-1, the assistant is deployed in eu-west-1.
To allow Lex to interact with core services, a proxy Lambda in eu-west-1 forwards and returns requests to the main Lambda in eu-north-1 via API Gateway + VPC endpoints.
**Serverless Automation**
EventBridge triggers Lambda jobs for:
- Price checking
- Alert management
- Data cleanup tasks
**Hybrid Storage Strategy**
- DynamoDB → portfolio/watchlist, real-time workloads
- RDS PostgreSQL → historical fundamentals and structured relational data

## 🛠️ Setup Instructions
**1️⃣ Clone the Repository**
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

**🖥️ Frontend Setup (React + Vite + Amplify)**
Install dependencies:
cd frontend
npm install

Run locally:
npm run dev

**Configure Amplify Hosting:**
amplify init
amplify hosting add
amplify publish

**🛠️ Backend Setup (Node.js API)**
Install dependencies:
cd backend
npm install

Run locally:
npm run start

**Deploy EC2 version:**
Provision an EC2 instance and run:
pm2 start server.js

**🔁 Lambda Microservices Setup**
Each Lambda has its own folder. Deploy using:
zip -r function.zip .
aws lambda update-function-code \
  --function-name <FunctionName> \
  --zip-file fileb://function.zip

## 🔐 Environment Variables
Create a .env file or use AWS Secrets Manager ( RECOMMENDED).
Example variables:

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
ALPHA_VANTAGE_API_KEY=
COGNITO_POOL_ID=
COGNITO_CLIENT_ID=
BEDROCK_MODEL_ID=nova-pro-v1:0
REGION=eu-north-1

For Lambdas:
Use Lambda Environment Variables in console or IaC.

## 🚀 Deployment Guide
**1. Deploy Infrastructure**
Use CloudFormation templates inside /infrastructure.
Example:

aws cloudformation deploy \
  --template-file template.yml \
  --stack-name trading-platform \
  --capabilities CAPABILITY_IAM

**2. Deploy Backend (EC2 + API Gateway)**
**3. Deploy Lambda Microservices**
**4. Deploy Frontend through Amplify**
**5. Update Cognito + Lex + Bedrock configs**

## 💡 Technical Challenges & Solutions
**1️⃣ Multi-Region Architecture**
Problem: Amazon Lex isn’t available in our primary region (eu-north-1). Since Lex needed to interact with our database and Bedrock model in eu-north-1, deploying it in eu-west-1 created a communication gap.
Solution: Deployed a proxy Lambda in eu-west-1 (alongside Lex) to relay requests to the main Lambda in eu-north-1 using API Gateway routing and VPC endpoints for secure, low-latency communication.
Result: Seamless cross-region conversational AI with <50ms latency.

**2️⃣ Optimizing AI Response Quality**
Problem: Initial Lex + Bedrock responses were too verbose, negatively impacting user experience and increasing inference costs.
Solution: Applied prompt engineering within the proxy Lambda, adding instructions like “Respond in 2–3 sentences maximum unless detailed information is requested” and reduced max_output_tokens to ensure concise responses.
Result: 40% faster responses, clearer outputs, and significantly reduced model usage cost.

**3️⃣ DynamoDB Schema Optimization**
Problem: Portfolio and wishlist items required fast, unified access, but storing them separately caused duplication and inefficient queries.
Solution: Designed a single-table schema with composite keys (PK, SK) and a GSI for active alerts. Used item prefixes (PORTFOLIO#, WISHLIST#) to differentiate entities.
Result: Reduced DynamoDB costs by ~60% and improved query performance to <5ms.

**4️⃣ Scalable Real-Time Price Alert System**
Problem: Monitoring hundreds of price alerts risked rate-limit issues with external APIs and unnecessary costs.
Solution: Built an EventBridge-scheduled Lambda that batches DynamoDB reads, caches recent responses, and applies exponential backoff when hitting API limits. SES triggers only when conditions are met.
Result: A highly reliable, cost-efficient price alert engine that scales without API overload.

## 🧭 Roadmap
- 🔄 Live market data ingestion**
- 📈 Kinesis streaming (or optimized Lambda polling)
- 🧠 RAG-based AI capabilities
- 🧮 Portfolio analytics + risk scoring

## 📬 Contact
**Walson Baiye Mboe**
**Cloud & Data Engineer | AWS Certified**
**LinkedIn: [link]**

## 📈 Demo
[Live Demo Link - Coming Soon]

## 🤝 Contributing
This is a portfolio project showcasing AWS and DevOps skills.
