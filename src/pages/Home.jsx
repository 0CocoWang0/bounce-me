import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER, MOCK_USERS, MOCK_EVENTS, MOCK_NOTIFICATIONS } from "../data/mock";
import Avatar from "../components/Avatar";

const TYPE_ICONS = {
  rsvp: "\u{1F44B}",
  badge: "\u{1F3C5}",
  split: "\u{1F4B8}",
  event: "\u{1F4C5}",
  settled: "\u{2705}",
};

/* Split notifications: newest 2 unread animate in, rest are already visible */
const newNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).slice(0, 2);
const newIds = new Set(newNotifs.map((n) => n.id));
const restNotifs = MOCK_NOTIFICATIONS.filter((n) => !newIds.has(n.id));

export default function Home() {
  const friends = MOCK_USERS.filter((u) => u.id !== CURRENT_USER.id);
  const upcoming = MOCK_EVENTS.filter(
    (e) => e.status === "upcoming" || e.status === "splitting"
  );

  /* Stagger the two new notifications dropping in */
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(1), 500);
    const t2 = setTimeout(() => setRevealed(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="px-5 pt-14">
      {/* Greeting */}
      <h1 className="text-sm font-bold mb-6 text-black dark:text-white">
        Afternoon, {CURRENT_USER.username}!
      </h1>

      {/* Friends row */}
      <div className="flex gap-5 mb-10 overflow-x-auto">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-bounce flex items-center justify-center text-xl text-bounce-dark">
            +
          </div>
          <span className="text-xs text-black dark:text-white">Friends</span>
        </div>
        {friends.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1">
            <Avatar initials={user.initials} avatar={user.avatar} size="lg" />
            <span className="text-xs text-black dark:text-white">{user.name.toLowerCase()}</span>
          </div>
        ))}
      </div>

      {/* Request / Send triangles */}
      <div className="flex justify-center gap-0 mb-10 h-full pt-30">
        <div className="relative w-40 h-[139px] -mr-8 text-black dark:text-white">
          <svg viewBox="0 0 160 139" className="w-full h-full">
            <path d="M12,0 L148,0 Q160,0 154,10.4 L86,128.6 Q80,139 74,128.6 L6,10.4 Q0,0 12,0 Z" className="fill-gray-100 dark:fill-black" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm mt-[-30px]">Request</span>
        </div>
        <div className="relative w-40 h-[139px] -ml-8 text-black dark:text-white">
          <svg viewBox="0 0 160 139" className="w-full h-full">
            <path d="M86,10.4 L154,128.6 Q160,139 148,139 L12,139 Q0,139 6,128.6 L74,10.4 Q80,0 86,10.4 Z" className="fill-gray-100 dark:fill-black" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm mt-[30px]">Send</span>
        </div>
      </div>

      {/* Notification Center */}
      <div className="space-y-2">
        {/* New notifications — slide in from top, staggered */}
        {newNotifs.map((n, i) => {
          /* Reveal bottom-up: last item first, top item last */
          const isVisible = revealed >= newNotifs.length - i;
          return (
            <div
              key={n.id}
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{
                maxHeight: isVisible ? 80 : 0,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className="flex items-start gap-3 rounded-2xl p-4 bg-gray-50 dark:bg-card-dark">
                <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-bounce mt-2 shrink-0" />
              </div>
            </div>
          );
        })}

        {/* Existing notifications — already visible, pushed down by new ones */}
        {restNotifs.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-2xl p-4 bg-gray-50/60 dark:bg-card-dark/60"
          >
            <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
              <p className="text-xs text-gray-300 dark:text-gray-500 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
