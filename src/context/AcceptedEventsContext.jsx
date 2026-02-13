import { createContext, useContext, useState } from "react";
import { MOCK_EVENTS } from "../data/mock";

const AcceptedEventsContext = createContext();

export function AcceptedEventsProvider({ children }) {
  // Initialize count with number of active groups (upcoming or splitting, not closed)
  const initialCount = MOCK_EVENTS.filter(
    (e) => e.status === "upcoming" || e.status === "splitting"
  ).length;

  const [acceptedCount, setAcceptedCount] = useState(initialCount);

  const incrementAccepted = () => {
    setAcceptedCount(prev => prev + 1);
  };

  return (
    <AcceptedEventsContext.Provider value={{ acceptedCount, incrementAccepted }}>
      {children}
    </AcceptedEventsContext.Provider>
  );
}

export function useAcceptedEvents() {
  const context = useContext(AcceptedEventsContext);
  if (!context) {
    throw new Error("useAcceptedEvents must be used within AcceptedEventsProvider");
  }
  return context;
}