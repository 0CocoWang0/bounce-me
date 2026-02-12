import cocoImg from "../assets/team-pic/coco.png";
import nahianImg from "../assets/team-pic/nahian.png";
import irinaImg from "../assets/team-pic/irina.png";
import sehajImg from "../assets/team-pic/sehaj.png";

// --- Users ---
export const CURRENT_USER = {
  id: "u1",
  name: "Coco",
  username: "magicoco",
  fullName: "Keming Wang",
  initials: "KW",
  avatar: cocoImg,
  badges: ["spontaneous", "budget"],
};

export const MOCK_USERS = [
  CURRENT_USER,
  {
    id: "u2",
    name: "Nahian",
    username: "nahian",
    fullName: "Nahian Ahmed",
    initials: "NA",
    avatar: nahianImg,
    badges: ["reliable", "connector"],
  },
  {
    id: "u3",
    name: "Irina",
    username: "irina",
    fullName: "Irina Petrov",
    initials: "IP",
    avatar: irinaImg,
    badges: ["organizer"],
  },
  {
    id: "u4",
    name: "Sehaj",
    username: "sehaj",
    fullName: "Sehaj Singh",
    initials: "SS",
    avatar: sehajImg,
    badges: ["budget"],
  },
  {
    id: "u5",
    name: "Alex",
    username: "alex",
    fullName: "Alex Chen",
    initials: "AC",
    badges: ["reliable"],
  },
];

// --- Badges (our proposed feature) ---
export const BADGES = [
  {
    id: "reliable",
    label: "The Reliable One",
    desc: "Always pays on time",
    icon: "🎯",
    color: "#FF6B6B",
  },
  {
    id: "organizer",
    label: "The Organizer",
    desc: "Creates events that bring people together",
    icon: "📋",
    color: "#4ECDC4",
  },
  {
    id: "connector",
    label: "The Social Connector",
    desc: "Invited 10+ friends to events",
    icon: "🤝",
    color: "#FFD93D",
  },
  {
    id: "budget",
    label: "The Budget Boss",
    desc: "Keeps groups under budget",
    icon: "💰",
    color: "#6BCB77",
  },
  {
    id: "spontaneous",
    label: "The Spontaneous Friend",
    desc: "Joined 5 events same-day",
    icon: "⚡",
    color: "#A66CFF",
  },
];

// --- Events (our proposed feature — layered onto Groups) ---
export const MOCK_EVENTS = [
  /* {
    id: "e1",
    title: "Taco Tuesday",
    emoji: "🌮",
    date: "2026-02-17",
    time: "6:00 PM",
    host: "u1",
    rsvps: ["u1", "u2", "u3"],
    totalCost: null,
    splits: [],
    status: "upcoming",
    moments: [
      // {
      //   id: "m_taco1",
      //   image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
      //   author: "u1",
      //   timestamp: "2026-02-17 6:30 PM",
      //   amount: 18
      // },
      // {
      //   id: "m_taco2",
      //   image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
      //   author: "u3",
      //   timestamp: "2026-02-17 6:45 PM",
      //   amount: 22
      // }
    ],
  }, */
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
    expenses: [
      {
        id: "exp_s1",
        name: "Coffee & Pastries",
        emoji: "☕",
        payer: "u2",
        amount: 27.0,
        time: "2:30 PM",
        photos: [
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        ],
      },
      {
        id: "exp_s2",
        name: "Printing Notes",
        emoji: "🖨️",
        payer: "u1",
        amount: 8.0,
        time: "3:00 PM",
        photos: [],
      },
      {
        id: "exp_s3",
        name: "Late Night Snacks",
        emoji: "🍕",
        payer: "u4",
        amount: 10.0,
        time: "5:15 PM",
        photos: [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
        ],
      },
    ],
    moments: [
      {
        id: "m_study1",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        author: "u2",
        timestamp: "2026-02-08 3:45 PM",
        amount: 15,
      },
      {
        id: "m_study2",
        image:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
        author: "u1",
        timestamp: "2026-02-08 3:30 PM",
        amount: 12,
      },
    ],
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
    moments: [
      // {
      //   id: "m_club1",
      //   image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
      //   author: "u5",
      //   timestamp: "2026-02-15 9:15 PM",
      //   amount: 35
      // },
      // {
      //   id: "m_club2",
      //   image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
      //   author: "u3",
      //   timestamp: "2026-02-15 9:30 PM",
      //   amount: 28
      // }
    ],
  },
  {
    id: "e4",
    title: "Rent Cycle",
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
    expenses: [
      {
        id: "exp_r1",
        name: "February Rent",
        emoji: "🏠",
        payer: "u1",
        amount: 2400.0,
        time: "12:00 PM",
        photos: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
        ],
      },
    ],
    moments: [
      {
        id: "m_rent1",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        author: "u2",
        timestamp: "2026-02-01 1:00 PM",
        amount: 600,
      },
      {
        id: "m_rent2",
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        author: "u4",
        timestamp: "2026-02-01 2:00 PM",
        amount: 600,
      },
    ],
  },
];

