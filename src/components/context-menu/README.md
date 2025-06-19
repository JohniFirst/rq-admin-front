# ContextMenu 右键菜单组件

`ContextMenu` 是一个可复用的 React 右键菜单组件，支持自定义菜单项，适用于任何需要右键菜单的场景。

## 用法示例

```tsx
import ContextMenu, { ContextMenuItem } from './ContextMenu';

const menu: ContextMenuItem[] = [
  { label: '编辑', onClick: () => alert('编辑') },
  { label: '删除', onClick: () => alert('删除'), disabled: false },
  { label: '禁用项', onClick: () => {}, disabled: true },
];

<ContextMenu menu={menu}>
  <div style={{ width: 200, height: 100, border: '1px solid #ccc' }}>
    右键点击这里试试
  </div>
</ContextMenu>
```

## Props
- `menu: ContextMenuItem[]`  菜单项数组，包含 label、onClick、icon、disabled。
- `children: React.ReactNode`  需要包裹的元素，右键触发菜单。
- `menuClassName?: string`  自定义菜单样式类名。

## 菜单项结构
```ts
interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

## 样式
默认自带基础样式，可通过 `menuClassName` 覆盖。

---
如需更复杂的交互或动画，可自行扩展。
