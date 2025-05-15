
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, RefreshCw, AlertTriangle, User, MapPin, Mail, Phone, 
  Calendar, ShoppingCart, CreditCard, Edit 
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock user details
const mockUserDetails = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "example@email.com",
  phone: "0901234567",
  status: "active",
  created_at: "2025-01-15T10:30:00Z",
  last_login: "2025-05-14T08:15:00Z",
  addresses: [
    {
      id: 1,
      is_default: true,
      street: "123 Đường Nguyễn Văn Linh",
      district: "Quận 7",
      city: "TP Hồ Chí Minh",
      country: "Việt Nam",
      postal_code: "70000"
    },
    {
      id: 2,
      is_default: false,
      street: "456 Đường Lê Duẩn",
      district: "Quận 1",
      city: "TP Hồ Chí Minh",
      country: "Việt Nam",
      postal_code: "70000"
    }
  ],
  orders: [
    {
      id: 1,
      order_date: "2025-05-14T09:45:00Z",
      status: "processing",
      items_count: 3,
      total: 39817000
    },
    {
      id: 2,
      order_date: "2025-04-20T14:30:00Z",
      status: "completed",
      items_count: 2,
      total: 25600000
    },
    {
      id: 3,
      order_date: "2025-03-05T11:15:00Z",
      status: "completed",
      items_count: 1,
      total: 12490000
    }
  ],
  total_spent: 77907000,
  orders_count: 3
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
    case "active":
      return <Badge className="bg-success">Hoạt động</Badge>;
    case "inactive":
      return <Badge variant="outline">Không hoạt động</Badge>;
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

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(mockUserDetails);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    setLoading(true);
    // In a real app, this would be an API call
    // fetch(`/api/v1/users/${id}`)
    //   .then(res => res.json())
    //   .then(data => setUser(data))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoading(false));

    // For the mock, we'll just simulate a delay
    setTimeout(() => {
      // Update mock user to match the ID in the URL
      setUser({
        ...mockUserDetails,
        id: Number(id)
      });
      setLoading(false);
    }, 300);
  }, [id]);

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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy người dùng</h2>
        <p className="text-muted-foreground mb-4">
          Người dùng này không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <a href="/dashboard/users">Quay lại danh sách người dùng</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <h1 className="text-2xl font-bold tracking-tight">Thông tin người dùng</h1>
          {getStatusBadge(user.status)}
        </div>
        <Button variant="outline" onClick={() => toast.success("Chức năng đang được phát triển")}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User info card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  ID: {user.id}
                </Badge>
              </div>

              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tham gia: {formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Đăng nhập cuối: {formatDate(user.last_login)}</span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                  <p className="text-lg font-semibold">{user.orders_count}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Chi tiêu</p>
                  <p className="text-lg font-semibold">{formatPrice(user.total_spent).split(" ")[0]}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">Lịch sử đơn hàng</h3>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Ngày đặt</th>
                      <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                      <th className="px-4 py-3 text-center font-medium">Sản phẩm</th>
                      <th className="px-4 py-3 text-right font-medium">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.orders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      >
                        <td className="px-4 py-3">#{order.id}</td>
                        <td className="px-4 py-3">{formatDate(order.order_date)}</td>
                        <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                        <td className="px-4 py-3 text-center">{order.items_count}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatPrice(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {user.orders.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Người dùng chưa có đơn hàng nào</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {user.addresses.map((address) => (
                  <Card key={address.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          {address.is_default && (
                            <Badge className="mb-1">Mặc định</Badge>
                          )}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">
                        {address.street},
                        {'\n'}
                        {address.district},
                        {'\n'}
                        {address.city},
                        {'\n'}
                        {address.country}, {address.postal_code}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {user.addresses.length === 0 && (
                  <div className="col-span-2 text-center py-10 bg-muted rounded-md">
                    <p className="text-muted-foreground">Chưa có địa chỉ nào</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
