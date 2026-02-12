import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MOCK_USERS, MOCK_TRANSACTIONS, CURRENT_USER, BADGES } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

// Pick the first pending outgoing transaction as default
const pendingOutgoing = MOCK_TRANSACTIONS.find(
  (t) => t.from === CURRENT_USER.id && t.status === "pending"
);

const DRAG_THRESHOLD = 120;

const bounceContacts = MOCK_USERS.filter((u) => u.id !== CURRENT_USER.id);

export default function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state;
  const { settleEvent } = useEvents();
  const isSettleUp = !!prefill?.settleUp;

  // 0=form+drag, 1=contacts, 2=confirm, 3=loading, 4=done
  const [step, setStep] = useState(0);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const [title, setTitle] = useState(prefill?.title ?? pendingOutgoing?.note ?? "");
  const [amount, setAmount] = useState(prefill?.amount ?? pendingOutgoing?.amount ?? 0);
  const [recipient, setRecipient] = useState(prefill?.recipient ?? null);
  const [searchQuery, setSearchQuery] = useState("");

  // Drag state — drag UP
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const startY = useRef(0);

  const canDrag = !!recipient;

  const onPointerDown = useCallback((e) => {
    if (!canDrag) return;
    e.preventDefault();
    startY.current = e.clientY;
    setIsDragging(true);
  }, [canDrag]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = Math.max(0, startY.current - e.clientY);
    setDragY(delta);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY >= DRAG_THRESHOLD) {
      setSnapped(true);
      setTimeout(() => setStep(2), 400);
    } else {
      setDragY(0);
    }
  }, [isDragging, dragY]);

  // Auto-advance from loading to success
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => setStep(4), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Guard so settle-up celebration only fires once
  const settledRef = useRef(false);

  // Auto-navigate home after success (only for non-settle-up)
  useEffect(() => {
    if (step !== 4) return;

    if (!isSettleUp) {
      const t = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(t);
    }

    // Settle-up celebration — run once
    if (settledRef.current) return;
    settledRef.current = true;

    settleEvent(prefill.settleUp.eventId);
    const t1 = setTimeout(() => setProgressAnimated(true), 600);
    const t2 = setTimeout(() => setShowButton(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 0: Form with draggable triangle
  if (step === 0) {
    const progress = canDrag ? Math.min(dragY / DRAG_THRESHOLD, 1) : 0;
    const translateY = snapped ? -(DRAG_THRESHOLD + 40) : -dragY;

    return (
      <div
        className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Top bar */}
        <div className="px-5 pt-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Title input */}
        <div className="text-center mt-10 px-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the transaction title"
            className="w-full text-center text-white text-lg font-semibold bg-transparent border-none outline-none placeholder-gray-500"
          />
        </div>

        {/* Recipient selector / avatar */}
        <div className="flex flex-col items-center mt-8">
          {recipient ? (
            <button onClick={() => setStep(1)}>
              <Avatar initials={recipient.initials} avatar={recipient.avatar} size="lg" />
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="w-14 h-14 rounded-full bg-bounce flex items-center justify-center text-2xl text-buonce-dark"
            >
              +
            </button>
          )}
          <span className="text-sm text-gray-400 mt-2">
            {recipient ? recipient.username : "To"}
          </span>
        </div>

        {/* Arrows pointing UP — only show when recipient selected */}
        {recipient && (
          <div
            className="flex flex-col items-center gap-1 mt-6"
            style={{ opacity: Math.max(0, 0.6 - progress * 0.6) }}
          >
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-500 animate-pulse rotate-180" style={{ animationDelay: `${i * 0.2}s` }}>
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Draggable upward triangle at bottom */}
        <div className="flex flex-col items-center mb-4">
          <div
            className={`flex flex-col items-center ${canDrag ? "cursor-grab active:cursor-grabbing touch-none" : ""
              } ${snapped ? "transition-transform duration-300 ease-out" : isDragging ? "" : "transition-transform duration-300 ease-out"
              }`}
            style={{ transform: canDrag ? `translateY(${translateY}px)` : "none" }}
            onPointerDown={onPointerDown}
          >
            <div className="relative w-64 h-56">
              <svg viewBox="0 0 260 230" className="w-full h-full">
                <path
                  d="M20,220 L240,220 Q255,220 248,205 L138,10 Q130,-5 122,10 L12,205 Q5,220 20,220 Z"
                  className="fill-black"
                />
              </svg>
              {/* Bank icon */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-card-dark border border-gray-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm.177-2h4.9a1.25 1.25 0 001.25-1.25V3.5h-7.4v8.25c0 .69.56 1.25 1.25 1.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400 mt-1">Bank Account</span>
              </div>
              {/* Amount */}
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <span className="text-2xl font-bold text-white">${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint text */}
        <p className="text-center text-sm text-gray-500 animate-pulse pb-28">
          {recipient ? "Drag up to send" : "Select a recipient to send"}
        </p>
      </div>
    );
  }

  // Step 1: Contact picker
  if (step === 1) {
    const filtered = bounceContacts.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col">
        {/* Header */}
        <div className="px-5 pt-14">
          <button
            onClick={() => setStep(0)}
            className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white mb-4">Send to</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a name or a username"
            className="w-full bg-card-dark text-white text-sm rounded-xl px-4 py-3 outline-none placeholder-gray-500 mb-6"
          />
        </div>

        {/* Bounce contacts */}
        <div className="px-5 flex-1 overflow-y-auto pb-28">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
            Bounce contacts
          </p>
          <div className="space-y-1">
            {filtered.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setRecipient(user);
                  setSearchQuery("");
                  setStep(0);
                }}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-card-dark transition-colors"
              >
                <Avatar initials={user.initials} avatar={user.avatar} size="md" />
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{user.username}</p>
                  <p className="text-gray-500 text-xs">{user.fullName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Confirmation
  if (step === 2) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col">
        <div className="px-5 pt-14">
          <button
            onClick={() => { setStep(0); setDragY(0); setSnapped(false); }}
            className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8">
          <div className="text-center mb-10">
            <p className="text-gray-400 text-sm">You're sending:</p>
            <p className="text-2xl font-bold text-white mt-1">${amount.toFixed(2)}</p>
          </div>

          <div className="space-y-0">
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">To</span>
              <span className="text-white font-semibold text-sm">{recipient?.username ?? "unknown"}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">For</span>
              <span className="text-white font-semibold text-sm">{title || "Send"}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">From</span>
              <span className="text-white font-semibold text-sm">Bank Account</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-gray-400 text-sm">Arrives by</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">5 minutes</span>
                <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                  <span className="text-gray-400 text-[10px]">i</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-28">
          <button
            onClick={() => setStep(3)}
            className="w-full bg-bounce text-black font-semibold py-4 rounded-2xl text-base mb-3 active:scale-95 transition-transform"
          >
            Looks good!
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full text-white font-semibold py-3 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Loading
  if (step === 3) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-gray-500 border-t-white animate-spin" />
      </div>
    );
  }

  // Step 4: Success — settle up celebration or generic
  if (isSettleUp) {
    const su = prefill.settleUp;
    const currentPct = su.currentPercentage;
    const animPct = progressAnimated ? 100 : currentPct;

    // Confetti pieces
    const confettiColors = ["#D4E157", "#FF6B6B", "#4ECDC4", "#FFD93D", "#A66CFF", "#6BCB77", "#FF9A8B", "#88D8F5"];
    const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`,
      color: confettiColors[i % confettiColors.length],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 80,
    }));

    // Pick 2 random badges the user "earned"
    const earnedBadges = BADGES.sort(() => Math.random() - 0.5).slice(0, 2);

    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="absolute confetti-piece"
              style={{
                left: p.left,
                top: -20,
                width: p.size,
                height: p.size * 1.5,
                backgroundColor: p.color,
                borderRadius: 2,
                animationDelay: p.delay,
                animationDuration: p.duration,
                "--drift": `${p.drift}px`,
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-20">
          {/* Event emoji + title */}
          <div className="text-6xl mb-3 animate-bounce">{su.emoji}</div>
          <h1 className="text-xl font-bold text-white mb-1">{su.eventTitle}</h1>
          <p className="text-sm text-gray-400 mb-8">All settled up!</p>

          {/* Members row */}
          <div className="flex -space-x-2 mb-8">
            {su.members.map((user) => (
              <div key={user.id} className="ring-2 ring-bounce-dark rounded-full">
                <Avatar initials={user.initials} avatar={user.avatar} size="md" />
              </div>
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="w-full max-w-65 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Settlement</span>
              <span className="text-xs font-semibold text-white">
                {animPct === 100 ? "🎉" : "🔥"} {animPct}%
              </span>
            </div>
            <div className="h-3 bg-card-dark rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${animPct}%`,
                  background: "linear-gradient(90deg, #4ade80, #22c55e)",
                  transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
          </div>

          {/* Badges earned */}
          {showButton && (
            <div className="mt-8 animate-fade-in">
              <p className="text-xs text-gray-400 text-center mb-3">You earned badges!</p>
              <div className="flex gap-6 justify-center mb-6">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1.5 w-16">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: badge.color }}
                    >
                      {badge.icon}
                    </div>
                    <span className="text-[10px] text-center leading-tight font-medium text-white">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom button */}
        {showButton && (
          <div className="px-8 pb-28 relative z-20 animate-fade-in">
            <button
              onClick={() => navigate("/groups")}
              className="w-full font-semibold py-4 rounded-2xl text-sm text-black active:scale-[0.98] transition-transform"
              style={{ backgroundColor: "#D4E157" }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Confetti + fade-in animations */}
        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
          }
          .confetti-piece {
            animation: confetti-fall linear forwards;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Step 4: Generic success (non-settle-up)
  return (
    <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white">Transfer Sent</h2>
    </div>
  );
}
