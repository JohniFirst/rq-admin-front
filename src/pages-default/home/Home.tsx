import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import home from './css/home.module.css'

// 这种方式添加的是内联样式，没有代码提示，伪类、伪元素无法书写
const readFont = {
	color: 'red',
	fontSize: '18px',
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{ duration: 0.6 }}
			className='mb-12'
		>
			{children}
		</motion.div>
	)
}

function Home() {
	const navigate = useCustomNavigate()

	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800'>
			<header className='w-full p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 shadow-sm z-50 flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-blue-600 dark:text-blue-400'>RQ Admin</h1>
				<span
					className='px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors'
					onClick={() => navigate('/login', false)}
					onKeyUp={() => navigate('/login', false)}
				>
					登录
				</span>
			</header>

			<main className='max-w-3xl mx-auto px-4 py-8'>
				<AnimatedSection>
					<p className={home.introTitle}>功能特点</p>
					<ol className='ml-8 list-[decimal] space-y-3'>
						<li style={readFont}>快速定位源码，【ctrl + 鼠标左键】，直接跳转vscode源码</li>
						<li>灵活的布局切换，支持垂直布局和水平布局</li>
						<li>使用原生canvas实现的图片拼接</li>
						<li>原生的视频播放器</li>
						<li>利用原生canvas实现的弹幕效果</li>
						<li>应用内菜单历史记录、支持拖拽排序</li>
						<li>支持深浅色模式切换以及系统颜色模式的监听（eg. 系统切换到深色模式时会跟随系统颜色切换）</li>
						<li>导航菜单快速查询、支持快捷键【ctrl + m】呼出</li>
						<li>轻量级的表格展示组件，支持查询、分页、excel导出</li>
						<li>使用biome替代传统的eslint和prettier进行all-in-one的代码检查和格式化</li>
						<li>使用typescript，增强代码健壮性</li>
						<li>增加git提交钩子，提交到git仓库的代码进行质量管理，对提交信息进行规范</li>
						<li>实现了共享元素动画</li>
						<li>实现了模块懒加载、权限校验的动态路由</li>
						<li>实现了权限校验的动态菜单</li>
						<li>实现了瀑布流显示的图片上传管理</li>
						<li>云相册实现了相册概念</li>
						<li>
							动画系统利用&nbsp;
							<a
								className='underline text-blue-600 hover:text-blue-800'
								target='_blank'
								rel='noreferrer'
								href='https://www.framer.com/motion/introduction/'
							>
								Framer Motion
							</a>
							&nbsp; 实现，动画效果自然流畅
						</li>
						<li>
							css使用&nbsp;
							<a
								className='underline text-blue-600 hover:text-blue-800'
								target='_blank'
								rel='noreferrer'
								href='https://v3.tailwindcss.com/docs/container'
							>
								tailwindcss
							</a>
							，熟悉之后使用更方便
						</li>
						<li>
							实现了基于fullcalendar的<NavLink to='/calendar'>日历组件</NavLink>
						</li>
					</ol>
				</AnimatedSection>

				<AnimatedSection>
					<p className={home.introTitle}>hooks一览</p>
					<ul className='ml-8 space-y-2'>
						<li>——useCopyToClipboard 零依赖的复制到剪切板</li>
						<li>——useCustomNavigate 避免重复导航的自定义路由</li>
						<li>——useFullScreen 零依赖的全屏hooks</li>
						<li>——useInViewport 判断元素是否进入视口</li>
						<li>——useJumpToVscodeSource 跳转vscode源码位置</li>
						<li>——useMouse 获取鼠标位置</li>
					</ul>
				</AnimatedSection>

				<AnimatedSection>
					<p className={home.introTitle}>TODO</p>
					<ol className='ml-8 list-[decimal] space-y-3'>
						<li>完善动画组件</li>
						<li>实现pdf编辑组件，向pdf内部新增图片</li>
						<li>更灵活的图片裁剪组件，支持放大，缩小，所见即所得</li>
						<li>表格组件增加pdf导出功能、增加打印功能</li>
						<li>路由切换增加动画，其余界面增加动画</li>
						<li>实现文件上传组件、支持多文件上传、支持拖拽</li>
						<li>实现浏览器端的文件选择</li>
						<li>添加缺失的后台接口</li>
						<li>实现鼠标拖拽的框选功能</li>
					</ol>
				</AnimatedSection>

				<AnimatedSection>
					<p className={home.introTitle}>一些面试题</p>
					<ol className='ml-8 list-[decimal] space-y-4'>
						<li className='font-semibold'>css使用的方式有哪些？有哪些优缺点？</li>
						<div className='ml-4 space-y-2'>
							<p>
								1.1
								使用内联样式。工程化项目中极端不推荐，会造成样式管理困难，伪类、伪元素无法书写，没有代码提示，需要使用驼峰命名法
							</p>
							<p>1.2 直接引入css文件。有可能会造成样式冲突，导致页面混乱</p>
							<p>1.3 使用css module。可以防止样式冲突，但是使用更复杂</p>
							<p>
								1.4 使用css-in-js。会自动插入一个唯一的类名，但是需要额外安装插件，并且没有代码提示，需要使用驼峰命名法
							</p>
							<p>1.5 使用tailwindcss。简单的样式可以直接使用，但是复杂样式复用困难，且需要额外安装插件</p>
						</div>

						<li className='font-semibold'>React与Vue有什么区别和共同点？</li>
						<div className='ml-4 space-y-2'>
							<p className='font-medium'>2.1 共同点：</p>
							<p>2.1.1 都使用的虚拟dom，配合diff算法，提高性能</p>
							<p>2.1.2 都是组件化思想，可以复用</p>
							<p className='font-medium mt-4'>2.2 不同点：</p>
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
						</div>
					</ol>
				</AnimatedSection>
			</main>
		</div>
	)
}

export default Home
