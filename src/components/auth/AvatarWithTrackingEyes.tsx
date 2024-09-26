import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const AvatarWithTrackingEyes = ({ password }: { password: string }) => {
  const avatarRef = useRef<HTMLDivElement>(null); // Ref for the avatar div
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false); // Track if mouse is inside the avatar

  // Handle mouse movement relative to the avatar container
  const handleMouseMove = (event: MouseEvent) => {
    const avatar = avatarRef.current;
    if (avatar) {
      const rect = avatar.getBoundingClientRect(); // Get avatar position and size
      const isInside = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );

      if (isInside) {
        setMousePosition({
          x: event.clientX - rect.left, // X position relative to avatar
          y: event.clientY - rect.top,  // Y position relative to avatar
        });
        setIsMouseInside(true); // Set mouse inside the avatar
      } else {
        setIsMouseInside(false); // Mouse is outside the avatar
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Blink when avatar is clicked
  const handleAvatarClick = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 300); // Blink for 0.3s
  };

  // Calculate eye movement based on cursor position within the avatar
  const eyeStyle = (eyeX: number, eyeY: number) => {
    const deltaX = mousePosition.x - eyeX;
    const deltaY = mousePosition.y - eyeY;
    const angle = Math.atan2(deltaY, deltaX);
    const radius = 5; // Eye movement radius
    return {
      transform: isMouseInside
        ? `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`
        : `translate(0px, 0px)`, // Eyes return to default position if mouse is outside
    };
  };

  return (
    <div
      id="avatar" 
      ref={avatarRef}
      className="relative w-32 h-32 cursor-pointer"
      onClick={handleAvatarClick}
    >
      {/* Avatar Image */}
      <Image src="/SpendWIse-5.png" alt="Avatar" width={100} height={100} className="rounded-full" />
      
      {/* Eyes */}
      <div className="absolute flex justify-between w-[40%] h-[20%] top-[40%] left-[30%]">
        {/* Left Eye */}
        <div className={`eye bg-black rounded-full w-4 h-4`} style={eyeStyle(20, 20)} />
        {/* Right Eye */}
        <div className={`eye bg-black rounded-full w-4 h-4`} style={eyeStyle(80, 20)} />
      </div>

      {/* Curtain */}
      <div className={`curtain absolute top-0 left-0 w-full h-full bg-gray-500 opacity-70 transition-all duration-500 ${password.length > 0 ? 'translate-y-0' : '-translate-y-full'}`} />
    </div>
  );
};

export default AvatarWithTrackingEyes;
