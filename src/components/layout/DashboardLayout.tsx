
import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { 
  Users, Package, ShoppingCart, Truck, LayoutDashboard, 
  LogOut, Menu, X, Bell, Search, Sun, Moon 
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Sản phẩm", path: "/dashboard/products", icon: Package },
    { name: "Đơn hàng", path: "/dashboard/orders", icon: ShoppingCart },
    { name: "Vận chuyển", path: "/dashboard/shipments", icon: Truck },
    { name: "Người dùng", path: "/dashboard/users", icon: Users },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-sidebar transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center">
              {isSidebarOpen ? (
                <span className="text-lg font-semibold text-sidebar-foreground">
                  Admin Dashboard
                </span>
              ) : (
                <span className="text-xl font-bold text-sidebar-foreground">AD</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          <nav className="space-y-1 px-2 py-4 flex-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
              >
                <link.icon className="h-5 w-5 mr-3" />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            ))}
          </nav>
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              {isSidebarOpen && <span>Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center flex-1">
              <div className="max-w-md w-full lg:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="py-2 px-4 text-sm">
                    Không có thông báo mới
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Sáng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Tối
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    Hệ thống
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="h-6" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    {isSidebarOpen && (
                      <span className="ml-2 text-sm font-medium">
                        {user?.name || "Admin"}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Thông tin cá nhân</DropdownMenuItem>
                  <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
