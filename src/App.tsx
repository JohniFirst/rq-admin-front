import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ConfigProvider, theme } from "antd";
import { port2 } from "@/utils/globalMessageChannel";
import { forage } from "./utils/localforage";
import { ForageEnums } from "./enums/localforage";
import { useCustomRoutes } from "./routes";
import { createBrowserRouter } from "react-router-dom";

function App() {
  const [isDark, setIsDark] = useState(false);
  const { routes } = useCustomRoutes();

  const router = createBrowserRouter(routes);

  forage.getItem(ForageEnums.THEME).then((value) => {
    if (value === "dark") {
      setIsDark(true);
    }
  });

  port2.onmessage = () => {
    setIsDark(!isDark);
  };

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#FF4500",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
