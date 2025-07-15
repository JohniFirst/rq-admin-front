import AnchorNav from '@/components/anchor-nav/anchor-nav'
import { useHeadings } from '@/components/anchor-nav/use-headings'

function AnchorNavDemo() {
  // 自动提取页面中的标题
  const headings = useHeadings('.content-area')

  return (
    <div className="flex min-h-screen">
      {/* 侧边导航 */}
      <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">目录导航</h3>
        <AnchorNav
          headings={headings}
          className="sticky top-4"
          activeClassName="text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20"
        />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-8 content-area">
        <h1 className="text-3xl font-bold mb-8">文档标题</h1>

        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-4">第一章 介绍</h1>
          <p className="mb-4">这是第一章的内容...</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1.1 背景</h2>
            <p className="mb-4">背景介绍内容...</p>
            <p className="mb-4">更多背景信息...</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1.2 目标</h2>
            <p className="mb-4">目标描述内容...</p>
            <p className="mb-4">具体目标列表...</p>
          </section>
        </section>

        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-4">第二章 技术实现</h1>
          <p className="mb-4">技术实现概述...</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2.1 前端技术</h2>
            <p className="mb-4">前端技术栈介绍...</p>

            <section className="mb-4">
              <h3 className="text-lg font-medium mb-2">2.1.1 React</h3>
              <p className="mb-4">React 框架介绍...</p>
              <p className="mb-4">React 的优势和特点...</p>
            </section>

            <section className="mb-4">
              <h3 className="text-lg font-medium mb-2">2.1.2 TypeScript</h3>
              <p className="mb-4">TypeScript 介绍...</p>
              <p className="mb-4">TypeScript 的类型系统...</p>
            </section>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2.2 后端技术</h2>
            <p className="mb-4">后端技术栈介绍...</p>
            <p className="mb-4">数据库设计...</p>
          </section>
        </section>

        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-4">第三章 总结</h1>
          <p className="mb-4">项目总结内容...</p>
          <p className="mb-4">未来展望...</p>
        </section>
      </div>
    </div>
  )
}

export default AnchorNavDemo
