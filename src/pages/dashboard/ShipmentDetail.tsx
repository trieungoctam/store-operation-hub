
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock shipment data
const mockShipment = {
  id: "S1002",
  orderId: "O10046",
  status: "shipped",
  carrier: "FedEx",
  trackingNumber: "FDX5896523144",
  estimatedDeliveryDate: "2025-05-18",
  shippingCost: 15.50,
  createdAt: "2025-05-09",
  customerName: "Nguyen Van A",
  customerEmail: "nguyenvana@example.com",
  customerPhone: "+84 123 456 789",
  shippingAddress: "123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam",
  items: [
    {
      id: 1,
      productName: "Smartphone XYZ",
      quantity: 1,
      price: 799.99
    },
    {
      id: 2,
      productName: "Wireless Earbuds",
      quantity: 2,
      price: 59.99
    }
  ],
  trackingEvents: [
    {
      date: "2025-05-09T14:30:00",
      status: "Order Processed",
      location: "Ho Chi Minh City, Vietnam",
      description: "Package has been processed and is ready for shipment"
    },
    {
      date: "2025-05-10T09:15:00",
      status: "Package Picked Up",
      location: "Ho Chi Minh City, Vietnam",
      description: "Package has been picked up by carrier"
    },
    {
      date: "2025-05-12T16:45:00",
      status: "In Transit",
      location: "Hanoi, Vietnam",
      description: "Package is in transit to the next facility"
    }
  ]
};

// Status badge component for shipments
const StatusBadge = ({ status }: { status: string }) => {
  const variant = status === "delivered" ? "success" : 
                  status === "shipped" ? "default" : 
                  status === "returned" ? "destructive" : "warning";

  return <Badge variant={variant as any}>{status}</Badge>;
};

const ShipmentDetailPage = () => {
  const { id } = useParams();
  const [shipment] = useState(mockShipment);
  const [currentStatus, setCurrentStatus] = useState(shipment.status);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    // In a real application, you would call an API to update the status
    console.log(`Updated shipment ${id} status to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Chi tiết vận chuyển #{id}</h1>
          <p className="text-gray-500">Đơn hàng: {shipment.orderId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/shipments">Quay lại</Link>
          </Button>
          <Button asChild>
            <Link to={`/dashboard/shipments/${id}/edit`}>Chỉnh sửa</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin vận chuyển</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID Vận chuyển</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ID Đơn hàng</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.orderId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Đơn vị vận chuyển</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.carrier}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.trackingNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày giao dự kiến</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.estimatedDeliveryDate}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Chi phí vận chuyển</dt>
                <dd className="mt-1 text-sm text-gray-900">${shipment.shippingCost.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1">
                  <div className="flex gap-2 items-center">
                    <StatusBadge status={currentStatus} />
                    <Select
                      value={currentStatus}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Cập nhật trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="shipped">Đang vận chuyển</SelectItem>
                          <SelectItem value="delivered">Đã giao hàng</SelectItem>
                          <SelectItem value="returned">Đã hoàn trả</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.customerPhone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Địa chỉ giao hàng</dt>
                <dd className="mt-1 text-sm text-gray-900">{shipment.shippingAddress}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
          <CardDescription>Danh sách sản phẩm đang được vận chuyển</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipment.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quá trình vận chuyển</CardTitle>
          <CardDescription>Lịch sử trạng thái vận chuyển</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {shipment.trackingEvents.map((event, index) => {
              const date = new Date(event.date);
              const formattedDate = date.toLocaleDateString("vi-VN");
              const formattedTime = date.toLocaleTimeString("vi-VN");
              
              return (
                <div key={index} className="mb-6 flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    {index < shipment.trackingEvents.length - 1 && (
                      <div className="h-full w-0.5 bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="font-medium">{event.status}</div>
                      <div className="text-sm text-gray-500">
                        {formattedDate} - {formattedTime}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {event.location}
                    </div>
                    <div className="text-sm mt-1">
                      {event.description}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Button variant="outline" className="mt-4 w-full">
              Thêm cập nhật mới
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentDetailPage;
