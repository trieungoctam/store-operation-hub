
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, RefreshCw, AlertTriangle, Package, Truck, 
  CreditCard, User, MapPin, Clock, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Mock order details
const mockOrderDetails = {
  id: 1,
  customer: {
    id: 1,
    name: "Nguyễn Văn A",
    email: "example@email.com",
    phone: "0901234567"
  },
  shipping_address: {
    street: "123 Đường Nguyễn Văn Linh",
    district: "Quận 7",
    city: "TP Hồ Chí Minh",
    country: "Việt Nam",
    postal_code: "70000"
  },
  items: [
    {
      id: 1,
      product_id: 101,
      product_name: "iPhone 15 Pro Max",
      variant: "256GB, Titan Black",
      quantity: 1,
      unit_price: 34990000,
      total_price: 34990000
    },
    {
      id: 2,
      product_id: 102,
      product_name: "Ốp lưng iPhone 15 Pro Max",
      variant: "Silicone, Đen",
      quantity: 2,
      unit_price: 590000,
      total_price: 1180000
    }
  ],
  payment: {
    method: "Credit Card",
    status: "Paid",
    transaction_id: "TXN123456789",
    payment_date: "2025-05-14T10:30:00Z",
  },
  shipment: {
    carrier: "GHN Express",
    tracking_number: "GHN1234567890",
    status: "Delivering",
    estimate_delivery_date: "2025-05-17T00:00:00Z",
    events: [
      {
        id: 1,
        date: "2025-05-15T08:30:00Z",
        status: "Order Processed",
        location: "HCM Sorting Center",
        description: "Đơn hàng đã được xử lý"
      },
      {
        id: 2,
        date: "2025-05-15T14:15:00Z",
        status: "Shipped",
        location: "HCM Distribution Center",
        description: "Đơn hàng đã được gửi đi"
      }
    ]
  },
  status: "processing",
  subtotal: 36170000,
  shipping_fee: 30000,
  tax: 3617000,
  discount: 0,
  total: 39817000,
  notes: "Gọi trước khi giao hàng",
  created_at: "2025-05-14T09:45:00Z",
  updated_at: "2025-05-15T08:30:00Z",
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-success">Đã hoàn thành</Badge>;
    case "shipped":
      return <Badge className="bg-primary">Đang giao hàng</Badge>;
    case "processing":
      return <Badge className="bg-warning">Đang xử lý</Badge>;
    case "pending":
      return <Badge variant="outline">Chờ xử lý</Badge>;
    case "cancelled":
      return <Badge className="bg-destructive">Đã hủy</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Đã hoàn thành";
    case "shipped":
      return "Đang giao hàng";
    case "processing":
      return "Đang xử lý";
    case "pending":
      return "Chờ xử lý";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState(mockOrderDetails);
  const [status, setStatus] = useState(mockOrderDetails.status);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order data
    setLoading(true);
    // In a real app, this would be an API call
    // fetch(`/api/v1/orders/${id}`)
    //   .then(res => res.json())
    //   .then(data => setOrder(data))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoading(false));

    // For the mock, we'll just simulate a delay
    setTimeout(() => {
      // Update mock order to match the ID in the URL
      setOrder({
        ...mockOrderDetails,
        id: Number(id)
      });
      setStatus(mockOrderDetails.status);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setLoading(true);
    // In a real app, this would be an API call
    // fetch(`/api/v1/orders/${id}/status`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setOrder({ ...order, status: newStatus });
    //     setStatus(newStatus);
    //     toast.success("Cập nhật trạng thái thành công");
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     toast.error("Không thể cập nhật trạng thái");
    //   })
    //   .finally(() => setLoading(false));

    // For the mock, we'll just simulate a delay
    setTimeout(() => {
      setOrder({ ...order, status: newStatus });
      setStatus(newStatus);
      toast.success("Cập nhật trạng thái thành công");
      setLoading(false);
    }, 500);
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

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-muted-foreground mb-4">
          Đơn hàng này không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <a href="/dashboard/orders">Quay lại danh sách đơn hàng</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Đơn hàng #{order.id}</h1>
            <p className="text-muted-foreground">
              Ngày đặt: {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái đơn hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="shipped">Đang giao hàng</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Chi tiết đơn hàng</TabsTrigger>
          <TabsTrigger value="shipment">Vận chuyển</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Tên khách hàng</p>
                  <p>{order.customer.name}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>{order.customer.email}</p>
                </div>
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p>{order.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping address */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <CardTitle className="text-lg">Địa chỉ giao hàng</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {order.shipping_address.street},
                  {'\n'}
                  {order.shipping_address.district},
                  {'\n'}
                  {order.shipping_address.city},
                  {'\n'}
                  {order.shipping_address.country}, {order.shipping_address.postal_code}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <CardTitle className="text-lg">Sản phẩm trong đơn hàng</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">Sản phẩm</th>
                      <th className="px-4 py-3 text-center font-medium">Số lượng</th>
                      <th className="px-4 py-3 text-right font-medium">Đơn giá</th>
                      <th className="px-4 py-3 text-right font-medium">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatPrice(item.unit_price)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatPrice(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>{formatPrice(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Thuế:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t mt-2">
                  <span className="font-semibold">Tổng thanh toán:</span>
                  <span className="font-semibold text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Phương thức thanh toán</p>
                  <p>{order.payment.method}</p>
                </div>
                <div>
                  <p className="font-medium">Trạng thái thanh toán</p>
                  <Badge className={order.payment.status === "Paid" ? "bg-success" : "bg-warning"}>
                    {order.payment.status === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </Badge>
                </div>
                {order.payment.transaction_id && (
                  <div>
                    <p className="font-medium">Mã giao dịch</p>
                    <p>{order.payment.transaction_id}</p>
                  </div>
                )}
                {order.payment.payment_date && (
                  <div>
                    <p className="font-medium">Ngày thanh toán</p>
                    <p>{formatDate(order.payment.payment_date)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shipment" className="space-y-6">
          {/* Shipment info */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                <CardTitle className="text-lg">Thông tin vận chuyển</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Đơn vị vận chuyển</p>
                  <p>{order.shipment.carrier}</p>
                </div>
                <div>
                  <p className="font-medium">Mã vận đơn</p>
                  <p>{order.shipment.tracking_number}</p>
                </div>
                <div>
                  <p className="font-medium">Trạng thái vận chuyển</p>
                  <Badge className="bg-primary">
                    {order.shipment.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">Ngày giao dự kiến</p>
                  <p>{formatDate(order.shipment.estimate_delivery_date)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/shipments/new?order_id=${order.id}`)}>
                <Truck className="h-4 w-4 mr-2" />
                Cập nhật thông tin vận chuyển
              </Button>
            </CardFooter>
          </Card>

          {/* Shipment timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch trình vận chuyển</CardTitle>
              <CardDescription>
                Theo dõi quá trình vận chuyển đơn hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.shipment.events.length > 0 ? (
                <div className="relative pl-8 space-y-6">
                  {order.shipment.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, index) => (
                    <div key={event.id} className="relative">
                      {index !== order.shipment.events.length - 1 && (
                        <div className="absolute left-[-12px] top-6 bottom-[-30px] border-l-2 border-dashed"></div>
                      )}
                      <div className="absolute left-[-20px] top-1">
                        <div className={`p-1 rounded-full ${index === 0 ? 'bg-primary text-white' : 'bg-muted border'}`}>
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mb-1 flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <h4 className="font-medium">{event.status}</h4>
                      <div className="text-sm mb-1">{event.location}</div>
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Chưa có thông tin vận chuyển</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/shipments/${order.id}`)}>
                Xem chi tiết vận chuyển
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailPage;
