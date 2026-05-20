import dotenv from 'dotenv';
dotenv.config();

const testKey = async (key, name) => {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: 'hi' }]
      })
    });
    console.log(`${name} Status:`, res.status);
    const body = await res.json();
    console.log(`${name} Body:`, JSON.stringify(body, null, 2));
  } catch (err) {
    console.error(`${name} Error:`, err.message);
  }
};

const run = async () => {
  await testKey(process.env.OPENROUTER_API_KEY_1, 'Key 1');
  await testKey(process.env.OPENROUTER_API_KEY_2, 'Key 2');
  await testKey(process.env.OPENROUTER_API_KEY_3, 'Key 3');
};
run();
