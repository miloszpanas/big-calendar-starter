import React from "react";

import events from "./Events";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "moment/locale/pl";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

moment.locale("pl");
const localizer = BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

// obiekt z nazwami przycisków do manipulowania widokami
const messages = {
  allDay: "Cały dzień",
  previous: "Poprzedni",
  next: "Następny",
  today: "Dziś",
  month: "Miesiąc",
  week: "Tydzień",
  work_week: "Tydzień pracujący",
  day: "Dzień",
  agenda: "Terminarz",
  date: "Data",
  time: "Czas",
  event: "Wydarzenie",
  noEventsInRange: "Brak wydarzeń",
  showMore: total => `+ Pokaż więcej (${total})`
};

class CalendarApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: events
    };
  }

  // przekazywanie randomowych styli do eventow
  eventStyleGetter = ({ event, start, end, isSelected }) => {
    console.log(event);
    let newStyle = {
      backgroundColor: "lightblue",
      borderRadius: "0px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block"
    };
    return {
      style: newStyle
    };
  };

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state;

    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    this.setState({
      events: nextEvents
    });

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent;
    });

    this.setState({
      events: nextEvents
    });

    //alert(`${event.title} was resized to ${start}-${end}`)
  };


  // dodaj nowy event 
  handleSelect = ({ start, end }) => {
    const title = window.prompt("Podaj nazwę eventu");
    console.log(events);
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title
          }
        ]
      });
  };

  render() {
    const PokaDane = (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.state.events}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        onSelectSlot={this.handleSelect}
        defaultView={BigCalendar.Views.MONTH}
        defaultDate={new Date()}
        views={allViews}
        startAccessor="start"
        endAccessor="end"
        // step={60}
        style={{ height: "100vh" }}
        messages={messages}
        eventPropGetter={this.eventStyleGetter}
      />
    );
    console.log(PokaDane);
    return PokaDane;
  }
}

export default CalendarApp;
