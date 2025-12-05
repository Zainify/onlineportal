// import { GoogleGenAI } from '@google/genai';
// import { asyncHandler } from '../utils/asyncHandler.js';

// // Initialize Gemini API
// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// export const generateContent = asyncHandler(async (req, res) => {
//     const { prompt } = req.body;

//     if (!prompt) {
//         return res.status(400).json({ message: 'Prompt is required' });
//     }

//     try {
//         // Use the gemini-pro model
//         const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();

//         res.json({ text });
//     } catch (error) {
//         console.error('Error generating AI content:', error);
//         res.status(500).json({ message: 'Failed to generate content', error: error.message });
//     }
// });
import { GoogleGenAI } from '@google/genai';
import { asyncHandler } from '../utils/asyncHandler.js';

// NOTE on Initialization:
// The GoogleGenAI constructor is simpler.
// It will automatically read the GEMINI_API_KEY from the
// environment variable if you don't pass ah
// n argument.
const genAI = new GoogleGenAI({ apiKey: "your api here" });
// If you must pass it explicitly (e.g., in a cloud environment), 
// use this: const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export const generateContent = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        // 🚀 LATEST METHOD: 
        // Call generateContent directly on the models object, 
        // passing the model name and contents in the request object.
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash', // The current, fast, and most cost-effective model
            contents: prompt,
        });

        // The result object now contains the response data directly.
        // Access the generated text from the 'text' property.
        const text = result.text;

        res.json({ text });
    } catch (error) {
        console.error('Error generating AI content:', error);
        // It's a good idea to check if the error is from the API
        const errorMessage = error.message || 'An unknown error occurred.';
        res.status(500).json({
            message: 'Failed to generate content',
            error: errorMessage
        });
    }
});