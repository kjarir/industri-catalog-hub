import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src="/flowravalves.png" 
                alt="Flowra Valves Logo" 
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Delivering reliable, high-performance solutions for fluid control and piping systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Fittings</li>
              <li className="text-muted-foreground">Valves</li>
              <li className="text-muted-foreground">Connectors</li>
              <li className="text-muted-foreground">Pipes</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+919372300603" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  7208994885
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:flowravalves@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  flowravalves@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} FlowraValves. All rights reserved | Designed & Developed by <a href="https://www.linkedin.com/in/mohdjarirnoorkhan/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mohd Jarir</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
