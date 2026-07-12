const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
createExpense,
getAllExpenses,
} = require("../controllers/expenseController");

router.post(
"/",
authenticate,
createExpense
);

router.get(
"/",
authenticate,
getAllExpenses
);

module.exports = router;