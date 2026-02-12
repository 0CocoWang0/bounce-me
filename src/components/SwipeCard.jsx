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

    } else if (offset.y > SWIPE_THRESHOLD) {
      alreadyExited.current = true;
      setExiting("down");
      setTimeout(() => onSwipe("down"), 350);

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
  } else if (exiting === "down") {
    cardTransform = `translateY(150%) rotate(5deg)`;
  } else if (!entered) {
    cardTransform = `scale(${stackScale * 0.92}) translateY(${stackY + 30}px)`;
  } else {
    cardTransform = `scale(${stackScale}) translateY(${stackY}px) translateX(${offset.x}px) rotate(${rotation}deg)`;
  }

  const acceptOpacity = Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1);
  const rejectOpacity = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 1);
  const considerOpacity = Math.min(Math.max(offset.y / SWIPE_THRESHOLD, 0), 1);

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
      <div className="w-full max-h-full rounded-3xl min-h-1/2 h-full shadow-2xl overflow-visible bg-white dark:bg-card-dark relative flex flex-col">


        {/* Image / color area */}
        <div
          className="flex-2 min-h-0 relative flex items-center justify-center rounded-t-3xl overflow-hidden"
          style={{ backgroundColor: event.imageColor }}
        >
          <div className="text-8xl drop-shadow-lg">{event.emoji}</div>

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

          {/* Considering stamp */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 border-4 border-yellow-400 text-yellow-500 px-4 py-2 rounded-xl font-black text-2xl pointer-events-none"
              style={{ opacity: considerOpacity }}
            >
              THINKING
            </div>

          {/* Going badge + attendee avatars — top right */}
          {event.attendees.length > 1 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {attendeeUsers.slice(0, 3).map((user, i) => (
                  <div
                    key={user.id}
                    className="ring-2 ring-white/30 rounded-full animate-bounce-slow"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <Avatar initials={user.initials} avatar={user.avatar} size="sm" />
                  </div>
                ))}
              </div>
              <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                {event.attendees.length - 1} going
              </div>
            </div>
          )}
        </div>

        {/* Info section — no clipping, content-driven height */}
        <div className="shrink-0 bg-white dark:bg-card-dark p-5 rounded-b-3xl">
          <div className="flex items-start gap-4">
            {/* Left: event details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">{event.description}</p>
              <h2 className="text-xl font-bold dark:text-white leading-tight">{event.title}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{event.date}</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                ~${event.estimatedPrice}/person
              </p>
            </div>

            {/* Right: host avatar + name */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Avatar initials={host?.initials ?? "?"} avatar={host?.avatar} size="xl" />
              <span className="text-xs text-gray-400 font-medium">{host?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
