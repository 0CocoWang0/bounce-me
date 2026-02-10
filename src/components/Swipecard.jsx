import { useState, useRef } from "react";
import Avatar from "./Avatar";
import { getUserById } from "../data/mock";

export default function SwipeCard({ event, onSwipe, style, isTop }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchCurrent, setTouchCurrent] = useState(null);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setTouchCurrent({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchCurrent) {
      setTouchStart(null);
      setTouchCurrent(null);
      return;
    }

    const deltaX = touchCurrent.x - touchStart.x;
    const deltaY = Math.abs(touchCurrent.y - touchStart.y);

    // Check if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        onSwipe("right");
      } else {
        onSwipe("left");
      }
    }

    setTouchStart(null);
    setTouchCurrent(null);
  };

  const host = getUserById(event.host);
  const attendeeUsers = event.attendees.map(getUserById);

  // Calculate drag position
  const dragX = touchStart && touchCurrent ? touchCurrent.x - touchStart.x : 0;
  const dragY = touchStart && touchCurrent ? touchCurrent.y - touchStart.y : 0;
  const rotation = dragX * 0.05; // Subtle rotation based on drag

  // Calculate opacity for accept/reject indicators
  const acceptOpacity = Math.min(Math.max(dragX / 150, 0), 1);
  const rejectOpacity = Math.min(Math.max(-dragX / 150, 0), 1);

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 touch-none"
      style={{
        ...style,
        transform: `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)`,
        transition: touchStart ? "none" : "transform 0.3s ease-out",
        zIndex: isTop ? 10 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white relative">
        {/* Image/Color Section */}
        <div
          className="h-2/3 relative flex items-center justify-center"
          style={{ backgroundColor: event.imageColor }}
        >
          {/* Large Emoji */}
          <div className="text-9xl">{event.emoji}</div>

          {/* Accept Indicator */}
          <div
            className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl rotate-12 border-4 border-white"
            style={{ opacity: acceptOpacity }}
          >
            ✓
          </div>

          {/* Reject Indicator */}
          <div
            className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl -rotate-12 border-4 border-white"
            style={{ opacity: rejectOpacity }}
          >
            ✕
          </div>

          {/* Indicator Badge */}
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
            {event.attendees.length > 1 && `${event.attendees.length - 1} going`}
          </div>
        </div>

        {/* Content Section */}
        <div className="h-1/3 bg-white p-6 flex flex-col justify-between">
          {/* Description */}
          <p className="text-center text-base mb-3 text-gray-700">
            {event.description}
            <br />
            <span className="font-semibold">Est. Price: ${event.estimatedPrice}?</span>
          </p>

          {/* Event Name, Date */}
          <div>
            <h2 className="text-3xl font-bold mb-1">{event.title}</h2>
            <p className="text-gray-600 mb-3">{event.date}</p>

            {/* Attendees */}
            <div className="flex items-center gap-2">
              {attendeeUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} initials={user.initials} size="sm" />
              ))}
              {event.attendees.length > 3 && (
                <span className="text-sm font-semibold text-gray-600">
                  +{event.attendees.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}