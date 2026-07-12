const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
createExpense,
getAllExpenses,
deleteExpenseController,
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


router.delete(
"/:id",
authenticate,
deleteExpenseController
);



module.exports = router;