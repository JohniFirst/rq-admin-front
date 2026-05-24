# RQ Admin 编程风格约束文档

> 本文档定义了 RQ Admin 项目的编程标准和风格指南，所有团队成员必须严格遵守。

---

## 一、技术栈规范

### 1.1 核心技术栈

| 分类     | 技术              | 版本 | 用途       |
| -------- | ----------------- | ---- | ---------- |
| 框架     | React             | 18.x | UI 框架    |
| 语言     | TypeScript        | 5.x  | 类型安全   |
| 构建工具 | Vite              | 7.x  | 构建工具   |
| 样式     | styled-components | 6.x  | 组件级样式 |
| UI 库    | Ant Design        | 6.x  | UI 组件库  |
| 状态管理 | Redux Toolkit     | 2.x  | 全局状态   |
| 路由     | React Router      | 7.x  | 路由管理   |
| HTTP     | Axios             | 1.x  | 网络请求   |
| 代码规范 | ESLint            | 9.x  | 代码检查   |
| 格式化   | Prettier          | 3.x  | 代码格式化 |

### 1.2 包管理器

**必须使用 `pnpm`**，禁止使用 `npm` 或 `yarn`。

```bash
# 安装依赖
pnpm install

# 添加依赖
pnpm add <package>

# 添加开发依赖
pnpm add -D <package>
```

---

## 二、命名规范

### 2.1 文件/文件夹命名

- **必须使用 kebab-case（短横线命名法）**
- 全部小写，单词之间用短横线连接
- 避免使用下划线和驼峰命名

| 类型     | 正确示例       | 错误示例                                     |
| -------- | -------------- | -------------------------------------------- |
| 文件夹   | `my-component` | `myComponent`, `MyComponent`, `my_component` |
| 普通文件 | `api-event.ts` | `ApiEvent.ts`, `apiEvent.ts`                 |

### 2.2 React 组件命名

- **使用 PascalCase（大驼峰命名）**
- 组件文件名与组件名一致
- 目录名使用 kebab-case

```
components/
├── my-component/
│   ├── MyComponent.tsx    # ✅ 组件文件 PascalCase
│   └── index.ts           # 导出文件
```

### 2.3 TypeScript 类型命名

- **接口/类型别名**：使用 PascalCase
- **枚举**：使用 PascalCase，枚举值使用 UPPER_SNAKE_CASE
- **常量**：使用 UPPER_SNAKE_CASE

```typescript
// ✅ 接口命名
interface UserInfo {
  id: string
  name: string
}

// ✅ 类型别名命名
type Status = 'active' | 'inactive'

// ✅ 枚举命名
enum LayoutModeEnum {
  COMMON_MENU = 'common-menu',
  HEADER_MENU = 'header-menu',
}

// ✅ 常量命名
const MAX_RETRY = 3
```

### 2.4 变量与函数命名

- **变量**：使用 camelCase（小驼峰命名）
- **函数**：使用 camelCase
- **类**：使用 PascalCase
- **私有成员**：使用下划线前缀 `_private`

```typescript
// ✅ 变量
const userName = 'John'

// ✅ 函数
function getUserInfo() {
  // ...
}

// ✅ 类
class DataService {
  private _cache: Map<string, any> = new Map()

  getData(key: string) {
    return this._cache.get(key)
  }
}
```

---

## 三、代码格式化规范

### 3.1 Prettier 配置

项目使用以下 Prettier 配置（见 `.prettierrc`）：

| 配置项          | 值      | 说明                 |
| --------------- | ------- | -------------------- |
| `singleQuote`   | `true`  | 使用单引号           |
| `trailingComma` | `all`   | 尾随逗号             |
| `printWidth`    | `100`   | 每行最大字符数       |
| `tabWidth`      | `2`     | 缩进空格数           |
| `semi`          | `false` | 不添加分号           |
| `arrowParens`   | `avoid` | 箭头函数单参数不括号 |
| `endOfLine`     | `auto`  | 自动检测换行符       |

