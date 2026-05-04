import { useState } from 'react';

const GROQ_KEY = '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';

type Props = { theme?: 'dark' | 'light' };

export default function MedicineInfo({ theme }: Props) {
  const dark = theme === 'dark';
  const [medicine, setMedicine] = useState('');
  const [result,   setResult]   = useState('');
  const [loading,  setLoading]  = useState(false);

  const search = async () => {
    if (!medicine.trim()) return;
    setLoading(true);
    setResult('');
    try {
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
              content: 'أنت صيدلي ذكي ومتخصص. قدم معلومات دقيقة ومختصرة وواضحة باللغة العربية.',
            },
            {
              role: 'user',
              content: `أعطني معلومات عن دواء "${medicine}" بالعربية تشمل:
              1. استخداماته
              2. الجرعة المعتادة
              3. الآثار الجانبية
              4. تحذيرات مهمة
              اجعل الإجابة مرتبة ومنسقة في نقاط.`,
            },
          ],
          max_tokens: 1000,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'خطأ غير معروف');
      setResult(data.choices[0].message.content);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setResult(`⚠️ تعذّر الاتصال: ${errorMsg}\nتحقق من اتصالك وحاول مجدداً.`);
    }
    setLoading(false);
  };

  // ── ألوان حسب الثيم ──────────────────────────────────────
  const inputBg      = dark ? 'rgba(255,255,255,0.07)' : '#f8fafc';
  const inputBorder  = dark ? 'rgba(255,255,255,0.12)' : '#e2e8f0';
  const inputColor   = dark ? 'rgba(226,232,240,0.95)' : '#1e293b';   // ← الإصلاح الرئيسي
  const placeholderColor = dark ? 'rgba(148,163,184,0.6)' : '#94a3b8';
  const resultBg     = dark ? 'rgba(34,211,238,0.07)'  : '#eff6ff';
  const resultBorder = dark ? 'rgba(34,211,238,0.2)'   : '#bfdbfe';
  const resultColor  = dark ? 'rgba(226,232,240,0.92)' : '#1e3a5f';   // ← الإصلاح الرئيسي
  const resultNote   = dark ? 'rgba(148,163,184,0.55)' : '#64748b';
  const loadingColor = dark ? '#a78bfa'                : '#7c3aed';

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* ── حقل البحث ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="اسم الدواء..."
          value={medicine}
          onChange={e => setMedicine(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: inputBg,
            border: `1.5px solid ${inputBorder}`,
            borderRadius: '14px',
            color: inputColor,               // ✅ لون واضح
            fontSize: '14px',
            fontFamily: "'Cairo', sans-serif",
            textAlign: 'right',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(34,211,238,0.5)')}
          onBlur={e  => (e.target.style.borderColor = inputBorder)}
        />
        {/* CSS لـ placeholder */}
        <style>{`
          input::placeholder { color: ${placeholderColor}; }
        `}</style>

        <button
          onClick={search}
          disabled={loading}
          style={{
            padding: '12px 20px',
            background: loading
              ? 'rgba(99,102,241,0.4)'
              : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none',
            borderRadius: '14px',
            color: 'white',
            fontWeight: 800,
            fontSize: '14px',
            fontFamily: "'Cairo', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.4)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          🔍 بحث
        </button>
      </div>

      {/* ── حالة التحميل ──────────────────────────────────── */}
      {loading && (
        <p style={{
          textAlign: 'center',
          color: loadingColor,
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '12px',
        }}>
          ⏳ جاري البحث...
        </p>
      )}

      {/* ── نتيجة البحث ───────────────────────────────────── */}
      {result && (
        <div style={{
          background: resultBg,
          border: `1.5px solid ${resultBorder}`,
          borderRadius: '16px',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* خط علوي */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px',
            background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.5),transparent)',
          }} />

          <p style={{
            fontSize: '13px',
            lineHeight: 1.9,
            color: resultColor,              // ✅ لون واضح وداكن
            whiteSpace: 'pre-line',
            margin: 0,
            fontWeight: 500,
          }}>
            {result}
          </p>

          <p style={{
            fontSize: '11px',
            color: resultNote,
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
          }}>
            ⚠️ استشر الصيدلاني قبل التناول
          </p>
        </div>
      )}
    </div>
  );
}
