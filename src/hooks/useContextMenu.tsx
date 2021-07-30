import { useCallback, useEffect, useState } from 'react';

export default function useContextMenu() {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      // This is a hack to fix the context menu.
      // Ideally, I should find the offset from the right edge of
      // the device selection column to the event target
      const offsetLeft =
        e.target.offsetParent.offsetParent.offsetParent.offsetParent
          .offsetParent.offsetParent.offsetLeft;
      const offsetTop = 20;

      const boundingClientRect = e.target.getBoundingClientRect();

      if (!e.target.className.includes('react-flow__pane')) {
        setXPos(`${boundingClientRect.x - offsetLeft}px`);
        setYPos(`${boundingClientRect.y + offsetTop}px`);
        // setXPos(`${e.pageX}px`);
        // setYPos(`${e.pageY}px`);
        setShowMenu(true);
      }
    },
    [setXPos, setYPos]
  );

  // console.log({ xPos }, { yPos });

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
