const openrouter = require("../services/openrouterService");

exports.vehicleChatbot = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message",
      });
    }

    // Convert previous conversation into Groq messages
    const messages = [
      {
        role: "system",
        content: `
You are AutoCare AI, a helpful and conversational automobile assistant.

Your job is to help users understand vehicle-related problems,
maintenance, servicing, fuel economy, warning signs, noises,
braking problems, engine problems, battery problems, tyres,
AC problems, electrical issues, and general automobile questions.

Be conversational and natural like a helpful mechanic.

IMPORTANT:
- Do NOT follow a fixed response format.
- Do NOT always use headings such as "Possible Causes", "Severity", etc.
- Answer naturally based on what the user asks.
- Ask follow-up questions when you need more information.
- Remember and use the previous conversation.
- Explain technical terms in simple language.
- If the problem could be dangerous, clearly tell the user to stop driving
  or get professional assistance.
- Never pretend to provide a guaranteed mechanical diagnosis.
- Do not invent information about the user's vehicle.
- You can provide possible causes, troubleshooting steps, maintenance advice,
  and general guidance.
- Keep answers reasonably concise unless the user asks for detailed information.

You are an AI assistant, so your response should feel like a real conversation.
        `,
      },
    ];

    // Add conversation history
    if (Array.isArray(history)) {
      history.forEach((chat) => {
        if (
          chat.role === "user" ||
          chat.role === "assistant"
        ) {
          messages.push({
            role: chat.role,
            content: chat.content,
          });
        }
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message.trim(),
    });

    // Open Router

    const completion = await openrouter.chat.completions.create ({
      model: "openrouter/free",
      messages,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("Chatbot Error:", error);

    res.status(500).json({
      success: false,
      message: "AI chatbot failed",
    });
  }
};