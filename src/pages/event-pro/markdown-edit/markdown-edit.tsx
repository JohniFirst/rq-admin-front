import { useState } from 'react'
import MarkdownEditor from '@/components/markdown-editor/markdown-editor'

const DEFAULT_MARKDOWN = `# ByteMD Markdown 编辑器\n\n> 这是一个基于 ByteMD 的 Markdown 编辑器组件演示。\n\n- 支持 GFM\n- 代码高亮\n- 数学公式\n- Mermaid 流程图\n- 图片缩放\n\n![示例图片](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80)\n`

const MarkdownEditPage: React.FC = () => {
	const [value, setValue] = useState(DEFAULT_MARKDOWN)

	return (
		<div className='p-4'>
			<MarkdownEditor value={value} onChange={setValue} height={`min(80vh, 800px)`} />
		</div>
	)
}

export default MarkdownEditPage
