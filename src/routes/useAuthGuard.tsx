import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

/**
 * 自定义钩子用于实现路由守卫
 */
export function useAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  // 模拟异步检查认证状态
  const checkAuthentication = async () => {
    // 你的逻辑来判断用户是否已认证
    const isAuthenticated = true;
    setIsAuthenticated(isAuthenticated);
  };

  if (isAuthenticated === null) {
    // 认证状态尚未确定，可以显示加载指示器
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // 用户未认证，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  // 用户已认证，返回null表示继续渲染当前路由
  return null;
}
