const validateClient = (req, res, next) => {
  const { name, email, status } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Invalid email format');
  }

  if (status && !['active', 'inactive', 'lead'].includes(status)) {
    errors.push('Status must be active, inactive, or lead');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateClient };
