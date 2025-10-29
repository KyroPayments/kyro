const User = require('../models/User');

// Middleware to check user's workspace and attach it to request
const workspaceMiddleware = async (req, res, next) => {
  // If there's no authenticated user, set default workspace
  if (!req.userId) {
    req.userWorkspace = 'testnet'; // Default workspace for unauthenticated users
    return next();
  }

  try {
    // Get the workspace from the user's profile in the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user's workspace to the request object
    req.userWorkspace = user.workspace || 'testnet';

    next();
  } catch (error) {
    console.error('Error in workspace middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to filter data by workspace
const filterByWorkspace = (req, res, next) => {
  // Ensure the user workspace is available
  if (!req.userWorkspace) {
    req.userWorkspace = 'testnet'; // Default fallback
  }

  next();
};

module.exports = {
  workspaceMiddleware,
  filterByWorkspace
};