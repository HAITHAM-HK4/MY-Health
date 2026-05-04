import { storage } from '../lib/storage';
// src/components/HealthChat.tsx — v2.0 (redesigned)
import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'assistant'; content: string; ts?: number };
type Props = { theme?: 'dark' | 'light' };

const GROQ_KEY = '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';

const callAI = async (messages: Message[]): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'أنت مساعد صحي ذكي ومتفهم باللغة العربية. ردودك واضحة ومفيدة وإيجابية. استخدم إيموجي باعتدال. دائماً انصح بزيارة الطبيب للحالات الجدية.',
        },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'خطأ غير معروف');
  return data.choices[0].message.content;
};

const QUICK_PROMPTS = [
  { icon: '💊', text: 'كيف أتحسّن من نزلة البرد؟' },
  { icon: '😴', text: 'نصائح لنوم أفضل' },
  { icon: '🥗', text: 'ما هو النظام الغذائي الصحي؟' },
  { icon: '🏃', text: 'تمارين مناسبة للمبتدئين' },
];

export default function HealthChat({ theme }: Props) {
  const dark = theme === 'dark';

  // 1. استرجاع المسودة من الذاكرة المحلية عند بدء التشغيل
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedDraft = storage.get('health_chat_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse chat draft', e);
      }
    }
    return [{ role: 'assistant', content: 'مرحباً! أنا مساعدك الصحي الذكي 🤖\nكيف يمكنني مساعدتك اليوم؟', ts: Date.now() }];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. حفظ المحادثة تلقائياً كمسودة مع أي تغيير
  useEffect(() => {
    storage.set('health_chat_draft', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: msg, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await callAI(newMessages.map(m => ({ role: m.role, content: m.content })));
      setMessages([...newMessages, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessages([...newMessages, {
        role: 'assistant',
        content: `⚠️ تعذّر الاتصال: ${errorMsg}\nتحقق من اتصالك وحاول مجدداً.`,
        ts: Date.now(),
      }]);
    }
    setLoading(false);
  };

  // 3. دالة لمسح المسودة وبدء محادثة جديدة
  const clearChat = () => {
    if (window.confirm('هل أنت متأكد من مسح المحادثة السابقة؟')) {
      const initMsg: Message[] = [{ role: 'assistant', content: 'مرحباً! أنا مساعدك الصحي الذكي 🤖\nكيف يمكنني مساعدتك اليوم؟', ts: Date.now() }];
      setMessages(initMsg);
      storage.remove('health_chat_draft');
    }
  };

  /* ── Theme tokens ── */
  const bg         = dark ? 'transparent'                  : 'transparent';
  const userBubble = dark ? 'rgba(99,102,241,0.22)'        : 'rgba(99,102,241,0.12)';
  const userBorder = dark ? 'rgba(99,102,241,0.35)'        : 'rgba(99,102,241,0.25)';
  const userText   = dark ? 'rgba(226,232,240,0.95)'       : '#1e293b';
  const aiBubble   = dark ? 'rgba(255,255,255,0.05)'       : '#f1f5f9';
  const aiBorder   = dark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.07)';
  const aiText     = dark ? 'rgba(226,232,240,0.9)'        : '#334155';
  const tsColor    = dark ? 'rgba(255,255,255,0.2)'        : '#cbd5e1';
  const inputBg    = dark ? 'rgba(255,255,255,0.05)'       : '#f8fafc';
  const inputBord  = dark ? 'rgba(255,255,255,0.1)'        : 'rgba(0,0,0,0.1)';
  const inputText  = dark ? 'rgba(226,232,240,0.9)'        : '#1e293b';
  const inputPH    = dark ? 'rgba(255,255,255,0.3)'        : '#94a3b8';
  const qpBg       = dark ? 'rgba(255,255,255,0.04)'       : '#f8fafc';
  const qpBord     = dark ? 'rgba(255,255,255,0.08)'       : 'rgba(0,0,0,0.07)';
  const qpText     = dark ? 'rgba(255,255,255,0.55)'       : '#475569';
  const sendActive = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  const sendDis    = dark ? 'rgba(255,255,255,0.07)'       : 'rgba(0,0,0,0.06)';
  const emptyText  = dark ? 'rgba(255,255,255,0.3)'        : '#94a3b8';
  const divColor   = dark ? 'rgba(255,255,255,0.05)'       : 'rgba(0,0,0,0.06)';

  return (
    <div dir="rtl" style={{ background: bg, display: 'flex', flexDirection: 'column', height: '520px' }}>

      {/* ── شريط المسودة (Draft Header) ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 4px 10px', borderBottom: `1px solid ${divColor}`, marginBottom: '10px'
      }}>
        <span style={{ fontSize: '11px', color: tsColor, fontWeight: 600 }}>
          💾 المحادثة محفوظة كمسودة تلقائياً
        </span>
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            style={{
              background: dark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'}`,
              color: dark ? '#fca5a5' : '#ef4444',
              borderRadius: '8px', padding: '4px 10px', fontSize: '10px',
              cursor: 'pointer', fontFamily: "'Cairo', 'Tajawal', sans-serif",
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            🗑️ مسح المحادثة
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '4px 0 8px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        scrollbarWidth: 'none',
      }}>

        {/* Welcome quick prompts */}
        {messages.length === 1 && (
          <div style={{ padding: '8px 0 4px' }}>
            <p style={{ fontSize: '11px', color: emptyText, marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px' }}>
              اقتراحات سريعة ↓
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q.text}
                  onClick={() => send(q.text)}
                  style={{
                    background: qpBg, border: `1px solid ${qpBord}`,
                    borderRadius: '14px', padding: '10px 12px',
                    color: qpText, fontSize: '12px', fontWeight: 600,
                    fontFamily: "'Cairo', 'Tajawal', sans-serif",
                    cursor: 'pointer', textAlign: 'right',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = dark
                      ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.3)';
                    (e.currentTarget as HTMLButtonElement).style.color = dark ? '#a5b4fc' : '#4f46e5';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = qpBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = qpBord;
                    (e.currentTarget as HTMLButtonElement).style.color = qpText;
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{q.icon}</span>
                  <span style={{ lineHeight: 1.4 }}>{q.text}</span>
                </button>
              ))}
            </div>
            <div style={{ height: '1px', background: divColor, margin: '16px 0 4px' }} />
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, marginBottom: '2px',
                background: isUser
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
                  : dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
                border: isUser
                  ? '1px solid rgba(99,102,241,0.3)'
                  : dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)',
              }}>
                {isUser ? '👤' : '🤖'}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '78%',
                background: isUser ? userBubble : aiBubble,
                border: `1px solid ${isUser ? userBorder : aiBorder}`,
                borderRadius: isUser
                  ? '18px 4px 18px 18px'
                  : '4px 18px 18px 18px',
                padding: '10px 14px',
              }}>
                <p style={{
                  color: isUser ? userText : aiText,
                  fontSize: '13px', lineHeight: 1.75,
                  margin: 0, whiteSpace: 'pre-wrap',
                  fontFamily: "'Cairo', 'Tajawal', sans-serif",
                }}>
                  {msg.content}
                </p>
                {msg.ts && (
                  <p style={{
                    fontSize: '10px', color: tsColor, margin: '4px 0 0',
                    textAlign: isUser ? 'left' : 'right',
                  }}>
                    {new Date(msg.ts).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              background: dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
              border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)',
            }}>🤖</div>
            <div style={{
              background: aiBubble, border: `1px solid ${aiBorder}`,
              borderRadius: '4px 18px 18px 18px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              {[0, 0.2, 0.4].map((d, idx) => (
                <span key={idx} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.7)', display: 'inline-block',
                  animation: 'hc-bounce 1.2s ease-in-out infinite',
                  animationDelay: `${d}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        borderTop: `1px solid ${divColor}`, paddingTop: '12px', marginTop: '4px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: inputBg, border: `1px solid ${inputBord}`,
          borderRadius: '16px', padding: '8px 8px 8px 14px',
          transition: 'border-color 0.2s',
        }}
          onFocusCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'}
          onBlurCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor = inputBord}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="اسأل عن صحتك..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: inputText, fontSize: '13px',
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              textAlign: 'right', direction: 'rtl',
            }}
          />

          {/* Clear button */}
          {input.length > 0 && (
            <button
              onClick={() => { setInput(''); inputRef.current?.focus(); }}
              style={{
                width: 24, height: 24, borderRadius: '50%', border: 'none',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                color: dark ? 'rgba(255,255,255,0.4)' : '#94a3b8',
                cursor: 'pointer', fontSize: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >×</button>
          )}

          {/* Send button */}
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 36, height: 36, borderRadius: '12px', border: 'none',
              background: input.trim() && !loading ? sendActive : sendDis,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 0 14px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 2L6.5 9M13.5 2L9 14L6.5 9M13.5 2L1.5 6.5L6.5 9"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '6px', fontSize: '10px', color: tsColor,
        }}>
          مدعوم بـ Llama 3.3 • اضغط Enter للإرسال
        </p>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes hc-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

