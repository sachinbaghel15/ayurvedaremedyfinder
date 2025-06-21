# Quick Start Guide - Ayurveda Remedy API

## Get Started in 5 Minutes

### 1. Sign Up for RapidAPI
1. Go to [RapidAPI.com](https://rapidapi.com)
2. Create a free account
3. Search for "Ayurveda Remedy API"
4. Subscribe to the Basic plan ($9.99/month)

### 2. Get Your API Key
After subscribing, you'll get:
- **API Key**: Your unique authentication key
- **Host**: The API host URL
- **Base URL**: The endpoint base URL

### 3. Test Your First Request

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://your-domain.com/api/remedies',
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
    'X-RapidAPI-Host': 'your-domain.com'
  }
};

axios.request(options).then(function (response) {
  console.log('Remedies:', response.data);
}).catch(function (error) {
  console.error('Error:', error);
});
```

#### Python
```python
import requests

url = "https://your-domain.com/api/remedies"
headers = {
    "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
    "X-RapidAPI-Host": "your-domain.com"
}

response = requests.get(url, headers=headers)
remedies = response.json()
print("Remedies:", remedies)
```

#### cURL
```bash
curl --request GET \
     --url 'https://your-domain.com/api/remedies' \
     --header 'X-RapidAPI-Key: YOUR_API_KEY_HERE' \
     --header 'X-RapidAPI-Host: your-domain.com'
```

### 4. Take a Dosha Assessment

#### Submit Assessment Answers
```javascript
const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://your-domain.com/api/doshas/assessment',
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
    'X-RapidAPI-Host': 'your-domain.com',
    'Content-Type': 'application/json'
  },
  data: {
    answers: ['vata', 'pitta', 'kapha', 'vata', 'pitta', 'kapha', 'vata', 'pitta']
  }
};

axios.request(options).then(function (response) {
  console.log('Dosha Result:', response.data);
}).catch(function (error) {
  console.error('Error:', error);
});
```

### 5. Get Personalized Remedies

#### Filter Remedies by Dosha
```javascript
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://your-domain.com/api/remedies?dosha=vata&category=digestive',
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
    'X-RapidAPI-Host': 'your-domain.com'
  }
};

axios.request(options).then(function (response) {
  console.log('Vata Digestive Remedies:', response.data);
}).catch(function (error) {
  console.error('Error:', error);
});
```

## Common Use Cases

### 1. Health App Integration
```javascript
// Get user's dosha type and recommend remedies
async function getPersonalizedRecommendations(userAnswers) {
  // First, get dosha assessment
  const doshaResult = await submitDoshaAssessment(userAnswers);
  const dominantDosha = doshaResult.data.dominantDosha;
  
  // Then, get remedies for that dosha
  const remedies = await getRemediesByDosha(dominantDosha);
  
  return {
    doshaType: doshaResult.data.doshaType,
    recommendations: doshaResult.data.recommendations,
    remedies: remedies.data
  };
}
```

### 2. E-commerce Product Recommendations
```javascript
// Suggest products based on dosha type
async function suggestProducts(userDosha) {
  const remedies = await getRemediesByDosha(userDosha);
  
  // Map remedies to products
  const products = remedies.data.map(remedy => ({
    name: remedy.name,
    category: remedy.category,
    benefits: remedy.benefits,
    productId: generateProductId(remedy)
  }));
  
  return products;
}
```

### 3. Educational Content Generation
```javascript
// Generate educational content about doshas
async function generateDoshaContent() {
  const doshaInfo = await getDoshaInfo();
  
  return {
    vata: {
      description: doshaInfo.data.vata.description,
      characteristics: doshaInfo.data.vata.characteristics,
      balancingFoods: doshaInfo.data.vata.balancing_foods
    },
    pitta: {
      description: doshaInfo.data.pitta.description,
      characteristics: doshaInfo.data.pitta.characteristics,
      balancingFoods: doshaInfo.data.pitta.balancing_foods
    },
    kapha: {
      description: doshaInfo.data.kapha.description,
      characteristics: doshaInfo.data.kapha.characteristics,
      balancingFoods: doshaInfo.data.kapha.balancing_foods
    }
  };
}
```

## Error Handling

### Handle API Errors Gracefully
```javascript
async function makeApiRequest(url, options) {
  try {
    const response = await axios.request({
      url,
      ...options,
      headers: {
        'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
        'X-RapidAPI-Host': 'your-domain.com',
        ...options.headers
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // API returned error response
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid API key. Please check your RapidAPI subscription.');
        case 429:
          throw new Error('Rate limit exceeded. Please wait before making more requests.');
        case 400:
          throw new Error('Invalid request. Please check your parameters.');
        default:
          throw new Error(`API Error: ${error.response.data.message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred.');
    }
  }
}
```

## Rate Limiting

### Monitor Your Usage
```javascript
// Check rate limit headers
const response = await axios.request(options);
const remainingRequests = response.headers['x-ratelimit-remaining'];
const resetTime = response.headers['x-ratelimit-reset'];

console.log(`Remaining requests: ${remainingRequests}`);
console.log(`Reset time: ${new Date(resetTime * 1000)}`);
```

## Best Practices

### 1. Cache Responses
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

async function getCachedRemedies() {
  const cacheKey = 'remedies';
  let remedies = cache.get(cacheKey);
  
  if (!remedies) {
    remedies = await makeApiRequest('/remedies');
    cache.set(cacheKey, remedies);
  }
  
  return remedies;
}
```

### 2. Batch Requests
```javascript
// Instead of multiple requests, batch them
async function getCompleteUserProfile(userAnswers) {
  const [doshaInfo, remedies] = await Promise.all([
    submitDoshaAssessment(userAnswers),
    getRemedies()
  ]);
  
  return { doshaInfo, remedies };
}
```

### 3. Validate Input
```javascript
function validateDoshaAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== 8) {
    throw new Error('Dosha assessment requires exactly 8 answers');
  }
  
  const validDoshas = ['vata', 'pitta', 'kapha'];
  const isValid = answers.every(answer => validDoshas.includes(answer));
  
  if (!isValid) {
    throw new Error('All answers must be one of: vata, pitta, kapha');
  }
  
  return true;
}
```

## Support & Resources

### Need Help?
- 📖 **Full Documentation**: [Your Documentation URL]
- 💬 **Community Forum**: [Your Forum URL]
- 📧 **Email Support**: support@yourdomain.com
- 🐛 **GitHub Issues**: [Your GitHub Repository]

### Rate Limits by Plan
- **Free**: 100 requests/15 minutes
- **Basic**: 1,000 requests/15 minutes
- **Pro**: 10,000 requests/15 minutes
- **Enterprise**: Custom limits

### Response Times
- Average: < 200ms
- 95th percentile: < 500ms
- 99th percentile: < 1000ms

## Next Steps

1. **Explore all endpoints** in the full documentation
2. **Build your first integration** using the examples above
3. **Join our community** for tips and updates
4. **Scale your usage** as your application grows

Happy coding! 🌿✨ 