import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";

function EventRow({ event }) {
  const host = getUserById(event.host);
  const totalOwed = event.splits
    .filter((s) => !s.paid)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <Link
      to={`/event/${event.id}`}
      className="flex items-center gap-3 bg-gray-50 dark:bg-card-dark rounded-xl p-4"
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center text-lg font-semibold">
        {event.emoji || event.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold dark:text-white">{event.title}</p>
        <p className="text-xs text-gray-400">
          {host?.name} · {event.rsvps.length} members
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm dark:text-white">
          ${totalOwed > 0 ? totalOwed.toFixed(2) : "0.00"}
        </p>
        {event.status === "splitting" && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400">
            splitting
          </span>
        )}
        {event.status === "upcoming" && (
          <span className="text-[10px] text-blue-600 dark:text-blue-400">
            upcoming
          </span>
        )}
        {event.status === "settled" && (
          <span className="text-[10px] text-green-600 dark:text-green-400">
            settled
          </span>
        )}
      </div>
    </Link>
  );
}

function Section({ children }) {
  return (
    <section className="mb-6">
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export default function Groups() {
  const { events } = useEvents();
  const [view, setView] = useState("active"); // "active" or "settled"

  // Filter events based on status
  const activeEvents = events.filter(
    (e) => e.status === "upcoming" || e.status === "splitting"
  );

  const settledEvents = events.filter((e) => e.status === "settled");

  // Pending: only relevant for active view
  const pending =
    view === "active"
      ? activeEvents.filter(
        (e) => e.splits.some((s) => s.userId === CURRENT_USER.id && !s.paid)
      )
      : [];

  return (
    <div className="px-5 pt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Bounce Groups</h1>
        <Link
          to="/create"
          className="bg-bounce text-black text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1"
        >
          + New
        </Link>
      </div>

      {/* Toggle Tabs */}
      <div className="flex bg-gray-100 dark:bg-card-dark rounded-2xl p-1 mb-6">
        <button
          onClick={() => setView("active")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            view === "active"
              ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
              : "text-gray-400"
          }`}
        >
          Bouncing
          {activeEvents.length > 0 && (
            <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
              view === "active"
                ? "bg-bounce text-bounce-dark"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            }`}>
              {activeEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setView("settled")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            view === "settled"
              ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
              : "text-gray-400"
          }`}
        >
          Bounced
          {settledEvents.length > 0 && (
            <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
              view === "settled"
                ? "bg-green-500 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
            }`}>
              {settledEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Active View */}
      {view === "active" && (
        <>
          <Section>
            {activeEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </Section>

          {pending.length > 0 && (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                You owe
              </p>
              <Section>
                {pending.map((event) => {
                  const userSplit = event.splits.find(
                    (s) => s.userId === CURRENT_USER.id && !s.paid
                  );
                  return (
                    <div key={event.id} className="relative">
                      <EventRow event={event} />
                      {userSplit && (
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                            You owe ${userSplit.amount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Section>
            </>
          )}
        </>
      )}

      {/* Settled View */}
      {view === "settled" && (
        <Section>
          {settledEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">{"\u{1F331}"}</p>
              <p className="text-sm text-gray-400">No settled groups yet</p>
            </div>
          ) : (
            settledEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))
          )}
        </Section>
      )}
    </div>
  );
}
