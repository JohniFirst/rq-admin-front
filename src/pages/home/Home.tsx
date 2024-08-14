import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <header className="w-full text-right p-5 bg-blue-400">
        <Link className="text-slate-50" to="/login">
          登录
        </Link>
      </header>
      <p>这里是主页，对项目进行介绍</p>
      <a href="vscode://file/D:\test\REACT_ABOUT\vite-react-antd\src\pages\home\Home.tsx">
        跳转源码
      </a>
    </>
  );
}

export default Home;
