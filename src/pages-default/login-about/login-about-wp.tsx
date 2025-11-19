import { motion } from 'framer-motion'
import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Novatrix } from 'uvcanvas'
import packageJson from '../../../package.json'

const LoginContainer = styled.section`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;

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
  padding: 4rem 3rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
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
  background: var(--color-background);

  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`

const FormWrapper = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
`

const BrandLink = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: 2rem;
  display: inline-block;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    color: var(--color-primary);
  }
`

const WelcomeTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-text);
  line-height: 1.2;
`

const WelcomeDescription = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 3rem;
  line-height: 1.6;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IconWrapper = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${props => (props.$color.includes('blue') ? '#3b82f6' : '#10b981')};
  }
`

const FeatureContent = styled.div`
  flex: 1;
`

const FeatureTitle = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  margin: 0 0 0.25rem 0;
`

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
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
        <BrandLink to="/">{packageJson.name}</BrandLink>
        <WelcomeTitle>欢迎回来</WelcomeTitle>
        <WelcomeDescription>登录您的账户，开始探索更多精彩内容</WelcomeDescription>
        <FeatureList>
          <FeatureItem>
            <IconWrapper $color="rgba(59, 130, 246, 0.1)">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="安全可靠"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </IconWrapper>
            <FeatureContent>
              <FeatureTitle>安全可靠</FeatureTitle>
              <FeatureDescription>采用先进的加密技术，保护您的数据安全</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <IconWrapper $color="rgba(16, 185, 129, 0.1)">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img">
                <title>高效便捷图标</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </IconWrapper>
            <FeatureContent>
              <FeatureTitle>高效便捷</FeatureTitle>
              <FeatureDescription>快速响应，轻松管理您的所有需求</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
        </FeatureList>
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
