interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
}

export const UserAvatar: React.FC<{ user: GroupMember; size?: number }> = ({
  user,
  size = 45, // Set a default size
}) => {
  if (user.avatar!=="") {
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
  
    

// Hash function to generate a numeric value from a string
const hashStringToNumber = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32-bit integer
  }
  return Math.abs(hash); // Ensure the hash is a positive number
};

// Use the hash function to compute the color
const color = `hsl(${((hashStringToNumber(user.userId) * 100) % 360) + 30}, 70%, 50%)`;



  return (
    <div
      className="flex items-center justify-center rounded-full text-white"
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
      {initials.slice(0,2)}
    </div>
  );
};
