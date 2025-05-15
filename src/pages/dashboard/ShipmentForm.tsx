
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  orderId: z.string().min(1, "Mã đơn hàng là bắt buộc"),
  carrier: z.string().min(1, "Đơn vị vận chuyển là bắt buộc"),
  trackingNumber: z.string().min(1, "Mã vận đơn là bắt buộc"),
  status: z.string().min(1, "Trạng thái là bắt buộc"),
  estimatedDeliveryDate: z.date({
    required_error: "Vui lòng chọn ngày giao dự kiến",
  }),
  shippingCost: z.number().min(0, "Chi phí vận chuyển không thể âm"),
  customerName: z.string().min(1, "Tên khách hàng là bắt buộc"),
  customerPhone: z.string().min(1, "Số điện thoại là bắt buộc"),
  customerEmail: z.string().email("Email không hợp lệ"),
  shippingAddress: z.string().min(1, "Địa chỉ giao hàng là bắt buộc"),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for existing shipment
const existingShipment = {
  id: "S1002",
  orderId: "O10046",
  status: "shipped",
  carrier: "FedEx",
  trackingNumber: "FDX5896523144",
  estimatedDeliveryDate: new Date("2025-05-18"),
  shippingCost: 15.50,
  customerName: "Nguyen Van A",
  customerEmail: "nguyenvana@example.com",
  customerPhone: "+84 123 456 789",
  shippingAddress: "123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam",
};

// Mock data for orders to select from
const orders = [
  { id: "O10045", customerName: "Tran Thi B" },
  { id: "O10046", customerName: "Nguyen Van A" },
  { id: "O10047", customerName: "Le Van C" },
  { id: "O10048", customerName: "Pham Thi D" },
  { id: "O10049", customerName: "Hoang Van E" },
];

const carriers = [
  "DHL Express",
  "FedEx",
  "UPS",
  "USPS",
  "GHN",
  "Giao hàng tiết kiệm",
  "Vietnam Post",
  "Viettel Post",
];

const ShipmentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form setup with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? existingShipment
      : {
          orderId: "",
          carrier: "",
          trackingNumber: "",
          status: "pending",
          estimatedDeliveryDate: new Date(),
          shippingCost: 0,
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          shippingAddress: "",
        },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would call an API to save the data
    console.log("Form submitted:", data);

    // Show success message
    toast.success(
      isEditMode
        ? "Thông tin vận chuyển đã được cập nhật"
        : "Thông tin vận chuyển mới đã được tạo"
    );

    // Redirect back to shipments page
    navigate("/dashboard/shipments");
  };

  // Handle order selection (in a real app, this would fetch customer details)
  const handleOrderSelect = (orderId: string) => {
    const selectedOrder = orders.find((order) => order.id === orderId);
    if (selectedOrder) {
      form.setValue("orderId", orderId);
      // In a real app, you would fetch customer details from an API
      // For now, we'll simulate this with mock data
      if (orderId === "O10046") {
        form.setValue("customerName", "Nguyen Van A");
        form.setValue("customerPhone", "+84 123 456 789");
        form.setValue("customerEmail", "nguyenvana@example.com");
        form.setValue("shippingAddress", "123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam");
      } else {
        // Reset customer fields if selecting a different order
        form.setValue("customerName", "");
        form.setValue("customerPhone", "");
        form.setValue("customerEmail", "");
        form.setValue("shippingAddress", "");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {isEditMode ? "Chỉnh sửa thông tin vận chuyển" : "Tạo thông tin vận chuyển mới"}
        </h1>
        <p className="text-gray-500">
          {isEditMode
            ? "Cập nhật thông tin vận chuyển hiện có"
            : "Nhập thông tin để tạo vận đơn mới"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin vận chuyển</CardTitle>
              <CardDescription>
                Nhập các thông tin vận chuyển cơ bản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn hàng</FormLabel>
                    <Select
                      onValueChange={handleOrderSelect}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {orders.map((order) => (
                            <SelectItem key={order.id} value={order.id}>
                              {order.id} - {order.customerName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Chọn đơn hàng cần tạo vận đơn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị vận chuyển</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đơn vị vận chuyển" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {carriers.map((carrier) => (
                              <SelectItem key={carrier} value={carrier}>
                                {carrier}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã vận đơn</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã vận đơn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                            <SelectItem value="shipped">Đang vận chuyển</SelectItem>
                            <SelectItem value="delivered">Đã giao hàng</SelectItem>
                            <SelectItem value="returned">Đã hoàn trả</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày giao dự kiến</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date(2100, 0, 1)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi phí vận chuyển</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
              <CardDescription>
                Thông tin người nhận hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ giao hàng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập địa chỉ giao hàng đầy đủ"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/shipments")}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditMode ? "Cập nhật" : "Tạo vận đơn"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ShipmentFormPage;
