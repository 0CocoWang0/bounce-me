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
            <Avatar initials={user.initials} size="lg" />
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


    </div>
  );
}
