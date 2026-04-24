import { useState } from 'react';

export default function EmergencyButton() {
  const [show, setShow] = useState(false);
  const emergency = localStorage.getItem('emergency') || '';

  const call = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      <button onClick={() => setShow(true)}
        className="fixed top-4 left-4 z-40 bg-red-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl animate-pulse">
        🆘
      </button>
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" dir="rtl">
            <h2 className="text-2xl font-bold text-red-600 text-center mb-4">🆘 طوارئ</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => call('110')} className="bg-red-500 text-white py-4 rounded-xl font-bold text-lg">🚑 الإسعاف — 110</button>
              <button onClick={() => call('113')} className="bg-blue-500 text-white py-4 rounded-xl font-bold text-lg">🚒 الإطفاء — 113</button>
              <button onClick={() => call('112')} className="bg-gray-700 text-white py-4 rounded-xl font-bold text-lg">🚔 الشرطة — 112</button>
              {emergency && (
                <button onClick={() => call(emergency)} className="bg-green-500 text-white py-4 rounded-xl font-bold text-lg">👤 طوارئ شخصي — {emergency}</button>
              )}
            </div>
            <button onClick={() => setShow(false)} className="w-full mt-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">إغلاق</button>
          </div>
        </div>
      )}
    </>
  );
}