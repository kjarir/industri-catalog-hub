import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollAnimationOptions {
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const {
    animation = 'fadeIn',
    delay = 0,
    duration = 1,
    stagger = 0,
    once = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state based on animation type
    const initialStates: Record<string, gsap.TweenVars> = {
      fadeIn: { opacity: 0 },
      slideUp: { opacity: 0, y: 60 },
      slideLeft: { opacity: 0, x: -60 },
      slideRight: { opacity: 0, x: 60 },
      scale: { opacity: 0, scale: 0.8 },
      rotate: { opacity: 0, rotation: -10 },
    };

    const finalStates: Record<string, gsap.TweenVars> = {
      fadeIn: { opacity: 1 },
      slideUp: { opacity: 1, y: 0 },
      slideLeft: { opacity: 1, x: 0 },
      slideRight: { opacity: 1, x: 0 },
      scale: { opacity: 1, scale: 1 },
      rotate: { opacity: 1, rotation: 0 },
    };

    // Set initial state
    gsap.set(element, initialStates[animation]);

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });

    tl.to(element, {
      ...finalStates[animation],
      duration,
      delay,
      ease: 'power3.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, delay, duration, stagger, once]);

  return ref;
};

// Hook for animating multiple elements with stagger
export const useStaggerAnimation = (
  selector: string,
  options: UseScrollAnimationOptions = {}
) => {
  const {
    animation = 'fadeIn',
    delay = 0,
    duration = 0.6,
    stagger = 0.2,
    once = true,
  } = options;

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const initialStates: Record<string, gsap.TweenVars> = {
      fadeIn: { opacity: 0 },
      slideUp: { opacity: 0, y: 60 },
      slideLeft: { opacity: 0, x: -60 },
      slideRight: { opacity: 0, x: 60 },
      scale: { opacity: 0, scale: 0.8 },
      rotate: { opacity: 0, rotation: -10 },
    };

    const finalStates: Record<string, gsap.TweenScrollTriggerVars> = {
      fadeIn: { opacity: 1 },
      slideUp: { opacity: 1, y: 0 },
      slideLeft: { opacity: 1, x: 0 },
      slideRight: { opacity: 1, x: 0 },
      scale: { opacity: 1, scale: 1 },
      rotate: { opacity: 1, rotation: 0 },
    };

    gsap.set(elements, initialStates[animation]);

    gsap.to(elements, {
      ...finalStates[animation],
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === elements[0]) {
          trigger.kill();
        }
      });
    };
  }, [selector, animation, delay, duration, stagger, once]);
};

