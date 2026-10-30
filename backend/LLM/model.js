import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { create_msg } from "../controller/msg.js";
import { get_inter_id, set_inter_id } from "../controller/conversation.js";


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";
// import { create_msg } from "../controller/msg.js";
// import { get_inter_id, set_inter_id } from "../controller/conversation.js";

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

export default async function LLMRespose(req, res) {
    const { id, message } = req.body;
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!id || !trimmedMessage) {
        return res.status(400).json({ error: "id and message are required" });
    }

    // 1. Immediately inform client of streaming headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    try {
        const userMessagePromise = create_msg(id, "user", trimmedMessage);
        
        // 2. Fetch history or interaction context asynchronously
        // const latest_interaction_id = await get_inter_id(id);

        // 3. Use models.generateContentStream for instant streaming start
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-flash-latest", // updated stable flash model
            contents: trimmedMessage,
            config: {
                systemInstruction: "You are a concise, friendly mathematics tutor. Explain step by step, use LaTeX for equations, give examples when useful, and adapt to the student's level.",
                maxOutputTokens: 512,
            }
        });

        let result = "";

        // 4. Stream chunks out immediately to client
        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
                result += text;
                res.write(text);
                if (typeof res.flush === "function") res.flush();
            }
        }
console.log("here");

        // 5. Complete client response before doing post-processing DB writes
        res.end();

        // 6. Save DB state asynchronously after stream ends
        await Promise.all([
            userMessagePromise,
            result ? create_msg(id, "assistant", result) : null,
        ]);

    } catch (error) {
        console.error("LLM request failed:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Unable to generate a response" });
        }
        res.end();
    }
}