import { CURRENT_USER, BADGES } from "../data/mock";
import Avatar from "../components/Avatar";

export default function Profile() {
  const earned = BADGES.filter((b) => CURRENT_USER.badges.includes(b.id));

  return (
    <div className="px-5 pt-14">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-8">
        <Avatar initials={CURRENT_USER.initials} size="xl" />
        <p className="font-bold text-lg mt-3">{CURRENT_USER.username}</p>
        <p className="text-sm text-gray-400">{CURRENT_USER.fullName}</p>
      </div>

      {/* === OUR NEW FEATURE: Badges === */}
      {earned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            Your Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            {earned.map((badge) => (
              <div
                key={badge.id}
                className="bg-bounce/20 border border-bounce rounded-full px-3 py-1.5 flex items-center gap-1.5"
              >
                <span>{badge.icon}</span>
                <span className="text-xs font-semibold">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All badges progress */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
          All Badges
        </h2>
        <div className="space-y-2">
          {BADGES.map((badge) => {
            const isEarned = CURRENT_USER.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  isEarned ? "bg-gray-50" : "bg-white border border-gray-100"
                }`}
              >
                <span className={`text-xl ${isEarned ? "" : "grayscale opacity-30"}`}>
                  {badge.icon}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isEarned ? "" : "text-gray-300"}`}>
                    {badge.label}
                  </p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
                {isEarned && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-bounce-dark">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings list (matches original Bounce profile) */}
      <div className="border-t border-gray-100">
        {["Personal Information", "Settings", "Support & Help"].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-sm">{item}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm font-medium underline">Sign out</button>
    </div>
  );
}
