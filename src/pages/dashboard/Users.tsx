import { useState, useEffect } from "react";
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
import { statsService, User as UserType } from "@/lib/statsService";

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

const getStatusBadge = (isActive: boolean) => {
  return isActive
    ? <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    : <Badge variant="outline" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
};

const UsersPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await statsService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());

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

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Đang tải...
                  </span>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu người dùng...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Tên</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Tên đăng nhập</th>
                      <th className="px-4 py-3 text-left font-medium">Số điện thoại</th>
                      <th className="px-4 py-3 text-left font-medium">Ngày đăng ký</th>
                      <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                        <td className="px-4 py-3">{user.id}</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/dashboard/users/${user.id}`}
                            className="hover:underline font-medium text-primary flex items-center gap-2"
                          >
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-500" />
                              </div>
                            )}
                            {user.full_name || user.username}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.username}</td>
                        <td className="px-4 py-3">{user.phone_number || "-"}</td>
                        <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3">{getStatusBadge(user.is_active)}</td>
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
            )}

            {/* Pagination */}
            {!loading && currentUsers.length > 0 && (
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
