import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, CheckCircle2, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">About Flowra Valves</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 animate-slide-up">
              Delivering reliable, high-performance solutions for fluid control and piping systems
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Introduction */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    At Flowra Valves, we are dedicated to delivering reliable, high-performance solutions for fluid control and piping systems. With a strong focus on quality, precision, and durability, we specialize in the manufacturing and supply of industrial valves and fittings that meet global standards.
                  </p>
                  <p>
                    We believe that every connection matters — which is why our products are engineered with accuracy, tested for performance, and built to last. Whether for oil & gas, chemical, petrochemical, power, or general industrial applications, Flowra Valves stands for trust, consistency, and excellence.
                  </p>
                </div>
              </div>

              {/* Product Range */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Product Range</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                  Our comprehensive product range includes:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Ball Valves',
                    'Needle Valves',
                    'Check Valves',
                    'Pipe Fittings',
                    'Double Ferrule Fittings',
                    'JIC Fittings',
                    'Autoclave Fittings'
                  ].map((product) => (
                    <div key={product} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{product}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg mt-6">
                  All our products are designed to perform under the most demanding industrial conditions, ensuring reliability and safety in critical applications.
                </p>
              </div>

              {/* Mission */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Our mission is simple:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">
                      To provide superior products that ensure leak-proof performance and long service life.
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">
                      To build lasting relationships through commitment, transparency, and customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Commitment */}
              <div className="p-8 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-lg text-foreground leading-relaxed text-center">
                  With our expertise and dedication, Flowra Valves continues to set benchmarks in the valve and fittings industry — <span className="font-semibold text-primary">where quality flows, and reliability connects.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                  <p className="text-muted-foreground">
                    Every product is engineered with precision and tested for performance to meet global standards.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Customer Commitment</h3>
                  <p className="text-muted-foreground">
                    We build lasting relationships through transparency, commitment, and exceptional service.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Reliability</h3>
                  <p className="text-muted-foreground">
                    Products built to last, ensuring leak-proof performance and long service life in demanding conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
