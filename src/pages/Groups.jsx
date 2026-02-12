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

function Section({ title, count, children }) {
  if (count === 0) return null;
  return (
    <section className="mb-6">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
        {title} ({count})
      </p>
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

      {/* Toggle Text Tabs */}
      <div className="flex justify-center gap-8 mb-6">
        <button
          onClick={() => setView("active")}
          className={`text-sm font-bold transition-colors ${
            view === "active"
              ? "text-black dark:text-white"
              : "text-gray-400"
          }`}
        >
          🔥 Active
        </button>

        <button
          onClick={() => setView("settled")}
          className={`text-sm font-bold transition-colors ${
            view === "settled"
              ? "text-black dark:text-white"
              : "text-gray-400"
          }`}
        >
          ✅ Settled
        </button>
      </div>

      {/* Active View */}
      {view === "active" && (
        <>
          <Section title="ACTIVE" count={activeEvents.length}>
            {activeEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </Section>

          {pending.length > 0 && (
            <Section title="Pending" count={pending.length}>
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
          )}
        </>
      )}

      {/* Settled View */}
      {view === "settled" && (
        <Section title="Settled" count={settledEvents.length}>
          {settledEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </Section>
      )}
    </div>
  );
}
