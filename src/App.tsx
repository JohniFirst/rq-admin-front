import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { useCustomRoutes } from "./routes";
import { createBrowserRouter } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { useJumpToVscodeSource } from "@/hooks/useJumpToVscodeSource";

function App() {
  const localTheme = useAppSelector((state) => state.systemInfo.theme);
  const { routes } = useCustomRoutes();

  const router = createBrowserRouter(routes);

  useJumpToVscodeSource();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          localTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#FF4500",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
