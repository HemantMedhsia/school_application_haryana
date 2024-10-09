import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalender.css"; // For custom styling

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [events] = useState([
    {
      title: "Design Review",
      start: new Date(2024, 9, 9, 12, 53),
      end: new Date(2024, 9, 9, 14, 0),
      allDay: false,
      color: "bg-blue-600",
    },
    {
      title: "Doctor's Appointment",
      start: new Date(2024, 9, 20, 10, 0),
      end: new Date(2024, 9, 20, 11, 0),
      allDay: false,
      color: "bg-red-600",
    },
    {
      title: "Family Trip",
      start: new Date(2024, 9, 22, 8, 0),
      end: new Date(2024, 9, 24, 20, 0),
      allDay: true,
      color: "bg-green-600",
    },
    {
      title: "Dart Game",
      start: new Date(2024, 9, 18, 18, 0),
      end: new Date(2024, 9, 18, 20, 0),
      allDay: false,
      color: "bg-teal-600",
    },
    {
      title: "Dinner",
      start: new Date(2024, 9, 18, 21, 0),
      end: new Date(2024, 9, 18, 23, 0),
      allDay: false,
      color: "bg-orange-600",
    },
  ]);

  // Custom toolbar for navigation (Previous, Next, Add Event)
  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="flex items-center justify-between p-3 bg-gray-900 text-white">
      <div className="flex items-center">
        <button
          className="text-purple-400 hover:bg-gray-700 p-2 rounded-md"
          onClick={() => onNavigate("PREV")}
        >
          {"<"}
        </button>
        <span className="text-lg font-semibold mx-3">{label}</span>
        <button
          className="text-purple-400 hover:bg-gray-700 p-2 rounded-md"
          onClick={() => onNavigate("NEXT")}
        >
          {">"}
        </button>
      </div>
      <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
        + Add Event
      </button>
    </div>
  );

  // Custom event styling
  const eventPropGetter = (event) => ({
    className: `${event.color} text-white p-1 rounded-md`,
  });

  return (
    <div className="flex h-screen bg-gray-900 w-full">
      {/* Sidebar with small calendar */}
      <ReactCalendar
        onChange={setValue}
        value={value}
        className="custom-calendar"
      />

      {/* Main Calendar */}
      <div className="w-full  h-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          components={{
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
};

export default EventCalendar;
