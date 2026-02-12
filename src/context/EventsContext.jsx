import { createContext, useContext, useState } from "react";
import { MOCK_EVENTS } from "../data/mock";

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(MOCK_EVENTS);

  function addEvent(event) {
    setEvents((prev) => [event, ...prev]);
  }

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
