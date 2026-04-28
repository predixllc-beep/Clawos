import React from 'react';

interface AppBarProps {
  title: string | React.ReactNode;
  leading?: React.ReactNode;
  actions?: React.ReactNode[];
  elevation?: boolean;
}

export const AppBar: React.FC<AppBarProps> = ({ 
  title, 
  leading, 
  actions, 
  elevation = true 
}) => {
  return (
    <div className={`
      flex items-center h-14 px-4 bg-white pt-env-top
      ${elevation ? 'shadow-sm border-b border-gray-100' : ''}
    `}>
      {leading && <div className="mr-4">{leading}</div>}
      
      <div className="flex-1 font-semibold text-lg truncate">
        {title}
      </div>
      
      {actions && (
        <div className="flex items-center gap-1 ml-4 justify-end">
          {actions.map((action, i) => (
            <div key={i} className="flex items-center justify-center min-w-[40px] min-h-[40px]">
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
