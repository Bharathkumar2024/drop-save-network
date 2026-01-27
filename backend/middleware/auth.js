import jwt from 'jsonwebtoken';
import Hospital from '../models/Hospital.js';
import Donor from '../models/Donor.js';
import BloodBank from '../models/BloodBank.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      if (decoded.role === 'hospital') {
        req.user = await Hospital.findById(decoded.id).select('-password');
      } else if (decoded.role === 'donor') {
        req.user = await Donor.findById(decoded.id);
      } else if (decoded.role === 'bloodbank') {
        req.user = await BloodBank.findById(decoded.id).select('-password');
      }

      req.userRole = decoded.role;
      req.userId = decoded.id;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `User role ${req.userRole} is not authorized to access this route`
      });
    }
    next();
  };
};