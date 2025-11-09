import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
}

export const ProductCard = ({ id, name, category, description, image }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 overflow-hidden">
      <div className="aspect-square overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
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
