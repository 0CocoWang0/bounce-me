import { MOCK_NOTIFICATIONS } from "../data/mock";

const TYPE_ICONS = {
  rsvp: "👋",
  badge: "🏅",
  split: "💸",
  event: "📅",
  settled: "✅",
};

export default function Notifications() {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {unread.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">New</p>
          <div className="space-y-1">
            {unread.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
              >
                <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-bounce mt-2 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Earlier</p>
          <div className="space-y-1">
            {read.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-xl p-4"
              >
                <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">{n.message}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
