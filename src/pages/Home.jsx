import { Link } from "react-router-dom";
import { CURRENT_USER, MOCK_USERS, MOCK_EVENTS } from "../data/mock";
import Avatar from "../components/Avatar";

export default function Home() {
  const friends = MOCK_USERS.filter((u) => u.id !== CURRENT_USER.id);
  const upcoming = MOCK_EVENTS.filter(
    (e) => e.status === "upcoming" || e.status === "splitting"
  );

  return (
    <div className="px-5 pt-14">
      {/* Greeting */}
      <h1 className="text-xl font-medium mb-6">
        Afternoon, {CURRENT_USER.username}!
      </h1>

      {/* Friends row */}
      <div className="flex gap-4 mb-10 overflow-x-auto">
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-500">
            +
          </div>
          <span className="text-xs text-gray-500">Friends</span>
        </div>
        {friends.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1">
            <Avatar initials={user.initials} size="lg" />
            <span className="text-xs">{user.name.toLowerCase()}</span>
          </div>
        ))}
      </div>

      {/* Request / Send triangles */}
      <div className="flex justify-center gap-0 mb-10">
        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center font-semibold text-lg"
          style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}>
          <span className="mt-[-30px]">Request</span>
        </div>
        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center font-semibold text-lg"
          style={{ clipPath: "polygon(50% 0%, 0 100%, 100% 100%)" }}>
          <span className="mt-[30px]">Send</span>
        </div>
      </div>

      {/* === OUR NEW FEATURE: Upcoming Events === */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Upcoming Events</h2>
            <Link
              to="/create"
              className="bg-bounce text-black text-sm font-semibold px-4 py-1.5 rounded-full"
            >
              + New
            </Link>
          </div>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                  {event.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-gray-400">
                    {event.date} · {event.rsvps.length} going
                  </p>
                </div>
                {event.status === "splitting" && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Split
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Invited Events Button */}
          <Link
            to="/events"
            className="flex items-center justify-center gap-2 text-black font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow mt-3"
            style={{ backgroundColor: '#D4E157' }}
          >
            <span className="text-xl"></span>
            <span>Invited Events</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </section>
      )}
    </div>
  );
}
