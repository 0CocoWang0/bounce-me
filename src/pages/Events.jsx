import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../components/SwipeCard";
import { SWIPEABLE_EVENTS } from "../data/mock";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(SWIPEABLE_EVENTS);
  const [swipedEvents, setSwipedEvents] = useState({
    accepted: [],
    rejected: [],
  });

  const handleSwipe = (direction) => {
    if (events.length === 0) return;

    const currentEvent = events[0];
    
    if (direction === "right") {
      setSwipedEvents((prev) => ({
        ...prev,
        accepted: [...prev.accepted, currentEvent],
      }));
    } else {
      setSwipedEvents((prev) => ({
        ...prev,
        rejected: [...prev.rejected, currentEvent],
      }));
    }

    setEvents((prev) => prev.slice(1));
  };

  const handleButtonClick = (direction) => {
    handleSwipe(direction);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 30px)' }}>
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Invited Events</h1>
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
                onSwipe={index === 0 ? handleSwipe : () => {}}
                isTop={index === 0}
                style={{
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                  opacity: 1 - index * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {events.length > 0 && (
        <div className="p-8 flex justify-center items-center gap-8 bg-white">
          {/* Reject Button */}
          <button
            onClick={() => handleButtonClick("left")}
            className="w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
          >
            <span className="text-3xl font-bold text-red-500">✕</span>
          </button>

          {/* Accept Button */}
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