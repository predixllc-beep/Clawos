import React from 'react';

export interface BottomNavItem {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
  currentIndex: number;
  onTap: (index: number) => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  items,
  currentIndex,
  onTap,
}) => {
  return (
    <div className="flex bg-white border-t border-gray-100 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
      {items.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <button
            key={item.label}
            onClick={() => onTap(index)}
            className="flex-1 flex flex-col items-center justify-center h-16 transition-colors select-none active:bg-gray-50 focus:outline-none"
          >
            <div className={`
              mb-1 transition-all duration-200 transform
              ${isActive ? 'text-blue-600 scale-110' : 'text-gray-400 scale-100'}
            `}>
              {isActive ? item.activeIcon : item.icon}
            </div>
            <span className={`
              text-[10px] font-medium transition-colors
              ${isActive ? 'text-blue-600' : 'text-gray-500'}
            `}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
