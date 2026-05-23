import { css } from 'styled-components'

// 状态栏按钮统一的悬停效果
export const headerButtonHover = css`
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

// 状态栏按钮基础样式
export const headerButtonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    ${headerButtonHover}
  }
`
