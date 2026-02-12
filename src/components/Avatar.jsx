export default function Avatar({ initials, avatar, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-neutral-800 text-white flex items-center justify-center font-semibold shrink-0 overflow-hidden`}
    >
      {avatar ? (
        <img src={avatar} alt={initials} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
