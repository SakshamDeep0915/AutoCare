require("dotenv").config();

const openrouter = require("./services/openrouterService");

async function testOpenRouter() {
    try {
        const completion = await openrouter.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "user",
                    content:
                        "You are an automotive AI assistant. Explain in two sentences why regular car servicing is important.",
                },
            ],
        });

        console.log("OpenRouter Response:");
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error("OpenRouter Error:");
        console.error(error.response?.data || error.message);
    }
}

testOpenRouter();