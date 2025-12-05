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
const genAI = new GoogleGenAI({ apiKey: "AIzaSyDYpuD6w6l12_4mvVL5vB0OYvQWgToCNAs" });
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

export const gradeQuiz = async (questionsAndAnswers) => {
    // questionsAndAnswers: [{ question: string, answer: string, question_id: string }]

    if (!questionsAndAnswers || questionsAndAnswers.length === 0) {
        return { total_marks: 0, obtained_marks: 0, questions: [] };
    }

    const prompt = `
    You are an expert educator grading a quiz with precision and care.
    I will provide a list of questions and the student's answers.
    
    For each question:
    1. Carefully evaluate if the answer is factually correct and demonstrates understanding
    2. Be fair but rigorous - partial answers should be marked incorrect unless they fully address the question
    3. Provide constructive, educational feedback that helps the student learn
    
    Input (Questions and Student Answers):
    ${JSON.stringify(questionsAndAnswers.map(qa => ({ question: qa.question, answer: qa.answer })), null, 2)}

    You must return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
    {
        "questions": [
            {
                "question": "The complete original question text",
                "student_answer": "The complete student's answer text",
                "status": "correct" OR "incorrect" (only these two values allowed),
                "feedback": "A detailed, constructive explanation. For correct answers, acknowledge what they did well. For incorrect answers, explain what was wrong and what the correct understanding should be. Be professional and encouraging.",
                "marks_awarded": 1 (if correct) or 0 (if incorrect)
            }
        ]
    }
    
    CRITICAL REQUIREMENTS:
    - The output array MUST have the same length and order as the input array
    - Include the FULL question text and student answer in each result
    - Feedback should be 2-4 sentences, educational and constructive
    - No markdown formatting in feedback, use plain text
    - Return ONLY the JSON object, no additional text
    `;

    try {
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = result.text;
        const data = JSON.parse(text);

        // Calculate totals
        let obtained_marks = 0;
        const total_marks = questionsAndAnswers.length; // Assuming 1 mark per question for now

        const gradedQuestions = data.questions.map((q, index) => {
            if (q.status === 'correct') obtained_marks++;
            return {
                ...q,
                question_id: questionsAndAnswers[index].question_id
            };
        });

        return {
            total_marks,
            obtained_marks,
            questions: gradedQuestions
        };

    } catch (error) {
        console.error('AI Grading Error:', error);
        // Fallback or rethrow
        throw new Error('Failed to grade quiz with AI');
    }
};