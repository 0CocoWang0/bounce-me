import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, CURRENT_USER } from "../data/mock";
import { useEvents } from "../context/EventsContext";
import Avatar from "../components/Avatar";

const EXPENSE_EMOJIS = ["🍕", "☕", "🍔", "🎬", "🚗", "🛒", "🎮", "📚", "🍺", "🏠", "💊", "🎁"];

export default function AddExpense() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events } = useEvents();
  const event = events.find((e) => e.id === eventId);

  const [emoji, setEmoji] = useState("🍕");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitMode, setSplitMode] = useState("equal"); // equal | custom
  const [unitMode, setUnitMode] = useState("$"); // $ | %
  const [photos, setPhotos] = useState([]);

  if (!event) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Event not found.</p>
      </div>
    );
  }

  const host = getUserById(event.host);
  const members = [
    host,
    ...event.rsvps
      .map((id) => getUserById(id))
      .filter(Boolean)
      .filter((u) => u.id !== event.host),
  ];

  const totalAmount = parseFloat(amount) || 0;
  const perPerson = members.length > 0 ? totalAmount / members.length : 0;

  // Fake photo picker — just cycles demo images
  const demoPhotos = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
  ];

  const addPhoto = () => {
    if (photos.length < 3) {
      setPhotos((prev) => [...prev, demoPhotos[prev.length % demoPhotos.length]]);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 px-5 pt-14 pb-2 flex items-center gap-3 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card-dark flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 dark:text-white">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-lg font-bold dark:text-white">Add Expense</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 pt-4 pb-4 flex flex-col">
        {/* Emoji + Description */}
        <div className="text-center mb-6">
          {/* Emoji selector */}
          <div className="relative inline-block mb-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-card-dark border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-3xl hover:border-bounce transition-colors active:scale-95"
            >
              {emoji}
            </button>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bounce text-black text-xs font-bold flex items-center justify-center">
              +
            </div>

            {/* Emoji picker dropdown */}
            {showEmojiPicker && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-600 rounded-2xl p-3 shadow-xl z-20 w-64">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Pick an emoji</p>
                <div className="grid grid-cols-6 gap-1">
                  {EXPENSE_EMOJIS.map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        setEmoji(em);
                        setShowEmojiPicker(false);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-90 transition-all ${
                        em === emoji ? "bg-bounce/20 ring-2 ring-bounce" : ""
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description input */}
          <div className="w-full bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:border-bounce transition-colors">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this expense for?"
              className="w-full text-center text-base font-medium bg-transparent border-none outline-none dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Amount input */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-5xl font-bold text-center bg-transparent border-none outline-none dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {totalAmount > 0 && members.length > 0
              ? `~$${perPerson.toFixed(2)} per person`
              : "Enter the total amount"}
          </p>
        </div>

        {/* Photo attachments */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Receipts & Photos</p>
          <div className="flex gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button
                onClick={addPhoto}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:border-bounce hover:text-bounce transition-colors active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909-4.97-4.969a.75.75 0 00-1.06 0L2.5 11.06zm6.22-3.31a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[9px] font-medium">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 mb-4" />

        {/* Split header */}
        <div className="flex items-center justify-between mb-4">
          <button className="text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
            Manage contacts
          </button>
          <div className="flex bg-gray-100 dark:bg-card-dark rounded-full p-0.5">
            <button
              onClick={() => setUnitMode("$")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                unitMode === "$"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-400"
              }`}
            >
              $
            </button>
            <button
              onClick={() => setUnitMode("%")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                unitMode === "%"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-400"
              }`}
            >
              %
            </button>
          </div>
        </div>

        {/* Members split list */}
        <div className="space-y-1 flex-1">
          {members.map((user) => {
            const isCurrentUser = user.id === CURRENT_USER.id;
            const splitAmount = unitMode === "$"
              ? perPerson.toFixed(2)
              : members.length > 0
                ? (100 / members.length).toFixed(1)
                : "0.0";
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <Avatar initials={user.initials} avatar={user.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium dark:text-white">
                    {isCurrentUser ? "Me" : user.name.toLowerCase()}
                  </span>
                  {isCurrentUser && (
                    <span className="text-[10px] text-gray-400 ml-1.5">(Payer)</span>
                  )}
                </div>
                <span className="text-sm font-bold dark:text-white">
                  {unitMode === "$" ? "$" : ""}{splitAmount}{unitMode === "%" ? "%" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-5 pb-8 pt-2">
        <button
          onClick={() => navigate(-1)}
          disabled={!description || !amount}
          className={`w-full font-semibold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] ${
            description && amount
              ? "text-black"
              : "text-black/40 opacity-60"
          }`}
          style={{ backgroundColor: "#D4E157" }}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}
