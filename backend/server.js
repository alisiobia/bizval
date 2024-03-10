require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require("openai");

// Initialize Express app
const app = express();

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Route handler for submitting a business idea
app.post('/submit-idea', async (req, res) => {
    try {
        // Retrieve the business idea and target market from the request body
        const { ideaDescription, targetMarket } = req.body;

        // Construct a detailed prompt for the OpenAI API
        const prompt = `A tool that helps founders and businesses rapidly validate their ideas with testers/users before investing heavily in production based on the following description: "${ideaDescription}", targeting the market "${targetMarket}". Please provide a detailed analysis as follows:\n\n1. Rephrase the business idea into a clearer concept.\n2. Highlight features of the idea\n3. Talk about existing competitors\n4. Discuss who the target market / users/personas are likely to be\n5. Give current statistics of the target market including references if possible\n6. Highlight the unique value proposition (UVP) that will make this idea stand out from all competitors\n7. Summarise and wish them good luck.`;

        // Use OpenAI to generate a response based on the detailed prompt
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: prompt }],
        });

        // Extract the generated response from the completion object
        const response = completion.choices[0].message.content;

        // Send the generated response back to the client
        res.json({ response });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
});

// Route handler for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
