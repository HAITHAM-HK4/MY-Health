import { Medicine } from '../pages/Medicines';

type Props = {
  medicine: Medicine;
  onTaken: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function MedicineCard({ medicine, onTaken, onDelete }: Props) {
  return (
    <div style={{
      background: medicine.taken
        ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
        : 'white',
      border: `2px solid ${medicine.taken ? '#10b981' : 'rgba(99,102,241,0.1)'}`,
      borderRadius: '20px',
      padding: '1rem',
      marginBottom: '12px',
      boxShadow: medicine.taken
        ? '0 4px 20px rgba(16,185,129,0.15)'
        : '0 4px 20px rgba(99,102,241,0.08)',
      transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>💊</span>
            <h3 style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b' }}>{medicine.name}</h3>
            {medicine.taken && (
              <span style={{
                background: '#10b981', color: 'white',
                borderRadius: '20px', padding: '2px 10px',
                fontSize: '11px', fontWeight: 700,
              }}>✅ تم</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px' }}>
              💉 {medicine.dose}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px' }}>
              🕐 {medicine.time}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px' }}>
              📅 {medicine.days} يوم
            </span>
          </div>
        </div>
        <button onClick={() => onDelete(medicine.id)} style={{
          background: '#fee2e2', color: '#ef4444',
          border: 'none', borderRadius: '10px',
          padding: '6px 10px', cursor: 'pointer', fontSize: '16px',
        }}>🗑️</button>
      </div>

      {!medicine.taken && (
        <button onClick={() => onTaken(medicine.id)} style={{
          width: '100%', marginTop: '12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', border: 'none', borderRadius: '14px',
          padding: '10px', fontWeight: 700, fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
        }}>
          ✅ أخذت الدواء
        </button>
      )}
    </div>
  );
}