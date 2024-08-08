import { useNavigate } from "react-router-dom";

function useCustomNavigate() {
  const navigate = useNavigate();

  return (path: string) => {
    if (path !== window.location.pathname) {
      navigate(path);
    }
  };
}

export default useCustomNavigate;
