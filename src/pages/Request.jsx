import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_TRANSACTIONS, getUserById, CURRENT_USER } from "../data/mock";
import Avatar from "../components/Avatar";

// Pick the first pending incoming transaction as the request
const pendingRequest = MOCK_TRANSACTIONS.find(
  (t) => t.to === CURRENT_USER.id && t.status === "pending"
);

const DRAG_THRESHOLD = 120; // px needed to trigger transition

export default function Request() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=triangle, 1=confirm, 2=loading, 3=done

  const sender = pendingRequest ? getUserById(pendingRequest.from) : null;
  const amount = pendingRequest?.amount ?? 25;
  const note = pendingRequest?.note ?? "Settle Up";

  // Drag state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const startY = useRef(0);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    startY.current = e.clientY;
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const delta = Math.max(0, e.clientY - startY.current); // only allow downward
    setDragY(delta);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY >= DRAG_THRESHOLD) {
      // Snap down then transition
      setSnapped(true);
      setTimeout(() => setStep(1), 400);
    } else {
      // Spring back
      setDragY(0);
    }
  }, [isDragging, dragY]);

  // Auto-advance from loading to success
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Auto-navigate home after success
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  // Step 0: Draggable triangle
  if (step === 0) {
    const progress = Math.min(dragY / DRAG_THRESHOLD, 1);
    const translateY = snapped ? DRAG_THRESHOLD + 40 : dragY;

    return (
      <div
        className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Back button */}
        <div className="px-5 pt-14">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mt-8">
          <h1 className="text-xl font-bold text-white">Settle Up</h1>
        </div>

        {/* Triangle + bank icon area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Draggable triangle */}
          <div
            className={`flex flex-col items-center cursor-grab active:cursor-grabbing touch-none ${
              snapped ? "transition-transform duration-300 ease-out" : isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateY(${translateY}px)` }}
            onPointerDown={onPointerDown}
          >
            <div className="relative w-64 h-56">
              <svg viewBox="0 0 260 230" className="w-full h-full">
                <path
                  d="M20,10 L240,10 Q255,10 248,25 L138,220 Q130,235 122,220 L12,25 Q5,10 20,10 Z"
                  className="fill-black"
                />
              </svg>
              {/* Amount */}
              <div className="absolute top-12 left-0 right-0 text-center">
                <span className="text-2xl font-bold text-white">${amount.toFixed(2)}</span>
              </div>
              {/* Avatar */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2">
                <Avatar initials={sender?.initials ?? "?"} avatar={sender?.avatar} size="lg" />
              </div>
            </div>
          </div>

          {/* Animated arrows — fade out as user drags */}
          <div
            className="flex flex-col items-center gap-1 mt-4"
            style={{ opacity: Math.max(0, 0.6 - progress * 0.6) }}
          >
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            ))}
          </div>

          {/* Bank icon — glows as triangle approaches */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <div
              className="w-12 h-12 rounded-full bg-card-dark flex items-center justify-center transition-all duration-200"
              style={{
                borderWidth: 2,
                borderColor: progress > 0.8 ? "#d0f900" : "#4b5563",
                boxShadow: progress > 0.8 ? "0 0 12px rgba(208,249,0,0.4)" : "none",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gray-400">
                <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm.177-2h4.9a1.25 1.25 0 001.25-1.25V3.5h-7.4v8.25c0 .69.56 1.25 1.25 1.25z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Bank Account</span>
          </div>

          {/* Hint text */}
          <p className="mt-10 text-sm text-gray-500 animate-pulse">
            Drag down to accept
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Confirmation
  if (step === 1) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col">
        {/* Back button */}
        <div className="px-5 pt-14">
          <button
            onClick={() => setStep(0)}
            className="w-10 h-10 rounded-full bg-card-dark flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-8">
          <div className="text-center mb-10">
            <p className="text-gray-400 text-sm">You're accepting:</p>
            <p className="text-2xl font-bold text-white mt-1">${amount.toFixed(2)}</p>
          </div>

          {/* Details table */}
          <div className="space-y-0">
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">From</span>
              <span className="text-white font-semibold text-sm">{sender?.username ?? "unknown"}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">For</span>
              <span className="text-white font-semibold text-sm">{note}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-gray-700">
              <span className="text-gray-400 text-sm">To</span>
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

        {/* Bottom buttons */}
        <div className="px-8 pb-28">
          <button
            onClick={() => setStep(2)}
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

  // Step 2: Loading
  if (step === 2) {
    return (
      <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-gray-500 border-t-white animate-spin" />
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="min-h-screen md:min-h-0 md:h-full bg-bounce-dark flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white">Transfer Accepted</h2>
    </div>
  );
}
