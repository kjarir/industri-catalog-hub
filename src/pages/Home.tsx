import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Home = () => {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];
  const featuresRef = useRef<HTMLElement>(null);
  const productsSectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollTriggers: ScrollTrigger[] = [];

    // Animate features section
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-item');
      if (features.length > 0) {
        gsap.set(features, { opacity: 0, y: 60, scale: 0.9 });
        const trigger = ScrollTrigger.create({
          trigger: featuresRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(features, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power3.out',
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    }

    // Animate products section header
    if (productsSectionRef.current) {
      const header = productsSectionRef.current.querySelector('.section-header');
      if (header) {
        gsap.set(header, { opacity: 0, y: 40 });
        const trigger = ScrollTrigger.create({
          trigger: productsSectionRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(header, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    }

    // Animate CTA section
    if (ctaRef.current) {
      const ctaContent = ctaRef.current.querySelector('.cta-content');
      if (ctaContent) {
        gsap.set(ctaContent, { opacity: 0, y: 40, scale: 0.95 });
        const trigger = ScrollTrigger.create({
          trigger: ctaRef.current,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(ctaContent, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            });
          },
        });
        scrollTriggers.push(trigger);
      }
    }

    return () => {
      scrollTriggers.forEach(trigger => trigger?.kill());
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-item text-center p-6 rounded-lg hover:bg-background/50 transition-colors">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-muted-foreground">
                  All valves meet strict ISO certifications and industry standards
                </p>
              </div>
              <div className="feature-item text-center p-6 rounded-lg hover:bg-background/50 transition-colors">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick turnaround times for all orders, nationwide shipping
                </p>
              </div>
              <div className="feature-item text-center p-6 rounded-lg hover:bg-background/50 transition-colors">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Technical assistance from experienced valve specialists
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section ref={productsSectionRef} className="py-20">
          <div className="container mx-auto px-4">
            <div className="section-header text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore our selection of high-quality industrial components
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-secondary animate-pulse rounded-lg" />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
                <div className="text-center">
                  <Link to="/products">
                    <Button size="lg">
                      View All Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          </div>
          <div className="cta-content container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today to discuss your valve and flow control needs
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
