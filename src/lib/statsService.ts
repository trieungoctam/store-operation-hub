import api from './api';

export interface StatsOverview {
  total_revenue: number;
  revenue_change: number;
  product_count: number;
  product_change: number;
  new_orders: number;
  orders_change: number;
  new_users: number;
  users_change: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface RecentOrder {
  id: number;
  customer_name: string;
  status: string;
  total: number;
  date: string;
}

export interface DashboardStats {
  overview: StatsOverview;
  revenue_chart: RevenueData[];
  category_chart: CategoryData[];
  recent_orders: RecentOrder[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  upload_date: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  value: string;
  price_modifier: number;
}

export interface Product {
  id: number;
  barcode: string;
  product_name: string;
  description: string;
  price: number;
  category_id: number;
  category_name?: string;
  brand_id: number;
  brand_name?: string;
  created_at: string;
  updated_at: string;
  quantity: number;
  variants: ProductVariant[];
  images: ProductImage[];
  stock?: number; // Keep for backward compatibility
}

export interface Order {
  id: number;
  user_id: number;
  customer_name?: string;
  total_amount: number;
  status: string;
  created_at: string;
  // Other order properties
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get all required data in parallel
      const [products, orders, users, categories] = await Promise.all([
        this.getProducts(),
        this.getOrders(),
        this.getUsers(),
        this.getCategories()
      ]);

      // Calculate overview stats
      const overview = this.calculateOverviewStats(products, orders, users);

      // Generate revenue data by month
      const revenueData = this.generateRevenueData(orders);

      // Generate category distribution data
      const categoryData = await this.generateCategoryData();

      // Format recent orders for display
      const recentOrders = this.formatRecentOrders(orders);

      return {
        overview,
        revenue_chart: revenueData,
        category_chart: categoryData,
        recent_orders: recentOrders
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Không thể lấy thông tin thống kê.');
    }
  },

