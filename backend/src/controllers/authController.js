const { findUserByEmail, findUserById } = require("../models/authModel");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const { validateLogin } = require("../validations/authValidation");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin(email, password);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  login,
  getProfile,
};