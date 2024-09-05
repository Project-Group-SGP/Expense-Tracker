interface User {
  id: number;
  name: string;
  avatar: string;
}

export const UserAvatar: React.FC<{ user: User; size?: number }> = ({
  user,
  size = 40, // Set a default size
}) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="rounded-full"
        style={{ width: size, height: size, objectFit: 'cover' }} // Added objectFit for image scaling
      />
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const color = `hsl(${((user.id * 100) % 360) + 30}, 70%, 50%)`;

  return (
    <div
      className="flex items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {initials}
    </div>
  );
};
