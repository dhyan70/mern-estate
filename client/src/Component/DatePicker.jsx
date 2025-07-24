import { useEffect, useRef, useState } from "react";

 const  DateRangePicker=() =>{
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const datepickerRef = useRef(null);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const day = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, day, 1).getDay();
    const daysInMonth = new Date(year, day + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, day, i);
      const dayString = day.toLocaleDateString("en-US");
      let className =
        "flex h-[46px] w-[46px] items-center justify-center rounded-full hover:bg-gray-2 dark:hover:bg-dark mb-2";

      if (selectedStartDate && dayString === selectedStartDate) {
        className += " bg-primary text-white dark:text-white rounded-r-none";
      }
      if (selectedEndDate && dayString === selectedEndDate) {
        className += " bg-primary text-white dark:text-white rounded-l-none";
      }
      if (
        selectedStartDate &&
        selectedEndDate &&
        new Date(day) > new Date(selectedStartDate) &&
        new Date(day) < new Date(selectedEndDate)
      ) {
        className += " bg-dark-3 rounded-none";
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          data-date={dayString}
          onClick={() => handleDayClick(dayString)}
        >
          {i}
        </div>,
      );
    }

    return daysArray;
  };

  const handleDayClick = (selectedDay) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(selectedDay);
      setSelectedEndDate(null);
    } else {
      if (new Date(selectedDay) < new Date(selectedStartDate)) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(selectedDay);
      } else {
        setSelectedEndDate(selectedDay);
      }
    }
  };

  const updateInput = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${selectedStartDate} - ${selectedEndDate}`;
    } else if (selectedStartDate) {
      return selectedStartDate;
    } else {
      return "";
    }
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Any initialization code can go here
  }, []);
   return (
 <section className="bg-white py-4">
  <div className="max-w-sm w-full" ref={datepickerRef}>
    {/* Input field */}
    <div className="relative mb-2">
      <input
        type="text"
        placeholder="Pick date range"
        className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700"
        value={updateInput()}
        onClick={toggleDatepicker}
        readOnly
      />
      <span
        onClick={toggleDatepicker}
        className="absolute left-2 top-0 bottom-0 flex items-center justify-center text-gray-400 cursor-pointer"
      >
        📅
      </span>
    </div>

    {/* Calendar panel */}
    {isOpen && (
      <div className="w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between text-sm mb-2">
          <p className="font-medium text-gray-800">
            {currentDate.toLocaleString("default", { day: "long" })}{" "}
            {currentDate.getFullYear()}
          </p>
          <div className="flex space-x-1">
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
              }
              className="text-gray-500 hover:text-primary"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
              }
              className="text-gray-500 hover:text-primary"
            >
              →
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar day */}
        <div className="grid grid-cols-7 text-sm text-center">
          {renderCalendar()}
        </div>

        {/* Selected Dates */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-600">
          <span>{selectedStartDate || "Start"}</span>
          <span>{selectedEndDate || "End"}</span>
        </div>
      </div>
    )}
  </div>
</section>

   )
}
export default DateRangePicker