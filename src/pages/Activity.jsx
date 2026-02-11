import { useState } from "react";
import { MOCK_TRANSACTIONS, MOCK_NOTIFICATIONS, CURRENT_USER, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

const TYPE_ICONS = {
  rsvp: "\u{1F44B}",
  badge: "\u{1F3C5}",
  split: "\u{1F4B8}",
  event: "\u{1F4C5}",
  settled: "\u{2705}",
};

function TransactionsTab() {
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === "pending");
  const completed = MOCK_TRANSACTIONS.filter((t) => t.status === "completed");

  return (
    <div>
      {pending.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">In progress</p>
          <div className="bg-gray-50 dark:bg-card-dark rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
            {pending.map((tx) => {
              const isIncoming = tx.to === CURRENT_USER.id;
              const other = getUserById(isIncoming ? tx.from : tx.to);
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4">
                  <Avatar initials={other?.initials ?? "?"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm dark:text-white">{other?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{tx.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm dark:text-white">
                      {isIncoming ? "" : "-"}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">{tx.daysLeft} days left</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Completed</p>
          <div className="bg-gray-50 dark:bg-card-dark rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
            {completed.map((tx) => {
              const isIncoming = tx.to === CURRENT_USER.id;
              const other = getUserById(isIncoming ? tx.from : tx.to);
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4">
                  <Avatar initials={other?.initials ?? "?"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm dark:text-white">{other?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{tx.note}</p>
                  </div>
                  <p className="font-semibold text-sm dark:text-white">
                    {isIncoming ? "" : "-"}${tx.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function AlertsTab() {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div>
      {unread.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">New</p>
          <div className="space-y-1">
            {unread.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 bg-gray-50 dark:bg-card-dark rounded-xl p-4"
              >
                <span className="text-lg mt-0.5">{TYPE_ICONS[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white">{n.message}</p>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
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

const TABS = ["Transactions", "Alerts"];

export default function Activity() {
  const [activeTab, setActiveTab] = useState("Transactions");

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Activity</h1>

      {/* Tab switcher */}
      <div className="flex gap-0 mb-6 bg-gray-100 dark:bg-card-dark rounded-full p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm font-semibold py-2 rounded-full transition-colors ${
              activeTab === tab
                ? "bg-white dark:bg-bounce-dark text-black dark:text-white shadow-sm"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Transactions" ? <TransactionsTab /> : <AlertsTab />}
    </div>
  );
}
