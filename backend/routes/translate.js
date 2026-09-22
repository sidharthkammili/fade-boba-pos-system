const express = require('express');
const router = express.Router();

const MYMEMORY_BASE_URL = 'https://api.mymemory.translated.net/get';
const CONTACT_EMAIL = process.env.TRANSLATE_CONTACT_EMAIL || '';

function decodeHtmlEntities(text = '') {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

router.post('/', async (req, res) => {
  const { texts, target } = req.body;

  if (!Array.isArray(texts) || !target) {
    return res.status(400).json({ error: 'texts array and target are required' });
  }

  try {
    const translations = await Promise.all(
      texts.map(async (text) => {
        if (typeof text !== 'string' || !text.trim()) {
          return text;
        }

        const params = new URLSearchParams({
          q: text,
          langpair: `en|${target}`,
        });

        if (CONTACT_EMAIL) {
          params.append('de', CONTACT_EMAIL);
        }

        const response = await fetch(`${MYMEMORY_BASE_URL}?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          console.error('MyMemory request failed:', data);
          return text;
        }

        const translated =
          data?.responseData?.translatedText ||
          data?.matches?.[0]?.translation ||
          text;

        return decodeHtmlEntities(translated);
      })
    );

    return res.json({ translations });
  } catch (error) {
    console.error('Translate route error:', error);
    return res.json({ translations: texts });
  }
});

module.exports = router;