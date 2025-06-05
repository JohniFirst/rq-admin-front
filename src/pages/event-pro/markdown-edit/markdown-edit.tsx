import { Crepe } from '@milkdown/crepe'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

const markdown = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`

const CrepeEditor: React.FC = () => {
	useEditor((root) => {
		return new Crepe({ root, defaultValue: markdown })
	})

	return <Milkdown />
}

const MilkdownEditorWrapper: React.FC = () => {
	return (
		<MilkdownProvider>
			<CrepeEditor />
		</MilkdownProvider>
	)
}

export default MilkdownEditorWrapper
