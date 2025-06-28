import { MoreOutlined } from '@ant-design/icons'
import { Button, message, Popover } from 'antd'
import type { HookAPI } from 'antd/es/modal/useModal'
import type { FC } from 'react'

import { delMenu } from '@/api/system-api'
import type { MenuApiResponse } from '@/types/system-service'

// import LucideIcon from '../lucide-icon'

// 弹出式菜单
type PopoverMenuProps = {
  values: MenuApiResponse
  modal: HookAPI
  onEdit?: (record: MenuApiResponse) => void
  onRefresh?: () => void
}

const Content: FC<PopoverMenuProps> = ({ values, modal, onEdit, onRefresh }) => {
  return (
    <div className="p-0">
      <Button
        type="text"
        // icon={<LucideIcon size={16} name='file-pen-line' />}
        onClick={() => onEdit?.(values)}
      >
        修 改
      </Button>

      <div className="w-full h-[1px] bg-gray-300 my-1" />

      <Button
        type="text"
        // icon={<LucideIcon size={16} name='trash-2' />}
        danger
        onClick={async () => {
          const confirmed = await modal.confirm({
            title: '确认删除？',
            cancelText: '取消',
            okText: '删除',
          })

          if (!confirmed) return

          await delMenu(values.id)
          message.success('删除成功')
          onRefresh?.()
        }}
      >
        删 除
      </Button>
    </div>
  )
}

const PopoverMenu: FC<PopoverMenuProps> = ({ values, modal, onEdit, onRefresh }) => {
  return (
    <Popover
      placement="left"
      trigger="click"
      title={null}
      content={<Content values={values} modal={modal} onEdit={onEdit} onRefresh={onRefresh} />}
    >
      <Button type="text" shape="circle" icon={<MoreOutlined />} />
    </Popover>
  )
}

export default PopoverMenu
