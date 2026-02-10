import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import { getUserById } from "../data/mock";

const SWIPE_THRESHOLD = 80;

export default function SwipeCard({ event, onSwipe, isTop, stackIndex, forceExit }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState(null);
  const [entered, setEntered] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const alreadyExited = useRef(false);

  const host = getUserById(event.host);
  const attendeeUsers = event.attendees.map(getUserById).filter(Boolean);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Handle button-triggered exit
  useEffect(() => {
    if (forceExit && !alreadyExited.current) {
      alreadyExited.current = true;
      setExiting(forceExit);
    }
  }, [forceExit]);

  function handlePointerDown(e) {
    if (!isTop || exiting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  }

  function handlePointerMove(e) {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  }

  function handlePointerUp() {
    if (!dragging) return;
    setDragging(false);

    if (offset.x > SWIPE_THRESHOLD) {
      alreadyExited.current = true;
      setExiting("right");
      setTimeout(() => onSwipe("right"), 350);
    } else if (offset.x < -SWIPE_THRESHOLD) {
      alreadyExited.current = true;
      setExiting("left");
      setTimeout(() => onSwipe("left"), 350);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }

  // Stack positioning
  const stackScale = 1 - stackIndex * 0.05;
  const stackY = stackIndex * 10;
  const rotation = dragging ? offset.x * 0.08 : 0;

  let cardTransform;
  if (exiting === "right") {
    cardTransform = `translateX(150%) rotate(20deg)`;
  } else if (exiting === "left") {
    cardTransform = `translateX(-150%) rotate(-20deg)`;
  } else if (!entered) {
    cardTransform = `scale(${stackScale * 0.92}) translateY(${stackY + 30}px)`;
  } else {
    cardTransform = `scale(${stackScale}) translateY(${stackY}px) translateX(${offset.x}px) rotate(${rotation}deg)`;
  }

  const acceptOpacity = Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1);
  const rejectOpacity = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 1);

  return (
    <div
      className="absolute inset-0 select-none"
      style={{
        transform: cardTransform,
        transition: dragging ? "none" : "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s ease",
        opacity: entered ? 1 - stackIndex * 0.15 : 0,
        zIndex: isTop ? 10 : 5 - stackIndex,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-white relative">
        {/* Image / color area */}
        <div
          className="h-2/3 relative flex items-center justify-center"
          style={{ backgroundColor: event.imageColor }}
        >
          <div className="text-9xl drop-shadow-lg">{event.emoji}</div>

          {/* Accept stamp */}
          <div
            className="absolute top-8 left-6 border-4 border-green-500 text-green-500 px-4 py-2 rounded-xl font-black text-3xl -rotate-12 pointer-events-none"
            style={{ opacity: acceptOpacity }}
          >
            I'M IN
          </div>

          {/* Reject stamp */}
          <div
            className="absolute top-8 right-6 border-4 border-red-500 text-red-500 px-4 py-2 rounded-xl font-black text-3xl rotate-12 pointer-events-none"
            style={{ opacity: rejectOpacity }}
          >
            NOPE
          </div>

          {/* Going badge */}
          {event.attendees.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
              {event.attendees.length - 1} going
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="h-1/3 bg-white p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{event.description}</p>
            <p className="text-sm font-semibold text-gray-700">
              Est. ~${event.estimatedPrice}/person
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-gray-400 text-sm mb-3">{event.date}</p>

            <div className="flex items-center gap-1.5">
              {attendeeUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="ring-2 ring-white rounded-full">
                  <Avatar initials={user.initials} size="sm" />
                </div>
              ))}
              {event.attendees.length > 4 && (
                <span className="text-xs font-semibold text-gray-500 ml-1">
                  +{event.attendees.length - 4}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                by {host?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
