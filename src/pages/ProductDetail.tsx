import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && product) {
      // Animate image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.9, x: -30 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
          }
        );
      }

      // Animate product info
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2,
          }
        );
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
            {/* Product Image */}
            <div ref={imageRef} className="aspect-square overflow-hidden rounded-lg bg-secondary shadow-card group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground text-xl">No image available</span>
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
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3">
                      {product.specifications.map((spec: any, index: number) => (
                        <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                          <dt className="font-medium">{spec.key}</dt>
                          <dd className="text-muted-foreground">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
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
