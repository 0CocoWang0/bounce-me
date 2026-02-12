import { useParams, useNavigate } from "react-router-dom";
import { getMomentById } from "../data/mock";

export default function MomentDetail() {
  const { momentId } = useParams();
  const navigate = useNavigate();
  
  const moment = getMomentById(momentId);

  if (!moment) {
    return (
      <div className="px-5 pt-14">
        <p className="text-gray-400">Moment not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-bounce-dark flex flex-col">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-5 pt-4 pb-2 text-gray-400 dark:text-gray-300"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <div className="px-5 pb-3">
        <h1 className="text-2xl font-bold dark:text-white">Moments</h1>
      </div>

      {/* Image - smaller to fit everything */}
      <div className="px-5 mb-3 flex-shrink-0">
        <img 
          src={moment.image} 
          alt={`Moment by ${moment.authorName}`}
          className="w-full aspect-[4/5] object-cover rounded-3xl"
        />
      </div>

      {/* Details */}
      <div className="px-5 pb-6">
        <h2 className="text-xl font-bold mb-1 dark:text-white">
          {moment.authorName} in {moment.eventName}
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">{moment.timestamp}</p>
        <p className="text-lg font-semibold dark:text-white">${moment.amount}</p>
      </div>
    </div>
  );
}