// --- Transactions (matches Bounce's existing transaction screen) ---
export const MOCK_TRANSACTIONS = [
  {
    id: "t1",
    from: "u3",
    to: "u1",
    amount: 1.0,
    note: "Test",
    status: "pending",
    daysLeft: 29,
  },
  {
    id: "t2",
    from: "u1",
    to: "u3",
    amount: 1.0,
    note: "BOUNCE ME BOUNCE ME",
    status: "pending",
    daysLeft: 29,
  },
  {
    id: "t3",
    from: "u2",
    to: "u1",
    amount: 15.0,
    note: "Study Sunday split",
    status: "completed",
    daysLeft: 0,
  },
  {
    id: "t4",
    from: "u3",
    to: "u1",
    amount: 600.0,
    note: "Rent — Feb",
    status: "completed",
    daysLeft: 0,
  },
];

// --- Notifications (our proposed feature) ---
export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "split",
    message: "nahian wants u to split Study Sunday 📚 — $15.00 don't ghost bestie 💀",
    time: "Just now",
    read: false,
    actionable: true,
    userId: "u2",
    eventId: "e2",
    link: "/event/e2",
    amount: 15.0,
    groupName: "Study Sunday",
  },
  {
    id: "n2",
    type: "rsvp",
    message: "Irina RSVP'd to Club Gathering",
    time: "Just now",
    read: false,
  },
  {
    id: "n3",
    type: "split",
    message: "Sehaj hasn't paid for Study Sunday yet",
    time: "1d ago",
    read: true,
  },
  {
    id: "n4",
    type: "event",
    message: "Taco Tuesday is in 2 days!",
    time: "2d ago",
    read: true,
  },
  {
    id: "n5",
    type: "settled",
    message: "Rent Cycle — Feb is fully settled",
    time: "1w ago",
    read: true,
  },
];

// --- Swipeable Events (our proposed feature) ---
export const SWIPEABLE_EVENTS = [
  {
    id: "se1",
    title: "Cat Cafe Hangout",
    description: "I want to go to cat cafe!",
    emoji: "🐱",
    estimatedPrice: 50,
    date: "2026-02-12",
    host: "u3",
    attendees: ["u3", "u5", "u2"],
    imageColor: "#FF6B6B",
    category: "Private",
  },
  {
    id: "se2",
    title: "Brunch at St Barth",
    description: "Let's do bottomless mimosas!",
    emoji: "🥂",
    estimatedPrice: 75,
    date: "2026-02-14",
    host: "u2",
    attendees: ["u2", "u4"],
    imageColor: "#FFD93D",
    category: "Private",
  },
  {
    id: "se3",
    title: "Movie Night",
    description: "New horror movie just came out",
    emoji: "🎬",
    estimatedPrice: 25,
    date: "2026-02-11",
    host: "u4",
    attendees: ["u4", "u5", "u2"],
    imageColor: "#A66CFF",
    category: "Club",
  },
  {
    id: "se4",
    title: "Karaoke Night",
    description: "Time to embarrass ourselves!",
    emoji: "🎤",
    estimatedPrice: 40,
    date: "2026-02-16",
    host: "u5",
    attendees: ["u5", "u3"],
    imageColor: "#4ECDC4",
    category: "School",
  },
  {
    id: "se5",
    title: "Escape Room Challenge",
    description: "Can we beat it in 60 mins?",
    emoji: "🔐",
    estimatedPrice: 35,
    date: "2026-02-13",
    host: "u2",
    attendees: ["u2", "u5", "u3", "u4"],
    imageColor: "#6BCB77",
    category: "Club",
  },
];

// --- Helpers ---
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getEventById(id) {
  return MOCK_EVENTS.find((e) => e.id === id);
}

export function getMomentById(id) {
  for (const event of MOCK_EVENTS) {
    if (event.moments) {
      const moment = event.moments.find((m) => m.id === id);
      if (moment) {
        return {
          ...moment,
          eventName: event.title,
          authorName: getUserById(moment.author)?.name || "Unknown",
        };
      }
    }
  }
  return null;
}
