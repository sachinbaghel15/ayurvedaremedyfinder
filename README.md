# 🌿 Ayurveda Remedy API

A professional, production-ready API for Ayurvedic remedies and health assessments with comprehensive symptom analysis and personalized treatment recommendations.

## 🚀 Features

- **Comprehensive Symptom Database**: 200+ symptoms across 12 categories
- **Dosha Assessment**: Personalized Ayurvedic constitution analysis
- **Remedy Recommendations**: Evidence-based treatment suggestions
- **PDF Report Generation**: Detailed health reports and recommendations
- **Subscription Management**: Multi-tier pricing with usage tracking
- **API Key Authentication**: Secure access control
- **Rate Limiting**: Protection against abuse
- **Professional Logging**: Winston-based structured logging
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and sanitization
- **Documentation**: OpenAPI/Swagger specifications

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or cloud)
- Redis (optional, for caching)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ayurveda-remedy-api.git
cd ayurveda-remedy-api

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Configure your environment variables
nano .env

# Start the development server
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ayurveda_remedy

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# API Keys
RAPIDAPI_KEY=your-rapidapi-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000
```

### Authentication
All API endpoints require an API key in the header:
```
X-RapidAPI-Key: your-api-key-here
```

### Core Endpoints

#### Health Check
```http
GET /health
```

#### Symptoms
```http
GET /api/symptoms?category=digestive
```

#### Remedies by Symptoms
```http
GET /api/remedies/by-symptoms?symptoms=fever,cough,headache
```

#### Dosha Assessment
```http
POST /api/doshas/assessment
Content-Type: application/json

{
  "age": 30,
  "gender": "male",
  "symptoms": ["anxiety", "insomnia", "digestive_issues"],
  "answers": [
    {"question": "How do you typically feel in cold weather?", "answer": "Very cold"},
    {"question": "What is your typical appetite like?", "answer": "Variable"}
  ]
}
```

#### Generate PDF Report
```http
POST /api/reports/generate
Content-Type: application/json

{
  "assessmentId": "assessment_123",
  "format": "pdf",
  "includeRemedies": true,
  "includeLifestyle": true
}
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "statusCode": 200
}
```

## 💡 Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const apiKey = 'your-api-key';
const baseURL = 'http://localhost:4000';

// Get symptoms by category
const getSymptoms = async (category) => {
  try {
    const response = await axios.get(`${baseURL}/api/symptoms`, {
      params: { category },
      headers: { 'X-RapidAPI-Key': apiKey }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Get remedies for symptoms
const getRemedies = async (symptoms) => {
  try {
    const response = await axios.get(`${baseURL}/api/remedies/by-symptoms`, {
      params: { symptoms: symptoms.join(',') },
      headers: { 'X-RapidAPI-Key': apiKey }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};
```

### Python
```python
import requests

api_key = 'your-api-key'
base_url = 'http://localhost:4000'

headers = {'X-RapidAPI-Key': api_key}

# Get symptoms
response = requests.get(f'{base_url}/api/symptoms', 
                       params={'category': 'digestive'}, 
                       headers=headers)
symptoms = response.json()

# Get remedies
response = requests.get(f'{base_url}/api/remedies/by-symptoms',
                       params={'symptoms': 'fever,cough,headache'},
                       headers=headers)
remedies = response.json()
```

### cURL
```bash
# Get symptoms
curl -X GET "http://localhost:4000/api/symptoms?category=digestive" \
  -H "X-RapidAPI-Key: your-api-key"

# Get remedies
curl -X GET "http://localhost:4000/api/remedies/by-symptoms?symptoms=fever,cough" \
  -H "X-RapidAPI-Key: your-api-key"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Examples

```javascript
const request = require('supertest');
const app = require('../server-simple');

describe('Symptoms API', () => {
  test('GET /api/symptoms should return symptoms', async () => {
    const response = await request(app)
      .get('/api/symptoms?category=digestive')
      .set('X-RapidAPI-Key', 'test-key');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});
```

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Security
npm run security     # Run security audit
npm run security:fix # Fix security issues

# Utilities
npm run clean        # Clean and reinstall dependencies
npm run logs         # View application logs
npm run logs:error   # View error logs
```

### Project Structure

```
ayurveda-remedy-api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── public/              # Static files
├── logs/                # Application logs
├── tests/               # Test files
├── docs/                # Documentation
├── server-simple.js     # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
npm run dev
```

#### Production
```bash
NODE_ENV=production
npm start
```

### Deployment Platforms

- **Render**: Use `render.yaml` configuration
- **Heroku**: Use `Procfile`
- **AWS**: Use Docker or Elastic Beanstalk
- **Google Cloud**: Use App Engine or Cloud Run

## 📊 Monitoring & Logging

### Log Levels
- `error`: Application errors
- `warn`: Warning messages
- `info`: General information
- `http`: HTTP requests
- `debug`: Debug information

### Log Files
- `logs/combined.log`: All logs
- `logs/error.log`: Error logs only

### Monitoring Integration
- Sentry for error tracking
- New Relic for performance monitoring
- Custom health check endpoints

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request validation
- **JWT Authentication**: Secure token-based auth
- **API Key Management**: Secure API access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier
- Follow conventional commit messages
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Docs](https://your-docs-url.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ayurveda-remedy-api/issues)
- **Email**: your.email@example.com

## 🙏 Acknowledgments

- Ayurvedic practitioners for medical guidance
- Open source community for tools and libraries
- Contributors and beta testers

---

**Made with ❤️ for better health and wellness**
