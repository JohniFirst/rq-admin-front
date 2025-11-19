import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const Header = styled.header`
  width: 100%;
  max-width: 100vw;
  padding: 20px 24px;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: var(--color-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`

const MainH1 = styled.h1`
  font-weight: 700;
  font-size: 28px;
  color: var(--theme-color);
  margin: 0;
`

const LoginButton = styled.button`
  padding: 10px 24px;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const SectionTitile = styled.h2`
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  color: var(--color-text);

  &::before {
    content: '';
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-right: 12px;
    width: 4px;
    height: 24px;
    border-radius: 2px;
  }
`

const RedLi = styled.li`
  color: #e53e3e;
  font-size: 16px;
  font-weight: 500;
`

const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  background-color: var(--color-background);
`

const ContentWrapper = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`

const AnimatedSectionWrapper = styled(motion.div)`
  margin-bottom: 60px;
  padding: 32px;
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 40px;
  }
`

const OrderedList = styled.ol`
  margin-left: 24px;
  list-style: decimal;
  color: var(--color-text-secondary);
  line-height: 1.8;

  li {
    margin-bottom: 12px;
    padding-left: 8px;

    &:hover {
      color: var(--color-text);
    }
  }
`

const UnorderedList = styled.ul`
  margin-left: 24px;
  list-style: disc;
  color: var(--color-text-secondary);
  line-height: 1.8;

  li {
    margin-bottom: 10px;
    padding-left: 8px;

    &:hover {
      color: var(--color-text);
    }
  }
`

const InterviewAnswer = styled.div`
  margin: 16px 0 24px 16px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 8px;
  border-left: 3px solid #667eea;

  p {
    margin-bottom: 10px;
    line-height: 1.7;
    color: var(--color-text-secondary);
  }
`

const InterviewQuestion = styled.li`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 12px;
  color: var(--color-text);
`

const SubTitle = styled.p`
  font-weight: 600;
  margin-top: 12px;
  color: var(--color-text) !important;
