import { MOCK_TRANSACTIONS, CURRENT_USER, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

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
                  <Avatar initials={other?.initials ?? "?"} avatar={other?.avatar} size="md" />
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
                  <Avatar initials={other?.initials ?? "?"} avatar={other?.avatar} size="md" />
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

export default function Activity() {
  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Activity</h1>
      <TransactionsTab />
    </div>
  );
}
