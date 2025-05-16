import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import shippingService, { ShippingOrder, ShippingStats } from "@/lib/shippingService";

// Status badge component for shipments
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, string> = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'in_transit': 'Đang vận chuyển',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy',
    'returned': 'Đã hoàn trả'
  };

  const variant = status === "delivered" ? "success" :
                  status === "in_transit" ? "default" :
                  status === "returned" || status === "cancelled" ? "destructive" : "warning";

  return <Badge variant={variant as any}>{statusMap[status] || status}</Badge>;
};

const ShipmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [shipments, setShipments] = useState<ShippingOrder[]>([]);
  const [stats, setStats] = useState<ShippingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, statsData] = await Promise.all([
          shippingService.getShippingOrders(),
          shippingService.getShippingStats()
        ]);
        setShipments(ordersData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch shipping data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      searchTerm === "" ||
      shipment.order_id.toString().includes(searchTerm) ||
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vận chuyển</h1>
        <p className="text-gray-500">Quản lý thông tin vận chuyển</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Tổng đơn vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_shipments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Đang vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shipments_in_transit}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Đã giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shipments_delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Thời gian giao hàng TB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.average_delivery_time} ngày</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Lọc và tìm kiếm thông tin vận chuyển</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo Mã đơn, Tracking number, Khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="in_transit">Đang vận chuyển</SelectItem>
                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="returned">Đã hoàn trả</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <Button asChild className="w-full md:w-auto">
                <Link to="/dashboard/shipments/new">Tạo vận đơn mới</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Đơn vị vận chuyển</TableHead>
                  <TableHead>Tracking number</TableHead>
                  <TableHead>Ngày giao dự kiến</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Chi phí</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.customer_name}</TableCell>
                    <TableCell>{shipment.provider_name}</TableCell>
                    <TableCell>{shipment.tracking_number}</TableCell>
                    <TableCell>{formatDate(shipment.estimated_delivery)}</TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell>{formatCurrency(shipment.cost)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/dashboard/shipments/${shipment.id}`}>
                            Chi tiết
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/dashboard/shipments/${shipment.id}/edit`}>
                            Sửa
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsPage;
