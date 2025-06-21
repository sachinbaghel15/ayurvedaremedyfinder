# Ayurveda Remedy API - RapidAPI Documentation

## Overview
The Ayurveda Remedy API provides comprehensive access to traditional Ayurvedic remedies, dosha assessments, and personalized health recommendations. This API is perfect for health apps, wellness platforms, and educational tools.

## Base URL
```
https://your-domain.com/api
```

## Authentication
All API requests require authentication using RapidAPI headers:

### Headers Required
```
X-RapidAPI-Key: YOUR_RAPIDAPI_KEY
X-RapidAPI-Host: your-domain.com
```

## Rate Limits
- **Free Plan**: 100 requests per 15 minutes
- **Basic Plan**: 1,000 requests per 15 minutes  
- **Pro Plan**: 10,000 requests per 15 minutes
- **Enterprise Plan**: Custom limits

## Endpoints

### 1. Get Dosha Information
**GET** `/doshas/info`

Returns comprehensive information about the three doshas (Vata, Pitta, Kapha) in Ayurveda.

**Response:**
```json
{
  "success": true,
  "data": {
    "vata": {
      "description": "Air and space elements",
      "characteristics": ["Light", "Quick", "Cold", "Dry"],
      "imbalance_symptoms": ["Anxiety", "Insomnia", "Dry skin"],
      "balancing_foods": ["Warm foods", "Sweet fruits", "Nuts"]
    },
    "pitta": {
      "description": "Fire and water elements", 
      "characteristics": ["Hot", "Sharp", "Intense", "Oily"],
      "imbalance_symptoms": ["Irritability", "Acid reflux", "Skin rashes"],
      "balancing_foods": ["Cooling foods", "Sweet fruits", "Dairy"]
    },
    "kapha": {
      "description": "Earth and water elements",
      "characteristics": ["Heavy", "Slow", "Cold", "Oily"],
      "imbalance_symptoms": ["Weight gain", "Lethargy", "Congestion"],
      "balancing_foods": ["Light foods", "Spices", "Honey"]
    }
  }
}
```

### 2. Submit Dosha Assessment
**POST** `/doshas/assessment`

Submit answers to determine user's dosha constitution.

**Request Body:**
```json
{
  "answers": ["vata", "pitta", "kapha", "vata", "pitta", "kapha", "vata", "pitta"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scores": {
      "vata": 3,
      "pitta": 3,
      "kapha": 2
    },
    "dominantDosha": "vata",
    "secondaryDosha": "pitta",
    "doshaType": "vata-pitta",
    "recommendations": {
      "lifestyle": [
        "Follow a regular daily routine",
        "Practice gentle yoga and meditation"
      ],
      "foods": [
        "Eat warm, cooked, and easily digestible foods",
        "Include sweet, sour, and salty tastes"
      ],
      "avoid": [
        "Irregular eating habits",
        "Excessive travel and movement"
      ]
    }
  }
}
```

### 3. Get Remedies
**GET** `/remedies`

Returns a comprehensive list of Ayurvedic remedies with detailed information.

**Query Parameters:**
- `category` (optional): Filter by category (digestive, immunity, stress, detox, energy)
- `dosha` (optional): Filter by suitable dosha (vata, pitta, kapha, all)
- `difficulty` (optional): Filter by difficulty level (easy, medium, hard)
- `limit` (optional): Number of results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": 1,
      "name": "Ginger Tea for Digestion",
      "description": "A warming tea to improve digestion and reduce bloating.",
      "category": "digestive",
      "difficulty": "easy",
      "suitableFor": ["vata", "kapha"],
      "benefits": [
        "Improves digestion",
        "Reduces bloating", 
        "Boosts immunity",
        "Relieves nausea"
      ]
    }
  ]
}
```

### 4. Health Check
**GET** `/health`

Simple health check endpoint to verify API status.

**Response:**
```json
{
  "success": true,
  "message": "Ayurveda Remedy API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "API key is required",
  "message": "Please provide a valid API key in the x-rapidapi-key header"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Please check your request parameters"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong on our end"
}
```

## Code Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://your-domain.com/api/remedies',
  headers: {
    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
    'X-RapidAPI-Host': 'your-domain.com'
  }
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
```

### Python
```python
import requests

url = "https://your-domain.com/api/remedies"
headers = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "your-domain.com"
}

response = requests.get(url, headers=headers)
print(response.json())
```

### PHP
```php
<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://your-domain.com/api/remedies",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY",
        "X-RapidAPI-Host: your-domain.com"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}
?>
```

## Use Cases

1. **Health Apps**: Integrate dosha assessments and personalized remedies
2. **Wellness Platforms**: Provide Ayurvedic recommendations to users
3. **Educational Tools**: Teach Ayurvedic principles and practices
4. **E-commerce**: Suggest products based on dosha type
5. **Content Creation**: Generate personalized health content

## Pricing Plans

### Free Plan
- 100 requests per 15 minutes
- Basic dosha information
- Limited remedy access

### Basic Plan ($9.99/month)
- 1,000 requests per 15 minutes
- Full dosha assessment
- Complete remedy database
- Basic analytics

### Pro Plan ($29.99/month)
- 10,000 requests per 15 minutes
- All features from Basic
- Priority support
- Advanced analytics
- Custom integrations

### Enterprise Plan (Custom)
- Unlimited requests
- Dedicated support
- Custom features
- White-label options

## Support
- **Documentation**: [Your Documentation URL]
- **Support Email**: support@yourdomain.com
- **GitHub**: [Your GitHub Repository]
- **Status Page**: [Your Status Page URL]

## Legal
This API is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. 