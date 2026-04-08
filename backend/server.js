import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/report-ai", (req, res) => {
  console.log("API HIT"); // 👈 ADD THIS

  const { income, expense, categories } = req.body;

  const savings = income - expense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  let topCategory = null;
  let max = 0;

  for (let cat in categories) {
    if (categories[cat] > max) {
      max = categories[cat];
      topCategory = cat;
    }
  }

  const percent = income > 0 ? Math.round((max / income) * 100) : 0;

  res.json({
    summary: `Your total savings this month is ₹${savings}, which represents ${savingsRate}% of your income.`,
    breakdown: topCategory
      ? `The highest portion of your spending is in "${topCategory}" totaling ₹${max}, which is ${percent}% of your income.`
      : "Not enough data to determine spending patterns.",
    behavior:
      expense < income * 0.5
        ? "Your expenses are well controlled relative to your income."
        : expense > income * 0.8
        ? "Your expenses are close to your income."
        : "Your spending is moderate.",
    recommendation:
      savingsRate < 20
        ? "Try to save at least 20%."
        : "You are in a good position to invest."
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));