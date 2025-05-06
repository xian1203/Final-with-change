import { useState } from "react";

interface TimePickerProps {
  onChange: (time: string) => void;
}

const TimePicker = ({ onChange }: TimePickerProps) => {
  const [time, setTime] = useState("12:00");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onChange(newTime);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="time" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Time
      </label>
      <input
        id="time"
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
      />
    </div>
  );
};

export default TimePicker;
