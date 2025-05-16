import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Truck, Package, Calendar, MapPin, DollarSign, Info } from "lucide-react";
import shippingService, { ShippingOrder } from "@/lib/shippingService";

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

// Function to get a tracking URL based on provider and tracking number
const getTrackingUrl = (providerName: string, trackingNumber: string): string => {
  // Default tracking URL in case provider is not found
  let trackingUrl = `https://track-global.com?number=${trackingNumber}`;

  const providers = {
    "Giao Hàng Nhanh": "https://ghn.vn/tracking?code=",
    "Giao Hàng Tiết Kiệm": "https://ghtk.vn/tracking?code=",
    "Viettel Post": "https://viettelpost.com.vn/tracking?code=",
    "J&T Express": "https://jtexpress.vn/tracking?code=",
    "Vietnam Post": "https://www.vnpost.vn/tracking?code="
  };

  // @ts-ignore - Ignoring TypeScript error for providers indexing
  if (providers[providerName]) {
    // @ts-ignore
    trackingUrl = providers[providerName] + trackingNumber;
  }

  return trackingUrl;
};

const ShipmentDetail = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState<ShippingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);
        // Get all shipments and find the one that matches the id
        const shipments = await shippingService.getShippingOrders();
        const foundShipment = shipments.find(s => s.id.toString() === id);

        if (foundShipment) {
          setShipment(foundShipment);
        } else {
          setError("Không tìm thấy thông tin vận chuyển");
        }
      } catch (error) {
        console.error("Failed to fetch shipment details:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShipmentDetails();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <p>Đang tải thông tin vận chuyển...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard/shipments">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Link>
          </Button>
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">{error || "Không tìm thấy thông tin vận chuyển"}</h2>
            <p className="mb-4">ID vận chuyển: {id}</p>
            <Button asChild>
              <Link to="/dashboard/shipments">Xem tất cả đơn vận chuyển</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const trackingUrl = getTrackingUrl(shipment.provider_name, shipment.tracking_number);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link to="/dashboard/shipments">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết vận chuyển #{shipment.id}</h1>
          <p className="text-gray-500 mb-2">Đơn hàng #{shipment.order_id}</p>
          <StatusBadge status={shipment.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
              Theo dõi đơn hàng
            </a>
          </Button>
          <Button asChild>
            <Link to={`/dashboard/shipments/${id}/edit`}>
              Cập nhật
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Thông tin chi tiết</TabsTrigger>
              <TabsTrigger value="timeline">Lịch sử vận chuyển</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Thông tin vận chuyển</h3>

                      <div className="space-y-4">
                        <div className="flex">
                          <div className="w-10">
                            <Truck className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Đơn vị vận chuyển</div>
                            <div className="font-medium">{shipment.provider_name}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Tracking Number</div>
                            <div className="font-medium">{shipment.tracking_number}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Ngày tạo</div>
                            <div className="font-medium">{formatDate(shipment.created_at)}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Dự kiến giao hàng</div>
                            <div className="font-medium">{formatDate(shipment.estimated_delivery)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>

                      <div className="space-y-4">
                        <div className="flex">
                          <div className="w-10">
                            <Info className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Khách hàng</div>
                            <div className="font-medium">{shipment.customer_name}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Địa chỉ giao hàng</div>
                            <div className="font-medium">{shipment.shipping_address}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Chi phí vận chuyển</div>
                            <div className="font-medium">{formatCurrency(shipment.cost)}</div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="w-10">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Trọng lượng</div>
                            <div className="font-medium">{shipment.weight} kg</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Fake timeline events based on status */}
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="rounded-full bg-green-500 p-2">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-full w-px bg-gray-200 mt-2"></div>
                      </div>
                      <div>
                        <div className="font-semibold">Đơn hàng đã được tạo</div>
                        <div className="text-sm text-gray-500">{formatDate(shipment.created_at)}</div>
                        <div className="mt-1 text-sm">Đơn hàng #{shipment.order_id} đã được tạo và đang chờ xử lý.</div>
                      </div>
                    </div>

                    {(shipment.status !== 'pending') && (
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full bg-blue-500 p-2">
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <div className="h-full w-px bg-gray-200 mt-2"></div>
                        </div>
                        <div>
                          <div className="font-semibold">Đơn hàng đang được xử lý</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(new Date(new Date(shipment.created_at).getTime() + 86400000).toISOString())}
                          </div>
                          <div className="mt-1 text-sm">Đơn hàng đã được xác nhận và đang được chuẩn bị.</div>
                        </div>
                      </div>
                    )}

                    {(['in_transit', 'delivered', 'returned'].includes(shipment.status)) && (
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full bg-blue-600 p-2">
                            <Truck className="h-4 w-4 text-white" />
                          </div>
                          <div className="h-full w-px bg-gray-200 mt-2"></div>
                        </div>
                        <div>
                          <div className="font-semibold">Đơn hàng đang vận chuyển</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(new Date(new Date(shipment.created_at).getTime() + 172800000).toISOString())}
                          </div>
                          <div className="mt-1 text-sm">Đơn hàng đã được giao cho đơn vị vận chuyển {shipment.provider_name}.</div>
                        </div>
                      </div>
                    )}

                    {(shipment.status === 'delivered') && (
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full bg-green-600 p-2">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Đơn hàng đã giao thành công</div>
                          <div className="text-sm text-gray-500">{formatDate(shipment.estimated_delivery)}</div>
                          <div className="mt-1 text-sm">Đơn hàng đã được giao thành công đến {shipment.customer_name}.</div>
                        </div>
                      </div>
                    )}

                    {(shipment.status === 'returned') && (
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full bg-red-600 p-2">
                            <ArrowLeft className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Đơn hàng đã hoàn trả</div>
                          <div className="text-sm text-gray-500">{formatDate(shipment.estimated_delivery)}</div>
                          <div className="mt-1 text-sm">Đơn hàng không giao được và đã được hoàn trả về kho.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tóm tắt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Vận chuyển:</span>
                  <span className="font-medium">{shipment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Đơn hàng:</span>
                  <span className="font-medium">{shipment.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Khách hàng:</span>
                  <span className="font-medium">{shipment.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Đơn vị vận chuyển:</span>
                  <span className="font-medium">{shipment.provider_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạo ngày:</span>
                  <span className="font-medium">{formatDate(shipment.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dự kiến giao:</span>
                  <span className="font-medium">{formatDate(shipment.estimated_delivery)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chi phí:</span>
                  <span className="font-medium">{formatCurrency(shipment.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Khoảng cách:</span>
                  <span className="font-medium">{shipment.distance} km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
