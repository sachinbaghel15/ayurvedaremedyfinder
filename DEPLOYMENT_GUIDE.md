# Deployment Guide for Ayurveda Remedy API

## Overview
This guide will help you deploy your Ayurveda Remedy API to production for RapidAPI marketplace.

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Domain name (for production)
- SSL certificate
- Server/hosting provider account

## Hosting Options

### 1. Heroku (Recommended for Beginners)
**Pros**: Easy deployment, automatic SSL, good free tier
**Cons**: Can be expensive at scale

#### Setup Steps:
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-ayurveda-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### 2. DigitalOcean App Platform
**Pros**: Good performance, reasonable pricing, easy scaling
**Cons**: Less beginner-friendly

#### Setup Steps:
1. Create DigitalOcean account
2. Create new App
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set run command: `npm start`
6. Configure environment variables

### 3. AWS EC2 (Advanced)
**Pros**: Full control, cost-effective at scale
**Cons**: Complex setup, requires server management

#### Setup Steps:
1. Launch EC2 instance (Ubuntu recommended)
2. Install Node.js and PM2
3. Clone repository
4. Set up Nginx reverse proxy
5. Configure SSL with Let's Encrypt
6. Set up PM2 for process management

## Environment Configuration

### Create `.env` file for production:
```env
NODE_ENV=production
PORT=5000
RAPIDAPI_HOST=your-domain.com
RAPIDAPI_KEY_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

### Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server-simple.js",
    "dev": "nodemon server-simple.js",
    "build": "npm install",
    "test": "jest"
  }
}
```

## SSL Certificate Setup

### Using Let's Encrypt (Free):
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using Cloudflare (Recommended):
1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable SSL/TLS encryption mode: "Full (strict)"

## Database Setup (Optional)

### MongoDB Atlas (Recommended):
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add to environment variables

### PostgreSQL on Railway:
1. Create Railway account
2. Create PostgreSQL database
3. Get connection string
4. Add to environment variables

## Monitoring & Logging

### Add PM2 for Process Management:
```bash
npm install -g pm2
pm2 start server-simple.js --name "ayurveda-api"
pm2 startup
pm2 save
```

### Add Logging:
```javascript
// Add to server-simple.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Security Measures

### 1. Helmet.js (Already included)
```javascript
app.use(helmet());
```

### 2. Rate Limiting (Already included)
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

### 3. CORS Configuration
```javascript
app.use(cors({
  origin: ['https://rapidapi.com', 'https://your-domain.com'],
  credentials: true
}));
```

### 4. Environment Variables
Never commit sensitive data to Git:
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

## Performance Optimization

### 1. Compression (Already included)
```javascript
app.use(compression());
```

### 2. Caching Headers
```javascript
app.use('/api/remedies', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### 3. Database Connection Pooling
```javascript
// If using MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## Testing Your Deployment

### 1. Health Check
```bash
curl https://your-domain.com/api/health
```

### 2. API Key Authentication
```bash
curl -H "X-RapidAPI-Key: test-key" \
     -H "X-RapidAPI-Host: your-domain.com" \
     https://your-domain.com/api/remedies
```

### 3. Rate Limiting Test
```bash
# Test rate limiting
for i in {1..110}; do
  curl -H "X-RapidAPI-Key: test-key" \
       -H "X-RapidAPI-Host: your-domain.com" \
       https://your-domain.com/api/health
done
```

## RapidAPI Integration

### 1. Update Base URL
In your RapidAPI listing, update the base URL:
```
https://your-domain.com/api
```

### 2. Test All Endpoints
Ensure all endpoints work with RapidAPI headers:
- `GET /health`
- `GET /doshas/info`
- `POST /doshas/assessment`
- `GET /remedies`

### 3. Monitor Performance
Set up monitoring to track:
- Response times
- Error rates
- API usage
- Server resources

## Backup Strategy

### 1. Code Backup
- Use Git with GitHub/GitLab
- Set up automatic deployments

### 2. Database Backup
- Enable automatic backups in MongoDB Atlas
- Set up daily backups for PostgreSQL

### 3. Environment Backup
- Document all environment variables
- Store securely (password manager)

## Scaling Considerations

### 1. Load Balancing
- Use multiple server instances
- Set up load balancer (AWS ALB, Nginx)

### 2. CDN
- Use Cloudflare for global distribution
- Cache static content

### 3. Database Scaling
- Use read replicas for high traffic
- Consider sharding for large datasets

## Troubleshooting

### Common Issues:

1. **Port Issues**
   ```bash
   # Check if port is in use
   lsof -i :5000
   ```

2. **SSL Issues**
   ```bash
   # Test SSL certificate
   openssl s_client -connect your-domain.com:443
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   pm2 monit
   ```

4. **Log Analysis**
   ```bash
   # View logs
   pm2 logs ayurveda-api
   ```

## Support Resources

- **Heroku Documentation**: https://devcenter.heroku.com/
- **DigitalOcean Guides**: https://www.digitalocean.com/community/tutorials
- **AWS Documentation**: https://docs.aws.amazon.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/

## Next Steps

1. **Deploy to your chosen platform**
2. **Set up monitoring and logging**
3. **Test all endpoints thoroughly**
4. **Submit to RapidAPI marketplace**
5. **Monitor performance and user feedback**
6. **Scale as needed**

Remember to keep your API documentation updated and provide excellent support to your users! 