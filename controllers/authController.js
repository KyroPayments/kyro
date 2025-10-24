const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { validateUserRegistration, validateUserLogin } = require('../validators/authValidator');
const { handleAsyncError } = require('../utils/errorHandler');
const config = require('../config');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    config.security.jwtSecret,
    { expiresIn: '24h' }
  );
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = config.security.saltRounds;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Register a new user
const register = handleAsyncError(async (req, res) => {
  const { error, value } = validateUserRegistration(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, name, password } = value;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const newUser = await User.create({
    email,
    name,
    password_hash: passwordHash
  });

  // Generate JWT token
  const token = generateToken(newUser.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: newUser,
    token
  });
});

// Login user
const login = handleAsyncError(async (req, res) => {
  const { error, value } = validateUserLogin(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = value;

  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Get the password hash from database for comparison
  const { data: userData } = await require('@supabase/supabase-js').createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  .from('users')
  .select('password_hash')
  .eq('email', email)
  .single();

  if (!userData) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Compare password
  const isValidPassword = await comparePassword(password, userData.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token
  });
});

// Get current user profile
const getProfile = handleAsyncError(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Update user profile
const updateProfile = handleAsyncError(async (req, res) => {
  // Note: In a real implementation, we would validate req.body against allowed fields
  // For now, we'll just allow name updates
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Update user in database
  const { data, error } = await require('@supabase/supabase-js').createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  .from('users')
  .update({ name, updated_at: new Date().toISOString() })
  .eq('id', req.userId)
  .select()
  .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const { password_hash: _, ...updatedUser } = data;

  res.status(200).json({
    success: true,
    user: updatedUser
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};