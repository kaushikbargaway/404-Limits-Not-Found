const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.verifyProofAI = async (text) => {
  try {
    console.log("🚀 Calling Groq SDK...");

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You evaluate whether a task proof is genuine."
        },
        {
          role: "user",
          content: `Evaluate this proof:
"${text}"

Reply ONLY with one word: VALID or FAKE`
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2,
      max_completion_tokens: 50
    });

    const reply = response.choices[0].message.content.trim();

    console.log("✅ Groq Response:", reply);

    let score = 50;

    if (reply.toLowerCase().includes("valid")) {
      score = 80;
    } else if (reply.toLowerCase().includes("fake")) {
      score = 20;
    }

    return score;

  } catch (error) {
    console.error("❌ GROQ ERROR:", error.message);
    return 50;
  }
};