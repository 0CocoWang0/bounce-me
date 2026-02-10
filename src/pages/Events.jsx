import { useState, useRef } from "react";
import SwipeCard from "../components/SwipeCard";
import { SWIPEABLE_EVENTS } from "../data/mock";

export default function Events() {
  const [events, setEvents] = useState(SWIPEABLE_EVENTS);
  const [bg, setBg] = useState(null);
  const [forceExit, setForceExit] = useState(null);
  const busy = useRef(false);

  // Called by SwipeCard after drag-commit OR after forceExit animation
  const handleSwipeComplete = (direction) => {
    setBg(direction);
    setTimeout(() => setBg(null), 500);

    setEvents((prev) => prev.slice(1));
    setForceExit(null);
    busy.current = false;
  };

  // Called by buttons
  const handleButtonClick = (direction) => {
    if (busy.current || events.length === 0) return;
    busy.current = true;

    // Set bg immediately so color shows behind the exiting card
    setBg(direction);
    setTimeout(() => setBg(null), 500);

    // Tell the top card to animate out
    setForceExit(direction);

    // Remove the card after animation
    setTimeout(() => {
      setEvents((prev) => prev.slice(1));
      setForceExit(null);
      busy.current = false;
    }, 400);
  };

  const bgColor =
    bg === "right"
      ? "bg-green-500"
      : bg === "left"
        ? "bg-red-500"
        : "bg-white";

  return (
    <div
      className={`flex flex-col relative transition-colors duration-300 ${bgColor}`}
      style={{ height: "calc(100vh - 30px)" }}
    >
      {/* Header */}
      <div className="p-4">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${bg ? "text-white" : "text-black"}`}>
          Invited Events
        </h1>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative p-4">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">No More Events</h2>
            <p className="text-gray-600">
              You've seen all of your invited events. Check back later for more!
            </p>

          </div>
        ) : (
          <div className="relative h-full">
            {events.slice(0, 3).map((event, index) => (
              <SwipeCard
                key={event.id}
                event={event}
                onSwipe={index === 0 ? handleSwipeComplete : () => { }}
                isTop={index === 0}
                stackIndex={index}
                forceExit={index === 0 ? forceExit : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {events.length > 0 && (
        <div className="p-8 flex justify-center items-center gap-8">
          <button
            onClick={() => handleButtonClick("left")}
            className={`w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 ${bg ? "bg-transparent" : "bg-white"}`}
          >
            <span className="text-3xl font-bold text-red-500">✕</span>
          </button>

          <button
            onClick={() => handleButtonClick("right")}
            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
          >
            <span className="text-3xl font-bold text-white">✓</span>
          </button>
        </div>
      )}
    </div>
  );
}
