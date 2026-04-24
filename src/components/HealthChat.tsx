import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const callGemini = async (messages: Message[]): Promise<string> => {
  const history = messages.map(m =>
    `${m.role === 'user' ? 'المستخدم' : 'المساعد'}: ${m.content}`
  ).join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `أنت مساعد صحي ذكي باللغة العربية. ردودك قصيرة ومفيدة. دائماً أذكّر بزيارة الطبيب للحالات الجدية.\n\n${history}`
          }]
        }],
      }),
    }
  );
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export default function HealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً! أنا مساعدك الصحي 🤖 كيف يمكنني مساعدتك؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await callGemini(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'حدث خطأ، حاول مرة ثانية' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-2xl max-w-xs text-sm ${
            msg.role === 'user'
              ? 'bg-purple-500 text-white self-start'
              : 'bg-gray-100 text-gray-800 self-end'
          }`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl self-end text-sm">
            ⏳ جاري التفكير...
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="اسأل عن صحتك..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 border border-gray-200 rounded-xl p-3 text-right text-sm"
        />
        <button onClick={send} disabled={loading}
          className="bg-purple-500 text-white px-4 rounded-xl font-bold">
          إرسال
        </button>
      </div>
    </div>
  );
}