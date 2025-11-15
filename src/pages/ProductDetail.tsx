import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowLeft, ArrowRight, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { convertGoogleDriveUrl } from '@/lib/imageUtils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get all images (support both single image and images array)
  // Handle both array format and ensure we have valid image URLs
  const allImages = product 
    ? (() => {
        // Check if images array exists and has items
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          return product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
        }
        // Fall back to single image
        if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
          return [product.image];
        }
        return [];
      })()
    : [];

  // Reset image states when product changes
  useEffect(() => {
    if (product) {
      setImageError(false);
      setImageLoading(true);
      setSelectedImageIndex(0);
    }
  }, [product?.id]);

  useEffect(() => {
    if (!isLoading && product) {
      // Animate image
      if (imageRef.current) {
        gsap.set(imageRef.current, { opacity: 0, scale: 0.9, x: -30 });
        gsap.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Animate product info
      if (infoRef.current && infoRef.current.children.length > 0) {
        gsap.set(infoRef.current.children, { opacity: 0, y: 30 });
        gsap.to(infoRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    }
  }, [isLoading, product]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-secondary rounded mb-8" />
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-secondary rounded-lg" />
                <div className="space-y-4">
                  <div className="h-10 bg-secondary rounded w-3/4" />
                  <div className="h-6 bg-secondary rounded w-1/4" />
                  <div className="h-32 bg-secondary rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/products">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image Gallery */}
            <div ref={imageRef} className="space-y-4">
              {/* Main Image Display */}
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary shadow-card group relative">
                {allImages.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xl">No image available</span>
                  </div>
                ) : (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary z-10">
                        <span className="text-muted-foreground">Loading...</span>
                      </div>
                    )}
                    {(() => {
                      const currentImage = allImages[selectedImageIndex];
                      const imageUrl = convertGoogleDriveUrl(currentImage);
                      
                      if (!imageUrl) {
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-xl">Image not available</span>
                          </div>
                        );
                      }

                      return (
                        <>
                          {!imageError && (
                            <img
                              key={selectedImageIndex}
                              src={imageUrl}
                              alt={`${product.name} - Image ${selectedImageIndex + 1} of ${allImages.length}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                              <span className="text-muted-foreground text-xl text-center">Image not available</span>
                              <span className="text-muted-foreground text-sm text-center mt-2">Check image URL or upload to Supabase Storage</span>
                            </div>
                          )}
                          
                          {/* Navigation Arrows (only show if multiple images) */}
                          {allImages.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex((prev) => 
                                    prev === 0 ? allImages.length - 1 : prev - 1
                                  );
                                  setImageLoading(true);
                                  setImageError(false);
                                }}
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImageIndex((prev) => 
                                    prev === allImages.length - 1 ? 0 : prev + 1
                                  );
                                  setImageLoading(true);
                                  setImageError(false);
                                }}
                              >
                                <ChevronRight className="h-6 w-6" />
                              </Button>
                              
                              {/* Image Counter */}
                              <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium z-20">
                                {selectedImageIndex + 1} / {allImages.length}
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>

              {/* Thumbnail Gallery (if multiple images) */}
              {allImages.length > 1 && (
                <div className="space-y-2">
                  {/* <p className="text-sm text-muted-foreground">
                    {allImages.length} image{allImages.length > 1 ? 's' : ''} available - Click to view
                  </p> */}
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {allImages.map((img, index) => {
                        const imageUrl = convertGoogleDriveUrl(img);
                        return (
                          <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4">
                            <div
                              className={`relative aspect-square overflow-hidden rounded-md border-2 cursor-pointer transition-all ${
                                selectedImageIndex === index
                                  ? 'border-primary shadow-md scale-105 ring-2 ring-primary/20'
                                  : 'border-border hover:border-primary/50 hover:scale-102'
                              }`}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                setImageLoading(true);
                                setImageError(false);
                              }}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                                  loading="lazy"
                />
              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                  <span className="text-xs text-muted-foreground">No image</span>
                                </div>
                              )}
                              {selectedImageIndex === index && (
                                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                              )}
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    {allImages.length > 4 && (
                      <>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                      </>
                    )}
                  </Carousel>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div ref={infoRef}>
              <div className="mb-4">
                <Badge variant="secondary" className="mb-4">{product.category}</Badge>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.specifications.map((spec: any, index: number) => (
                        <div 
                          key={index} 
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors rounded-md px-2 -mx-2"
                        >
                          <dt className="font-semibold text-foreground md:col-span-1">
                            {spec.key}
                          </dt>
                          <dd className="text-muted-foreground md:col-span-2 leading-relaxed">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Link to="/contact">
                <Button size="lg" className="w-full md:w-auto">
                  <Mail className="mr-2 h-5 w-5" />
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
