import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Globe, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">About FlowraValves</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 animate-slide-up">
              Leading supplier of premium industrial valves with over two decades of excellence
            </p>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2000, FlowraValves has grown from a small local supplier to a 
                  trusted nationwide provider of industrial valves and flow control solutions. Our commitment 
                  to quality, reliability, and customer service has made us a preferred partner for 
                  businesses across various industries including oil & gas, chemical processing, and manufacturing.
                </p>
                <p>
                  We specialize in providing precision-engineered gate valves, ball valves, butterfly valves, 
                  and check valves that meet the demanding requirements of critical industrial applications. 
                  Our products are sourced from leading manufacturers and undergo rigorous quality control 
                  to ensure they meet or exceed ISO and industry standards.
                </p>
                <p>
                  With a team of experienced valve specialists and a comprehensive inventory, we're equipped 
                  to handle projects of any size. Whether you need a single valve or bulk supplies 
                  for a large-scale project, we deliver the products and technical support you need to succeed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">20+</div>
                  <p className="text-muted-foreground">Years in Business</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">5000+</div>
                  <p className="text-muted-foreground">Satisfied Clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <p className="text-muted-foreground">States Served</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">10k+</div>
                  <p className="text-muted-foreground">Products Available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every product meets rigorous standards.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Your success is our priority. We're here to support you every step of the way.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously adapt to industry changes and emerging technologies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
