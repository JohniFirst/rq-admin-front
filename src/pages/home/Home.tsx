import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <header className="w-full text-right p-5 bg-blue-400">
        <Link className="text-slate-50" to="/login">登录</Link>
      </header>
      <p>这里是主页，对项目进行介绍</p>
      {/* TDOD 在页面路由添加对应的跳转连接 */}
      <a href="vscode://file/D:\test\REACT_ABOUT\vite-react-antd\src\pages\login\login.tsx">使用vscode定位源码</a>
    </>
  );
}

export default Home;
