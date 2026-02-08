import { MOCK_TRANSACTIONS, CURRENT_USER, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

export default function Transactions() {
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === "pending");
  const completed = MOCK_TRANSACTIONS.filter((t) => t.status === "completed");

  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          Search
        </button>
      </div>

      {pending.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">In progress</p>
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
            {pending.map((tx) => {
              const isIncoming = tx.to === CURRENT_USER.id;
              const other = getUserById(isIncoming ? tx.from : tx.to);
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4">
                  <Avatar initials={other?.initials ?? "?"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{other?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{tx.note}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${isIncoming ? "" : ""}`}>
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
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
            {completed.map((tx) => {
              const isIncoming = tx.to === CURRENT_USER.id;
              const other = getUserById(isIncoming ? tx.from : tx.to);
              return (
                <div key={tx.id} className="flex items-center gap-3 p-4">
                  <Avatar initials={other?.initials ?? "?"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{other?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{tx.note}</p>
                  </div>
                  <p className="font-semibold text-sm">
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
