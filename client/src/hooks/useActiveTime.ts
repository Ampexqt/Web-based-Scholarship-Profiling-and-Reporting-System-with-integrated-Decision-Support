import { useState, useEffect, useRef } from 'react';

export function useActiveTime(targetAppId: string) {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const isActive = useRef(true);
  const idleTimeout = useRef<any>(null);
  const interval = useRef<any>(null);

  const IDLE_THRESHOLD = 30000; // 30 seconds of no interaction = idle

  const setIdle = () => {
    isActive.current = false;
  };

  const resetIdle = () => {
    isActive.current = true;
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
    idleTimeout.current = setTimeout(setIdle, IDLE_THRESHOLD);
  };

  useEffect(() => {
    // Start tracking active time
    interval.current = setInterval(() => {
      if (isActive.current) {
        setActiveSeconds((prev) => prev + 1);
      }
    }, 1000);

    // Initial setup
    resetIdle();

    // Event listeners to detect activity
    const events = ['mousemove', 'mousedown', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove', 'MSPointerMove'];
    events.forEach((event) => window.addEventListener(event, resetIdle));

    return () => {
      // Cleanup on unmount
      if (interval.current) clearInterval(interval.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      events.forEach((event) => window.removeEventListener(event, resetIdle));
    };
  }, [targetAppId]);

  return activeSeconds;
}
