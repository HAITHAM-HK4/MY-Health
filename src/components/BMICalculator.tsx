import { useState } from 'react';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return;
    setBmi(Math.round((w / (h * h)) * 10) / 10);
  };

  const getStatus = () => {
    if (!bmi) return null;
    if (bmi < 18.5) return { text: 'نحيف 😟',        color: 'text-blue-500' };
    if (bmi < 25)   return { text: 'وزن مثالي 😊',   color: 'text-green-500' };
    if (bmi < 30)   return { text: 'زيادة وزن 😐',   color: 'text-yellow-500' };
    return           { text: 'سمنة ⚠️',              color: 'text-red-500' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">⚖️ حاسبة BMI</h2>

      <input
        type="number"
        placeholder="الوزن (كغ)"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 mb-2 text-right"
      />

      <input
        type="number"
        placeholder="الطول (سم)"
        value={height}
        onChange={e => setHeight(e.target.value)}
        className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-right"
      />

      <button
        onClick={calculate}
        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold mb-3"
      >
        احسب
      </button>

      {bmi && status && (
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">{bmi}</p>
          <p className={`text-lg font-bold mt-1 ${status.color}`}>
            {status.text}
          </p>
        </div>
      )}
    </div>
  );
}