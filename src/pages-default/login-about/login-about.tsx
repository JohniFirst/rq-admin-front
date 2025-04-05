import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Novatrix } from 'uvcanvas'

const LoginContainer = styled.section`
  min-height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const BackgroundCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  opacity: 0.8;
`

const LeftPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`

const RightPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`

const FormWrapper = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(4px);
`

export default function LoginAbout() {
	return (
		<LoginContainer>
			<BackgroundCanvas>
				<Novatrix />
			</BackgroundCanvas>

			<LeftPanel
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<h1 className='text-5xl font-bold mb-8 text-gray-800'>欢迎回来</h1>
				<p className='text-xl text-gray-600 mb-4'>
					登录您的账户，开始探索更多精彩内容
				</p>
				<div className='flex flex-col gap-4'>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
							<svg
								className='w-6 h-6 text-blue-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								role='img'
								aria-label='安全可靠'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>
						<div>
							<h3 className='font-semibold text-gray-800'>安全可靠</h3>
							<p className='text-gray-600'>
								采用先进的加密技术，保护您的数据安全
							</p>
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
							<svg
								className='w-6 h-6 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								role='img'
								aria-label='高效便捷图标'
							>
								<title>高效便捷图标</title>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M13 10V3L4 14h7v7l9-11h-7z'
								/>
							</svg>
						</div>
						<div>
							<h3 className='font-semibold text-gray-800'>高效便捷</h3>
							<p className='text-gray-600'>快速响应，轻松管理您的所有需求</p>
						</div>
					</div>
				</div>
			</LeftPanel>

			<RightPanel
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<FormWrapper
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.6 }}
				>
					<Outlet />
				</FormWrapper>
			</RightPanel>
		</LoginContainer>
	)
}
