import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_EVENTS, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

export default function Split() {
  const { eventId } = useParams();
  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  const [totalCost, setTotalCost] = useState(event?.totalCost ?? "");

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  const members = event.rsvps.map((id) => getUserById(id)).filter(Boolean);
  const perPerson = totalCost
    ? (Number(totalCost) / members.length).toFixed(2)
    : "0.00";

  return (
    <div className="px-5 pt-14">
      <Link to={`/event/${eventId}`} className="text-sm text-gray-400 mb-4 block">
        &larr; Back to event
      </Link>

      <h1 className="text-2xl font-bold mb-1 dark:text-white">
        {event.emoji} {event.title}
      </h1>
      <p className="text-sm text-gray-400 mb-6">Split the bill</p>

      {/* Total cost input */}
      <div className="mb-6">
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
          Total Cost
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-card-dark dark:text-white rounded-xl pl-9 pr-4 py-3 text-lg focus:outline-none focus:border-bounce"
          />
        </div>
      </div>

      {/* Per person */}
      <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-4 mb-6 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Per Person</p>
        <p className="text-3xl font-bold mt-1 dark:text-white">${perPerson}</p>
        <p className="text-xs text-gray-400 mt-1">
          split between {members.length} people
        </p>
      </div>

      {/* Members */}
      <div className="space-y-2 mb-8">
        {members.map((user) => {
          const split = event.splits.find((s) => s.userId === user.id);
          return (
            <div
              key={user.id}
              className="flex items-center gap-3 bg-gray-50 dark:bg-card-dark rounded-xl p-3"
            >
              <Avatar initials={user.initials} avatar={user.avatar} size="md" />
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">{user.name}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  split?.paid
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                }`}
              >
                {split?.paid ? "Paid" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full bg-bounce text-black font-semibold py-3.5 rounded-full text-sm">
        Send Bounce Request
      </button>
    </div>
  );
}
