import PaxSenixAI from '@paxsenix/ai';

const paxsenix = new PaxSenixAI({
  apiKey: 'sk-paxsenix-h5_eXrhg7GixWlcynfBz0EP34o9y9DGOuoJhOWTWtCXr4KRv'
});

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are the Troverstar Marketplace AI Assistant. Your job is to help buyers and sellers on the Troverstar platform. 
You assist with tasks like listing items, finding products, handling orders, shipping questions, and general support. 
Provide friendly, clear, and useful answers tailored to online marketplace users.`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array' });
  }

  try {
    const fullMessages = [SYSTEM_PROMPT, ...messages];

    const chatResponse = await paxsenix.Chat.createCompletion({
      model: model || 'gpt-3.5-turbo',
      messages: fullMessages,
    });

    res.status(200).json({ response: chatResponse.choices[0].message });
  } catch (error) {
    console.error('PaxSenix AI error:', error);
    res.status(500).json({ error: 'Something went wrong with PaxSenix AI' });
  }
}
