
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Define the product form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên sản phẩm phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  price: z.number().min(0, {
    message: "Giá phải lớn hơn hoặc bằng 0.",
  }),
  category: z.string().min(1, {
    message: "Vui lòng chọn một danh mục.",
  }),
  inventory: z.number().min(0, {
    message: "Số lượng tồn kho phải lớn hơn hoặc bằng 0.",
  }),
  imageUrl: z.string().url({
    message: "Vui lòng nhập một URL hợp lệ.",
  }),
  isFeatured: z.boolean().default(false),
  status: z.string().optional(),
});

// Define the form values type based on the schema
type FormValues = z.infer<typeof formSchema>;

// Mock categories data
const categories = [
  { id: "1", name: "Điện thoại" },
  { id: "2", name: "Máy tính bảng" },
  { id: "3", name: "Laptop" },
  { id: "4", name: "Phụ kiện" },
];

// Mock product data for editing
const mockProduct = {
  id: "123",
  name: "iPhone 13 Pro",
  description:
    "Điện thoại iPhone 13 Pro 128GB chính hãng Apple, màn hình Super Retina XDR, chip A15 Bionic.",
  price: 999,
  category: "1",
  inventory: 50,
  imageUrl:
    "https://cdn.tgdd.vn/Products/Images/42/230523/iphone-13-pro-max-gold-1-600x600.jpg",
  isFeatured: true,
  status: "active",
};

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Initialize the form with useForm hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          name: mockProduct.name,
          description: mockProduct.description || "",
          price: mockProduct.price,
          category: mockProduct.category,
          inventory: mockProduct.inventory,
          imageUrl: mockProduct.imageUrl,
          isFeatured: mockProduct.isFeatured,
          status: mockProduct.status || "active",
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "",
          inventory: 0,
          imageUrl: "",
          isFeatured: false,
          status: "active",
        },
    mode: "onChange",
  });

  const { setValue } = form;

  useEffect(() => {
    if (isEditMode && mockProduct) {
      setValue("name", mockProduct.name);
      setValue("description", mockProduct.description || "");
      setValue("price", mockProduct.price);
      setValue("category", mockProduct.category);
      setValue("inventory", mockProduct.inventory);
      setValue("imageUrl", mockProduct.imageUrl);
      setValue("isFeatured", mockProduct.isFeatured);
      setValue("status", mockProduct.status || "active");
    }
  }, [isEditMode, setValue]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Ensure price is a number
    const submissionData = {
      ...data,
      price: Number(data.price) // Ensure price is a number
    };

    // In a real application, you would handle the form submission here
    console.log("Form submitted with data:", submissionData);
    toast.success(
      isEditMode ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!"
    );
    navigate("/dashboard/products");
  };

  const priceValue = form.watch("price");

  useEffect(() => {
    if (priceValue) {
      setValue("price", Number(priceValue));
    }
  }, [priceValue, setValue]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Chỉnh sửa thông tin chi tiết của sản phẩm."
              : "Nhập thông tin chi tiết để tạo sản phẩm mới."}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>Nhập các thông tin cơ bản của sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả sản phẩm"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập giá sản phẩm"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng tồn kho</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số lượng tồn kho"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
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
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL hình ảnh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập URL hình ảnh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Sản phẩm nổi bật</FormLabel>
                      <FormDescription>
                        Chọn để hiển thị sản phẩm trên trang chủ.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">
                  {isEditMode ? "Cập nhật" : "Tạo sản phẩm"}
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
