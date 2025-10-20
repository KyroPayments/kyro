const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use(logger.requestLogger);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(logger.errorLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Kyro payment platform server running on port ${PORT}`);
});

module.exports = app;