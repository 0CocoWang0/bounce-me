import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { AcceptedEventsProvider, useAcceptedEvents } from "./context/AcceptedEventsContext";
import Home from "./pages/Home";
import Activity from "./pages/Activity";
import Groups from "./pages/Groups";
import Accounts from "./pages/Accounts";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import Split from "./pages/Split";
import Events from "./pages/Events";
import MomentDetail from "./pages/MomentDetail";
import Request from "./pages/Request";
import Send from "./pages/Send";
import EventGroupPreview from "./pages/EventGroupPreview";
import AddExpense from "./pages/AddExpense";
import Reminder from "./pages/Reminder";

function NavIcon({ d, label, icon, badge }) {
  return (
    <div className="flex flex-col items-center gap-0.5 relative">
      {icon || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d={d} />
        </svg>
      )}
      <span className="text-[10px]">{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}

const tabs = [
  {
    to: "/",
    //label: "Home",
    icon: (
      <svg viewBox="0 0 55 55" fill="currentColor" className="w-6 h-6">
        <path d="M52.0575 16.622L30.5724 3.27652C28.555 2.02077 26.1169 1.97152 24.0377 3.12879C21.9585 4.28605 20.7456 6.39129 20.7704 8.75507L20.8199 12.8178L24.0253 10.8357L24.0006 8.71813C23.9882 7.54856 24.5946 6.50209 25.6219 5.92346C26.1169 5.65261 26.6491 5.51719 27.1813 5.51719C27.763 5.51719 28.3446 5.67723 28.8645 6.00964L50.3496 19.3551C51.3026 19.9461 51.8471 20.931 51.8471 22.0513C51.8471 23.1716 51.2902 24.1442 50.3372 24.7352L29.1367 37.7729C28.1466 38.3884 26.9461 38.4131 25.9313 37.8591C24.9164 37.305 24.2976 36.2832 24.2852 35.1259L24.0996 18.2964L20.8942 20.2662L21.055 35.1506C21.0798 37.4774 22.3174 39.5457 24.3719 40.666C25.3496 41.1954 26.414 41.4663 27.4659 41.4663C28.6293 41.4663 29.7927 41.1462 30.8323 40.4937L52.0328 27.4314C53.9263 26.2618 55.0649 24.2427 55.0649 22.0267C55.0649 19.8106 53.9511 17.7916 52.0575 16.622Z" />
        <path d="M30.8818 42.2665L30.857 44.0639C30.8447 45.2212 30.2258 46.243 29.211 46.797C28.1961 47.3511 26.9956 47.3264 26.0055 46.7109L4.80504 33.6609C3.85207 33.0699 3.29514 32.0973 3.29514 30.977C3.29514 29.8567 3.83969 28.8841 4.79267 28.2808L26.2778 14.9353C27.2803 14.3197 28.4932 14.2828 29.5204 14.8614C30.5476 15.4401 31.1541 16.4865 31.1417 17.6561L30.956 34.7073L34.211 32.7006L34.3719 17.6931C34.3966 15.3293 33.1714 13.224 31.1046 12.0668C29.0253 10.9095 26.5872 10.9588 24.5699 12.2145L3.08474 25.56C1.19118 26.7419 0.0649414 28.7609 0.0649414 30.977C0.0649414 33.193 1.20356 35.2244 3.09712 36.3817L24.2976 49.444C25.3372 50.0842 26.5006 50.4166 27.664 50.4166C28.7159 50.4166 29.7803 50.1457 30.758 49.6163C32.8125 48.496 34.0501 46.4277 34.0748 44.1009L34.112 40.2597L30.8818 42.2665Z" />
      </svg>
    ),
    end: true,
  },
  {
    to: "/events",
    //label: "Events",
    d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
  },
  {
    to: "/groups",
    ///label: "Groups",
    d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    showBadge: true, // Flag to show accepted count
  },
  {
    to: "/activity",
    //label: "Transactions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },

  {
    to: "/accounts",
    //label: "Accounts",
    d: "M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z",
  },
  {
    to: "/profile",
    //label: "Profile",
    d: "M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-2.54-.636A6.735 6.735 0 0012 17.25a6.735 6.735 0 00-4.145 1.211A8.25 8.25 0 0112 3.75a8.25 8.25 0 014.145 14.711zM12 13.5a3 3 0 100-6 3 3 0 000 6z",
  },
];


function Nav() {
  const { acceptedCount } = useAcceptedEvents();

  return (
    <nav className="z-100 fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-transparent">
      <div className="max-w-md mx-auto flex justify-around py-5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `${isActive ? "text-black dark:text-bounce" : "text-gray-400 dark:text-[#4c4647]"}`
            }
          >
            <NavIcon 
              d={tab.d} 
              label={tab.label} 
              icon={tab.icon} 
              badge={tab.showBadge ? acceptedCount : 0}
            />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      {/* Desktop: dark bg + centered iPhone mockup. Mobile: no frame */}
      <div className="min-h-screen md:bg-neutral-900 md:flex md:items-center md:justify-center">
        <div className="relative w-full md:w-[393px] md:h-[852px] md:rounded-[55px] md:border-[14px] md:border-black md:shadow-[0_0_0_2px_#525252,0_50px_100px_-20px_rgba(0,0,0,0.5)] md:overflow-hidden md:[transform:translateZ(0)]">
          {/* Dynamic Island */}
          <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50" />

          {/* Scrollable app shell */}
          <div className="phone-scroll min-h-screen md:min-h-0 md:h-full md:overflow-y-auto bg-white dark:bg-gradient-to-t dark:from-bounce-dark dark:to-[#4C4647]">
            <div className="max-w-md mx-auto pb-20 md:max-w-none md:h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/split/:eventId" element={<Split />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event-preview/:eventId" element={<EventGroupPreview />} />
                <Route path="/add-expense/:eventId" element={<AddExpense />} />
                <Route path="/reminder/:eventId" element={<Reminder />} />
                <Route path="/moment/:momentId" element={<MomentDetail />} />
                <Route path="/request" element={<Request />} />
                <Route path="/send" element={<Send />} />
              </Routes>
            </div>
            <Nav />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AcceptedEventsProvider>
      <AppContent />
    </AcceptedEventsProvider>
  );
}