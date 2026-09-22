const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Make sure we have an API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: 'Sorry, the AI Assistant is not configured right now. Please set GEMINI_API_KEY on the backend.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fetch menu to give context to the LLM
    const menuResult = await pool.query('SELECT item_name, base_price, item_type FROM Menu_Items');
    const menuItems = menuResult.rows;
    
    let menuContext = 'Here is the current menu for Fade Boba:\n';
    menuItems.forEach(item => {
      menuContext += `- ${item.item_name} (${item.item_type}): $${item.base_price}\n`;
    });
    
    const systemInstruction = `You are a helpful and friendly AI assistant for Fade Boba, a boba tea shop. 
Your job is to answer customer questions about the menu, give recommendations, and provide allergy information if asked. 
Be concise and conversational. Do not make up menu items that are not on the list.
${menuContext}`;

    let contents = [];
    if (history && history.length > 0) {
      const filteredHistory = history[0].role === 'assistant' ? history.slice(1) : history;
      
      contents = filteredHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ reply: 'I am having trouble processing your request right now.' });
  }
});

module.exports = router;
