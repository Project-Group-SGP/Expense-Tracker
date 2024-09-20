// Delete Button Version-2
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
const DeleteButton = ({ disabled, handleOnClick, selectedCount }) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "group ml-auto font-normal text-xs flex items-center justify-center space-x-2",
        "transition-all duration-300 ease-in-out",
        "hover:bg-red-100 hover:text-red-600 hover:border-red-300 hover:shadow-md",
        "active:scale-95 active:shadow-inner",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      )}
      disabled={disabled}
      onClick={handleOnClick}
    >
      <Trash
        className={cn(
          "h-4 w-4 transition-all duration-300",
          "group-hover:rotate-12 group-hover:scale-110 group-hover:text-red-500"
        )}
      />
      <span className="relative overflow-hidden w-[48px]">
        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
          Delete
        </span>
        <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0">
          Confirm
        </span>
      </span>
      <span className="ml-1 transition-opacity duration-300 group-hover:opacity-0">
        ({selectedCount})
      </span>
    </Button>
  );
};
export default DeleteButton;


// Delete Button Version-3
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Trash } from "lucide-react";
// import { cn } from "@/lib/utils";
// const DeleteButton = ({ disabled, handleOnClick, selectedCount }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Button
//       size="sm"
//       variant="outline"
//       className={cn(
//         "relative overflow-hidden font-normal text-sm",
//         "transition-all duration-300 ease-in-out",
//         "bg-white dark:bg-gray-800",
//         "border-gray-300 dark:border-gray-600",
//         "text-gray-700 dark:text-gray-300",
//         "hover:bg-red-50 dark:hover:bg-red-900/30",
//         "hover:border-red-300 dark:hover:border-red-700",
//         "hover:text-red-600 dark:hover:text-red-400",
//         "focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-50 focus:outline-none",
//         disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//       )}
//       disabled={disabled}
//       onClick={handleOnClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       aria-label={`Delete ${selectedCount} selected items`}
//     >
//       <div className="flex items-center justify-center space-x-2 px-3 py-1">
//         <Trash 
//           className={cn(
//             "w-4 h-4 transition-transform duration-300",
//             isHovered ? "rotate-12" : "rotate-0"
//           )} 
//         />
//         <span className="transition-all duration-300">
//           Delete {selectedCount > 0 && `(${selectedCount})`}
//         </span>
//       </div>
//       <div 
//         className={cn(
//           "absolute bottom-0 left-0 h-0.5 bg-red-500 dark:bg-red-400 transition-all duration-300",
//           isHovered ? "w-full" : "w-0"
//         )} 
//       />
//     </Button>
//   );
// };
// export default DeleteButton;


// Delete Button Version-4
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Trash, AlertCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// const DeleteButton = ({ disabled, handleOnClick, selectedCount }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isPressed, setIsPressed] = useState(false);

//   const handleClick = (e) => {
//     if (!disabled) {
//       setIsPressed(true);
//       handleOnClick(e);
//       setTimeout(() => setIsPressed(false), 200);
//     }
//   };

//   return (
//     <Button
//       size="sm"
//       variant="outline"
//       className={cn(
//         "relative overflow-hidden font-medium text-sm",
//         "transition-all duration-300 ease-in-out",
//         "bg-white dark:bg-gray-800",
//         "border-gray-300 dark:border-gray-600",
//         "text-gray-700 dark:text-gray-300",
//         "hover:bg-red-50 dark:hover:bg-red-900/30",
//         "hover:border-red-300 dark:hover:border-red-700",
//         "hover:text-red-600 dark:hover:text-red-400",
//         "focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-50 focus:outline-none",
//         "active:scale-95 transition-transform duration-75",
//         disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//       )}
//       disabled={disabled}
//       onClick={handleClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       aria-label={`Delete ${selectedCount} selected item${selectedCount !== 1 ? 's' : ''}`}
//     >
//       <div className="flex items-center justify-center space-x-2 px-3 py-1.5">
//         {selectedCount > 0 ? (
//           <Trash 
//             className={cn(
//               "w-4 h-4 transition-all duration-300",
//               isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
//             )}
//           />
//         ) : (
//           <AlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
//         )}
//         <span className="transition-all duration-300">
//           {selectedCount > 0 ? `Delete (${selectedCount})` : "No Selection"}
//         </span>
//       </div>
//       <div 
//         className={cn(
//           "absolute bottom-0 left-0 h-0.5 bg-red-500 dark:bg-red-400 transition-all duration-300",
//           isHovered ? "w-full" : "w-0"
//         )}
//       />
//       {isPressed && (
//         <div className="absolute inset-0 bg-red-200 dark:bg-red-800 opacity-30 transition-opacity duration-200" />
//       )}
//     </Button>
//   );
// };

// export default DeleteButton;