import useCustomNavigate from '@/hooks/useCustomNavigate'
import home from './css/home.module.css'

function Home() {
  const navigate = useCustomNavigate()

  return (
    <>
      <header className="w-full text-right p-5 bg-blue-400">
        <span
          className="text-slate-50 login-view-transitoin cursor-pointer"
          onClick={() => navigate('/login', false)}
        >
          登录
        </span>
      </header>

      <main className="m-4">
        <p className={home.introTitle}>功能特点</p>
        <ul className="ml-4">
          <li>1、快速定位源码，【ctrl + 鼠标左键】，直接跳转vscode源码</li>
          <li>2、灵活的布局切换，支持垂直布局和水平布局</li>
          <li>3、使用原生canvas实现的图片拼接</li>
          <li>4、原生的视频播放器</li>
          <li>5、利用原生canvas实现的弹幕效果</li>
          <li>6、应用内菜单历史记录、支持拖拽排序</li>
          <li>7、深浅色模式切换</li>
          <li>8、导航菜单快速查询、支持快捷键【ctrl + m】呼出</li>
          <li>9、轻量级的表格展示组件，支持查询、分页、excel导出</li>
          <li>10、使用eslint对代码质量进行检查</li>
          <li>11、使用prettier进行代码格式化</li>
          <li>12、使用typescript，增强代码健壮性</li>
          <li>
            13、增加git提交钩子，提交到git仓库的代码进行质量管理，对提交信息进行规范
          </li>
          <li>14、实现了共享元素动画</li>
        </ul>

        <p className={home.introTitle}>hooks一览</p>
        <ul className="ml-4">
          <li>——useCopyToClipboard 零依赖的复制到剪切板</li>
          <li>——useCustomNavigate 避免重复导航的自定义路由</li>
          <li>——useFullScreen 零依赖的全屏hooks</li>
          <li>——useInViewport 判断元素是否进入视口</li>
          <li>——useJumpToVscodeSource 跳转vscode源码位置</li>
          <li>——useMouse 获取鼠标位置</li>
        </ul>

        <p className={home.introTitle}>TODO</p>
        <ul className="ml-4">
          <li>1、动态路由</li>
          <li>2、动态菜单，并且完善菜单的导航方式</li>
          <li>3、完善动画组件</li>
          <li>4、实现pdf编辑组件，向pdf内部新增图片</li>
          <li>5、更灵活的图片裁剪组件，支持放大，缩小，所见即所得</li>
          <li>6、表格组件增加pdf导出功能、增加打印功能</li>
          <li>7、路由切换增加动画，其余界面增加动画</li>
          <li>8、实现文件上传组件、支持多文件上传、支持拖拽</li>
          <li>9、实现浏览器端的文件选择</li>
          <li>10、添加后台接口</li>
        </ul>
      </main>
    </>
  )
}

export default Home
