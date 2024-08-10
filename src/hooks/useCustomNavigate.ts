import { useNavigate } from "react-router-dom";

/**
 * 重写react-router-dom的useNavigate
 * 
 * 避免导航到当前的重复页面
 * 
 * 默认采用replace模式
 */
function useCustomNavigate() {
  const navigate = useNavigate();

  return (path: string) => {
    if (path !== window.location.pathname) {
      navigate(path, { replace: true });
    }
  };
}

export default useCustomNavigate;
