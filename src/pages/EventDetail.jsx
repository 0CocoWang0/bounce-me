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

  // Calculate settlement percentage
  const totalSplits = event.splits?.length || 0;
  const paidSplits = event.splits?.filter(s => s.paid).length || 0;
  let settlementPercentage = 0;

  if (event.status === "settled") {
    settlementPercentage = 100;
  } else if (event.status === "splitting") {
    settlementPercentage = totalSplits > 0 ? Math.round((paidSplits / totalSplits) * 100) : 0;
  } else if (event.status === "upcoming") {
    settlementPercentage = 0;
  }

  // Get moments from event data
  const moments = event.moments || [];

  return (
    <div className="px-5 pt-14 pb-8">
      <Link to="/groups" className="text-sm text-gray-400 mb-4 block">
        &larr; Back
      </Link>

      {/* Event header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{event.emoji}</div>
        <h1 className="text-2xl font-bold dark:text-white">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {event.date} at {event.time}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-400 rounded-full h-12 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gray-500 transition-all duration-500"
          style={{ width: `${settlementPercentage}%` }}
        ></div>
        <span className="relative z-10 text-white font-semibold">
          {settlementPercentage}% settled
        </span>
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
              <Avatar initials={user.initials} avatar={user.avatar} size="md" />
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

      {/* Three Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          className="flex-1 text-center bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-full text-sm"
        >
          View split
        </button>
        <button
          className="flex-1 text-center bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-full text-sm"
        >
          Add expense
        </button>
        <button
          className="flex-1 text-center font-semibold py-3 rounded-full text-sm"
          style={{ backgroundColor: '#D4E157' }}
        >
          Settle up
        </button>
      </div>

      {/* Moments Section */}
      {moments.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Moments</h2>
          <div className="flex gap-3">
            {moments.map((moment) => {
              const author = getUserById(moment.author);
              return (
                <Link
                  key={moment.id}
                  to={`/moment/${moment.id}`}
                  className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={moment.image}
                    alt={`Moment by ${author?.name}`}
                    className="w-full h-full object-cover"
                  />
                </Link>
              );
            })}
            <div className="flex-1 aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-card-dark flex items-center justify-center">
              <span className="text-gray-400 text-sm">View more→</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
