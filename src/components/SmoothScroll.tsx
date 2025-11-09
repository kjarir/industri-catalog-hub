import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Store lenis instance globally for ScrollToTop component
    (window as any).lenis = lenis;

    // Prevent Lenis from intercepting scroll events in containers marked with data-lenis-prevent
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // Check if the scroll event is inside a container that should prevent Lenis
      const preventContainer = target.closest('[data-lenis-prevent]');
      if (preventContainer) {
        // Let the container handle its own scroll
        e.stopPropagation();
        return;
      }
      
      // Also check for scrollable containers with overflow
      const scrollableContainer = target.closest('[class*="overflow-y-auto"], [class*="overflow-auto"]');
      if (scrollableContainer && scrollableContainer !== document.body && scrollableContainer !== document.documentElement) {
        const container = scrollableContainer as HTMLElement;
        const canScroll = container.scrollHeight > container.clientHeight;
        if (canScroll) {
          // Check if we're at the boundaries
          const { scrollTop, scrollHeight, clientHeight } = container;
          const isAtTop = scrollTop <= 1;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          const scrollingDown = e.deltaY > 0;
          const scrollingUp = e.deltaY < 0;
          
          // If we're at boundaries and trying to scroll further, let Lenis handle it
          if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
            // Allow Lenis to handle boundary scrolling
            return;
          }
          
          // Otherwise, prevent Lenis from intercepting - let the container scroll
          e.stopPropagation();
          return;
        }
      }
    };

    // Animation frame function
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Add wheel event listener before Lenis processes it
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    requestAnimationFrame(raf);

    // Scroll to top on route change
    lenis.scrollTo(0, { immediate: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [location.pathname]);

  return <>{children}</>;
};

