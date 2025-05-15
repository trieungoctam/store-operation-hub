
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Edit, Trash2, Plus, ImagePlus, Star, 
  Package, RefreshCw, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Mock product details
const mockProductDetails = {
  id: 1,
  barcode: "P1001",
  product_name: "iPhone 15 Pro Max",
  description: "Apple iPhone 15 Pro Max với chip A17 Pro, màn hình OLED 6.7 inch, camera 48MP và nhiều tính năng cao cấp khác.",
  price: 34990000,
  category: "Điện thoại",
  brand: "Apple",
  stock: 45,
  created_at: "2025-01-15T10:30:00Z",
  updated_at: "2025-05-01T08:15:00Z",
  images: [
    { id: 1, url: "/placeholder.svg", is_primary: true },
    { id: 2, url: "/placeholder.svg", is_primary: false },
    { id: 3, url: "/placeholder.svg", is_primary: false },
  ],
  variants: [
    { id: 1, size: "128GB", color: "Titan Black", stock: 15 },
    { id: 2, size: "256GB", color: "Titan Black", stock: 12 },
    { id: 3, size: "512GB", color: "Titan Black", stock: 8 },
    { id: 4, size: "128GB", color: "Titan White", stock: 5 },
    { id: 5, size: "256GB", color: "Titan White", stock: 5 },
  ]
};

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Format date helper
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(mockProductDetails);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data
    setLoading(true);
    // In a real app, this would be an API call
    // fetch(`/api/v1/products/${id}`)
    //   .then(res => res.json())
    //   .then(data => setProduct(data))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoading(false));

    // For the mock, we'll just simulate a delay
    setTimeout(() => {
      // Update mock product to match the ID in the URL
      setProduct({
        ...mockProductDetails,
        id: Number(id)
      });
      setLoading(false);
    }, 300);
  }, [id]);

  const handleDelete = () => {
    // Delete product
    // In a real app, this would be an API call
    // fetch(`/api/v1/products/${id}`, { method: 'DELETE' })
    //   .then(() => {
    //     toast.success("Đã xóa sản phẩm thành công");
    //     navigate('/dashboard/products');
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     toast.error("Không thể xóa sản phẩm");
    //   });

    // For the mock, simulate success
    toast.success("Đã xóa sản phẩm thành công");
    navigate('/dashboard/products');
  };

  const handleDeleteVariant = (variantId: number) => {
    // In a real app, delete via API
    // For the mock, update the state
    setProduct({
      ...product,
      variants: product.variants.filter(v => v.id !== variantId)
    });
    toast.success("Đã xóa biến thể thành công");
  };

  const handleDeleteImage = (imageId: number) => {
    // In a real app, delete via API
    // For the mock, update the state
    setProduct({
      ...product,
      images: product.images.filter(img => img.id !== imageId)
    });
    toast.success("Đã xóa hình ảnh thành công");
  };

  const handleSetPrimaryImage = (imageId: number) => {
    // In a real app, update via API
    // For the mock, update the state
    setProduct({
      ...product,
      images: product.images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }))
    });
    toast.success("Đã đặt làm ảnh chính");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-4">
          Sản phẩm này không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link to="/dashboard/products">Quay lại danh sách sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <h1 className="text-2xl font-bold tracking-tight">{product.product_name}</h1>
          <Badge className="ml-2">{product.category}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/products/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa sản phẩm "{product.product_name}"? 
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Xác nhận xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <CardDescription>
              Chi tiết thông tin cơ bản của sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID sản phẩm</p>
                <p>{product.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mã sản phẩm</p>
                <p>{product.barcode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giá</p>
                <p className="font-semibold text-lg">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng kho</p>
                <p>{product.stock} sản phẩm</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Danh mục</p>
                <p>{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thương hiệu</p>
                <p>{product.brand}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{formatDate(product.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p>{formatDate(product.updated_at)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả</p>
              <p className="text-sm">{product.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Product images */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
              <CardDescription>
                Quản lý hình ảnh sản phẩm
              </CardDescription>
            </div>
            <Button variant="outline">
              <ImagePlus className="h-4 w-4 mr-2" />
              Thêm ảnh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.url} 
                    alt="Product" 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {image.is_primary && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Ảnh chính
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    {!image.is_primary && (
                      <Button 
                        size="icon" 
                        variant="secondary"
                        onClick={() => handleSetPrimaryImage(image.id)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa ảnh</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa hình ảnh này? 
                            {image.is_primary && " Đây là ảnh chính của sản phẩm."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {product.images.length === 0 && (
                <div className="col-span-3 h-32 border border-dashed rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chưa có hình ảnh</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Biến thể sản phẩm</CardTitle>
            <CardDescription>
              Quản lý các biến thể của sản phẩm (kích thước, màu sắc, v.v.)
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm biến thể
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Kích thước</th>
                  <th className="px-4 py-3 text-left font-medium">Màu sắc</th>
                  <th className="px-4 py-3 text-right font-medium">Kho</th>
                  <th className="px-4 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.id} className="border-b">
                    <td className="px-4 py-3">{variant.id}</td>
                    <td className="px-4 py-3">{variant.size}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div 
                          className="h-4 w-4 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: variant.color.toLowerCase().includes('black') ? 'black' : 
                                            variant.color.toLowerCase().includes('white') ? 'white' : 
                                            '#ccc',
                            border: variant.color.toLowerCase().includes('white') ? '1px solid #ccc' : 'none'
                          }} 
                        />
                        {variant.color}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{variant.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa biến thể</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa biến thể này? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                Xác nhận xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
                {product.variants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center">
                      <p className="text-muted-foreground">Chưa có biến thể nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
