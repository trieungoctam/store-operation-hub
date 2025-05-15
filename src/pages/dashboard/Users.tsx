
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock users data
const mockUsers = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
  created_at: new Date(2025, 0, 1 + i).toISOString(),
  status: i % 5 === 0 ? "inactive" : "active",
  orders_count: Math.floor(Math.random() * 10),
  total_spent: Math.floor(Math.random() * 50000000),
}));

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Format date helper
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success">Hoạt động</Badge>;
    case "inactive":
      return <Badge variant="outline">Không hoạt động</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const navigate = useNavigate();

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground">
          Xem và quản lý người dùng trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý thông tin của người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Tên</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Số điện thoại</th>
                    <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-medium">Đơn hàng</th>
                    <th className="px-4 py-3 text-right font-medium">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/dashboard/users/${user.id}`}
                          className="hover:underline font-medium text-primary"
                        >
                          {user.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.phone}</td>
                      <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-3 text-right">{user.orders_count}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(user.total_spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {currentUsers.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {currentUsers.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} 
                  trong số {filteredUsers.length} người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Logic for showing pagination numbers
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    if (pageToShow > totalPages) return null;

                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
