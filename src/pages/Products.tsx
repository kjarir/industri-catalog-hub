import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { AdminPanel } from '@/components/AdminPanel';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { data: products, isLoading } = useProducts(selectedCategory);
  const { data: categories } = useCategories();
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac) to open admin panel
      // Check for both 'A' and 'a' to handle different keyboard layouts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
        e.preventDefault();
        setIsAdminPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }

    // Animate filter section
    if (filterRef.current) {
      gsap.fromTo(
        filterRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: filterRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
            <div ref={headerRef} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-muted-foreground">
              Browse our complete catalog of industrial components and equipment
            </p>
          </div>

          {/* Filter Section */}
            <div ref={filterRef} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                onClick={() => setSelectedCategory(undefined)}
                  className="hover:scale-105 transition-transform"
              >
                All Products
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                    className="hover:scale-105 transition-transform"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-secondary animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </>
  );
};

export default Products;
