import {
  CheckOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, ColorPicker, Input, Modal, Switch, Tabs, Tooltip, message } from 'antd'
import { saveAs } from 'file-saver'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slice/system-info'
import { presetThemes } from '@/config/preset-themes'

// Styled Components
const MainContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.03) 0%, transparent 100%);
  overflow-x: hidden;
  padding: 32px;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  .button-group {
    display: flex;
    gap: 16px;
  }
`

const StyledPrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.35);
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.45);
    transform: translateY(-2px);
  }
`

const StyledSecondaryButton = styled(Button)`
  background: linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.8));
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 28px;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .ant-tabs-tab {
    padding: 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--color-primary);
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background: var(--color-primary);
  }
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
`

const ThemeCard = styled.div<{ $isActive: boolean; $isCustom: boolean }>`
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props =>
    props.$isActive
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.18), rgba(118, 75, 162, 0.12))'
      : 'linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.6))'};
  border: 2px solid ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-border)')};
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-3px) scale(1.01);
    box-shadow:
      0 16px 32px rgba(102, 126, 234, 0.16),
      0 0 0 1px rgba(102, 126, 234, 0.1);
    background: ${props =>
      props.$isActive
        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.22), rgba(118, 75, 162, 0.15))'
        : 'linear-gradient(145deg, var(--color-surface-hover), rgba(255, 255, 255, 0.8))'};
  }
`

const ThemeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const ThemeName = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.3px;
`

const ActiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
`

const ColorPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`

const ColorDot = styled.div<{ $color: string }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  background: ${props =>
    props.$color.includes('gradient')
      ? props.$color
      : `linear-gradient(145deg, ${props.$color}, ${props.$color}88)`};
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
    border-radius: 10px 10px 0 0;
  }

  &:hover {
    transform: scale(1.15) rotate(3deg);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.15),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }
`

const ActionButtons = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.25s ease;
`

const StyledButton = styled(Button)`
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
    color: var(--color-primary);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.5));
  border-radius: 20px;
  border: 2px dashed var(--color-border);
  backdrop-filter: blur(10px);
`

const EmptyIcon = styled.div`
  width: 112px;
  height: 112px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), transparent);
    opacity: 0.3;
  }

  .icon {
    font-size: 44px;
    color: var(--color-primary);
  }
`

const EmptyText = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: 500;
`

const ModalContent = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
`

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
`

const StyledInput = styled(Input)`
  border-radius: 12px;
  height: 48px;
  border: 1px solid var(--color-border);
  background: linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.6));

  &:hover,
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`

const ColorPickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ColorPickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 24px;
  background: linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.6));
  border-radius: 14px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.12);
    transform: translateX(4px);
  }
`

const ColorLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  width: 22%;
  min-width: 80px;
`

const ColorValue = styled.span`
  font-size: 13px;
  color: var(--color-text-disabled);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  min-width: 90px;
  font-weight: 500;
`

const SwitchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(145deg, var(--color-surface), rgba(255, 255, 255, 0.6));
  border-radius: 12px;
  border: 1px solid var(--color-border);
`

const SwitchInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const SwitchTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 4px 0;
`

const SwitchDesc = styled.p`
  font-size: 13px;
  color: var(--color-text-disabled);
  margin: 0;
`

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
  }

  .ant-modal-header {
    border-bottom: 1px solid var(--color-border);
  }

  .ant-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
  }

  .ant-modal-footer {
    border-top: 1px solid var(--color-border);
  }
`

const ModalOkButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;

  &:hover {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  }
`

const ModalCancelButton = styled(Button)`
  border-radius: 10px;
  font-weight: 500;
`

