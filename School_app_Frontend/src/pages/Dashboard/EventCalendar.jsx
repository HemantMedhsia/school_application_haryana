import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import './EventCalendar.css'; // Custom styles

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events] = useState([
    {
      title: 'Design Review',
      start: new Date(2024, 8, 6, 12, 58),
      end: new Date(2024, 8, 6, 14, 0),
      type: 'Business',
    },
    {
      title: 'Dart Game?',
      start: new Date(2024, 8, 17, 10, 0),
      end: new Date(2024, 8, 17, 12, 0),
      type: 'Personal',
    },
    {
      title: 'Family Trip',
      start: new Date(2024, 8, 21, 10, 0),
      end: new Date(2024, 8, 21, 14, 0),
      type: 'Family',
    },
  ]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default color
    switch (event.type) {
      case 'Personal':
        backgroundColor = '#0277bd';
        break;
      case 'Business':
        backgroundColor = '#8e24aa';
        break;
      case 'Family':
        backgroundColor = '#43a047';
        break;
      default:
        backgroundColor = '#546e7a';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        color: 'white',
        padding: '5px',
        border: 'none',
        fontSize: '12px',
        fontWeight: '500',
      },
    };
  };

  return (
    <div className="calendar-layout rounded-md">
      <aside className="sidebar">
        <button className="add-event-btn">Add Event</button>
        <div className="filters">
          <h3 className="filter-title">Calendars</h3>
          <ul className="filter-list">
            <li><input type="checkbox" checked readOnly /> <span>View All</span></li>
            <li><input type="checkbox" checked readOnly /> <span>Personal</span></li>
            <li><input type="checkbox" checked readOnly /> <span>Business</span></li>
            <li><input type="checkbox" checked readOnly /> <span>Family</span></li>
            <li><input type="checkbox" /> <span>Holiday</span></li>
            <li><input type="checkbox" /> <span>ETC</span></li>
          </ul>
        </div>
      </aside>
      <main className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ border: 'none' }}
          popup
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: ({ label, onNavigate, onView }) => (
              <div className="calendar-toolbar">
                <button className="nav-btn" onClick={() => onNavigate('PREV')}>❮</button>
                <span className="calendar-label">{label}</span>
                <button className="nav-btn" onClick={() => onNavigate('NEXT')}>❯</button>
                <div className="view-buttons">
                  <button className="view-btn" onClick={() => onView('month')}>Month</button> 
                  <button className="view-btn" onClick={() => onView('week')}>Week</button>
                  <button className="view-btn" onClick={() => onView('day')}>Day</button>
                  <button className="view-btn" onClick={() => onView('agenda')}>List</button>
                </div>
              </div>
            ),
          }}
        />
      </main>
    </div>
  );
};

export default EventCalendar;
