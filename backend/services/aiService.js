const Groq = require("groq-sdk");

// Lazy client — only instantiated when a proof is actually submitted.
// This prevents the server from crashing on startup if GROQ_API_KEY is missing.
let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      return null; // Gracefully degrade
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

exports.verifyProofAI = async (imageUrl, text, taskDescription) => {
  const groq = getGroqClient();

  // If no API key is configured, return a neutral score instead of crashing
  if (!groq) {
    console.warn("⚠️  GROQ_API_KEY not set — skipping AI verification, using default score 50.");
    return 50;
  }

  try {
    console.log("🚀 Calling Groq (multimodal)...");

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are evaluating whether a user completed a real-world task.

Task: "${taskDescription}"
User claim: "${text}"

Instructions:
- Analyze the claim carefully
- Check if the evidence supports the claim
- Detect inconsistencies or fake proofs
- Don't be that strict because this is just for trial.

Scoring rules:
- 0 = completely fake
- 50 to 75 = uncertain to some evidence of completion
- 100 = fully genuine

Return ONLY a number.`
          }
        ]
      }
    ];

    // Only send image if one was provided
    if (imageUrl && imageUrl.length > 0) {
      messages[0].content.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      temperature: 0.2,
      max_completion_tokens: 300
    });

    const reply = response.choices[0].message.content.trim();
    console.log("✅ Groq Response:", reply);

    const numericScore = parseInt(reply);
    if (!isNaN(numericScore)) return numericScore;

    console.log("⚠️ AI returned non-numeric response, fallback used");
    return 50;

  } catch (error) {
    console.error("❌ GROQ ERROR:", error.response?.data || error.message);
    return 50; // Fallback score — don't crash the proof upload
  }
};