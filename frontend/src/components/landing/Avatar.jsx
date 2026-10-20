export function Avatar({ person, size = 22, className = '' }) {
  return (
    <img
      src={person.avatar}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full bg-[#15151E] object-contain ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size }}
      draggable="false"
    />
  )
}

export function AvatarStack({ people, size = 22, className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      {people.map((person, index) => (
        <span
          key={person.id}
          className="relative rounded-full ring-2 ring-[#0B0B10]"
          style={{ marginLeft: index === 0 ? 0 : -7, zIndex: people.length - index }}
        >
          <Avatar person={person} size={size} />
        </span>
      ))}
    </div>
  )
}
