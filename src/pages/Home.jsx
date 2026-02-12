import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER, MOCK_USERS, MOCK_EVENTS, MOCK_NOTIFICATIONS, SWIPEABLE_EVENTS } from "../data/mock";
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
      {/* Greeting + Event Inbox */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-sm font-bold text-black dark:text-white">
          Afternoon, {CURRENT_USER.username}!
        </h1>
        <Link
          to="/events"
          className="relative flex items-center gap-1.5 bg-gray-100 dark:bg-card-dark px-3 py-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 dark:text-white">
            <path fillRule="evenodd" d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h9.454a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15.25A2.75 2.75 0 0116.25 18H3.75A2.75 2.75 0 011 15.25v-3.98zm3.068-5.852A1.25 1.25 0 015.273 4.5h9.454a1.25 1.25 0 011.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 00-.86.49l-.606 1.02a1 1 0 01-.86.49H8.326a1 1 0 01-.86-.49l-.606-1.02A1 1 0 006 11H2.432l.015-.062 1.621-5.52z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold dark:text-white">Inbox</span>
          {SWIPEABLE_EVENTS.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {SWIPEABLE_EVENTS.length}
            </span>
          )}
        </Link>
      </div>

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
        <Link to="/request" className="relative w-40 h-[139px] -mr-8 text-black dark:text-white">
          <svg viewBox="0 0 160 139" className="w-full h-full">
            <path d="M12,0 L148,0 Q160,0 154,10.4 L86,128.6 Q80,139 74,128.6 L6,10.4 Q0,0 12,0 Z" className="fill-gray-100 dark:fill-black" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm mt-[-30px]">Request</span>
        </Link>
        <Link to="/send" className="relative w-40 h-[139px] -ml-8 text-black dark:text-white">
          <svg viewBox="0 0 160 139" className="w-full h-full">
            <path d="M86,10.4 L154,128.6 Q160,139 148,139 L12,139 Q0,139 6,128.6 L74,10.4 Q80,0 86,10.4 Z" className="fill-gray-100 dark:fill-black" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm mt-[30px]">Send</span>
        </Link>
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