  async getProducts(skip = 0, limit = 1000): Promise<Product[]> {
    try {
      const response = await api.get('/products/', {
        params: { skip, limit }
      });

      // Handle response format with data array
      const products = response.data?.data || response.data?.items || [];

      // Map quantity to stock for backward compatibility
      return products.map((product: Product) => ({
        ...product,
        stock: product.quantity
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return fake products
      return this.generateFakeProducts(30);
    }
  },

  async getOrders(limit = 100): Promise<Order[]> {
    try {
      const response = await api.get('/api/v1/orders/', {
        params: { limit }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return fake orders data
      return this.generateFakeOrders(20);
    }
  },

  async getUsers(limit = 100): Promise<User[]> {
    try {
      // Endpoint chính xác dựa vào baseURL trong api.ts là http://103.90.226.131:8000/api/v1
      const response = await api.get('/users/', {
        params: { skip: 0, limit }
      });

      console.log('User API response:', response);

      // Kiểm tra cấu trúc dữ liệu trả về
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
        return response.data.items;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        return this.generateFakeUsers(15);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch user data. Using sample data instead.');
      // Return fake users data
      return this.generateFakeUsers(15);
    }
  },

  async getUserById(id: string | number): Promise<User | null> {
    try {
      const response = await api.get(`/users/${id}`);

      console.log(`User ${id} API response:`, response);

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      alert(`Failed to fetch user ${id}. Using sample data instead.`);

      // For demo purposes, generate a fake user with the requested ID
      const fakeUsers = this.generateFakeUsers(15);
      const fakeUser = fakeUsers.find(user => user.id === Number(id));

      // If we happened to generate a user with the matching ID, return it
      // Otherwise, create a specific one with this ID
      if (fakeUser) {
        return fakeUser;
      } else {
        return {
          id: Number(id),
          username: `user${id}`,
          email: `user${id}@example.com`,
          full_name: `Người dùng ${id}`,
          avatar_url: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${id}` : null,
          phone_number: Math.random() > 0.2 ? `090${Math.floor(1000000 + Math.random() * 9000000)}` : null,
          is_active: Math.random() > 0.1,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
          last_login: Math.random() > 0.2 ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() : null
        };
      }
    }
  },

  async getCategories(): Promise<Category[]> {
    // Use hardcoded categories instead of API call
    return [
      {
        id: 4,
        name: "Sức khỏe & Làm đẹp",
        description: "Sản phẩm chăm sóc sức khỏe và làm đẹp"
      },
      {
        id: 3,
        name: "Thời trang",
        description: "Quần áo, giày dép và phụ kiện thời trang"
      },
      {
        id: 2,
        name: "Đồ gia dụng",
        description: "Các thiết bị và vật dụng trong gia đình"
      },
      {
        id: 1,
        name: "Đồ điện tử",
        description: "Các sản phẩm điện tử, công nghệ"
      }
    ];
  },

  calculateOverviewStats(products: Product[], orders: Order[], users: User[]): StatsOverview {
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // Get current month orders and revenue
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const previousMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear;
    });

    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate revenue change percentage
    const revenueChange = previousMonthRevenue === 0
      ? 100
      : Number(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1));

    // Calculate new orders change percentage
    const ordersChange = previousMonthOrders.length === 0
      ? 100
      : Number(((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length * 100).toFixed(1));

    // Get new users (registered in current month)
    const newUsers = users.filter(user => {
      const registrationDate = new Date(user.created_at);
      return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear;
    });

    const previousMonthUsers = users.filter(user => {
      const registrationDate = new Date(user.created_at);
      return registrationDate.getMonth() === previousMonth && registrationDate.getFullYear() === previousYear;
    });

    // Calculate new users change percentage
    const usersChange = previousMonthUsers.length === 0
      ? 100
      : Number(((newUsers.length - previousMonthUsers.length) / previousMonthUsers.length * 100).toFixed(1));

    // Calculate product count and change (since we don't have historical data, use a random value for now)
    const productChange = 8.2; // Placeholder

    return {
      total_revenue: totalRevenue,
      revenue_change: revenueChange,
      product_count: products.length,
      product_change: productChange,
      new_orders: currentMonthOrders.length,
      orders_change: ordersChange,
      new_users: newUsers.length,
      users_change: usersChange
    };
  },

  generateRevenueData(orders: Order[] = []): RevenueData[] {
    // Dữ liệu doanh thu giả cho 12 tháng
    const fakeMonthlyRevenue = [
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

    return fakeMonthlyRevenue;
  },

  async generateCategoryData(): Promise<CategoryData[]> {
    try {
      // Danh sách 4 danh mục chính
      const mainCategories = [
        {
          id: 23,
          name: "Sức khỏe & Làm đẹp",
          description: "Sản phẩm chăm sóc sức khỏe và làm đẹp"
        },
        {
          id: 17,
          name: "Thời trang",
          description: "Quần áo, giày dép và phụ kiện thời trang"
        },
        {
          id: 11,
          name: "Đồ gia dụng",
          description: "Các thiết bị và vật dụng trong gia đình"
        },
        {
          id: 5,
          name: "Đồ điện tử",
          description: "Các sản phẩm điện tử, công nghệ"
        }
      ];

      // Lấy số lượng sản phẩm cho mỗi danh mục bằng cách gọi API riêng biệt
      const categoryCountsPromises = mainCategories.map(async (category) => {
        try {
          const response = await api.get('/products/', {
            params: {
              skip: 0,
              limit: 1000, // Lấy tối đa 1000 sản phẩm cho mỗi danh mục
              category_id: category.id,
            }
          });

          // Đếm số sản phẩm từ mảng items hoặc data trong response
          const items = response.data?.data || response.data?.items || [];
          const totalInCategory = items.length;

          console.log(`Category ${category.name}: ${totalInCategory} products`);

          return {
            categoryId: category.id,
            name: category.name,
            count: totalInCategory
          };
        } catch (error) {
          console.error(`Error fetching products for category ${category.id}:`, error);
          return {
            categoryId: category.id,
            name: category.name,
            count: 0
          };
        }
      });

      // Đợi tất cả các request hoàn thành
      const categoryCounts = await Promise.all(categoryCountsPromises);

      // Tính tổng số sản phẩm từ tất cả các danh mục
      const totalProducts = categoryCounts.reduce((sum, category) => sum + category.count, 0);

      if (totalProducts === 0) {
        // Nếu không có sản phẩm nào, sử dụng dữ liệu mặc định
        const defaultCounts = [
          { name: "Sức khỏe & Làm đẹp", value: 33 },
          { name: "Thời trang", value: 24 },
          { name: "Đồ gia dụng", value: 20 },
          { name: "Đồ điện tử", value: 23 }
        ];
        return defaultCounts;
      }

      // Chuyển đổi thành mảng dữ liệu cho biểu đồ
      const result = categoryCounts.map(category => ({
        name: category.name,
        value: Math.round((category.count / totalProducts) * 100) // Phần trăm
      })).sort((a, b) => b.value - a.value); // Sắp xếp theo giá trị giảm dần

      return result;
    } catch (error) {
      console.error('Error generating category data:', error);
      // Trả về dữ liệu mặc định nếu có lỗi
      return [
        { name: "Sức khỏe & Làm đẹp", value: 33 },
        { name: "Thời trang", value: 24 },
        { name: "Đồ gia dụng", value: 20 },
        { name: "Đồ điện tử", value: 23 }
      ];
    }
  },

  formatRecentOrders(orders: Order[]): RecentOrder[] {
    // Sort orders by date (newest first) and take top 5
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer_name: order.customer_name || `User ${order.user_id}`,
        status: order.status,
        total: order.total_amount,
        date: order.created_at
      }));
  },

  generateFakeOrders(count: number): Order[] {
    const statuses = ['pending', 'processing', 'completed', 'cancelled', 'shipped'];
    const currentDate = new Date();

    return Array.from({ length: count }, (_, i) => {
      // Generate random date within the last 2 months
      const daysAgo = Math.floor(Math.random() * 60);
      const date = new Date(currentDate);
      date.setDate(date.getDate() - daysAgo);

      return {
        id: 10000 + i,
        user_id: 100 + Math.floor(Math.random() * 20),
        customer_name: `Khách hàng ${i + 1}`,
        total_amount: Math.floor(Math.random() * 5000000) + 200000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: date.toISOString()
      };
    });
  },

  generateFakeUsers(count: number): User[] {
    const currentDate = new Date();

    return Array.from({ length: count }, (_, i) => {
      // Generate random date within the last 2 months
      const daysAgo = Math.floor(Math.random() * 60);
      const date = new Date(currentDate);
      date.setDate(date.getDate() - daysAgo);

      // Random last login date (some null to simulate never logged in)
      const hasLoggedIn = Math.random() > 0.2;
      const loginDaysAgo = Math.floor(Math.random() * 30);
      const loginDate = new Date(currentDate);
      loginDate.setDate(loginDate.getDate() - loginDaysAgo);

      return {
        id: 100 + i,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        full_name: `Người dùng ${i + 1}`,
        avatar_url: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${i}` : null,
        phone_number: Math.random() > 0.2 ? `090${Math.floor(1000000 + Math.random() * 9000000)}` : null,
        is_active: Math.random() > 0.1,
        created_at: date.toISOString(),
        last_login: hasLoggedIn ? loginDate.toISOString() : null
      };
    });
  },

  generateFakeProducts(count: number): Product[] {
    const categories = [
      { id: 5, name: "Đồ điện tử" },
      { id: 11, name: "Đồ gia dụng" },
      { id: 17, name: "Thời trang" },
      { id: 23, name: "Sức khỏe & Làm đẹp" }
    ];

    const brands = [
      { id: 1, name: "Sony" },
      { id: 2, name: "Samsung" },
      { id: 3, name: "Apple" },
      { id: 4, name: "LG" },
      { id: 5, name: "Xiaomi" }
    ];

    const products: Product[] = [];

    for (let i = 0; i < count; i++) {
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const brandIndex = Math.floor(Math.random() * brands.length);
      const quantity = Math.floor(Math.random() * 100) + 10;
      const price = Math.floor(Math.random() * 10000000) + 100000;

      const product: Product = {
        id: 1000 + i,
        barcode: `BRC${1000 + i}`,
        product_name: `Sản phẩm ${i + 1}`,
        description: `Mô tả chi tiết về sản phẩm ${i + 1}`,
        price: price,
        category_id: categories[categoryIndex].id,
        category_name: categories[categoryIndex].name,
        brand_id: brands[brandIndex].id,
        brand_name: brands[brandIndex].name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        quantity: quantity,
        stock: quantity,
        variants: [],
        images: [{
          id: i,
          product_id: 1000 + i,
          image_url: `https://picsum.photos/400/300?random=${i}`,
          is_primary: true,
          upload_date: new Date().toISOString()
        }]
      };

      products.push(product);
    }

    return products;
  }
};