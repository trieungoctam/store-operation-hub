
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Package, ShoppingCart, Users, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const salesData = [
  { name: 'T1', sales: 4000 },
  { name: 'T2', sales: 3000 },
  { name: 'T3', sales: 5000 },
  { name: 'T4', sales: 2780 },
  { name: 'T5', sales: 1890 },
  { name: 'T6', sales: 2390 },
  { name: 'T7', sales: 3490 },
  { name: 'T8', sales: 4000 },
  { name: 'T9', sales: 4500 },
  { name: 'T10', sales: 5200 },
  { name: 'T11', sales: 6000 },
  { name: 'T12', sales: 7000 }
];

const categoryData = [
  { name: 'Điện thoại', value: 400 },
  { name: 'Laptop', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Phụ kiện', value: 100 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentOrders = [
  { id: 1, customer: 'Nguyễn Văn A', date: '15/05/2025', status: 'Đang giao hàng', amount: '2,350,000 đ' },
  { id: 2, customer: 'Trần Thị B', date: '15/05/2025', status: 'Đã thanh toán', amount: '1,750,000 đ' },
  { id: 3, customer: 'Lê Văn C', date: '14/05/2025', status: 'Đã hoàn thành', amount: '5,120,000 đ' },
  { id: 4, customer: 'Hoàng Thị D', date: '14/05/2025', status: 'Đang xử lý', amount: '850,000 đ' },
  { id: 5, customer: 'Phạm Văn E', date: '13/05/2025', status: 'Đang xử lý', amount: '3,450,000 đ' },
];

const topProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', sold: 120, revenue: '360,000,000 đ' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', sold: 95, revenue: '285,000,000 đ' },
  { id: 3, name: 'MacBook Pro 16"', sold: 75, revenue: '375,000,000 đ' },
  { id: 4, name: 'AirPods Pro 2', sold: 200, revenue: '140,000,000 đ' },
  { id: 5, name: 'iPad Pro 12.9"', sold: 65, revenue: '227,500,000 đ' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Đã hoàn thành':
      return <Badge className="bg-success">Đã hoàn thành</Badge>;
    case 'Đang giao hàng':
      return <Badge className="bg-primary">Đang giao hàng</Badge>;
    case 'Đã thanh toán':
      return <Badge className="bg-primary">Đã thanh toán</Badge>;
    case 'Đang xử lý':
      return <Badge variant="outline">Đang xử lý</Badge>;
    case 'Đã hủy':
      return <Badge className="bg-destructive">Đã hủy</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động của hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Doanh thu
                </p>
                <div className="flex items-center gap-1">
                  <h2 className="text-2xl font-bold">126,500,000 đ</h2>
                  <span className="text-xs text-success flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% so với tháng trước
                </p>
              </div>
              <div className="rounded-full p-2 bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sản phẩm
                </p>
                <div className="flex items-center gap-1">
                  <h2 className="text-2xl font-bold">1,256</h2>
                  <span className="text-xs text-success flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    8%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  120 sản phẩm mới trong tháng
                </p>
              </div>
              <div className="rounded-full p-2 bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đơn hàng
                </p>
                <div className="flex items-center gap-1">
                  <h2 className="text-2xl font-bold">450</h2>
                  <span className="text-xs text-destructive flex items-center">
                    <ArrowDownRight className="h-3 w-3" />
                    3%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  -3% so với tháng trước
                </p>
              </div>
              <div className="rounded-full p-2 bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Khách hàng
                </p>
                <div className="flex items-center gap-1">
                  <h2 className="text-2xl font-bold">2,450</h2>
                  <span className="text-xs text-success flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    10%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  +10% so với tháng trước
                </p>
              </div>
              <div className="rounded-full p-2 bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Thống kê doanh thu 12 tháng gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
            <CardDescription>
              Phân phối doanh thu theo danh mục sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              5 đơn hàng mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                    <th className="px-4 py-3 text-left font-medium">Ngày</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-medium">Giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-3">#{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3">{order.date}</td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-right">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>
              Top 5 sản phẩm bán chạy nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Sản phẩm</th>
                    <th className="px-4 py-3 text-right font-medium">Đã bán</th>
                    <th className="px-4 py-3 text-right font-medium">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3 text-right">{product.sold}</td>
                      <td className="px-4 py-3 text-right">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
