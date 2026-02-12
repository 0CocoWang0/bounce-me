import { Link } from "react-router-dom";
import { MOCK_NOTIFICATIONS, getUserById } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

const TYPE_ICONS = {
  rsvp: "\u{1F44B}",
  badge: "\u{1F3C5}",
  split: "\u{1F4B8}",
  event: "\u{1F4C5}",
  settled: "\u{2705}",
};

export default function Notifications() {
  const { events } = useEvents();
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Notifications</h1>

      {unread.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">New</p>
          <div className="space-y-1">
            {unread.map((n) => {
              const actionUser = n.actionable && n.userId ? getUserById(n.userId) : null;
              const linkedEvent = n.eventId ? events.find((e) => e.id === n.eventId) : null;
              const isSettled = linkedEvent?.status === "settled";
              const Wrapper = n.link ? Link : "div";
              const wrapperProps = n.link ? { to: n.link } : {};
              const displayMsg = isSettled
                ? `${n.groupName} is all bounced up fr ✅ no cap`
                : n.message;
              return (
                <Wrapper
                  key={n.id}
                  {...wrapperProps}
                  className={`flex items-start gap-3 rounded-xl p-4 ${
                    isSettled
                      ? "bg-green-900/20 dark:bg-green-900/30 border border-green-800/40"
                      : "bg-gray-50 dark:bg-card-dark"
                  }`}
                >
                  {actionUser ? (
                    <Avatar initials={actionUser.initials} avatar={actionUser.avatar} size="md" />
                  ) : (
                    <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isSettled ? "text-green-400" : "dark:text-white"}`}>{displayMsg}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.actionable ? (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 shrink-0 ${
                      isSettled
                        ? "text-green-400 bg-green-400/20"
                        : "text-bounce bg-bounce/20"
                    }`}>
                      {isSettled ? "Settled" : "Split"}
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-bounce mt-2 shrink-0" />
                  )}
                </Wrapper>
              );
            })}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Earlier</p>
          <div className="space-y-1">
            {read.map((n) => {
              const actionUser = n.actionable && n.userId ? getUserById(n.userId) : null;
              const linkedEvent = n.eventId ? events.find((e) => e.id === n.eventId) : null;
              const isSettled = linkedEvent?.status === "settled";
              const Wrapper = n.link ? Link : "div";
              const wrapperProps = n.link ? { to: n.link } : {};
              const displayMsg = isSettled
                ? `${n.groupName} is all bounced up fr ✅ no cap`
                : n.message;
              return (
                <Wrapper
                  key={n.id}
                  {...wrapperProps}
                  className={`flex items-start gap-3 rounded-xl p-4 ${
                    isSettled
                      ? "bg-green-900/10 dark:bg-green-900/20 border border-green-800/30"
                      : ""
                  }`}
                >
                  {actionUser ? (
                    <Avatar initials={actionUser.initials} avatar={actionUser.avatar} size="md" />
                  ) : (
                    <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isSettled ? "text-green-400/80" : "text-gray-500 dark:text-gray-400"}`}>{displayMsg}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{n.time}</p>
                  </div>
                  {n.actionable && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 shrink-0 ${
                      isSettled
                        ? "text-green-400/60 bg-green-400/10"
                        : "text-bounce/60 bg-bounce/10"
                    }`}>
                      {isSettled ? "Settled" : "Split"}
                    </span>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
