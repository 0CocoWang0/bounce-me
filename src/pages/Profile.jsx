import { CURRENT_USER, BADGES } from "../data/mock";
import Avatar from "../components/Avatar";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="px-5 pt-14">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-8">
        <Avatar initials={CURRENT_USER.initials} avatar={CURRENT_USER.avatar} size="xl" />
        <p className="font-bold text-lg mt-3 dark:text-white">{CURRENT_USER.username}</p>
        <p className="text-sm text-gray-400">{CURRENT_USER.fullName}</p>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center justify-between mb-8 px-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">Appearance</span>
        <button
          onClick={toggleTheme}
          className="relative w-14 h-7 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-bounce-dark"
          aria-label="Toggle dark mode"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-sm transition-transform duration-300 ${theme === "dark" ? "translate-x-7" : "translate-x-0"
              }`}
          >
            {theme === "dark" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
          </span>
        </button>
      </div>

      {/* Badges */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-4">
          Badges
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {[...BADGES].sort((a, b) => {
            const aEarned = CURRENT_USER.badges.includes(a.id) ? 0 : 1;
            const bEarned = CURRENT_USER.badges.includes(b.id) ? 0 : 1;
            return aEarned - bEarned;
          }).map((badge) => {
            const isEarned = CURRENT_USER.badges.includes(badge.id);
            return (
              <div key={badge.id} className="flex flex-col items-center gap-1.5 w-16">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                    isEarned ? "" : "bg-gray-200 dark:bg-gray-700 grayscale opacity-40"
                  }`}
                  style={isEarned ? { backgroundColor: badge.color } : undefined}
                >
                  {badge.icon}
                </div>
                <span className={`text-[10px] text-center leading-tight font-medium ${
                  isEarned ? "dark:text-white" : "text-gray-300 dark:text-gray-600"
                }`}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings list */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        {["Personal Information", "Settings", "Support & Help"].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700"
          >
            <span className="text-sm dark:text-white">{item}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300 dark:text-gray-600">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm w-full font-medium underline text-red-500 dark:text-red-400">Sign out</button>
    </div>
  );
}
