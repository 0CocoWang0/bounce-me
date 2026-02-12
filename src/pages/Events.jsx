import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SwipeCard from "../components/SwipeCard";
import { SWIPEABLE_EVENTS, getUserById } from "../data/mock";
import { useAcceptedEvents } from "../context/AcceptedEventsContext";

export default function Events() {
  const [events, setEvents] = useState(SWIPEABLE_EVENTS);
  const [bg, setBg] = useState(null);
  const [forceExit, setForceExit] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const busy = useRef(false);
  const { incrementAccepted } = useAcceptedEvents();

  function recordAndRemove(direction) {
    const current = events[0];
    if (current) {
      let decision = "declined";
      if (direction === "right") {
        decision = "accepted";
        incrementAccepted(); // Increment counter when accepting
      }
      if (direction === "down") decision = "considering";

      setHistory((prev) => [
        { event: current, decision },
        ...prev,
      ]);
    }

    setBg(direction);
    setTimeout(() => setBg(null), 500);

    setEvents((prev) => prev.slice(1));
    setForceExit(null);
    busy.current = false;
  }

  const handleSwipeComplete = (direction) => {
    recordAndRemove(direction);
  };

  const handleButtonClick = (direction) => {
    if (busy.current || events.length === 0) return;
    busy.current = true;

    setBg(direction);
    setTimeout(() => setBg(null), 500);

    setForceExit(direction);

    setTimeout(() => {
      const current = events[0];
      if (current) {
        let decision = "declined";
        if (direction === "right") {
          decision = "accepted";
          incrementAccepted(); // Increment counter when accepting
        }
        if (direction === "down") decision = "considering";
        setHistory((prev) => [
          { event: current, decision },
          ...prev,
        ]);
      }
      setEvents((prev) => prev.slice(1));
      setForceExit(null);
      busy.current = false;
    }, 400);
  };



  const accepted = history.filter((h) => h.decision === "accepted");
  const declined = history.filter((h) => h.decision === "declined");
  const considering = history.filter((h) => h.decision === "considering");

  return (
    <div
      className={`pt-14 flex flex-col relative transition-colors duration-300 h-[calc(100vh-30px)] md:h-full`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${bg ? "text-white" : "text-black dark:text-white"}`}>
            Invited Events
          </h1>
          {events.length > 0 && (
            <p className={`text-sm transition-colors duration-300 ${bg ? "text-white/70" : "text-gray-400"}`}>
              {events.length} remaining
            </p>
          )}
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-300 ${bg ? "border-white/40 text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1h.01a1 1 0 010 2h-.01a1 1 0 01-1-1zm0 5.25a1 1 0 011-1h.01a1 1 0 010 2h-.01a1 1 0 01-1-1zm0 5.25a1 1 0 011-1h.01a1 1 0 010 2h-.01a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          History
          {history.length > 0 && (
            <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Card Stack */}
      <div className="flex-1 min-h-0 relative p-4">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="text-6xl mb-4">{"\u{1F389}"}</div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">No More Events</h2>
            <p className="text-gray-600 dark:text-gray-400">
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
        <div className="p-20 flex justify-center items-center gap-10">

          {/* Decline */}
          <button
            onClick={() => handleButtonClick("left")}
            className="w-16 h-16 aspect-square rounded-full border-4 border-red-500 
                      flex items-center justify-center shadow-lg 
                      hover:scale-110 active:scale-95 transition-transform 
                      bg-white dark:bg-card-dark shrink-0"
          >
            <span className="text-3xl font-bold text-red-500">{"\u2715"}</span>
          </button>

          {/* Considering */}
          <button
            onClick={() => handleButtonClick("down")}
            className="w-16 h-16 aspect-square rounded-full 
                      bg-yellow-400 flex items-center justify-center 
                      shadow-lg hover:scale-110 active:scale-95 
                      transition-transform shrink-0"
          >
            <span className="text-3xl">🤔</span>
          </button>

          {/* Accept */}
          <button
            onClick={() => handleButtonClick("right")}
            className="w-16 h-16 aspect-square rounded-full 
                      bg-green-500 flex items-center justify-center 
                      shadow-lg hover:scale-110 active:scale-95 
                      transition-transform shrink-0"
          >
            <span className="text-3xl font-bold text-white">{"\u2713"}</span>
          </button>

        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowHistory(false)}
          />

          <div className="ml-auto relative w-[85%] max-w-sm bg-white dark:bg-bounce-dark h-full shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white dark:bg-bounce-dark border-b border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold dark:text-white">Event History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300"
              >
                {"\u2715"}
              </button>
            </div>

            <div className="p-4">
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No decisions yet. Start swiping!
                </p>
              ) : (
                <>
                  {accepted.length > 0 && (
                    <section className="mb-6">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        Accepted ({accepted.length})
                      </p>
                      <div className="space-y-2">
                        {accepted.map(({ event }) => {
                          const host = getUserById(event.host);
                          return (
                            <Link
                              key={event.id}
                              to={`/event-preview/${event.id}`}
                              state={{ event, decision: "accepted" }}
                              className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-3 active:scale-[0.98] transition-transform"
                            >
                              <span className="text-2xl">{event.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold dark:text-white">{event.title}</p>
                                <p className="text-xs text-gray-400">{event.date} · by {host?.name}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Going</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-400">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {declined.length > 0 && (
                    <section>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        Declined ({declined.length})
                      </p>
                      <div className="space-y-2">
                        {declined.map(({ event }) => {
                          const host = getUserById(event.host);
                          return (
                            <Link
                              key={event.id}
                              to={`/event-preview/${event.id}`}
                              state={{ event, decision: "declined" }}
                              className="flex items-center gap-3 bg-gray-50 dark:bg-card-dark rounded-xl p-3 active:scale-[0.98] transition-transform"
                            >
                              <span className="text-2xl grayscale opacity-50">{event.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-400">{event.title}</p>
                                <p className="text-xs text-gray-300">{event.date} · by {host?.name}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-red-400 text-xs font-semibold">Skipped</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-300">
                                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  )}
                  {considering.length > 0 && (
                    <section className="mt-6 mb-6">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        Considering ({considering.length})
                      </p>
                      <div className="space-y-2">
                        {considering.map(({ event }) => {
                          const host = getUserById(event.host);
                          return (
                            <Link
                              key={event.id}
                              to={`/event-preview/${event.id}`}
                              state={{ event, decision: "considering" }}
                              className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-3 active:scale-[0.98] transition-transform"
                            >
                              <span className="text-2xl">{event.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold dark:text-white">{event.title}</p>
                                <p className="text-xs text-gray-400">{event.date} · by {host?.name}</p>
                              </div>
                              <span className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                                Thinking
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}