### 3.2 格式化示例

```typescript
// ✅ 推荐格式
const getUser = async (id: string) => {
  const user = await fetchUser(id)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

// ❌ 不推荐格式
const getUser = async (id: string) => {
  const user = await fetchUser(id)
  return { id: user.id, name: user.name, email: user.email }
}
```

---

## 四、TypeScript 规范

### 4.1 严格模式

项目启用 TypeScript 严格模式，必须遵守：

- ✅ 禁止使用 `any` 类型
- ✅ 明确指定函数返回类型
- ✅ 使用类型断言时要谨慎

```typescript
// ✅ 推荐：明确类型
function formatDate(date: Date): string {
  return date.toISOString()
}

// ❌ 不推荐：使用 any
function formatDate(date: any): any {
  return date.toISOString()
}
```

### 4.2 类型定义位置

- **全局类型**：放在 `types/` 目录
- **组件类型**：放在组件目录内或组件文件顶部
- **API 类型**：放在 `src/api/` 目录或对应模块

```typescript
// types/auth.d.ts
declare interface User {
  id: string
  name: string
  email: string
}
```

### 4.3 泛型使用

- 使用泛型提高代码复用性
- 泛型参数使用大写字母开头

```typescript
// ✅ 泛型示例
function identity<T>(arg: T): T {
  return arg
}
```

---

## 五、React 组件规范

### 5.1 组件结构

```typescript
// ✅ 推荐结构
import { useState, useEffect } from 'react'

interface MyComponentProps {
  title: string
  onSubmit?: () => void
}

function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = title
  }, [title])

  const handleClick = () => {
    setCount(prev => prev + 1)
    onSubmit?.()
  }

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
    </div>
  )
}

export default MyComponent
```

### 5.2 Hooks 使用规范

- ✅ 使用 `useCallback` 包装传递给子组件的函数
- ✅ 使用 `useMemo` 缓存计算结果
- ✅ 使用 `React.memo` 优化大列表组件

```typescript
// ✅ 推荐
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])

const ListItem = React.memo(({ data }) => {
  // ...
})
```

### 5.3 样式方案选择

| 场景         | 推荐方案          |
| ------------ | ----------------- |
| 简单样式     | Tailwind CSS      |
| 复杂组件样式 | styled-components |
| 全局样式     | CSS 文件          |

```tsx
// Tailwind CSS
const Button = () => <button className="px-4 py-2 bg-blue-500 text-white rounded">Click me</button>

// styled-components
const StyledButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
`
```

---

## 六、状态管理规范

### 6.1 状态管理选择

| 场景           | 推荐方案                  |
| -------------- | ------------------------- |
| 组件内部状态   | `useState` / `useReducer` |
| 跨组件共享状态 | Redux Toolkit             |
| 临时/本地状态  | `useRef`                  |

### 6.2 Redux Toolkit 规范

- Slice 放在 `src/store/slice/` 目录
- 使用 `createSlice` 创建 slice
- Selector 使用 `useAppSelector`
- 异步逻辑使用 `createAsyncThunk`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

export const { increment, setValue } = counterSlice.actions
export default counterSlice.reducer
```

---

## 七、API 规范

### 7.1 API 组织

```
src/api/
├── system-api.ts     # 系统相关 API
├── calendar.ts       # 日历相关 API
└── event-pro/        # 功能模块
    └── file.ts
```

### 7.2 HTTP 请求规范

- 使用 `src/utils/http.ts` 中的 `http` 实例
- 统一错误处理和响应拦截
- 请求参数和响应类型定义清晰

```typescript
import { http } from '@/utils/http'

export interface UserResponse {
  id: string
  name: string
}

export async function getUser(id: string): Promise<UserResponse> {
  return http.get(`/users/${id}`)
}
```

---

## 八、路由规范

### 8.1 路由配置

- 路由定义在 `src/routes/` 目录
- 使用 React Router v7 API
- 路径使用小写和短横线

