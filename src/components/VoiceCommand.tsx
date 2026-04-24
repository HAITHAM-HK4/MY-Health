import { useState } from 'react';

type Props = { onNavigate: (page: string) => void };

export default function VoiceCommand({ onNavigate }: Props) {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');

  const commands: Record<string, string> = {
    'الرئيسية': 'home',
    'الأدوية':  'medicines',
    'صحتي':     'health',
    'الأعراض':  'symptoms',
    'التقويم':  'calendar',
    'الإعدادات':'settings',
    'سجلاتي':  'records',
    'الذكاء':   'ai',
    'إنجازات':  'achievements',
    'لقاحات':   'vaccines',
    'تاريخي':   'history',
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setResponse('المتصفح لا يدعم الصوت'); return; }

    const recognition = new SR();
    recognition.lang = 'ar-SA';
    recognition.onstart = () => setListening(true);
    recognition.onend   = () => setListening(false);
    recognition.onresult = (e: any) => {
      const said = e.results[0][0].transcript;
      setText(said);
      const matched = Object.keys(commands).find(cmd => said.includes(cmd));
      if (matched) {
        onNavigate(commands[matched]);
        setResponse(`✅ ${matched}`);
      } else {
        setResponse('لم أفهم — جرب: الأدوية، صحتي');
      }
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 left-4 z-40">
      <button onClick={startListening}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl ${
          listening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
        }`}>
        🎤
      </button>
      {(text || response) && (
        <div className="absolute bottom-16 left-0 bg-white rounded-2xl p-3 shadow-lg w-48 text-xs" dir="rtl">
          {text && <p className="text-gray-500 mb-1">سمعت: {text}</p>}
          {response && <p className="text-blue-600 font-bold">{response}</p>}
        </div>
      )}
    </div>
  );
}