import { createContext, useContext, useState, useCallback } from "react";
import { MOCK_EVENTS } from "../data/mock";

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(MOCK_EVENTS);

  const addEvent = useCallback((event) => {
    setEvents((prev) => [event, ...prev]);
  }, []);

  const settleEvent = useCallback((eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: "settled",
              splits: (e.splits || []).map((s) => ({ ...s, paid: true })),
            }
          : e
      )
    );
  }, []);

  return (
    <EventsContext.Provider value={{ events, addEvent, settleEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