`

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <AnimatedSectionWrapper
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </AnimatedSectionWrapper>
  )
}

function Home() {
  const navigate = useCustomNavigate()

  return (
    <MainContainer>
      <Header>
        <MainH1>RQ Admin</MainH1>
        <LoginButton
          onClick={() => navigate('/login', false)}
          onKeyUp={() => navigate('/login', false)}
        >
          登录
        </LoginButton>
      </Header>

      <ContentWrapper>
        <AnimatedSection>
          <SectionTitile>功能特点</SectionTitile>
          <OrderedList>
            <RedLi>快速定位源码，【ctrl + 鼠标左键】，直接跳转vscode源码</RedLi>
            <li>灵活的布局切换，支持垂直布局和水平布局</li>
            <li>使用原生canvas实现的图片拼接</li>
            <li>原生的视频播放器</li>
            <li>利用原生canvas实现的弹幕效果</li>
            <li>应用内菜单历史记录、支持拖拽排序</li>
            <li>
              支持深浅色模式切换以及系统颜色模式的监听（eg. 系统切换到深色模式时会跟随系统颜色切换）
            </li>
            <li>导航菜单快速查询、支持快捷键【ctrl + m】呼出</li>
            <li>轻量级的表格展示组件，支持查询、分页、excel导出</li>
            <li>使用typescript，增强代码健壮性</li>
            <li>增加git提交钩子，提交到git仓库的代码进行质量管理，对提交信息进行规范</li>
            <li>实现了共享元素动画</li>
            <li>实现了模块懒加载、权限校验的动态路由</li>
            <li>实现了权限校验的动态菜单</li>
            <li>实现了瀑布流显示的图片上传管理</li>
            <li>云相册实现了相册概念</li>
            <li>
              动画系统利用
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.framer.com/motion/introduction/"
              >
                Framer Motion
              </a>
              实现，动画效果自然流畅
            </li>
            <li>css使用styled-components，更灵活且满足需求</li>
            <li>
              实现了基于fullcalendar的<NavLink to="/event-pro/calendar">日历组件</NavLink>
            </li>
            <li>
              实现了云端文件管理系统，实现单文件上传/多文件上传/文件列表/文件描述/文件描述更新/文件物理删除/文件下载/文件预览/还有云端的文件管理系统
            </li>
            <li>实现了基于bytemd的在线markdown编辑器</li>
            <li>全栈开发，前后端协调一致</li>
            <li>【基于浏览器】实现excel数据导入【及导入数据筛选功能】</li>
          </OrderedList>
        </AnimatedSection>

        <AnimatedSection>
          <SectionTitile>hooks一览</SectionTitile>
          <UnorderedList>
            <li>——useCopyToClipboard 零依赖的复制到剪切板</li>
            <li>——useCustomNavigate 避免重复导航的自定义路由</li>
            <li>——useFullScreen 零依赖的全屏hooks</li>
            <li>——useInViewport 判断元素是否进入视口</li>
            <li>——useJumpToVscodeSource 跳转vscode源码位置</li>
            <li>——useMouse 获取鼠标位置</li>
          </UnorderedList>
        </AnimatedSection>

        <AnimatedSection>
          <SectionTitile>TODO</SectionTitile>
          <OrderedList>
            <li>完善动画组件</li>
            <li>实现pdf编辑组件，向pdf内部新增图片</li>
            <li>更灵活的图片裁剪组件，支持放大，缩小，所见即所得</li>
            <li>【基于前端】表格组件增加pdf导出功能、增加打印功能</li>
            <li>路由切换增加动画，其余界面增加动画</li>
            <li>实现文件上传组件、支持多文件上传、支持拖拽</li>
            <li>实现浏览器端的文件选择</li>
            <li>添加缺失的后台接口</li>
            <li>实现鼠标拖拽的框选功能</li>
            <li>增加md文档在线编辑的文件夹功能</li>
            <li>【后端接口协调配合，这个操作比较简单】增加pdf预览功能</li>
            <li>【基于前端】增加word预览功能</li>
            <li>【基于前端】增加excel预览功能</li>
            <li>【基于前端】增加ppt预览功能</li>
          </OrderedList>
        </AnimatedSection>

        <AnimatedSection>
          <SectionTitile>一些面试题</SectionTitile>
          <OrderedList>
            <InterviewQuestion>css使用的方式有哪些？有哪些优缺点？</InterviewQuestion>
            <InterviewAnswer>
              <p>
                1.1
                使用内联样式。工程化项目中极端不推荐，会造成样式管理困难，伪类、伪元素无法书写，没有代码提示，需要使用驼峰命名法
              </p>
              <p>1.2 直接引入css文件。有可能会造成样式冲突，导致页面混乱</p>
              <p>1.3 使用css module。可以防止样式冲突，但是使用更复杂</p>
              <p>
                1.4
                使用css-in-js。会自动插入一个唯一的类名，但是需要额外安装插件，并且没有代码提示，需要使用驼峰命名法
              </p>
              <p>
                1.5
                使用tailwindcss。简单的样式可以直接使用，但是复杂样式复用困难，且需要额外安装插件
              </p>
            </InterviewAnswer>

            <InterviewQuestion>React与Vue有什么区别和共同点？</InterviewQuestion>
            <InterviewAnswer>
              <SubTitle>2.1 共同点：</SubTitle>
              <p>2.1.1 都使用的虚拟dom，配合diff算法，提高性能</p>
              <p>2.1.2 都是组件化思想，可以复用</p>
              <SubTitle>2.2 不同点：</SubTitle>
              <p>
                2.2.1
                React是单向数据流，Vue是双向数据流。在数据更新，组件更新方式上，vue更灵活，更高效。react很多优化需要自己写，而vue本身就帮我们做了
              </p>
              <p>
                2.2.2
                react主要使用jsx语法，vue主要使用的是vue单文件组件。这就导致在样式使用上，vue有天然优势，它直接在style标签内部写样式，可以获得完整的css代码提示，可以直接使用css预处理器，可以使用scope标签决定编写的样式是否局部有效
              </p>
              <p>
                2.2.3
                vue更像是精装房，react更像是毛坯房。比如路由守卫、路由注册，react需要自己写函数，vue已经定义好了钩子，可以直接使用，灵活性同样很好
              </p>
              <p>
                2.2.4
                react使用人数更多，组件更丰富，比如动画方面，react有更多的npm库可以使用。代码格式化校验方面，react有biome，格式化效率更快，使用更便捷，不用再安装eslint和prettier
              </p>
            </InterviewAnswer>
          </OrderedList>
        </AnimatedSection>
      </ContentWrapper>
    </MainContainer>
  )
}

export default Home
