import { BellOutlined } from '@ant-design/icons'
import { Badge, Button, Popover, Tabs, type TabsProps } from 'antd'
import type React from 'react'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { headerButtonBase } from './styles'

interface MessageNotificationProps {
  unreadMessages: number
}

type MessageNotificationTab = 'unread' | 'read'

interface MessageItem {
  id: number
  type: 'notification' | 'system' | 'warning'
  title: string
  desc: string
  time: string
}

// 模拟消息数据
const mockMessages: Record<MessageNotificationTab, MessageItem[]> = {
  unread: [
    {
      id: 1,
      type: 'notification',
      title: '系统更新通知',
      desc: '系统将于今晚10点进行版本更新，届时可能会有短暂的不可用...',
      time: '5分钟前',
    },
    {
      id: 2,
      type: 'system',
      title: '新功能上线',
      desc: '全新的数据可视化功能已上线，快来体验吧！',
      time: '30分钟前',
    },
    {
      id: 3,
      type: 'warning',
      title: '存储空间提醒',
      desc: '您的存储空间已使用80%，建议及时清理不需要的文件。',
      time: '2小时前',
    },
  ],
  read: [
    {
      id: 4,
      type: 'notification',
      title: '账号安全提醒',
      desc: '您的账号在新设备上登录，如非本人操作请及时修改密码。',
      time: '昨天',
    },
    {
      id: 5,
      type: 'system',
      title: '周报生成完成',
      desc: '您的本周工作周报已生成，可以前往查看。',
      time: '2天前',
    },
  ],
}

const NotificationWrapper = styled.button`
  ${headerButtonBase}
  padding: 0;
`

const NotificationPanel = styled.div`
  width: 380px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);

      .title-icon {
        font-size: 18px;
      }
    }

    .mark-all-link {
      font-size: 13px;
      color: var(--color-primary);
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .panel-tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .ant-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .ant-tabs-content {
      flex: 1;
      overflow: hidden;
    }

    .ant-tabs-tabpane {
      height: 100%;
      overflow: hidden;
    }

    .ant-tabs-nav {
      margin: 0;
      padding: 0 16px;
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 10px 12px;
      margin: 0;
    }

    .ant-tabs-ink-bar {
      background: var(--color-primary);
    }
  }

  .message-list {
    height: 100%;
    overflow-y: auto;
    padding: 8px 16px 16px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 2px;
    }
  }

  .mark-all-btn {
    margin: 0 16px 16px;
    height: 40px;
    background: var(--color-primary);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
  }
`

const MessageItemWrapper = styled.div<{ $isUnread: boolean }>`
  display: flex;
  gap: 12px;
  padding: 14px;
  margin-bottom: 8px;
  background: var(--color-surface);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  border-left: ${props => (props.$isUnread ? '3px solid var(--color-primary)' : 'none')};
  background: ${props =>
    props.$isUnread
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, var(--color-surface) 100%)'
      : 'var(--color-surface)'};
  opacity: ${props => (props.$isUnread ? 1 : 0.7)};

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    opacity: 1;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const MessageIcon = styled.div<{ $type: MessageItem['type'] }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$type) {
      case 'notification':
        return 'linear-gradient(135deg, var(--color-primary) 0%, #818cf8 100%)'
      case 'system':
        return 'linear-gradient(135deg, var(--color-success) 0%, #34d399 100%)'
      case 'warning':
        return 'linear-gradient(135deg, var(--color-warning) 0%, #fbbf24 100%)'
    }
  }};
`

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;

  .message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
  }

  .message-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .unread-dot {
    width: 8px;
    height: 8px;
    background: var(--color-primary);
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .message-desc {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .message-time {
    font-size: 12px;
    color: var(--color-text-disabled);
    margin-top: 6px;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--color-text-disabled);
  font-size: 14px;
`

const MessageItemCard: React.FC<{ message: MessageItem; isUnread: boolean }> = ({
  message,
  isUnread,
}) => (
  <MessageItemWrapper $isUnread={isUnread}>
    <MessageIcon $type={message.type}>🔔</MessageIcon>
    <MessageContent>
      <div className="message-header">
        <div className="message-title">{message.title}</div>
        {isUnread && <div className="unread-dot" />}
      </div>
      <div className="message-desc">{message.desc}</div>
      <div className="message-time">{message.time}</div>
    </MessageContent>
  </MessageItemWrapper>
)

const MessageNotification: React.FC<MessageNotificationProps> = ({ unreadMessages }) => {
  const [activeTab, setActiveTab] = useState<MessageNotificationTab>('unread')

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'unread',
        label: `未读 (${unreadMessages})`,
        children: (
          <div className="message-list">
            {mockMessages.unread.length > 0 ? (
              <>
                {mockMessages.unread.map(msg => (
                  <MessageItemCard key={msg.id} message={msg} isUnread />
                ))}
                <Button className="mark-all-btn">全部标记为已读</Button>
              </>
            ) : (
              <EmptyState>暂无未读消息</EmptyState>
            )}
          </div>
        ),
      },
      {
        key: 'read',
        label: '已读',
        children: (
          <div className="message-list">
            {mockMessages.read.length > 0 ? (
              mockMessages.read.map(msg => (
                <MessageItemCard key={msg.id} message={msg} isUnread={false} />
              ))
            ) : (
              <EmptyState>暂无已读消息</EmptyState>
            )}
          </div>
        ),
      },
    ],
    [unreadMessages],
  )

  return (
    <NotificationWrapper>
      <Popover
        trigger="click"
        content={
          <NotificationPanel>
            <div className="panel-header">
              <div className="header-title">
                <span className="title-icon">🔔</span>
                消息中心
              </div>
              {activeTab === 'unread' && <span className="mark-all-link">全部已读</span>}
            </div>
            <div className="panel-tabs">
              <Tabs
                activeKey={activeTab}
                items={items}
                onChange={key => setActiveTab(key as MessageNotificationTab)}
              />
            </div>
          </NotificationPanel>
        }
        placement="bottomRight"
      >
        <Badge count={unreadMessages} size="small">
          <BellOutlined style={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
        </Badge>
      </Popover>
    </NotificationWrapper>
  )
}

export default MessageNotification
