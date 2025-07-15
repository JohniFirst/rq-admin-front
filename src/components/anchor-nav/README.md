# AnchorNav 锚点导航组件

一个智能的锚点导航组件，支持自动提取页面标题、滚动监听和高亮显示。

## 功能特性

- 🎯 **自动标题提取**: 自动从页面中提取 h1-h6 标题元素
- 📍 **滚动监听**: 使用 Intersection Observer 监听标题可见性
- ✨ **智能高亮**: 当前可见标题对应的导航项会自动高亮
- 🎨 **可定制样式**: 支持自定义样式和主题
- 📱 **响应式设计**: 支持暗色主题和响应式布局
- 🚀 **平滑滚动**: 点击导航项平滑滚动到对应位置

## 使用方法

### 基础用法

```tsx
import React from 'react'
import AnchorNav from './anchor-nav'

function MyPage() {
  const headings = [
    { id: 'intro', text: '介绍', level: 1 },
    { id: 'features', text: '功能特性', level: 1 },
    { id: 'installation', text: '安装', level: 2 },
    { id: 'usage', text: '使用方法', level: 2 },
  ]

  return (
    <div className="flex">
      <AnchorNav headings={headings} />
      <div className="flex-1">
        <h1 id="intro">介绍</h1>
        <h1 id="features">功能特性</h1>
        <h2 id="installation">安装</h2>
        <h2 id="usage">使用方法</h2>
      </div>
    </div>
  )
}
```

### 自动提取标题

```tsx
import React from 'react'
import AnchorNav from './anchor-nav'
import { useHeadings } from './use-headings'

function MyPage() {
  // 自动提取 .content 容器内的标题
  const headings = useHeadings('.content')

  return (
    <div className="flex">
      <AnchorNav headings={headings} />
      <div className="flex-1 content">
        <h1>介绍</h1>
        <h1>功能特性</h1>
        <h2>安装</h2>
        <h2>使用方法</h2>
      </div>
    </div>
  )
}
```

### 自定义样式

```tsx
<AnchorNav
  headings={headings}
  className="custom-nav-class"
  activeClassName="text-red-600 bg-red-50"
/>
```

## API 文档

### AnchorNav Props

| 属性              | 类型        | 默认值                      | 描述                |
| ----------------- | ----------- | --------------------------- | ------------------- |
| `headings`        | `Heading[]` | -                           | 标题数组，必需      |
| `className`       | `string`    | `''`                        | 导航容器的 CSS 类名 |
| `activeClassName` | `string`    | `'text-blue-600 font-bold'` | 激活状态的 CSS 类名 |

### Heading 接口

```tsx
interface Heading {
  id: string // 标题的唯一标识符
  text: string // 标题文本内容
  level: number // 标题级别 (1-6, 对应 h1-h6)
}
```

### useHeadings Hook

```tsx
function useHeadings(containerSelector?: string): Heading[]
```

- `containerSelector`: 可选，CSS 选择器，指定要提取标题的容器元素
- 返回值: 提取到的标题数组

## 样式定制

组件使用 Tailwind CSS 类名，你可以通过以下方式自定义样式：

### 修改默认激活样式

```tsx
<AnchorNav activeClassName="text-green-600 font-bold bg-green-50" />
```

### 添加自定义 CSS

```css
.anchor-nav {
  /* 自定义导航样式 */
}

.anchor-nav button:hover {
  /* 悬停效果 */
}
```

## 注意事项

1. **标题 ID**: 确保每个标题元素都有唯一的 `id` 属性，如果没有会自动生成
2. **容器选择器**: 使用 `useHeadings` 时，确保指定的容器选择器存在
3. **性能优化**: 组件使用 Intersection Observer，性能良好，但建议在大量标题时进行测试
4. **浏览器兼容性**: 需要支持 Intersection Observer API 的现代浏览器

## 示例

查看 `anchor-nav-demo.tsx` 文件获取完整的使用示例。
