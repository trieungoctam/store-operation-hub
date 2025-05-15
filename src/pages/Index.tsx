
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, ShieldCheck, BarChart, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Admin System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Quản lý hệ thống <span className="text-primary">hiệu quả</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Trung tâm quản trị toàn diện giúp bạn kiểm soát sản phẩm, đơn hàng và người dùng một cách dễ dàng.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="group">
              <Link to="/dashboard">
                Truy cập Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative rounded-xl bg-white dark:bg-gray-800 shadow-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Dashboard Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
            
            <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Dashboard hiện đại</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Truy cập nhanh vào tất cả dữ liệu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý sản phẩm</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thêm, sửa, xóa và theo dõi tình trạng kho sản phẩm một cách dễ dàng.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thống kê báo cáo</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Theo dõi doanh số, xu hướng và hiệu suất kinh doanh với biểu đồ trực quan.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý đơn hàng</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Xử lý đơn hàng và theo dõi trạng thái giao hàng đến khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 flex items-center">
              <ShieldCheck className="h-6 w-6 text-primary mr-2" />
              <span className="font-medium">Admin System</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Admin System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
