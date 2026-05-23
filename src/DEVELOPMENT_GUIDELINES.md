# RQ Admin 前端开发规范

## 一、项目基础规范

### 1.1 包管理器

- **必须使用 pnpm** 作为包管理器，禁止使用 npm 或 yarn

### 1.2 命名规范

- **文件夹/文件命名**：使用短横线命名法（kebab-case）
  - ✅ `my-component`
  - ❌ `myComponent`、`MyComponent`
- **React 组件**：PascalCase（首字母大写）
- **TypeScript 类型/接口**：PascalCase
- **枚举**：PascalCase，枚举值使用 UPPER_SNAKE_CASE

### 1.3 代码风格

- 遵循 Airbnb JavaScript Style Guide
- 使用 Prettier 进行代码格式化（配置见 `.prettierrc`）
- TypeScript 严格模式

## 二、存储规范

### 2.1 存储键名统一管理

**所有存储键名必须定义在 `src/enums/localforage.ts` 中**

```typescript
// localforage（持久化存储）
export enum ForageEnums {
  APP_HISTORY = 'APP_HISTORY',
  // ...
}

// localStorage
export enum LocalStorageKeys {
  THEME_MODE = 'rq-admin-theme-mode',
  // ...
}

// sessionStorage
export enum SessionStorageKeys {
  // ...
}
```

### 2.2 存储工具使用

- **敏感数据**：使用 `utils/storage.ts` 中的 `secureStorage`
- **普通数据**：使用原生 `localStorage`/`sessionStorage`
- **大量结构化数据**：使用 `localforage`（IndexedDB 封装）

```typescript
import { secureStorage } from '@/utils/storage'

// 存储敏感数据
secureStorage.set('key', data)
const data = secureStorage.get('key', defaultValue)

// 存储普通数据
localStorage.setItem('key', JSON.stringify(data))
```

### 2.3 键名命名规范

- 使用有意义的前缀，如 `rq-admin-` 避免与其他应用冲突
- 使用驼峰命名，语义化

## 三、组件规范

### 3.1 样式方案

- **复杂组件样式**：使用 `styled-components`
- **简单样式**：使用 Tailwind CSS
- **避免内联样式**，特殊情况除外

### 3.2 组件文件结构

```
components/
├── MyComponent/
│   ├── MyComponent.tsx      # 组件实现
│   ├── MyComponent.css      # 如果需要独立 CSS 文件
│   └── index.ts             # 导出
```

### 3.3 组件设计原则

- 单一职责原则（SRP）
- 使用 `React.memo` 优化不必要的重渲染
- 合理使用 `useMemo` 和 `useCallback`
- 组件内部函数使用 `useCallback` 包装后传递给子组件

```typescript
// ✅ 推荐：使用 useCallback
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])

// ✅ 推荐：使用 useMemo 缓存计算结果
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])

// ✅ 推荐：大列表组件使用 React.memo
const ListItem = React.memo(({ data }) => {
  // ...
})
```

## 四、状态管理规范

### 4.1 状态管理选择

- **组件内部状态**：`useState`、`useReducer`
- **跨组件共享状态**：Redux Toolkit
- **临时/本地状态**：React refs（`useRef`）

### 4.2 Redux Store 结构

- 使用 `@reduxjs/toolkit`
- Slice 放在 `store/slice/` 目录
- Selector 优先使用浅比较 `shallowEqual`

### 4.3 状态持久化

- 涉及用户偏好的状态应持久化到 localStorage
- 使用 `localforage` 存储复杂数据结构
- 页面加载时从存储恢复状态

## 五、主题系统规范

### 5.1 主题配置

- 预设主题定义在 `src/config/preset-themes.ts`
- 主题包含：`id`、`name`、`isDark`、`colors`

### 5.2 CSS 变量

- 所有颜色使用 CSS 变量：`var(--color-primary)`
- 亮色/暗色主题变量分别定义在：
  - `src/assets/css/light.css`
  - `src/assets/css/dark.css`

### 5.3 主题切换

- 使用 Redux 存储当前主题
- 主题配置统一在 `theme-switcher.tsx` 组件中管理
- 主题模式包括：浅色、深色、跟随系统、自动切换

## 六、路由规范

### 6.1 路由配置

- 路由定义在 `src/routes/` 目录
- 使用 React Router v7
- 动态路由使用 `src/routes/dynamic-routes.tsx`

### 6.2 路由命名

- 路径使用小写和短横线
- 命名与页面功能一致

## 七、API 规范

### 7.1 API 模块组织

```
src/api/
├── system-api.ts     # 系统相关 API
├── calendar.ts       # 日历相关 API
└── [feature]/
    └── index.ts      # 按功能模块组织
```

### 7.2 API 请求

- 使用 Axios 封装 HTTP 请求
- 统一错误处理和响应拦截
- 请求参数和响应类型定义清晰

## 八、性能规范

### 8.1 渲染优化

- 避免不必要的重渲染
- 大列表使用虚拟滚动（如 `react-virtualized`）
- 图片懒加载
- 代码分割（React.lazy）

### 8.2 依赖优化

- 按需导入（Tree Shaking）
- 避免引入整个大型库
- 生产构建使用压缩和混淆

## 九、代码质量

### 9.1 TypeScript

- 禁止使用 `any`，尽量使用具体类型
- 接口和类型别名命名清晰
- 善用泛型提高复用性

### 9.2 注释规范

- 公共 API 添加 JSDoc 注释
- 复杂逻辑添加解释性注释
- 已完成 TODO 使用标准格式标记

### 9.3 ESLint & Prettier

- 代码提交前自动运行 lint 检查
- Husky + lint-staged 实现 pre-commit 检查

## 十、Git 规范

### 10.1 Commit Message

- 遵循 Conventional Commits
- `feat:` 新功能
- `fix:` 修复 bug
- `refactor:` 重构
- `docs:` 文档更新
- `chore:` 构建/工具

### 10.2 分支命名

- `feature/` 新功能分支
- `fix/` Bug 修复分支
- `hotfix/` 紧急修复分支

## 十一、文件路径引用

### 11.1 路径别名

使用 `@/` 引用 `src/` 目录：

```typescript
// ✅ 推荐
import { Button } from '@/components/base'
import { api } from '@/api/system-api'

// ❌ 不推荐
import { Button } from '../../../components/base'
```

## 十二、样式变量参考

### 12.1 颜色变量

```css
/* 主题色 */
--color-primary: 主色 --color-primary-hover: 主色悬停 --color-primary-active: 主色激活 /* 语义色 */
  --color-success: 成功 --color-warning: 警告 --color-danger: 危险 --color-info: 信息 /* 界面色 */
  --color-background: 背景 --color-surface: 表面 --color-surface-hover: 表面悬停
  --color-text: 主文本 --color-text-secondary: 次要文本 --color-border: 边框;
```

### 12.2 间距变量

- 使用 `--default-gap: 16px` 作为默认间距
- 组件内间距根据具体情况调整

---

**最后更新**：2026-05-22
