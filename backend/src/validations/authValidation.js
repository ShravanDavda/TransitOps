const validateLogin = (email, password) => {
  if (!email || !password) {
    return {
      valid: false,
      message: "Email and password are required",
    };
  }

  return {
    valid: true,
  };
};

module.exports = {
  validateLogin,
};