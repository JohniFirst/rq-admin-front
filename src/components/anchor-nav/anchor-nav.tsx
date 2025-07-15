import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

interface AnchorNavProps {
  headings: Array<{
    id: string
    text: string
    level: number
  }>
  className?: string
  activeClassName?: string
}

// Styled Components
const NavContainer = styled.nav`
  &.anchor-nav {
    /* 基础样式 */
  }
`

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NavItem = styled.li`
  list-style: none;
`

const NavButton = styled.button<{ $isActive: boolean; $level: number }>`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1.4;

  /* 根据标题级别设置缩进 */
  padding-left: ${(props: { $level: number }) => {
    return props.$level * 12 + 'px'
  }};

  /* 默认状态 */
  color: #374151;

  /* 悬停状态 */
  &:hover {
    background-color: #f3f4f6;
  }

  /* 激活状态 */
  ${(props: { $isActive: boolean }) =>
    props.$isActive &&
    `
    color: #2563eb;
    font-weight: 600;
    background-color: #eff6ff;
  `}

  /* 暗色主题支持 */
  @media (prefers-color-scheme: dark) {
    color: #d1d5db;

    &:hover {
      background-color: #374151;
    }

    ${(props: { $isActive: boolean }) =>
      props.$isActive &&
      `
      color: #60a5fa;
      background-color: rgba(96, 165, 250, 0.1);
    `}
  }
`

function AnchorNav({ headings, className = '', activeClassName }: AnchorNavProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // 创建 Intersection Observer 来监听标题元素的可见性
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -35% 0px', // 调整触发区域
        threshold: 0,
      },
    )

    // 观察所有标题元素
    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <NavContainer className={`anchor-nav ${className}`}>
      <NavList>
        {headings.map(heading => (
          <NavItem key={heading.id}>
            <NavButton
              onClick={() => scrollToHeading(heading.id)}
              $isActive={activeId === heading.id}
              $level={heading.level}
              className={activeId === heading.id ? activeClassName : ''}
            >
              {heading.text}
            </NavButton>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  )
}

export default AnchorNav
