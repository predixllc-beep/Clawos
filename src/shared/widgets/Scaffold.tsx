import React from 'react';

/**
 * Flutter-style Scaffold component
 * Provides basic app layout structure with AppBar, Body, and BottomNavigationBar
 */
interface ScaffoldProps {
  appBar?: React.ReactNode;
  body: React.ReactNode;
  bottomNavigationBar?: React.ReactNode;
  floatingActionButton?: React.ReactNode;
  backgroundColor?: string;
}

export const Scaffold: React.FC<ScaffoldProps> = ({
  appBar,
  body,
  bottomNavigationBar,
  floatingActionButton,
  backgroundColor = 'bg-gray-50',
}) => {
  return (
    <div className={`flex flex-col h-[100dvh] w-full overflow-hidden ${backgroundColor}`}>
      {appBar && <header className="shrink-0 z-10">{appBar}</header>}
      
      <main className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full">
        {body}
      </main>

      {floatingActionButton && (
        <div className="absolute right-4 bottom-20 z-20">
          {floatingActionButton}
        </div>
      )}

      {bottomNavigationBar && (
        <footer className="shrink-0 z-10 pb-env-bottom">
          {bottomNavigationBar}
        </footer>
      )}
    </div>
  );
};
