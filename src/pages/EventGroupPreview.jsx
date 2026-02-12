import { useLocation, useNavigate } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import Avatar from "../components/Avatar";

export default function EventGroupPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const decision = location.state?.decision || "accepted";

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
        <button
          onClick={() => navigate("/events")}
          className="mt-4 text-sm text-bounce font-semibold"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const host = getUserById(event.host);
  const members = [
    host,
    ...event.attendees
      .map((id) => getUserById(id))
      .filter(Boolean)
      .filter((u) => u.id !== event.host),
  ];

  return (
    <div className="px-5 pt-14 pb-8">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 dark:text-white"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Event Preview
        </span>
        <div className="w-10" />
      </div>

      {/* Event title with emoji */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{event.emoji}</div>
        <h1 className="text-2xl font-bold dark:text-white">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{event.date}</p>
        {event.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {event.description}
          </p>
        )}
      </div>

      {/* People row */}
      <div className="flex gap-5 overflow-x-auto mb-8 p-1">
        {members.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`rounded-full ${
                user.id === event.host ? "ring-2 ring-bounce" : ""
              }`}
            >
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

      {/* Info cards */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Estimated Cost</p>
          <p className="text-xl font-bold dark:text-white">
            ${event.estimatedPrice?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Per Person</p>
          <p className="text-xl font-bold dark:text-white">
            ~$
            {event.estimatedPrice && members.length > 0
              ? (event.estimatedPrice / members.length).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Category badge */}
      {event.category && (
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 dark:bg-card-dark text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
            {event.category === "Private"
              ? "🔒"
              : event.category === "Club"
              ? "🏫"
              : "📚"}{" "}
            {event.category}
          </span>
        </div>
      )}

      {/* Host info */}
      {host && (
        <div className="bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-400 mb-3">Hosted by</p>
          <div className="flex items-center gap-3">
            <Avatar initials={host.initials} avatar={host.avatar} size="md" />
            <div>
              <p className="font-semibold dark:text-white">{host.name}</p>
              <p className="text-xs text-gray-400">@{host.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status banner */}
      {decision === "accepted" ? (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
          <p className="text-green-700 dark:text-green-400 font-semibold">
            You're going!
          </p>
          <p className="text-green-600 dark:text-green-500 text-xs mt-0.5">
            The group will be created once the event starts.
          </p>
        </div>

      ) : decision === "considering" ? (

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-yellow-700 dark:text-yellow-400 font-semibold">
            You're considering this event 🤔
          </p>
          <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-0.5">
            Take your time — you can decide before it starts.
          </p>
        </div>

      ) : (

        <div className="bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            You skipped this event
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            You can still change your mind and join.
          </p>
        </div>

      )}
    </div>
  );
}
