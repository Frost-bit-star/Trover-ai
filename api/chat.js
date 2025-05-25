import PaxSenixAI from '@paxsenix/ai';

const paxsenix = new PaxSenixAI();

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are the Troverstar Marketplace AI Assistant. 
You only respond to questions about the Troverstar platform, including listing items, finding products, handling orders, shipping, or general support. 
If a user says hello or greets you, respond politely and guide them back to Troverstar-related help. 
If someone asks something unrelated to Troverstar, politely inform them that you can only assist with Troverstar Marketplace topics.`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array' });
  }

  const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.includes(userMessage.trim())) {
    return res.json({
      response: {
        role: 'assistant',
        content: 'Hi, I am the Troverstar Marketplace AI Assistant. How can I help you with your marketplace needs today?'
      }
    });
  }

  try {
    const fullMessages = [SYSTEM_PROMPT, ...messages];

    const chatResponse = await paxsenix.Chat.createCompletion({
      model: model || 'gpt-3.5-turbo',
      messages: fullMessages,
    });

    res.json({ response: chatResponse.choices[0].message });
  } catch (error) {
    console.error('PaxSenix AI error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Something went wrong with PaxSenix AI' });
  }
}