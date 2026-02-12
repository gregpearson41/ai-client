const Topic = require('../models/Topic');
const Prompt = require('../models/Prompt');
const ChatEngine = require('../models/ChatEngine');

/**
 * Call OpenAI-compatible API (GPT models)
 */
const callOpenAI = async (apiKey, systemMessage, userMessage) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

/**
 * Call Anthropic API (Claude models)
 */
const callAnthropic = async (apiKey, systemMessage, userMessage) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemMessage,
      messages: [
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
};

/**
 * Call Google Gemini API
 */
const callGemini = async (apiKey, systemMessage, userMessage) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemMessage }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

/**
 * Map engine name to the correct API caller
 */
const ENGINE_MAP = {
  openai: callOpenAI,
  anthropic: callAnthropic,
  claude: callAnthropic,
  gemini: callGemini,
  google: callGemini
};

/**
 * Resolve which caller to use based on engine_name.
 * Matches case-insensitively against known prefixes/keywords.
 */
const resolveEngineCaller = (engineName) => {
  const name = engineName.toLowerCase();
  for (const [key, caller] of Object.entries(ENGINE_MAP)) {
    if (name.includes(key)) {
      return caller;
    }
  }
  return null;
};

/**
 * @desc    Submit a topic, prompt, and chat engine — proxies to AI API
 * @route   POST /api/public/chat-prompt
 * @access  Public
 */
const submitChatPrompt = async (req, res) => {
  try {
    const { topic_id, prompt_id, chat_engine_id } = req.body;


    if (!chat_engine_id) {
      return res.status(400).json({
        success: false,
        message: 'Chat engine is required'
      });
    }

    // Look up the chat engine (need api_key)
    const chatEngine = await ChatEngine.findById(chat_engine_id);
    if (!chatEngine) {
      return res.status(404).json({
        success: false,
        message: 'Chat engine not found'
      });
    }
    if (!chatEngine.active) {
      return res.status(400).json({
        success: false,
        message: 'Chat engine is not active'
      });
    }

    // Look up topic (optional)
    let topic = null;
    if (topic_id) {
      topic = await Topic.findById(topic_id).populate('prompt');
    }

    // Look up prompt (optional)
    let prompt = null;
    // Use topic's linked prompt if available
    if (topic && topic.prompt) {
      prompt = topic.prompt;
    } else if (prompt_id) {
      // Fallback for backward compatibility
      prompt = await Prompt.findById(prompt_id);
    }

    // Build the system message from prompt + topic context
    const systemParts = [];

    if (prompt) {
      systemParts.push(prompt.prompt);
    }

    if (topic) {
      systemParts.push(`Topic: ${topic.topic_label || topic.topic_name}`);
      if (topic.description) {
        systemParts.push(`Topic context: ${topic.description}`);
      }
    }

    const systemMessage = systemParts.length > 0
      ? systemParts.join('\n\n')
      : 'You are a helpful assistant.';

    // Resolve the correct API caller
    const caller = resolveEngineCaller(chatEngine.engine_name);
    if (!caller) {
      return res.status(400).json({
        success: false,
        message: `Unsupported chat engine: ${chatEngine.engine_name}. Supported engines include: OpenAI, Anthropic/Claude, Google/Gemini.`
      });
    }

    // Call the AI API
    const aiResponse = await caller(chatEngine.api_key, systemMessage);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        engine: chatEngine.engine_name,
        topic: topic ? { topic_name: topic.topic_name, topic_label: topic.topic_label } : null,
        prompt: prompt ? { prompt_name: prompt.prompt_name } : null
      }
    });
  } catch (error) {
    console.error('Chat prompt error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing chat prompt'
    });
  }
};

module.exports = {
  submitChatPrompt
};
