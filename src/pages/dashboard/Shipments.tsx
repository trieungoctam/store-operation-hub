
import { useState } from "react";
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

// Mock data for shipments
const shipments = [
  {
    id: "S1001",
    orderId: "O10045",
    status: "pending",
    carrier: "DHL Express",
    trackingNumber: "DHL4851254125",
    estimatedDeliveryDate: "2025-05-20",
    shippingCost: 12.99,
    createdAt: "2025-05-10",
  },
  {
    id: "S1002",
    orderId: "O10046",
    status: "shipped",
    carrier: "FedEx",
    trackingNumber: "FDX5896523144",
    estimatedDeliveryDate: "2025-05-18",
    shippingCost: 15.50,
    createdAt: "2025-05-09",
  },
  {
    id: "S1003",
    orderId: "O10047",
    status: "delivered",
    carrier: "UPS",
    trackingNumber: "UPS9874563210",
    estimatedDeliveryDate: "2025-05-12",
    actualDeliveryDate: "2025-05-11",
    shippingCost: 10.75,
    createdAt: "2025-05-07",
  },
  {
    id: "S1004",
    orderId: "O10048",
    status: "returned",
    carrier: "USPS",
    trackingNumber: "USPS3214569870",
    estimatedDeliveryDate: "2025-05-15",
    shippingCost: 8.99,
    createdAt: "2025-05-08",
  },
  {
    id: "S1005",
    orderId: "O10049",
    status: "pending",
    carrier: "DHL Express",
    trackingNumber: "DHL7896541230",
    estimatedDeliveryDate: "2025-05-22",
    shippingCost: 14.25,
    createdAt: "2025-05-12",
  },
];

// Status badge component for shipments
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    returned: "bg-red-100 text-red-800",
  };

  const variant = status === "delivered" ? "success" : 
                  status === "shipped" ? "default" : 
                  status === "returned" ? "destructive" : "warning";

  return <Badge variant={variant as any}>{status}</Badge>;
};

const ShipmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      searchTerm === "" ||
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vận chuyển</h1>
        <p className="text-gray-500">Quản lý thông tin vận chuyển</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Lọc và tìm kiếm thông tin vận chuyển</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo Mã đơn, Tracking number..."
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
                    <SelectItem value="shipped">Đang vận chuyển</SelectItem>
                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Đơn vị vận chuyển</TableHead>
                <TableHead>Tracking number</TableHead>
                <TableHead>Ngày dự kiến</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Chi phí</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.orderId}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>{shipment.trackingNumber}</TableCell>
                  <TableCell>{shipment.estimatedDeliveryDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={shipment.status} />
                  </TableCell>
                  <TableCell>${shipment.shippingCost.toFixed(2)}</TableCell>
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

          <div className="p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsPage;
