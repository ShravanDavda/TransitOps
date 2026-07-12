const {
  addExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
} = require("../models/expenseModel");
const {
  validateExpense,
} = require("../validations/expenseValidation");

const createExpense = async (req, res) => {

  try {

    const error = validateExpense(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const expense =
      await addExpense(req.body);

    return res.status(201).json({
      success: true,
      expense,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

const getAllExpenses = async (req, res) => {

  try {

    const expenses =
      await getExpenses();

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


const deleteExpenseController = async (req,res)=>{

  try{

    const expense =
    await getExpenseById(req.params.id);

    if(!expense){

      return res.status(404).json({
        success:false,
        message:"Expense not found",
      });

    }

    await deleteExpense(req.params.id);

    return res.status(200).json({
      success:true,
      message:"Expense deleted",
    });

  }catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    });

  }

};









module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpenseController,
};