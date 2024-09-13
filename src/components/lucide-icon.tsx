import type { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Suspense, lazy } from 'react'

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }} />

export type LucideIconType = keyof typeof dynamicIconImports

const dynamicList = Object.keys(dynamicIconImports)

interface IconProps extends Omit<LucideProps, 'ref'> {
	name: LucideIconType
}

const LucideIcon = ({ name, ...props }: IconProps) => {
	if (!dynamicList.includes(name)) {
		return name
	}

	const Icon = lazy(dynamicIconImports[name])

	return (
		<Suspense fallback={fallback}>
			<Icon {...props} />
		</Suspense>
	)
}

export default LucideIcon
