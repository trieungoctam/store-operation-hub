import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/lib/auth";

const formSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Ensure both username and password are present
      if (!data.username || !data.password) {
        throw new Error("Tên đăng nhập và mật khẩu là bắt buộc");
      }

      // First, get the token
      const response = await authService.login({
        username: data.username,
        password: data.password
      });

      // Store the token
      localStorage.setItem("token", response.access_token);

      try {
        // Then, fetch user information with the token
        const userInfo = await authService.getUserInfo();

        // Store user data
        localStorage.setItem("user", JSON.stringify(userInfo));

        toast.success("Đăng nhập thành công");
        navigate("/dashboard");
      } catch (userError) {
        console.error("Failed to fetch user data:", userError);
        // Even if we can't get user data, we can still navigate to dashboard
        // since we have the authentication token
        toast.success("Đăng nhập thành công");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đăng nhập không thành công");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-center">
            Đăng nhập để quản lý hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ECommerce Admin. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
