import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '@/assets/hero-industrial.jpg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background image with parallax effect
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 1.2, opacity: 0 });
        gsap.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
        });

        // Parallax effect on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.set(imageRef.current, {
                yPercent: 30 * self.progress,
              });
            }
          },
        });
      }

      // Animate title
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 50 });
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      // Animate description text
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 0, y: 30 });
        gsap.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out',
        });
      }

      // Animate buttons with stagger
      if (buttonsRef.current && buttonsRef.current.children.length > 0) {
        gsap.set(buttonsRef.current.children, { opacity: 0, y: 20, scale: 0.9 });
        gsap.to(buttonsRef.current.children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.9,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Industrial equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Premium Industrial Valves
            <span className="block text-primary">& Flow Control Solutions</span>
          </h1>
          <p ref={textRef} className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Welcome to Flowra Valves, a trusted name in high-quality fittings and valves for industrial, commercial, and engineering applications. With a commitment to precision, durability, and performance, we provide a comprehensive range of products designed to meet the demanding needs of modern industries.
          </p>
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto group">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
