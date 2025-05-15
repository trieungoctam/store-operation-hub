
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Filter, ChevronLeft, ChevronRight, Calendar 
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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Mock orders data
const mockOrders = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  customer_name: `Khách hàng ${i + 1}`,
  customer_email: `customer${i + 1}@example.com`,
  order_date: new Date(2025, 4, 15 - (i % 30)).toISOString(),
  status: i % 5 === 0 ? "pending" : i % 5 === 1 ? "processing" : i % 5 === 2 ? "shipped" : i % 5 === 3 ? "completed" : "cancelled",
  total: Math.floor(Math.random() * 10000000) + 500000,
  items_count: Math.floor(Math.random() * 5) + 1,
  payment_method: i % 3 === 0 ? "COD" : i % 3 === 1 ? "Bank Transfer" : "Credit Card",
}));

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

const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const navigate = useNavigate();

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    const orderDate = new Date(order.order_date);
    const matchesDate = 
      (!dateRange.from || orderDate >= dateRange.from) &&
      (!dateRange.to || orderDate <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">
          Xem và quản lý tất cả đơn hàng trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý và theo dõi trạng thái các đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đang giao hàng</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                        )
                      ) : (
                        "Chọn thời gian"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="p-3 pointer-events-auto"
                    />
                    <div className="flex items-center justify-end gap-2 p-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => document.body.click()} // Close the popover
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {(search || statusFilter || dateRange.from) && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                    <th className="px-4 py-3 text-left font-medium">Ngày đặt</th>
                    <th className="px-4 py-3 text-right font-medium">Tổng</th>
                    <th className="px-4 py-3 text-center font-medium">Số sản phẩm</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/dashboard/orders/${order.id}`)}>
                      <td className="px-4 py-3">#{order.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatDate(order.order_date)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3 text-center">{order.items_count}</td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3">{order.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {currentOrders.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {currentOrders.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} 
                  trong số {filteredOrders.length} đơn hàng
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
