import { useCallback, useEffect, useState } from 'react';

export default function useContextMenu() {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      if (!e.target.className.includes('react-flow__pane')) {
        setXPos(`${e.pageX}px`);
        setYPos(`${e.pageY}px`);
        setShowMenu(true);
      }
    },
    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu };
}
