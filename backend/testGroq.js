require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Give me 3 tips to maintain a car engine.",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

testGroq();