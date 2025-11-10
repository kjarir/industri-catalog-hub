import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { convertGoogleDriveUrl } from '@/lib/imageUtils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
}

export const ProductCard = ({ id, name, category, description, image }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial state
    gsap.set(card, { opacity: 0, y: 50, scale: 0.95 });

    // Animate in on scroll
    const scrollTrigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => {
        if (card) {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
          });
        }
      },
    });

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) {
          gsap.to(img, {
            scale: 1.15,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) {
          gsap.to(img, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      scrollTrigger?.kill();
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const imageUrl = convertGoogleDriveUrl(image);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset states when image URL changes
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setImageLoading(true);
    } else {
      setImageLoading(false);
    }
  }, [imageUrl]);

  return (
    <Card ref={cardRef} className="group overflow-hidden">
      <div ref={imageRef} className="aspect-square overflow-hidden bg-secondary relative">
        {imageUrl ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary z-10">
                <span className="text-muted-foreground text-sm">Loading...</span>
              </div>
            )}
            {!imageError && (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
                onLoad={() => {
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                style={{ display: imageError ? 'none' : 'block' }}
              />
            )}
            {imageError && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <span className="text-muted-foreground text-sm text-center">Image not available</span>
                <span className="text-muted-foreground text-xs text-center mt-2">Check image URL or upload to Supabase Storage</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={`/products/${id}`}>
          <Button variant="outline" className="w-full group/btn">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
