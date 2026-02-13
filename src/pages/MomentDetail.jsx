import { useParams, useNavigate } from "react-router-dom";
import { getMomentById, getUserById } from "../data/mock";
import Avatar from "../components/Avatar";

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

  const author = getUserById(moment.author);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center pb-20"
      onClick={() => navigate(-1)}
    >
      {/* Close button */}
      <button
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl z-10"
        onClick={() => navigate(-1)}
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={moment.image}
        alt={`Moment by ${moment.authorName}`}
        className="max-w-[85%] max-h-[75vh] rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Bottom info overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-20 pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-2">
          {author && (
            <Avatar initials={author.initials} avatar={author.avatar} size="md" />
          )}
          <div>
            <p className="text-white font-semibold text-sm">{moment.authorName}</p>
            <p className="text-white/60 text-xs">{moment.eventName}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-xs">{moment.timestamp}</p>
          <p className="text-white font-bold text-sm">${moment.amount}</p>
        </div>
      </div>
    </div>
  );
}
