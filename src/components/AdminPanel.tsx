import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, Category } from '@/hooks/useCategories';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { X, Plus, Edit, Trash2, LogOut, FolderTree, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { convertGoogleDriveUrl } from '@/lib/imageUtils';
import { uploadProductImage, deleteProductImage, checkBucketExists } from '@/lib/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { user, signIn, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    specifications: [{ key: '', value: '' }],
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if bucket exists when admin panel opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      checkBucketExists()
        .then((exists) => {
          setBucketExists(exists);
          if (exists) {
            console.log('✅ Storage bucket is available');
          } else {
            console.warn('⚠️ Storage bucket not found or not accessible');
          }
        })
        .catch((error) => {
          console.error('Error checking bucket:', error);
          setBucketExists(null); // Set to null to show unknown state
        });
    }
  }, [isOpen, isAuthenticated]);

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    parent_id: 'none', // Use 'none' instead of '' to avoid Select empty string error
  });

  // Organize categories into parent and children
  const organizedCategories = useMemo(() => {
    if (!categories) return { parents: [], children: [] };
    
    const parents = categories.filter(cat => !cat.parent_id);
    const children = categories.filter(cat => cat.parent_id);
    
    return { parents, children };
  }, [categories]);


  useEffect(() => {
    if (user) {
      checkAdminRole();
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  // Disable Lenis smooth scroll when admin panel is open
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.stop();
      }
      return () => {
        if (lenis) {
          lenis.start();
        }
      };
    }
  }, [isOpen, isAuthenticated]);

  const checkAdminRole = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (data) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        variant: 'destructive',
      });
      await signOut();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image: '',
      specifications: [{ key: '', value: '' }],
    });
    setEditingProduct(null);
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image || '',
        specifications: product.specifications || [{ key: '', value: '' }],
      });
    } else {
      resetForm();
    }
    setIsProductDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file (JPG, PNG, GIF, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB. Please compress the image and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      // Try to upload directly - the upload function will handle bucket checking
      const imageUrl = await uploadProductImage(file, editingProduct?.id);
      setFormData({ ...formData, image: imageUrl });
      setBucketExists(true); // Update state after successful upload
      toast({
        title: 'Image Uploaded',
        description: 'Image uploaded successfully to Supabase Storage',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload image. Please try again.';
      
      // Check if it's a bucket not found error
      if (errorMessage.includes('Bucket not found') || errorMessage.includes('not found')) {
        setBucketExists(false);
        toast({
          title: 'Storage Bucket Not Found',
          description: 'Please create the "product-images" bucket in Supabase Dashboard. Click the warning above for instructions, or use manual URL input below.',
          variant: 'destructive',
          duration: 10000, // Show for 10 seconds
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      specifications: formData.specifications.filter(s => s.key && s.value),
    };

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
    } else {
      await createProduct.mutateAsync(productData);
    }

    setIsProductDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = async () => {
    if (deleteProductId) {
      // Find the product to get its image URL
      const productToDelete = products?.find(p => p.id === deleteProductId);
      
      // Delete the product
      await deleteProduct.mutateAsync(deleteProductId);
      
      // Delete the image from storage if it exists and is from Supabase
      if (productToDelete?.image && productToDelete.image.includes('supabase.co')) {
        try {
          await deleteProductImage(productToDelete.image);
        } catch (error) {
          console.error('Failed to delete image from storage:', error);
        }
      }
      
      setDeleteProductId(null);
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      parent_id: 'none', // Use 'none' instead of '' to avoid Select empty string error
    });
    setEditingCategory(null);
  };

  const openCategoryDialog = (category?: Category, isSubcategory: boolean = false) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name,
        parent_id: category.parent_id || 'none',
      });
    } else {
      resetCategoryForm();
      // If creating a subcategory and there are parent categories, pre-select the first one
      if (isSubcategory && organizedCategories.parents.length > 0) {
        setCategoryFormData({
          name: '',
          parent_id: organizedCategories.parents[0].id,
        });
      }
    }
    setIsCategoryDialogOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name: categoryFormData.name,
      parent_id: categoryFormData.parent_id === 'none' ? null : categoryFormData.parent_id,
    };

    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, ...categoryData });
    } else {
      await createCategory.mutateAsync(categoryData);
    }

    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  const handleDeleteCategory = async () => {
    if (deleteCategoryId) {
      await deleteCategory.mutateAsync(deleteCategoryId);
      setDeleteCategoryId(null);
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-md animate-scale-in shadow-hover">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">FlowraValves Admin Panel</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@flowravalves.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full hover-scale" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login to Admin Panel'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="container mx-auto px-4 py-4 flex-shrink-0 border-b border-border">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div 
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'auto'
          }}
          data-lenis-prevent
        >
          <div className="container mx-auto px-4 py-8">

          {/* Tabs for Products and Categories */}
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Products</CardTitle>
                <Button onClick={() => openProductDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto overscroll-contain pr-2">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                          {(() => {
                            const imageUrl = convertGoogleDriveUrl(product.image);
                            return imageUrl ? (
                        <img
                                src={imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'block';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No img</span>
                              </div>
                            );
                          })()}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openProductDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeleteProductId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Categories</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openCategoryDialog()}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                      <Button
                        onClick={() => openCategoryDialog(undefined, true)}
                        disabled={organizedCategories.parents.length === 0}
                      >
                        <FolderTree className="mr-2 h-4 w-4" />
                        Add Subcategory
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto overscroll-contain pr-2">
                    {/* Parent Categories */}
                    {organizedCategories.parents.map((category) => {
                      const subcategories = organizedCategories.children.filter(
                        child => child.parent_id === category.id
                      );
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <FolderTree className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h3 className="font-semibold">{category.name}</h3>
                                {subcategories.length > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    {subcategories.length} subcategory{subcategories.length !== 1 ? 'ies' : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openCategoryDialog(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setDeleteCategoryId(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {/* Subcategories */}
                          {subcategories.length > 0 && (
                            <div className="ml-8 space-y-2">
                              {subcategories.map((subcategory) => (
                                <div
                                  key={subcategory.id}
                                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-background"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">└─</span>
                                    <span className="font-medium">{subcategory.name}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openCategoryDialog(subcategory)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => setDeleteCategoryId(subcategory.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {organizedCategories.parents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No categories yet. Create your first category!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the product details below.' 
                : 'Fill in the product information to add it to your catalog.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {organizedCategories.parents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  {organizedCategories.children.map((cat) => {
                    const parent = categories?.find(c => c.id === cat.parent_id);
                    return (
                      <SelectItem key={cat.id} value={cat.name}>
                        {parent ? `${parent.name} > ${cat.name}` : cat.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              
              {/* File Upload */}
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                {bucketExists === false && (
                  <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        ⚠️ Storage bucket not found
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          setBucketExists(null); // Show loading state
                          const exists = await checkBucketExists();
                          setBucketExists(exists);
                          if (exists) {
                            toast({
                              title: 'Bucket Found!',
                              description: 'Storage bucket is now available. You can upload images.',
                            });
                          } else {
                            toast({
                              title: 'Bucket Not Found',
                              description: 'Please verify the bucket name is exactly "product-images" and is set to Public in Supabase Dashboard.',
                              variant: 'destructive',
                            });
                          }
                        }}
                        className="h-6 px-2 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Check Again
                      </Button>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                      Create the bucket to enable direct uploads:
                    </p>
                    <ol className="text-xs text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1 mb-2">
                      <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Dashboard</a> → <strong>Storage</strong></li>
                      <li>Click <strong>"New bucket"</strong></li>
                      <li>Name: <strong className="font-mono">product-images</strong> (exact name)</li>
                      <li>Set to <strong>Public</strong> (important!)</li>
                      <li>Click <strong>"Create bucket"</strong></li>
                      <li className="font-semibold mt-2">⚠️ IMPORTANT: Set up Storage Policies!</li>
                      <li>Go to <strong>Storage → Policies → product-images</strong></li>
                      <li>Add policies OR run SQL from <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">STORAGE-POLICIES-SETUP.sql</code></li>
                      <li>Click <strong>"Check Again"</strong> button above to verify</li>
                    </ol>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      💡 <strong>Tip:</strong> You can use manual URL input below while setting up the bucket.
                    </p>
                  </div>
                )}
                {bucketExists === true && (
                  <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      ✅ Storage bucket is ready! You can upload images directly.
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full"
                >
                  {isUploadingImage ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {bucketExists === false ? 'Try Upload Anyway (Bucket Check Failed)' : 'Upload Image to Supabase Storage'}
                    </>
                  )}
                </Button>
                {bucketExists === null && (
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Checking bucket status...
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mb-3">
                  <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.image-error')) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'image-error w-full h-full flex items-center justify-center';
                          errorDiv.innerHTML = '<span class="text-muted-foreground text-sm">Failed to load image</span>';
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => setFormData({ ...formData, image: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Manual URL Input (Alternative) */}
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Or paste image URL manually:
                </label>
              <Input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste image URL (Google Drive, Imgur, etc.)"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                <strong>Recommended:</strong> Upload directly to Supabase Storage (500MB free tier)
                <br />
                <strong>Storage estimate:</strong> ~1,000-5,000 products (depending on image size)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specifications</label>
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newSpecs = formData.specifications.filter((_, i) => i !== index);
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    specifications: [...formData.specifications, { key: '', value: '' }],
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Specification
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsProductDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category details below.' 
                : 'Create a new category or subcategory. Select a parent category to create a subcategory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name *</label>
              <Input
                required
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Parent Category (Optional)
                <span className="text-xs text-muted-foreground ml-2">
                  Select "None" for main category, or choose a parent to create a subcategory
                </span>
              </label>
              <Select
                value={categoryFormData.parent_id}
                onValueChange={(value) => setCategoryFormData({ ...categoryFormData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Main Category)</SelectItem>
                  {organizedCategories.parents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCategoryDialogOpen(false);
                  resetCategoryForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
              {deleteCategoryId && organizedCategories.children.some(c => c.parent_id === deleteCategoryId) && (
                <span className="block mt-2 text-destructive font-semibold">
                  Warning: This category has subcategories. Please delete them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
