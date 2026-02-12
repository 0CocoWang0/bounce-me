import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

export default function Reminder() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();
  const event = events.find((e) => e.id === eventId);

  // Step: 0=select, 1=sending, 2=done
  const [step, setStep] = useState(0);

  const unpaidMembers = (event?.splits || [])
    .filter((s) => !s.paid && s.userId !== CURRENT_USER.id)
    .map((s) => ({
      ...s,
      user: getUserById(s.userId),
    }))
    .filter((s) => s.user);

  const [selected, setSelected] = useState(() =>
    unpaidMembers.reduce((acc, m) => ({ ...acc, [m.userId]: true }), {})
  );

  const toggleSelect = (userId) => {
    setSelected((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const selectedTotal = unpaidMembers
    .filter((m) => selected[m.userId])
    .reduce((sum, m) => sum + m.amount, 0);

  const selectedCount = unpaidMembers.filter((m) => selected[m.userId]).length;

  // Auto-advance from sending to done
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Auto-navigate back after done
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => navigate(-1), 1800);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  if (!event) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex items-center justify-center">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  // Step 1: Sending animation
  if (step === 1) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-gray-500 border-t-white animate-spin" />
          <p className="text-sm text-gray-400">Sending reminders...</p>
        </div>
      </div>
    );
  }

  // Step 2: Success
  if (step === 2) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Reminders Sent!</h2>
        <p className="text-sm text-gray-400 mt-2">
          {selectedCount} {selectedCount === 1 ? "person" : "people"} nudged 👊
        </p>
      </div>
    );
  }

  // Step 0: Select who to remind
  return (
    <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="px-8 mt-8 mb-10">
        <h1 className="text-xl font-semibold text-white text-center">
          Who would you like to send a reminder to?
        </h1>
      </div>

      {/* Member list */}
      <div className="px-5 flex-1">
        <div className="space-y-1">
          {unpaidMembers.map((member) => {
            const isSelected = selected[member.userId];
            return (
              <button
                key={member.userId}
                onClick={() => toggleSelect(member.userId)}
                className="w-full flex items-center gap-3 py-3.5 px-2 rounded-xl transition-colors active:scale-[0.98]"
              >
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-white border-white"
                      : "border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-black">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Avatar + name */}
                <Avatar initials={member.user.initials} avatar={member.user.avatar} size="md" />
                <span className="text-white font-medium text-sm flex-1 text-left">
                  {member.user.username}
                </span>

                {/* Amount */}
                <span className="text-white font-bold text-sm">
                  ${member.amount.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>

        {unpaidMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-400 text-sm">Everyone has paid up!</p>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-28">
        {/* Total */}
        <div className="flex items-center justify-between py-4 border-t border-gray-700 mb-4">
          <span className="text-gray-400 text-sm">Total</span>
          <span className="text-white font-bold text-lg">${selectedTotal.toFixed(2)}</span>
        </div>

        {/* Send reminder button */}
        <button
          onClick={() => selectedCount > 0 && setStep(1)}
          disabled={selectedCount === 0}
          className={`w-full font-semibold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] ${
            selectedCount > 0
              ? "text-black"
              : "text-black/40 opacity-60"
          }`}
          style={{ backgroundColor: "#D4E157" }}
        >
          Send a reminder
        </button>

        {/* Mark as settled */}
        <button
          onClick={() => navigate(-1)}
          className="w-full text-white font-semibold py-3 text-sm mt-2 underline underline-offset-2"
        >
          Mark as settled
        </button>
      </div>
    </div>
  );
}