```typescript
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/user/profile',
    element: <UserProfile />,
  },
])
```

---

## 九、代码质量规范

### 9.1 ESLint 规则

项目使用以下核心规则：

| 规则                                                 | 级别  | 说明                 |
| ---------------------------------------------------- | ----- | -------------------- |
| `@typescript-eslint/no-confusing-non-null-assertion` | error | 禁止混淆的非空断言   |
| `react/react-in-jsx-scope`                           | off   | React 17+ 不需要导入 |
| `no-unused-vars`                                     | warn  | 未使用变量警告       |
| `react/prop-types`                                   | off   | 使用 TypeScript 类型 |

### 9.2 注释规范

- 公共 API 添加 JSDoc 注释
- 复杂逻辑添加解释性注释
- 避免无意义注释

```typescript
/**
 * 获取用户信息
 * @param id 用户 ID
 * @returns 用户信息 Promise
 */
export async function getUser(id: string): Promise<UserResponse> {
  // 从缓存获取或请求 API
  const cached = cache.get(id)
  if (cached) return cached

  return http.get(`/users/${id}`)
}
```

---

## 十、文件路径引用规范

### 10.1 路径别名

使用 `@/` 引用 `src/` 目录：

```typescript
// ✅ 推荐
import { Button } from '@/components/base'
import { http } from '@/utils/http'

// ❌ 不推荐
import { Button } from '../../../components/base'
```

### 10.2 绝对导入优先

优先使用绝对路径导入，避免相对路径的层级跳跃。

---

## 十一、Git 规范

### 11.1 Commit Message

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

| 类型       | 说明      | 示例                            |
| ---------- | --------- | ------------------------------- |
| `feat`     | 新功能    | `feat: add user profile page`   |
| `fix`      | 修复 bug  | `fix: resolve login issue`      |
| `refactor` | 重构      | `refactor: simplify auth logic` |
| `docs`     | 文档更新  | `docs: update API docs`         |
| `chore`    | 构建/工具 | `chore: update dependencies`    |

### 11.2 分支命名

| 分支类型 | 命名规则             | 示例                   |
| -------- | -------------------- | ---------------------- |
| 功能分支 | `feature/` + 功能名  | `feature/user-profile` |
| Bug 修复 | `fix/` + 问题描述    | `fix/login-error`      |
| 紧急修复 | `hotfix/` + 问题描述 | `hotfix/critical-bug`  |

---

## 十二、性能规范

### 12.1 渲染优化

- ✅ 避免不必要的重渲染
- ✅ 使用 `React.memo` 优化组件
- ✅ 大列表使用虚拟滚动
- ✅ 图片懒加载

### 12.2 依赖优化

- ✅ 按需导入（Tree Shaking）
- ✅ 避免引入整个大型库
- ✅ 生产构建使用压缩和混淆

---

## 十三、存储规范

### 13.1 存储键名管理

所有存储键名必须定义在 `src/enums/localforage.ts`：

```typescript
export enum ForageEnums {
  TOKEN = 'TOKEN',
  APP_HISTORY = 'APP_HISTORY',
  SYSTEM_INFO = 'SYSTEM_INFO',
}
```

### 13.2 存储工具使用

| 数据类型       | 推荐方案                          |
| -------------- | --------------------------------- |
| 敏感数据       | `secureStorage`                   |
| 普通数据       | `localStorage` / `sessionStorage` |
| 大量结构化数据 | `localforage`                     |

---

## 十四、主题系统规范

### 14.1 主题配置

预设主题定义在 `src/config/preset-themes.ts`：

```typescript
interface ThemeConfig {
  id: string
  name: string
  isDark: boolean
  colors: Record<string, string>
}
```

### 14.2 CSS 变量

所有颜色使用 CSS 变量：

```css
:root {
  --color-primary: #1890ff;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-danger: #f5222d;
}
```

---

## 附录：常用命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm types
```

---

**最后更新**：2026-05-24  
**适用版本**：RQ Admin v0.1.0+
