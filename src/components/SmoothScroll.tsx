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

    // Animation frame function
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top on route change
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [location.pathname]);

  return <>{children}</>;
};

