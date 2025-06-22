const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Specific route handlers for static files with explicit MIME types
app.get('/styles-new.css', (req, res) => {
  console.log('styles-new.css route handler called');
  const filePath = path.join(__dirname, 'public', 'styles-new.css');
  
  if (fs.existsSync(filePath)) {
    console.log('Serving styles-new.css with text/css MIME type');
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  } else {
    console.log('File not found:', filePath);
    res.status(404).send('CSS file not found');
  }
});

app.get('/styles.css', (req, res) => {
  console.log('styles.css route handler called');
  const filePath = path.join(__dirname, 'public', 'styles.css');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  } else {
    res.status(404).send('CSS file not found');
  }
});

app.get('/script-new.js', (req, res) => {
  console.log('script-new.js route handler called');
  const filePath = path.join(__dirname, 'public', 'script-new.js');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  } else {
    res.status(404).send('JS file not found');
  }
});

app.get('/jspdf.min.js', (req, res) => {
  console.log('jspdf.min.js route handler called');
  const filePath = path.join(__dirname, 'public', 'jspdf.min.js');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(filePath);
  } else {
    res.status(404).send('JS file not found');
  }
});

// Serve other static files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fixed Server running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
}); 