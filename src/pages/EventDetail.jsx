import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

export default function EventDetail() {
  const { eventId } = useParams();
  const { events } = useEvents();
  const event = events.find((e) => e.id === eventId);
  const [rsvpd, setRsvpd] = useState(false);

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  const host = getUserById(event.host);
  // Host first, then the rest
  const members = [host, ...event.rsvps.map((id) => getUserById(id)).filter(Boolean).filter((u) => u.id !== event.host)];

  const totalCost = event.totalCost || 0;
  const totalSplits = event.splits?.length || 0;
  const paidSplits = event.splits?.filter((s) => s.paid).length || 0;
  const unpaidAmount = event.splits?.filter((s) => !s.paid).reduce((sum, s) => sum + s.amount, 0) || 0;

  let settlementPercentage = 0;
  if (event.status === "settled") {
    settlementPercentage = 100;
  } else if (event.status === "splitting") {
    settlementPercentage = totalSplits > 0 ? Math.round((paidSplits / totalSplits) * 100) : 0;
  }

  const moments = event.moments || [];

  // Fun emoji milestones for the progress bar
  const progressEmoji =
    settlementPercentage === 100 ? "🎉" :
      settlementPercentage >= 75 ? "🔥" :
        settlementPercentage >= 50 ? "💪" :
          settlementPercentage >= 25 ? "🚀" : "🌱";

  return (
    <div className="px-5 pt-14 pb-8">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/groups"
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 dark:text-white">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </Link>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 dark:text-white">
            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </div>
      </div>

      {/* Event title with emoji */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{event.emoji}</div>
        <h1 className="text-2xl font-bold dark:text-white">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {event.date} at {event.time}
        </p>
      </div>

      {/* People row — host first, horizontal scroll */}
      <div className="flex gap-5 overflow-x-auto mb-8 p-1">
        {members.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className={`rounded-full ${user.id === event.host ? "ring-2 ring-bounce" : ""}`}>
              <Avatar initials={user.initials} avatar={user.avatar} size="lg" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user.id === CURRENT_USER.id ? "you" : user.name.toLowerCase()}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-card-dark flex items-center justify-center text-gray-400 text-xl">
            +
          </div>
          <span className="text-xs text-gray-400">add</span>
        </div>
      </div>

      {/* Fun progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Settlement</span>
          <span className="text-xs font-semibold dark:text-white">{progressEmoji} {settlementPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-card-dark rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(settlementPercentage, 2)}%`,
              background: settlementPercentage === 100
                ? "linear-gradient(90deg, #4ade80, #22c55e)"
                : settlementPercentage >= 50
                  ? "linear-gradient(90deg, #facc15, #4ade80)"
                  : "linear-gradient(90deg, #f87171, #facc15)",
            }}
          />
        </div>
      </div>

      {/* Expense + Balance cards */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Group Expenses</p>
          <p className="text-xl font-bold dark:text-white">${totalCost.toFixed(2)}</p>
        </div>
        <div className="flex-1 bg-gray-900 dark:bg-black rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Group Balance</p>
          <p className={`text-xl font-bold ${unpaidAmount > 0 ? "text-red-400" : "text-green-400"}`}>
            ${unpaidAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {event.status !== "settled" && (
        <div className="flex gap-3 mb-8">
          <button className="flex-1 text-center bg-gray-900 dark:bg-card-dark border border-gray-700 text-white font-semibold py-3.5 rounded-2xl text-sm">
            Add expense
          </button>
          <button
            className="flex-1 text-center font-semibold py-3.5 rounded-2xl text-sm text-black"
            style={{ backgroundColor: "#D4E157" }}
          >
            Settle up
          </button>
        </div>
      )}

      {/* RSVP button for upcoming events */}
      {event.status === "upcoming" && !rsvpd && (
        <button
          onClick={() => setRsvpd(true)}
          className="w-full bg-bounce text-black font-semibold py-4 rounded-2xl text-base mb-6 active:scale-95 transition-transform"
        >
          RSVP →
        </button>
      )}

      {rsvpd && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center mb-6">
          <p className="text-green-700 dark:text-green-400 font-semibold">You're in!</p>
          <p className="text-green-600 dark:text-green-500 text-xs mt-0.5">See you there.</p>
        </div>
      )}

      {/* Moments Section */}
      {moments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 dark:text-white">Moments</h2>
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
