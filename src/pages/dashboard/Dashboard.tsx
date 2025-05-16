import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { statsService } from "@/lib/statsService";
import type { StatsOverview, RevenueData, CategoryData, RecentOrder } from "@/lib/statsService";
import { Button } from "@/components/ui/button";

// Fallback mock data
const mockStatsOverview = {
  total_revenue: 120500000,
  revenue_change: 12.5,
  product_count: 250,
  product_change: 8.2,
  new_orders: 48,
  orders_change: 35,
  new_users: 32,
  users_change: -4.3
};

const mockRevenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 55000000 },
  { month: "T6", revenue: 67000000 },
  { month: "T7", revenue: 72000000 },
  { month: "T8", revenue: 78000000 },
  { month: "T9", revenue: 69000000 },
  { month: "T10", revenue: 85000000 },
  { month: "T11", revenue: 96000000 },
  { month: "T12", revenue: 120500000 },
];

const mockCategoryData = [
  { name: "Điện thoại", value: 35 },
  { name: "Laptop", value: 25 },
  { name: "Máy tính bảng", value: 15 },
  { name: "Phụ kiện", value: 20 },
  { name: "Khác", value: 5 },
];

const mockRecentOrders = [
  {
    id: 1,
    customer_name: "Nguyễn Văn A",
    status: "Hoàn thành",
    total: 5500000,
    date: "2025-05-15T10:30:00Z",
  },
  {
    id: 2,
    customer_name: "Trần Thị B",
    status: "Đang xử lý",
    total: 3200000,
    date: "2025-05-15T09:15:00Z",
  },
  {
    id: 3,
    customer_name: "Lê Văn C",
    status: "Đang giao hàng",
    total: 8900000,
    date: "2025-05-14T14:45:00Z",
  },
  {
    id: 4,
    customer_name: "Phạm Thị D",
    status: "Hoàn thành",
    total: 2100000,
    date: "2025-05-13T16:20:00Z",
  },
  {
    id: 5,
    customer_name: "Hoàng Văn E",
    status: "Đã hủy",
    total: 6400000,
    date: "2025-05-12T11:10:00Z",
  },
];

// Format number to Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Format date to Vietnamese format
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [overview, setOverview] = useState<StatsOverview>(mockStatsOverview);
  const [revenueData, setRevenueData] = useState<RevenueData[]>(mockRevenueData);
  const [categoryData, setCategoryData] = useState<CategoryData[]>(mockCategoryData);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(mockRecentOrders);

  // Function to refresh category distribution data
  const refreshCategoryData = async () => {
    setCategoryLoading(true);
    try {
      const data = await statsService.generateCategoryData();
      setCategoryData(data);
      console.log('Category data refreshed:', data);
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Option 1: Fetch all data in one request
        const dashboardData = await statsService.getDashboardStats();
        setOverview(dashboardData.overview);
        setRevenueData(dashboardData.revenue_chart);
        setCategoryData(dashboardData.category_chart);
        setRecentOrders(dashboardData.recent_orders);

        console.log('Dashboard data loaded:', dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);

        // Option 2: Fall back to mock data if the combined endpoint fails
        setOverview(mockStatsOverview);
        setRevenueData(mockRevenueData);
        setCategoryData(mockCategoryData);
        setRecentOrders(mockRecentOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Map overview data to stats cards format
  const statsCards = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(overview.total_revenue),
      change: `${overview.revenue_change > 0 ? '+' : ''}${overview.revenue_change}%`,
      icon: DollarSign,
      trend: overview.revenue_change >= 0 ? "up" : "down",
    },
    {
      title: "Số lượng sản phẩm",
      value: overview.product_count.toString(),
      change: `${overview.product_change > 0 ? '+' : ''}${overview.product_change}%`,
      icon: Package,
      trend: overview.product_change >= 0 ? "up" : "down",
    },
    {
      title: "Đơn hàng mới",
      value: overview.new_orders.toString(),
      change: `${overview.orders_change > 0 ? '+' : ''}${overview.orders_change}%`,
      icon: ShoppingCart,
      trend: overview.orders_change >= 0 ? "up" : "down",
    },
    {
      title: "Người dùng mới",
      value: overview.new_users.toString(),
      change: `${overview.users_change > 0 ? '+' : ''}${overview.users_change}%`,
      icon: Users,
      trend: overview.users_change >= 0 ? "up" : "down",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Đang tải...
            </span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">
          Xem tổng quan về hoạt động của cửa hàng của bạn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs flex items-center ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {stat.change}
                <span className="text-muted-foreground ml-1">so với tháng trước</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Doanh thu của cửa hàng trong 12 tháng qua
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Phân bố sản phẩm theo danh mục</CardTitle>
              <CardDescription>
                Tỷ lệ sản phẩm theo từng danh mục (%)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCategoryData}
              disabled={categoryLoading}
            >
              {categoryLoading ? "Đang tải..." : "Làm mới"}
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} label={{ position: 'top', formatter: (value) => `${value}%` }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>
            Danh sách 5 đơn hàng mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Ngày đặt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">ORD-{order.id.toString().padStart(3, '0')}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${
                        order.status === "Hoàn thành"
                          ? "bg-success/20 text-success"
                          : order.status === "Đã hủy"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
