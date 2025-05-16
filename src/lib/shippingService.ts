import api from './api';

export interface ShippingProvider {
  id: number;
  name: string;
  logo: string;
  active: boolean;
  tracking_url: string;
  cost_per_km: number;
  base_cost: number;
}

export interface ShippingOrder {
  id: number;
  order_id: number;
  customer_name: string;
  shipping_address: string;
  provider_id: number;
  provider_name: string;
  tracking_number: string;
  status: string;
  estimated_delivery: string;
  created_at: string;
  cost: number;
  weight: number;
  distance: number;
}

export interface ShippingStats {
  total_shipments: number;
  shipments_in_transit: number;
  shipments_delivered: number;
  shipments_pending: number;
  average_delivery_time: number;
  total_shipping_cost: number;
}

export const shippingService = {
  async getShippingProviders(): Promise<ShippingProvider[]> {
    try {
      const response = await api.get('/api/v1/shipping/providers');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching shipping providers:', error);
      return this.generateFakeProviders();
    }
  },

  async getShippingOrders(limit = 50): Promise<ShippingOrder[]> {
    try {
      const response = await api.get('/api/v1/shipping/orders', {
        params: { limit }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching shipping orders:', error);
      return this.generateFakeShippingOrders(20);
    }
  },

  async getShippingStats(): Promise<ShippingStats> {
    try {
      const response = await api.get('/api/v1/shipping/stats');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching shipping stats:', error);
      return this.generateFakeShippingStats();
    }
  },

  generateFakeProviders(): ShippingProvider[] {
    return [
      {
        id: 1,
        name: "Giao Hàng Nhanh",
        logo: "https://picsum.photos/100/100?random=1",
        active: true,
        tracking_url: "https://ghn.vn/tracking?code=",
        cost_per_km: 5000,
        base_cost: 15000
      },
      {
        id: 2,
        name: "Giao Hàng Tiết Kiệm",
        logo: "https://picsum.photos/100/100?random=2",
        active: true,
        tracking_url: "https://ghtk.vn/tracking?code=",
        cost_per_km: 4000,
        base_cost: 12000
      },
      {
        id: 3,
        name: "Viettel Post",
        logo: "https://picsum.photos/100/100?random=3",
        active: true,
        tracking_url: "https://viettelpost.com.vn/tracking?code=",
        cost_per_km: 4500,
        base_cost: 13000
      },
      {
        id: 4,
        name: "J&T Express",
        logo: "https://picsum.photos/100/100?random=4",
        active: true,
        tracking_url: "https://jtexpress.vn/tracking?code=",
        cost_per_km: 5500,
        base_cost: 16000
      },
      {
        id: 5,
        name: "Vietnam Post",
        logo: "https://picsum.photos/100/100?random=5",
        active: false,
        tracking_url: "https://www.vnpost.vn/tracking?code=",
        cost_per_km: 3500,
        base_cost: 10000
      }
    ];
  },

  generateFakeShippingOrders(count: number): ShippingOrder[] {
    const providers = this.generateFakeProviders();
    const statuses = ['pending', 'processing', 'in_transit', 'delivered', 'cancelled', 'returned'];
    const currentDate = new Date();
    const cities = [
      "Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
      "Biên Hòa", "Nha Trang", "Huế", "Hạ Long", "Đà Lạt"
    ];

    return Array.from({ length: count }, (_, i) => {
      // Generate random dates
      const createdDaysAgo = Math.floor(Math.random() * 30);
      const createdDate = new Date(currentDate);
      createdDate.setDate(createdDate.getDate() - createdDaysAgo);

      const deliveryDays = Math.floor(Math.random() * 7) + 1;
      const estimatedDate = new Date(createdDate);
      estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);

      // Select random provider
      const providerIndex = Math.floor(Math.random() * providers.length);
      const provider = providers[providerIndex];

      // Generate random distance and calculate cost
      const distance = Math.floor(Math.random() * 100) + 5;
      const weight = Math.floor(Math.random() * 10) + 1;
      const cost = provider.base_cost + (distance * provider.cost_per_km);

      // Generate random city for address
      const fromCity = cities[Math.floor(Math.random() * cities.length)];
      const toCity = cities[Math.floor(Math.random() * cities.length)];

      return {
        id: 5000 + i,
        order_id: 10000 + Math.floor(Math.random() * 1000),
        customer_name: `Khách hàng ${i + 1}`,
        shipping_address: `${Math.floor(Math.random() * 100) + 1} Đường ${Math.floor(Math.random() * 50) + 1}, ${toCity}`,
        provider_id: provider.id,
        provider_name: provider.name,
        tracking_number: `TRK${100000 + Math.floor(Math.random() * 900000)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        estimated_delivery: estimatedDate.toISOString(),
        created_at: createdDate.toISOString(),
        cost: cost,
        weight: weight,
        distance: distance
      };
    });
  },

  generateFakeShippingStats(): ShippingStats {
    const shippingOrders = this.generateFakeShippingOrders(100);

    const inTransit = shippingOrders.filter(order => order.status === 'in_transit').length;
    const delivered = shippingOrders.filter(order => order.status === 'delivered').length;
    const pending = shippingOrders.filter(order => ['pending', 'processing'].includes(order.status)).length;

    const totalCost = shippingOrders.reduce((sum, order) => sum + order.cost, 0);

    // Calculate average delivery time (in days)
    let totalDeliveryDays = 0;
    let deliveredCount = 0;

    shippingOrders.forEach(order => {
      if (order.status === 'delivered') {
        const createdDate = new Date(order.created_at);
        const estimatedDate = new Date(order.estimated_delivery);
        const daysDiff = Math.floor((estimatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDeliveryDays += daysDiff;
        deliveredCount++;
      }
    });

    const averageDeliveryTime = deliveredCount > 0 ? totalDeliveryDays / deliveredCount : 0;

    return {
      total_shipments: shippingOrders.length,
      shipments_in_transit: inTransit,
      shipments_delivered: delivered,
      shipments_pending: pending,
      average_delivery_time: Number(averageDeliveryTime.toFixed(1)),
      total_shipping_cost: totalCost
    };
  }
};

export default shippingService;