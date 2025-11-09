import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { emailjsConfig, isEmailjsConfigured } from '@/lib/emailjs.config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if EmailJS is configured
      if (!isEmailjsConfigured()) {
        throw new Error('EmailJS is not configured. Please set up your Template ID and Public Key.');
      }

      // Prepare template parameters for EmailJS
      // Sending all variable variations to match your template HTML which uses multiple variable names
      const templateParams: Record<string, string> = {
        // Name - your template uses: {{user_name}}{{from_name}}{{name}} (will use first one that works)
        user_name: formData.name.trim(),
        from_name: formData.name.trim(),
        name: formData.name.trim(),
        // Email - your template uses: {{user_email}}{{from_email}}{{email}}
        user_email: formData.email.trim(),
        from_email: formData.email.trim(),
        email: formData.email.trim(),
        // Phone - your template uses: {{phone}}{{phone_number}}
        phone: (formData.phone || 'Not provided').trim(),
        phone_number: (formData.phone || 'Not provided').trim(),
        // Company - your template uses: {{company}}{{company_name}}
        company: (formData.company || 'Not provided').trim(),
        company_name: (formData.company || 'Not provided').trim(),
        // Message - your template uses: {{message}}{{user_message}}
        message: formData.message.trim(),
        user_message: formData.message.trim(),
        // Recipient email (must be set in EmailJS template settings as "To Email")
        to_email: 'flowravalves@gmail.com',
        // Reply-to email
        reply_to: formData.email.trim(),
        // Website URL for links
        website_url: window.location.origin,
      };

      // Send email using EmailJS
      // Note: The "To Email" must be set in EmailJS template settings to: flowravalves@gmail.com
      // Format: emailjs.send(serviceId, templateId, templateParams, publicKey)
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      console.log('EmailJS Success:', response);

      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (error: any) {
      console.error('EmailJS Error Details:', {
        error,
        status: error?.status,
        text: error?.text,
        message: error?.message,
        serviceId: emailjsConfig.serviceId,
        templateId: emailjsConfig.templateId,
      });

      // Provide more helpful error messages
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error?.status === 422) {
        if (error?.text?.includes('recipients address is empty')) {
          errorMessage = 'EmailJS Error: The "To Email" field is empty in your template settings. Please go to EmailJS Dashboard > Email Templates > Edit template_xs15xpo > Set "To Email" to: flowravalves@gmail.com';
        } else {
          errorMessage = `EmailJS Error: ${error.text || 'Template configuration error. Please check your EmailJS template settings.'}`;
        }
      } else if (error?.status === 400) {
        errorMessage = 'Invalid request. Please check your EmailJS configuration.';
      } else if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please check your Public Key.';
      } else if (error?.text) {
        errorMessage = `EmailJS Error: ${error.text}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error Sending Message',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

    // Animate form and info cards
    if (formRef.current && infoRef.current) {
      gsap.fromTo(
        [formRef.current, infoRef.current],
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our team for inquiries, quotes, or support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card ref={formRef}>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your needs..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:+919372300603" className="text-muted-foreground hover:text-primary transition-colors">
                        7208994885
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:flowravalves@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                        flowravalves@gmail.com 
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">India</p>
                      <p className="text-muted-foreground text-sm">Serving industrial clients globally</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-hero text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
                  <p className="opacity-90 mb-4">
                    Contact us for inquiries, quotes, or technical support. We're here to help with all your valve and fittings needs.
                  </p>
                  <a href="tel:+919372300603">
                    <Button variant="secondary" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Us Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
