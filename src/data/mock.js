// --- Users ---
export const CURRENT_USER = {
  id: "u1",
  name: "Coco",
  username: "magicoco",
  fullName: "Keming Wang",
  initials: "KW",
  badges: ["spontaneous", "budget"],
};

export const MOCK_USERS = [
  CURRENT_USER,
  { id: "u2", name: "Nahian", username: "nahian", fullName: "Nahian Ahmed", initials: "NA", badges: ["reliable", "connector"] },
  { id: "u3", name: "Irina", username: "irina", fullName: "Irina Petrov", initials: "IP", badges: ["organizer"] },
  { id: "u4", name: "Sehaj", username: "sehaj", fullName: "Sehaj Singh", initials: "SS", badges: ["budget"] },
  { id: "u5", name: "Alex", username: "alex", fullName: "Alex Chen", initials: "AC", badges: ["reliable"] },
];

// --- Badges (our proposed feature) ---
export const BADGES = [
  { id: "reliable", label: "The Reliable One", desc: "Always pays on time", icon: "🎯" },
  { id: "organizer", label: "The Organizer", desc: "Creates events that bring people together", icon: "📋" },
  { id: "connector", label: "The Social Connector", desc: "Invited 10+ friends to events", icon: "🤝" },
  { id: "budget", label: "The Budget Boss", desc: "Keeps groups under budget", icon: "💰" },
  { id: "spontaneous", label: "The Spontaneous Friend", desc: "Joined 5 events same-day", icon: "⚡" },
];

// --- Events (our proposed feature — layered onto Groups) ---
export const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Taco Tuesday",
    emoji: "🌮",
    date: "2026-02-10",
    time: "6:00 PM",
    host: "u1",
    rsvps: ["u1", "u2", "u3"],
    totalCost: null,
    splits: [],
    status: "upcoming",
  },
  {
    id: "e2",
    title: "Study Sunday",
    emoji: "📚",
    date: "2026-02-08",
    time: "2:00 PM",
    host: "u2",
    rsvps: ["u1", "u2", "u4"],
    totalCost: 45.0,
    splits: [
      { userId: "u1", amount: 15.0, paid: true },
      { userId: "u2", amount: 15.0, paid: true },
      { userId: "u4", amount: 15.0, paid: false },
    ],
    status: "splitting",
  },
  {
    id: "e3",
    title: "Club Gathering",
    emoji: "🎉",
    date: "2026-02-15",
    time: "8:00 PM",
    host: "u3",
    rsvps: ["u3", "u5"],
    totalCost: null,
    splits: [],
    status: "upcoming",
  },
  {
    id: "e4",
    title: "Rent Cycle — Feb",
    emoji: "🏠",
    date: "2026-02-01",
    time: "12:00 PM",
    host: "u1",
    rsvps: ["u1", "u2", "u3", "u4"],
    totalCost: 2400.0,
    splits: [
      { userId: "u1", amount: 600.0, paid: true },
      { userId: "u2", amount: 600.0, paid: true },
      { userId: "u3", amount: 600.0, paid: true },
      { userId: "u4", amount: 600.0, paid: true },
    ],
    status: "settled",
  },
];

// --- Transactions (matches Bounce's existing transaction screen) ---
export const MOCK_TRANSACTIONS = [
  { id: "t1", from: "u3", to: "u1", amount: 1.0, note: "Test", status: "pending", daysLeft: 29 },
  { id: "t2", from: "u1", to: "u3", amount: 1.0, note: "BOUNCE ME BOUNCE ME", status: "pending", daysLeft: 29 },
  { id: "t3", from: "u2", to: "u1", amount: 15.0, note: "Study Sunday split", status: "completed", daysLeft: 0 },
  { id: "t4", from: "u3", to: "u1", amount: 600.0, note: "Rent — Feb", status: "completed", daysLeft: 0 },
];

// --- Notifications (our proposed feature) ---
export const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "rsvp", message: "Irina RSVP'd to Club Gathering", time: "2h ago", read: false },
  { id: "n2", type: "badge", message: "You earned The Budget Boss badge!", time: "1d ago", read: false },
  { id: "n3", type: "split", message: "Sehaj hasn't paid for Study Sunday yet", time: "1d ago", read: true },
  { id: "n4", type: "event", message: "Taco Tuesday is in 2 days!", time: "2d ago", read: true },
  { id: "n5", type: "settled", message: "Rent Cycle — Feb is fully settled", time: "1w ago", read: true },
];

// --- Helpers ---
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getEventById(id) {
  return MOCK_EVENTS.find((e) => e.id === id);
}
