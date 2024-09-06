interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
}

export const UserAvatar: React.FC<{ user: GroupMember; size?: number }> = ({
  user,
  size = 40, // Set a default size
}) => {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          objectFit: 'cover', // Ensures the image scales properly
        }}
      />
    );
  }

  // Fallback to initials
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Ensure color calculation works with string IDs
  const color = `hsl(${((parseInt(user.userId, 10) * 100) % 360) + 30}, 70%, 50%)`;

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2, // Adjust font size based on the avatar size
      }}
    >
      {initials}
    </div>
  );
};
