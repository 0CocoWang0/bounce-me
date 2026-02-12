import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_USERS, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [invited, setInvited] = useState([]);

  const friends = MOCK_USERS.filter((u) => u.id !== CURRENT_USER.id);

  function toggleInvite(userId) {
    setInvited((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    addEvent({
      id: `e_new_${Date.now()}`,
      title,
      emoji: "🎈",
      date,
      time,
      host: CURRENT_USER.id,
      rsvps: [CURRENT_USER.id, ...invited],
      totalCost: null,
      splits: [],
      status: "upcoming",
      moments: [],
    });
    navigate("/groups");
  }

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
            Event Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Taco Tuesday, Study Sesh..."
            className="w-full border border-gray-200 dark:border-gray-700 dark:bg-card-dark dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bounce"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-card-dark dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bounce"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border border-gray-200 dark:border-gray-700 dark:bg-card-dark dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bounce"
            />
          </div>
        </div>

        {/* Invite friends */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">
            Invite Friends
          </label>
          <div className="space-y-2">
            {friends.map((user) => {
              const selected = invited.includes(user.id);
              return (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => toggleInvite(user.id)}
                  className={`w-full flex items-center gap-3 rounded-xl p-3 border transition-colors ${
                    selected
                      ? "border-bounce bg-bounce/10"
                      : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-card-dark"
                  }`}
                >
                  <Avatar initials={user.initials} avatar={user.avatar} size="sm" />
                  <span className="text-sm font-medium dark:text-white">{user.name}</span>
                  {selected && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-bounce-dark dark:text-bounce ml-auto">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-bounce text-black font-semibold py-3.5 rounded-full text-sm"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
