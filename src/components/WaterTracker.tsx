import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
export default function WaterTracker() {
  const today = new Date().toDateString();
  const key = `water_${today}`;
  const [cups, setCups] = useState(0);
  const { currentMember, updateMember } = useFamily();
  useEffect(() => {
    const saved = storage.get(key);
    if (saved) setCups(Number(saved));
  }, []);
  const update = (val: number) => {
    const newVal = Math.max(0, cups + val);
    setCups(newVal);
    storage.set(key, String(newVal));
    // ← مزامنة مع بيانات العائلة
    if (currentMember) updateMember({ water: newVal });
  };
  const goal = 8;
  const percent = Math.min((cups / goal) * 100, 100);
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <h2 className="font-bold text-gray-700 mb-3">💧 شرب الماء</h2>
      <div className="bg-gray-100 rounded-full h-4 mb-3">
        <div
          className="bg-blue-400 h-4 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-center text-gray-600 mb-3">
        {cups} / {goal} أكواب
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => update(-1)}
          className="bg-gray-100 text-gray-700 w-12 h-12 rounded-full text-2xl font-bold"
        >−</button>
        <button
          onClick={() => update(1)}
          className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl font-bold"
        >+</button>
      </div>
    </div>
  );
}

