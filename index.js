const app = require('./app');
const PORT = process.env.PORT || 4000;
const sendReportRoute = require('./routes/sendReport');

app.listen(PORT, () => {
  console.log(`🚀 Enhanced Ayurveda Remedy API running on port ${PORT}`);
  console.log(`📖 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔓 No API key required for development`);
  console.log(`🌱 Model: Symptom → Cause → Remedy → Product`);
  console.log(`⚖️ Ethical & Scalable Design Implemented`);
});

app.use('/api', sendReportRoute); 