const loadCustomThemes = (): CustomTheme[] => {
  try {
    const saved = localStorage.getItem('rq-admin-custom-themes')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomThemes = (themes: CustomTheme[]) => {
  localStorage.setItem('rq-admin-custom-themes', JSON.stringify(themes))
}

const ThemeConfig: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentTheme = useAppSelector(state => state.systemInfo.theme)
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(loadCustomThemes)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveCustomThemes(customThemes)
  }, [customThemes])

  const handleThemeSelect = useCallback(
    (theme: ThemeConfig) => {
      dispatch(setTheme(theme.id))
    },
    [dispatch],
  )

  const handleCreateTheme = () => {
    setEditingTheme(null)
    setShowCreateModal(true)
  }

  const handleEditTheme = (theme: CustomTheme) => {
    setEditingTheme(theme)
    setShowCreateModal(true)
  }

  const handleDeleteTheme = useCallback(
    (themeId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这个主题吗？',
        onOk: () => {
          setCustomThemes(prev => prev.filter(theme => theme.id !== themeId))
          if (currentTheme === themeId) {
            dispatch(setTheme('default-light'))
          }
          message.success('主题已删除')
        },
      })
    },
    [dispatch, currentTheme],
  )

  const handleExportTheme = (theme: CustomTheme) => {
    const themeJson = JSON.stringify(theme, null, 2)
    const blob = new Blob([themeJson], { type: 'application/json' })
    saveAs(blob, `theme-${theme.name}.json`)
    message.success('主题导出成功')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const theme = JSON.parse(e.target?.result as string) as CustomTheme
        if (!theme.id || !theme.name || !theme.colors) {
          throw new Error('Invalid theme file')
        }
        const exists = customThemes.some(t => t.id === theme.id || t.name === theme.name)
        if (exists) {
          message.error('主题已存在')
          return
        }
        setCustomThemes([...customThemes, { ...theme, isCustom: true }])
        message.success('主题导入成功')
      } catch {
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
      <ThemeCard
        key={theme.id}
        $isActive={isActive}
        $isCustom={isCustom}
        onClick={() => handleThemeSelect(theme)}
        onMouseEnter={e => {
          const target = e.currentTarget
          const actionButtons = target.querySelector('.action-buttons') as HTMLElement
          if (actionButtons) {
            actionButtons.style.opacity = '1'
          }
        }}
        onMouseLeave={e => {
          const target = e.currentTarget
          const actionButtons = target.querySelector('.action-buttons') as HTMLElement
          if (actionButtons) {
            actionButtons.style.opacity = '0'
          }
        }}
      >
        <ThemeHeader>
          <ThemeName>{theme.name}</ThemeName>
          {isActive && (
            <ActiveBadge>
              <CheckOutlined />
              <span>当前</span>
            </ActiveBadge>
          )}
        </ThemeHeader>

        <ColorPreview>
          {Object.entries(theme.colors)
            .slice(0, 5)
            .map(([key, color]) => (
              <Tooltip key={key} title={key}>
                <ColorDot $color={color} />
              </Tooltip>
            ))}
        </ColorPreview>

        {isCustom && (
          <ActionButtons className="action-buttons">
            <Tooltip title="编辑">
              <StyledButton
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={e => {
                  e.stopPropagation()
                  handleEditTheme(theme as CustomTheme)
                }}
              />
            </Tooltip>
            <Tooltip title="导出">
              <StyledButton
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={e => {
                  e.stopPropagation()
                  handleExportTheme(theme as CustomTheme)
                }}
              />
            </Tooltip>
            <Tooltip title="删除">
              <StyledButton
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteTheme(theme.id)
                }}
              />
            </Tooltip>
          </ActionButtons>
        )}
      </ThemeCard>
    )
  }

  const HiddenFileInput = styled.input`
    display: none;
  `

  return (
    <MainContainer>
      <HiddenFileInput ref={fileInputRef} type="file" accept=".json" onChange={handleFileImport} />
      <HeaderActions>
        <div className="button-group">
          <StyledPrimaryButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTheme}
            size="large"
          >
            新建主题
          </StyledPrimaryButton>
          <StyledSecondaryButton icon={<UploadOutlined />} onClick={handleImportClick} size="large">
            导入主题
          </StyledSecondaryButton>
        </div>
      </HeaderActions>

      <StyledTabs
        items={[
          {
            key: 'preset',
            label: '预设主题',
            children: <ThemeGrid>{presetThemes.map(renderThemeCard)}</ThemeGrid>,
          },
          {
            key: 'custom',
            label: '自定义主题',
            children: (
              <ThemeGrid>
                {customThemes.length > 0 ? (
                  customThemes.map(renderThemeCard)
                ) : (
                  <EmptyState>
                    <EmptyIcon>
                      <PlusOutlined className="icon" />
                    </EmptyIcon>
                    <EmptyText>暂无自定义主题，点击"新建主题"创建</EmptyText>
                  </EmptyState>
                )}
              </ThemeGrid>
            ),
          },
        ]}
      />

      <ThemeEditModal
        open={showCreateModal}
        editingTheme={editingTheme}
        onCancel={() => setShowCreateModal(false)}
        onSave={theme => {
          if (editingTheme) {
            setCustomThemes(
              customThemes.map(t => (t.id === theme.id ? { ...theme, updatedAt: Date.now() } : t)),
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
    </MainContainer>
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
  const [colors, setColors] = useState<ThemeColors>(editingTheme?.colors || presetThemes[0].colors)
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
    <StyledModal
      open={open}
      title={editingTheme ? '编辑主题' : '新建主题'}
      onCancel={onCancel}
      onOk={handleSave}
      width={760}
      okText="保存"
      cancelText="取消"
      footer={[
        <ModalCancelButton key="cancel" onClick={onCancel}>
          取消
        </ModalCancelButton>,
        <ModalOkButton key="ok" type="primary" onClick={handleSave}>
          保存
        </ModalOkButton>,
      ]}
    >
      <ModalContent>
        <FormSection>
          <FormLabel>主题名称</FormLabel>
          <StyledInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入主题名称"
            size="large"
          />
        </FormSection>

        <FormSection>
          <FormLabel>主题颜色</FormLabel>
          <ColorPickerList>
            {Object.entries(colors).map(([key, color]) => (
              <ColorPickerItem key={key}>
                <ColorLabel>{key}</ColorLabel>
                <ColorPicker
                  value={color}
                  onChange={color => setColors({ ...colors, [key]: color.toHexString() })}
                  size="small"
                />
                <ColorValue>{color}</ColorValue>
              </ColorPickerItem>
            ))}
          </ColorPickerList>
        </FormSection>

        <SwitchSection>
          <SwitchInfo>
            <SwitchTitle>深色主题</SwitchTitle>
            <SwitchDesc>标记为深色主题，用于自动切换</SwitchDesc>
          </SwitchInfo>
          <Switch
            checked={isDark}
            onChange={setIsDark}
            size="default"
            checkedChildren="是"
            unCheckedChildren="否"
          />
        </SwitchSection>
      </ModalContent>
    </StyledModal>
  )
}

export default ThemeConfig
