import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_EVENTS, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

export default function EventDetail() {
  const { eventId } = useParams();
  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  const [rsvpd, setRsvpd] = useState(false);

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  const host = getUserById(event.host);
  const members = event.rsvps.map((id) => getUserById(id)).filter(Boolean);

  return (
    <div className="px-5 pt-14">
      <Link to="/groups" className="text-sm text-gray-400 mb-4 block">
        &larr; Back
      </Link>

      {/* Event header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{event.emoji}</div>
        <h1 className="text-2xl font-bold dark:text-white">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {event.date} at {event.time}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Hosted by {host?.name}
        </p>
      </div>

      {/* RSVP swipe button */}
      {event.status === "upcoming" && !rsvpd && (
        <button
          onClick={() => setRsvpd(true)}
          className="w-full bg-bounce text-black font-semibold py-4 rounded-2xl text-base mb-6 active:scale-95 transition-transform"
        >
          Swipe to RSVP &rarr;
        </button>
      )}

      {rsvpd && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center mb-6">
          <p className="text-green-700 dark:text-green-400 font-semibold">You're in!</p>
          <p className="text-green-600 dark:text-green-500 text-xs mt-0.5">See you there.</p>
        </div>
      )}

      {/* Who's going */}
      <section className="mb-6">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          Who's Going ({members.length})
        </h2>
        <div className="space-y-2">
          {members.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 bg-gray-50 dark:bg-card-dark rounded-xl p-3"
            >
              <Avatar initials={user.initials} size="md" />
              <span className="text-sm font-medium flex-1 dark:text-white">{user.name}</span>
              {user.id === event.host && (
                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Split action */}
      {(event.status === "splitting" || event.status === "upcoming") && (
        <Link
          to={`/split/${event.id}`}
          className="block w-full text-center bg-black dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-full text-sm"
        >
          {event.status === "splitting" ? "View Split" : "Start Split \u2192"}
        </Link>
      )}

      {event.status === "settled" && (
        <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">All settled!</p>
          <p className="text-xs text-gray-400 mt-0.5">
            ${event.totalCost?.toFixed(2)} split between {members.length} people
          </p>
        </div>
      )}
    </div>
  );
}
