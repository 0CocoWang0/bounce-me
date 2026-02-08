import { Link } from "react-router-dom";
import { MOCK_EVENTS, getUserById } from "../data/mock";

export default function Groups() {
  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Link
          to="/create"
          className="bg-bounce text-black text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1"
        >
          + New
        </Link>
      </div>

      <div className="space-y-2">
        {MOCK_EVENTS.map((event) => {
          const host = getUserById(event.host);
          const totalOwed = event.splits
            .filter((s) => !s.paid)
            .reduce((sum, s) => sum + s.amount, 0);

          return (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center text-lg font-semibold">
                {event.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{event.title}</p>
                <p className="text-xs text-gray-400">
                  {host?.name} · {event.rsvps.length} members
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  ${totalOwed > 0 ? totalOwed.toFixed(2) : "0.00"}
                </p>
                {event.status === "splitting" && (
                  <span className="text-[10px] text-amber-600">pending</span>
                )}
                {event.status === "settled" && (
                  <span className="text-[10px] text-green-600">settled</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
