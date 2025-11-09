import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';

const Home = () => {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in hover-lift p-6 rounded-lg">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-muted-foreground">
                  All valves meet strict ISO certifications and industry standards
                </p>
              </div>
              <div className="text-center animate-fade-in hover-lift p-6 rounded-lg" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card">
                  <Clock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick turnaround times for all orders, nationwide shipping
                </p>
              </div>
              <div className="text-center animate-fade-in hover-lift p-6 rounded-lg" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-card">
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
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
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
        <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 animate-slide-up">
              Contact us today to discuss your valve and flow control needs
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="hover-scale">
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
