import { presetThemes } from '@/config/preset-themes'
import {
	CheckOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	PlusOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import { Button, ColorPicker, Input, Modal, Switch, Tabs, message } from 'antd'
import { saveAs } from 'file-saver'
import type React from 'react'
import { useRef, useState } from 'react'

interface ThemeConfigProps {
	currentTheme: string
	onThemeChange: (themeId: string) => void
}

const ThemeConfig: React.FC<ThemeConfigProps> = ({
	currentTheme,
	onThemeChange,
}) => {
	const [customThemes, setCustomThemes] = useState<CustomTheme[]>([])
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleThemeSelect = (theme: ThemeConfig) => {
		onThemeChange(theme.id)
	}

	const handleCreateTheme = () => {
		setEditingTheme(null)
		setShowCreateModal(true)
	}

	const handleEditTheme = (theme: CustomTheme) => {
		setEditingTheme(theme)
		setShowCreateModal(true)
	}

	const handleDeleteTheme = (themeId: string) => {
		setCustomThemes(customThemes.filter((theme) => theme.id !== themeId))
		if (currentTheme === themeId) {
			onThemeChange('default-light')
		}
	}

	const handleExportTheme = (theme: CustomTheme) => {
		const themeJson = JSON.stringify(theme, null, 2)
		const blob = new Blob([themeJson], { type: 'application/json' })
		saveAs(blob, `theme-${theme.name}.json`)
	}

	const handleImportClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const theme = JSON.parse(e.target?.result as string) as CustomTheme
				if (!theme.id || !theme.name || !theme.colors) {
					throw new Error('Invalid theme file')
				}
				setCustomThemes([...customThemes, { ...theme, isCustom: true }])
				message.success('主题导入成功')
			} catch (error) {
				message.error('主题文件格式错误')
			}
		}
		reader.readAsText(file)
		event.target.value = ''
	}

	const renderThemeCard = (theme: ThemeConfig) => {
		const isCustom = 'isCustom' in theme
		const isActive = currentTheme === theme.id

		return (
			<div
				key={theme.id}
				className={`
          relative p-4 rounded-lg cursor-pointer transition-all duration-300
          ${
						isActive
							? 'ring-2 ring-primary bg-primary/5'
							: 'hover:bg-gray-50 dark:hover:bg-gray-800'
					}
        `}
				onClick={() => handleThemeSelect(theme)}
			>
				<div className='flex items-center justify-between mb-3'>
					<span className='font-medium text-gray-900 dark:text-gray-100'>
						{theme.name}
					</span>
					{isActive && <CheckOutlined className='text-primary text-lg' />}
				</div>

				<div className='grid grid-cols-5 gap-2 mb-3'>
					{Object.entries(theme.colors)
						.slice(0, 5)
						.map(([key, color]) => (
							<div
								key={key}
								className='w-6 h-6 rounded-full'
								style={{ backgroundColor: color }}
								title={key}
							/>
						))}
				</div>

				{isCustom && (
					<div className='absolute bottom-2 right-2 space-x-1'>
						<Button
							type='text'
							size='small'
							icon={<EditOutlined />}
							onClick={(e) => {
								e.stopPropagation()
								handleEditTheme(theme as CustomTheme)
							}}
						/>
						<Button
							type='text'
							size='small'
							icon={<DownloadOutlined />}
							onClick={(e) => {
								e.stopPropagation()
								handleExportTheme(theme as CustomTheme)
							}}
						/>
						<Button
							type='text'
							size='small'
							danger
							icon={<DeleteOutlined />}
							onClick={(e) => {
								e.stopPropagation()
								handleDeleteTheme(theme.id)
							}}
						/>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<div className='space-x-2'>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleCreateTheme}
					>
						新建主题
					</Button>
					<Button icon={<UploadOutlined />} onClick={handleImportClick}>
						导入主题
					</Button>
					<input
						type='file'
						ref={fileInputRef}
						className='hidden'
						accept='.json'
						onChange={handleFileImport}
					/>
				</div>
			</div>

			<Tabs
				items={[
					{
						key: 'preset',
						label: '预设主题',
						children: (
							<div className='grid grid-cols-2 gap-4'>
								{presetThemes.map(renderThemeCard)}
							</div>
						),
					},
					{
						key: 'custom',
						label: '自定义主题',
						children: (
							<div className='grid grid-cols-2 gap-4'>
								{customThemes.length > 0 ? (
									customThemes.map(renderThemeCard)
								) : (
									<div className='col-span-2 text-center py-8 text-gray-500'>
										暂无自定义主题，点击"新建主题"创建
									</div>
								)}
							</div>
						),
					},
				]}
			/>

			<ThemeEditModal
				open={showCreateModal}
				editingTheme={editingTheme}
				onCancel={() => setShowCreateModal(false)}
				onSave={(theme) => {
					if (editingTheme) {
						setCustomThemes(
							customThemes.map((t) =>
								t.id === theme.id ? { ...theme, updatedAt: Date.now() } : t,
							),
						)
					} else {
						setCustomThemes([
							...customThemes,
							{
								...theme,
								id: `custom-${Date.now()}`,
								isCustom: true,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						])
					}
					setShowCreateModal(false)
					message.success(editingTheme ? '主题更新成功' : '主题创建成功')
				}}
			/>
		</div>
	)
}

interface ThemeEditModalProps {
	open: boolean
	editingTheme: CustomTheme | null
	onCancel: () => void
	onSave: (theme: CustomTheme) => void
}

const ThemeEditModal: React.FC<ThemeEditModalProps> = ({
	open,
	editingTheme,
	onCancel,
	onSave,
}) => {
	const [name, setName] = useState(editingTheme?.name || '')
	const [colors, setColors] = useState<ThemeColors>(
		editingTheme?.colors || presetThemes[0].colors,
	)
	const [isDark, setIsDark] = useState(editingTheme?.isDark || false)

	const handleSave = () => {
		if (!name.trim()) {
			message.error('请输入主题名称')
			return
		}

		onSave({
			id: editingTheme?.id || '',
			name: name.trim(),
			colors,
			isDark,
			isCustom: true,
			createdAt: editingTheme?.createdAt || Date.now(),
			updatedAt: editingTheme?.updatedAt || Date.now(),
		})
	}

	return (
		<Modal
			open={open}
			title={editingTheme ? '编辑主题' : '新建主题'}
			onCancel={onCancel}
			onOk={handleSave}
			width={640}
		>
			<div className='space-y-6 py-4'>
				<div>
					<p className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
						主题名称
					</p>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='请输入主题名称'
					/>
				</div>

				<div>
					<p className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
						主题颜色
					</p>
					<div className='grid grid-cols-2 gap-4'>
						{Object.entries(colors).map(([key, color]) => (
							<div key={key} className='flex items-center space-x-2'>
								<span className='text-sm text-gray-600 dark:text-gray-400 w-20'>
									{key}
								</span>
								<ColorPicker
									value={color}
									onChange={(color) =>
										setColors({ ...colors, [key]: color.toHexString() })
									}
								/>
								<span className='text-xs text-gray-400'>{color}</span>
							</div>
						))}
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						深色主题
					</span>
					<Switch checked={isDark} onChange={setIsDark} />
				</div>
			</div>
		</Modal>
	)
}

export default ThemeConfig
