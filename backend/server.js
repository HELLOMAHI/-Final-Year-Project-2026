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
  const { income, expense, categories } = req.body;

  const savings = income - expense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  // 🔹 Find top category
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
        ? "Your expenses are well controlled relative to your income. This indicates strong financial discipline."
        : expense > income * 0.8
        ? "Your expenses are close to your income. This may affect long-term savings."
        : "Your spending is moderate and manageable.",

    recommendation:
      savingsRate < 20
        ? "Try to maintain a savings rate of at least 20% by reducing non-essential expenses."
        : "You are in a good position to increase savings or start investing regularly."
  });
});
app.listen(5000, () => console.log("Server running on 5000"));