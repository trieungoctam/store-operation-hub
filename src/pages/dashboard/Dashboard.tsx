
import { useState } from "react";
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

// Mock data for statistics
const stats = [
  {
    title: "Tổng doanh thu",
    value: "120.500.000 VND",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Số lượng sản phẩm",
    value: "250",
    change: "+8.2%",
    icon: Package,
    trend: "up",
  },
  {
    title: "Đơn hàng mới",
    value: "48",
    change: "+35%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Người dùng mới",
    value: "32",
    change: "-4.3%",
    icon: Users,
    trend: "down",
  },
];

// Mock data for charts
const revenueData = [
  { name: "T1", revenue: 45000000 },
  { name: "T2", revenue: 52000000 },
  { name: "T3", revenue: 48000000 },
  { name: "T4", revenue: 61000000 },
  { name: "T5", revenue: 55000000 },
  { name: "T6", revenue: 67000000 },
  { name: "T7", revenue: 72000000 },
  { name: "T8", revenue: 78000000 },
  { name: "T9", revenue: 69000000 },
  { name: "T10", revenue: 85000000 },
  { name: "T11", revenue: 96000000 },
  { name: "T12", revenue: 120500000 },
];

const categoryData = [
  { name: "Điện thoại", value: 35 },
  { name: "Laptop", value: 25 },
  { name: "Máy tính bảng", value: 15 },
  { name: "Phụ kiện", value: 20 },
  { name: "Khác", value: 5 },
];

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    status: "Hoàn thành",
    total: "5.500.000 VND",
    date: "15/05/2025",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    status: "Đang xử lý",
    total: "3.200.000 VND",
    date: "15/05/2025",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    status: "Đang giao hàng",
    total: "8.900.000 VND",
    date: "14/05/2025",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    status: "Hoàn thành",
    total: "2.100.000 VND",
    date: "13/05/2025",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    status: "Đã hủy",
    total: "6.400.000 VND",
    date: "12/05/2025",
  },
];

// Format number to Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const Dashboard = () => {
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
        {stats.map((stat, index) => (
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
                <XAxis dataKey="name" />
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
          <CardHeader>
            <CardTitle>Sản phẩm theo danh mục</CardTitle>
            <CardDescription>
              Phân bố sản phẩm theo danh mục (%)
            </CardDescription>
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
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
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
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
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
                  <TableCell className="text-right">{order.total}</TableCell>
                  <TableCell>{order.date}</TableCell>
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
