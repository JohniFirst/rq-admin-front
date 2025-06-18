# SquareInputBox 验证码输入框组件

一个美观、功能完整的验证码输入框组件，支持多种自定义配置和交互体验。

## 特性

- 🎨 **美观设计**: 圆角输入框，支持多种尺寸和样式
- ⌨️ **智能交互**: 自动聚焦、键盘导航、点击定位
- 🔒 **类型支持**: 文本、数字、密码三种输入类型
- 📱 **移动友好**: 支持移动端数字键盘
- 🎯 **状态反馈**: 错误、成功、禁用等多种状态
- ⚡ **高性能**: 使用 React Hooks 和 useCallback 优化性能
- 🎛️ **高度可定制**: 支持自定义尺寸、间距、圆角等

## 基础用法

```tsx
import SquareInputBox from "@/components/square-input-box";

function MyComponent() {
  const [code, setCode] = useState("");

  return (
    <SquareInputBox
      value={code}
      onChange={setCode}
      onComplete={(value) => console.log("输入完成:", value)}
    />
  );
}
```

## API

### Props

| 参数         | 说明           | 类型                               | 默认值   |
| ------------ | -------------- | ---------------------------------- | -------- |
| length       | 验证码长度     | `number`                           | `6`      |
| size         | 输入框大小(px) | `number`                           | `48`     |
| gap          | 输入框间距(px) | `number`                           | `8`      |
| borderRadius | 圆角大小(px)   | `number`                           | `8`      |
| value        | 当前值         | `string`                           | `''`     |
| onChange     | 值变化回调     | `(value: string) => void`          | -        |
| onComplete   | 输入完成回调   | `(value: string) => void`          | -        |
| disabled     | 是否禁用       | `boolean`                          | `false`  |
| autoFocus    | 是否自动聚焦   | `boolean`                          | `false`  |
| type         | 输入类型       | `'text' \| 'number' \| 'password'` | `'text'` |
| placeholder  | 占位符         | `string`                           | `''`     |
| className    | 自定义样式类名 | `string`                           | -        |
| error        | 错误状态       | `boolean`                          | `false`  |
| success      | 成功状态       | `boolean`                          | `false`  |

## 使用示例

### 基础验证码输入

```tsx
<SquareInputBox
  length={6}
  type="number"
  value={code}
  onChange={setCode}
  onComplete={handleSubmit}
  autoFocus
/>
```

### 密码类型输入

```tsx
<SquareInputBox
  length={8}
  type="password"
  value={password}
  onChange={setPassword}
  onComplete={handlePasswordComplete}
/>
```

### 自定义样式

```tsx
<SquareInputBox
  length={4}
  size={64}
  gap={12}
  borderRadius={12}
  value={code}
  onChange={setCode}
/>
```

### 状态反馈

```tsx
<SquareInputBox
  value={code}
  onChange={setCode}
  error={isError}
  success={isSuccess}
  onComplete={handleValidation}
/>
```

### 禁用状态

```tsx
<SquareInputBox value="123456" disabled={true} />
```

## 交互说明

### 键盘操作

- **数字/字母键**: 输入内容
- **Backspace**: 删除上一个字符
- **Arrow Left/Right**: 在输入框间导航
- **Enter**: 触发完成回调（当输入完成时）

### 鼠标操作

- **点击任意输入框**: 聚焦到对应位置
- **自动聚焦**: 输入时自动聚焦到下一个输入框

### 移动端

- **数字类型**: 自动弹出数字键盘
- **触摸友好**: 支持触摸点击和滑动

## 最佳实践

### 1. 表单集成

```tsx
import { Form } from "antd";

<Form.Item
  name="verificationCode"
  rules={[{ required: true, message: "请输入验证码" }]}
>
  <SquareInputBox length={6} type="number" onComplete={handleAutoSubmit} />
</Form.Item>;
```

### 2. 验证逻辑

```tsx
const handleCodeChange = (value: string) => {
  setCode(value);

  // 实时验证
  if (value.length === 6) {
    const isValid = validateCode(value);
    setError(!isValid);
    setSuccess(isValid);
  }
};
```

### 3. 自动提交

```tsx
const handleComplete = (value: string) => {
  // 自动提交表单
  form.submit();

  // 或者调用API
  submitVerificationCode(value);
};
```

## 样式定制

组件使用 styled-components 构建，支持通过 className 进行样式覆盖：

```css
.custom-input-box {
  /* 自定义样式 */
}

.custom-input-box .input-wrapper {
  /* 输入框样式 */
}

.custom-input-box .display-input {
  /* 显示内容样式 */
}
```

## 注意事项

1. **性能优化**: 组件已使用 useCallback 优化，避免不必要的重渲染
2. **无障碍**: 支持键盘导航和屏幕阅读器
3. **移动端**: 自动适配移动端输入体验
4. **状态管理**: 建议使用受控组件模式，通过 value 和 onChange 管理状态

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础验证码输入功能
- 支持多种输入类型和状态
- 支持自定义样式和交互
