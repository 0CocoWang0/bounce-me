import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

export default function EventDetail() {
  const { eventId } = useParams();
  const { events } = useEvents();
  const event = events.find((e) => e.id === eventId);
  const navigate = useNavigate();
  const [rsvpd, setRsvpd] = useState(false);

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  const host = getUserById(event.host);
  // Host first, then the rest
  const members = [host, ...event.rsvps.map((id) => getUserById(id)).filter(Boolean).filter((u) => u.id !== event.host)];

  const totalCost = event.totalCost || 0;
  const totalSplits = event.splits?.length || 0;
  const paidSplits = event.splits?.filter((s) => s.paid).length || 0;
  const unpaidAmount = event.splits?.filter((s) => !s.paid).reduce((sum, s) => sum + s.amount, 0) || 0;

  let settlementPercentage = 0;
  if (event.status === "settled") {
    settlementPercentage = 100;
  } else if (event.status === "splitting") {
    settlementPercentage = totalSplits > 0 ? Math.round((paidSplits / totalSplits) * 100) : 0;
  }

  const moments = event.moments || [];
  const expenses = event.expenses || [];
  const [lightbox, setLightbox] = useState(null);
  const [reactions, setReactions] = useState({
    exp_s1: { "🔥": 2, "😂": 1 },
    exp_s3: { "💀": 3, "❤️": 1 },
    exp_r1: { "🙌": 4, "🔥": 2 },
  });
  const [pickerOpen, setPickerOpen] = useState(null);

  const REACTION_EMOJIS = ["😂", "🔥", "💀", "❤️", "👀", "🙌"];

  const toggleReaction = (expenseId, emoji) => {
    setReactions((prev) => {
      const current = prev[expenseId] || {};
      const count = current[emoji] || 0;
      return {
        ...prev,
        [expenseId]: { ...current, [emoji]: count > 0 ? undefined : 1 },
      };
    });
  };

  // Fun emoji milestones for the progress bar
  const progressEmoji =
    settlementPercentage === 100 ? "🎉" :
      settlementPercentage >= 75 ? "🔥" :
        settlementPercentage >= 50 ? "💪" :
          settlementPercentage >= 25 ? "🚀" : "🌱";

  return (
    <div className="px-5 pt-14 pb-25 overflow-x-clip">
      {/* Top nav */}
      <div className="sticky top-0 z-40 flex items-center justify-between mb-6 -mx-5 px-5 pt-2 pb-3 backdrop-blur-md">
        <Link
          to="/groups"
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 dark:text-white">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </Link>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 dark:text-white">
            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </div>
      </div>

      {/* Event title with emoji */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{event.emoji}</div>
        <h1 className="text-2xl font-bold dark:text-white">{event.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {event.date} at {event.time}
        </p>
      </div>

      {/* People row — host first, horizontal scroll */}
      <div className="flex gap-5 overflow-x-auto mb-8 p-1">
        {members.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className={`rounded-full ${user.id === event.host ? "ring-2 ring-bounce" : ""}`}>
              <Avatar initials={user.initials} avatar={user.avatar} size="lg" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user.id === CURRENT_USER.id ? "you" : user.name.toLowerCase()}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-card-dark flex items-center justify-center text-gray-400 text-xl">
            +
          </div>
          <span className="text-xs text-gray-400">add</span>
        </div>
      </div>

      {/* Fun progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Settlement</span>
          <span className="text-xs font-semibold dark:text-white">{progressEmoji} {settlementPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-card-dark rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(settlementPercentage, 2)}%`,
              background: settlementPercentage === 100
                ? "linear-gradient(90deg, #4ade80, #22c55e)"
                : settlementPercentage >= 50
                  ? "linear-gradient(90deg, #facc15, #4ade80)"
                  : "linear-gradient(90deg, #f87171, #facc15)",
            }}
          />
        </div>
      </div>

      {/* Expense + Balance cards */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Group Expenses</p>
          <p className="text-xl font-bold dark:text-white">${totalCost.toFixed(2)}</p>
        </div>
        <div className="flex-1 bg-gray-900 dark:bg-black rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-1">Group Balance</p>
          <p className={`text-xl font-bold ${unpaidAmount > 0 ? "text-red-400" : "text-green-400"}`}>
            ${unpaidAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Settle up button */}
      {event.status !== "settled" && (
        <div className="mb-8">
          {unpaidAmount > 0 ? (
            <button
              onClick={() => {
                if (event.host === CURRENT_USER.id) {
                  // I'm the host — remind others to pay
                  navigate(`/reminder/${event.id}`);
                } else {
                  // I owe the host — go to send flow
                  navigate("/send", {
                    state: {
                      recipient: host,
                      amount: unpaidAmount,
                      title: `${event.title} split`,
                    },
                  });
                }
              }}
              className="w-full text-center font-semibold py-3.5 rounded-2xl text-sm text-black active:scale-[0.98] transition-transform"
              style={{ backgroundColor: "#D4E157" }}
            >
              Settle up
            </button>
          ) : (
            <div className="w-full text-center font-semibold py-3.5 rounded-2xl text-sm text-gray-400 bg-gray-100 dark:bg-card-dark dark:text-gray-500">
              You're all settled up!
            </div>
          )}
        </div>
      )}

      {/* Expense History */}
      {expenses.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧾</span>
              <h2 className="text-lg font-bold dark:text-white">Expense History</h2>
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-card-dark text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {expenses.length}
              </span>
            </div>
            {event.status !== "settled" && (
              <button
                onClick={() => navigate(`/add-expense/${event.id}`)}
                className="flex items-center gap-1 text-xs font-semibold bg-gray-900 dark:bg-card-dark border border-gray-700 text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              >
                <span className="text-sm">+</span> New
              </button>
            )}
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-3 bottom-3 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-4">
              {expenses.map((expense) => {
                const payer = getUserById(expense.payer);
                return (
                  <div key={expense.id} className="relative flex gap-3">
                    {/* Timeline dot */}
                    <div className="relative z-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center text-lg shrink-0 border-2 border-white dark:border-bounce-dark">
                      {expense.emoji}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-3">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-semibold text-sm dark:text-white">{expense.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Avatar initials={payer?.initials} avatar={payer?.avatar} size="sm" />
                            <span className="text-xs text-gray-400">
                              {payer?.id === CURRENT_USER.id ? "You" : payer?.name} paid
                            </span>
                            <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                            <span className="text-xs text-gray-400">{expense.time}</span>
                          </div>
                        </div>
                        <span className="font-bold text-sm dark:text-white whitespace-nowrap">
                          ${expense.amount.toFixed(2)}
                        </span>
                      </div>

                      {/* Mini photo gallery */}
                      {expense.photos?.length > 0 && (
                        <div className="flex gap-1.5 mt-2.5">
                          {expense.photos.map((photo, j) => (
                            <button
                              key={j}
                              onClick={() => setLightbox({ photos: expense.photos, index: j })}
                              className="w-14 h-14 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600 hover:ring-2 hover:ring-bounce transition-all active:scale-95"
                            >
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Emoji reactions */}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {REACTION_EMOJIS.filter((em) => reactions[expense.id]?.[em]).map((em) => (
                          <button
                            key={em}
                            onClick={() => toggleReaction(expense.id, em)}
                            className="flex items-center gap-1 bg-bounce/20 border border-bounce/40 rounded-full px-2 py-0.5 text-xs active:scale-95 transition-transform"
                          >
                            <span>{em}</span>
                            <span className="text-[10px] font-semibold dark:text-white">{reactions[expense.id][em]}</span>
                          </button>
                        ))}
                        <div className="relative">
                          <button
                            onClick={() => setPickerOpen(pickerOpen === expense.id ? null : expense.id)}
                            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-95 transition-transform"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                              <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
                              <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
                            </svg>
                          </button>
                          {pickerOpen === expense.id && (
                            <div className="absolute bottom-9 right-0 flex gap-1 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1.5 shadow-lg z-20">
                              {REACTION_EMOJIS.map((em) => (
                                <button
                                  key={em}
                                  onClick={() => {
                                    toggleReaction(expense.id, em);
                                    setPickerOpen(null);
                                  }}
                                  className="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Photo Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>

          {/* Nav arrows */}
          {lightbox.photos.length > 1 && (
            <>
              <button
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
                  }));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index + 1) % prev.photos.length,
                  }));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}

          <img
            src={lightbox.photos[lightbox.index]}
            alt=""
            className="max-w-[85%] max-h-[75vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Dot indicators */}
          {lightbox.photos.length > 1 && (
            <div className="absolute bottom-8 flex gap-2">
              {lightbox.photos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightbox.index ? "bg-white scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Moments Section */}
      {moments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 dark:text-white">Moments</h2>
          <div className="flex gap-3">
            {moments.map((moment) => {
              const author = getUserById(moment.author);
              return (
                <Link
                  key={moment.id}
                  to={`/moment/${moment.id}`}
                  className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={moment.image}
                    alt={`Moment by ${author?.name}`}
                    className="w-full h-full object-cover"
                  />
                </Link>
              );
            })}
            <div className="flex-1 aspect-[3/4] rounded-2xl bg-gray-100 dark:bg-card-dark flex items-center justify-center">
              <span className="text-gray-400 text-sm">View more→</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
