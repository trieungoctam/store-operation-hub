
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

// Mock product if ID is provided
const mockProduct = {
  id: 1,
  barcode: "P1001",
  product_name: "iPhone 15 Pro Max",
  description: "Apple iPhone 15 Pro Max với chip A17 Pro, màn hình OLED 6.7 inch, camera 48MP và nhiều tính năng cao cấp khác.",
  price: 34990000,
  category_id: 1,
  brand_id: 1,
};

// Mock categories and brands
const mockCategories = [
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Tablet" },
  { id: 4, name: "Phụ kiện" },
  { id: 5, name: "Khác" },
];

const mockBrands = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
  { id: 4, name: "Dell" },
  { id: 5, name: "Khác" },
];

// Validation schema
const productSchema = z.object({
  barcode: z.string().min(1, "Mã sản phẩm là bắt buộc"),
  product_name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().min(1, "Mô tả sản phẩm là bắt buộc"),
  price: z.string().min(1, "Giá sản phẩm là bắt buộc").transform(val => parseInt(val.replace(/[^0-9]/g, ""))),
  category_id: z.string().min(1, "Danh mục là bắt buộc"),
  brand_id: z.string().min(1, "Thương hiệu là bắt buộc"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      barcode: "",
      product_name: "",
      description: "",
      price: "0",
      category_id: "",
      brand_id: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      // In a real app, fetch product data from API
      // fetch(`/api/v1/products/${id}`)
      //   .then(res => res.json())
      //   .then(data => {...})
      //   .catch(err => console.error(err))
      //   .finally(() => setIsLoading(false));

      // For the mock, simulate a delay and use mock data
      setTimeout(() => {
        form.reset({
          barcode: mockProduct.barcode,
          product_name: mockProduct.product_name,
          description: mockProduct.description,
          price: mockProduct.price.toString(),
          category_id: mockProduct.category_id.toString(),
          brand_id: mockProduct.brand_id.toString(),
        });
        setIsLoading(false);
      }, 300);
    }
  }, [id, form, isEditMode]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);

    try {
      // In a real app, send data to API
      // const method = isEditMode ? 'PUT' : 'POST';
      // const url = isEditMode ? `/api/v1/products/${id}` : '/api/v1/products';
      
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // if (!response.ok) throw new Error("Failed to save product");
      // const result = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success(isEditMode ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
      
      // Navigate back to product list or detail
      if (isEditMode) {
        navigate(`/dashboard/products/${id}`);
      } else {
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    
    // Format with comma separators
    if (numericValue) {
      return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
    }
    
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold tracking-tight ml-4">
          {isEditMode ? `Chỉnh sửa sản phẩm #${id}` : "Thêm sản phẩm mới"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>
            Nhập thông tin chi tiết cho sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã sản phẩm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên sản phẩm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Giá sản phẩm</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="0"
                            onChange={(e) => {
                              const formatted = formatPrice(e.target.value);
                              e.target.value = formatted;
                              onChange(e);
                            }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            đ
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Thương hiệu</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thương hiệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockBrands.map((brand) => (
                            <SelectItem 
                              key={brand.id} 
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Mô tả sản phẩm</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả sản phẩm chi tiết"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? "Cập nhật" : "Thêm sản phẩm"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFormPage;
