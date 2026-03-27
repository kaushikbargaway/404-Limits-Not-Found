const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.verifyProofAI = async (imageUrl, text, taskDescription) => {
  try {
    console.log("🚀 Calling Groq (multimodal)...");

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are evaluating whether a user completed a real-world task.

Task: "${taskDescription}"
User claim: "${text}"

Instructions:
- Analyze the image and the claim carefully
- Check if the image supports the claim
- Detect inconsistencies or fake proofs
- Don't be that strict because this just for trial.

Scoring rules:
- 0 = completely fake
- 50 to 75 = uncertain to some evidence of completion
- 100 = fully genuine

Return ONLY a number.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 300
    });

    const reply = response.choices[0].message.content.trim();

    console.log("✅ Groq Response:", reply);

    // Extract number safely
    const numericScore = parseInt(reply);

    if (!isNaN(numericScore)) {
      return numericScore;
    }

    console.log("⚠️ AI returned non-numeric response, fallback used");
    return 50;

  } catch (error) {
    console.error("❌ GROQ ERROR:", error.response?.data || error.message);
    return 50;
  }
};