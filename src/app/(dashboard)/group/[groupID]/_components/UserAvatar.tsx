import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface GroupMember {
  userId: string
  name: string
  avatar: string
}

export const UserAvatar: React.FC<{ user: GroupMember; size?: number }> = ({
  user,
  size = 45, // Set a default size
}) => {
  // Hash function to generate a numeric value from a string
  const hashStringToNumber = (str: string) => {
    if (!str) return 0
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash &= hash // Convert to 32-bit integer
    }
    return Math.abs(hash) // Ensure the hash is a positive number
  }

  // Use the hash function to compute the color
  const color = `hsl(${((hashStringToNumber(user.userId) * 100) % 360) + 30}, 70%, 50%)`

  // Fallback to initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar
      style={{
        width: size,
        height: size,
      }}
    >
      <AvatarImage
        src={user.avatar}
        alt={user.name}
        style={{
          objectFit: "cover",
        }}
      />
      <AvatarFallback
        style={{
          backgroundColor: color,
          color: "#fff",
          fontSize: `${size / 2.3}px`,
          lineHeight: `${size}px`,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
