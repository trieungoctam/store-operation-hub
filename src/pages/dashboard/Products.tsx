import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { statsService, Product } from "@/lib/statsService";

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await statsService.getProducts(0, 1000);
        setProducts(data);
        console.log('Products loaded:', data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const searchTerms = search.toLowerCase();
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerms) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchTerms)) ||
      (product.description && product.description.toLowerCase().includes(searchTerms));

    const matchesCategory = categoryFilter ? product.category_id.toString() === categoryFilter : true;
    const matchesBrand = brandFilter ? product.brand_id.toString() === brandFilter : true;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Đã xóa sản phẩm thành công");
  };

  // Get unique categories and brands for filters
  const categories = Array.from(new Set(products.map(p => p.category_id))).map(id => id.toString());
  const brands = Array.from(new Set(products.map(p => p.brand_id))).map(id => id.toString());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Đang tải...
            </span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải danh sách sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">
            Xem và quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/products/new")}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Quản lý thông tin các sản phẩm trong hệ thống ({products.length} sản phẩm)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả danh mục</SelectItem>
                    {categories.map((categoryId) => (
                      <SelectItem key={categoryId} value={categoryId}>
                        Danh mục {categoryId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={brandFilter}
                  onValueChange={setBrandFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả thương hiệu</SelectItem>
                    {brands.map((brandId) => (
                      <SelectItem key={brandId} value={brandId}>
                        Thương hiệu {brandId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Hình ảnh</th>
                    <th className="px-4 py-3 text-left font-medium">Mã vạch</th>
                    <th className="px-4 py-3 text-left font-medium">Tên sản phẩm</th>
                    <th className="px-4 py-3 text-right font-medium">Giá</th>
                    <th className="px-4 py-3 text-left font-medium">Danh mục</th>
                    <th className="px-4 py-3 text-left font-medium">Thương hiệu</th>
                    <th className="px-4 py-3 text-right font-medium">Kho</th>
                    <th className="px-4 py-3 text-center font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images.find(img => img.is_primary)?.image_url || product.images[0].image_url}
                            alt={product.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">{product.barcode}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/dashboard/products/${product.id}`}
                          className="hover:underline font-medium text-primary"
                        >
                          {product.product_name}
                        </Link>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        {product.category_name || `Danh mục ${product.category_id}`}
                      </td>
                      <td className="px-4 py-3">
                        {product.brand_name || `Thương hiệu ${product.brand_id}`}
                      </td>
                      <td className="px-4 py-3 text-right">{product.quantity || product.stock || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
                          >
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
                                <AlertDialogTitle>
                                  Xác nhận xóa sản phẩm
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa sản phẩm "{product.product_name}"?
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(product.id)}
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
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)}
                trong số {filteredProducts.length} sản phẩm
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Logic for showing pagination numbers
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }

                  if (pageToShow > totalPages) return null;

                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageToShow ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
