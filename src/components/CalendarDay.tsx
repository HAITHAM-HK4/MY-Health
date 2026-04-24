type Props = {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  water: number;
  mood: number;
  allTaken: boolean;
  onClick: () => void;
};

export default function CalendarDay({
  day, isToday, isSelected, water, mood, allTaken, onClick
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
        isSelected
          ? 'bg-blue-500 text-white'
          : isToday
          ? 'bg-blue-100 text-blue-700 font-bold'
          : 'bg-white text-gray-700'
      }`}
    >
      <span className="font-bold">{day}</span>
      <div className="flex gap-px mt-px">
        {water >= 4 && <span className="text-xs">💧</span>}
        {allTaken && <span className="text-xs">💊</span>}
        {mood >= 4 && <span className="text-xs">😊</span>}
      </div>
    </button>
  );
}