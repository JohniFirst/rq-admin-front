import React, { useState } from "react";
import { Badge, Button, Popover, Tabs, type TabsProps } from "antd";
import { BellOutlined } from "@ant-design/icons";

interface MessageNotificationProps {
  unreadMessages: number;
}

type MessageNotificationTab = "unread" | "read";

const MessageNotification: React.FC<MessageNotificationProps> = ({
  unreadMessages,
}) => {
  const [activeTab, setActiveTab] = useState<MessageNotificationTab>("unread"); // 未读消息或已读消息

  const handleTabChange = (key: string) => {
    setActiveTab(key as MessageNotificationTab);
  };

  const handleMarkAllAsRead = () => {
    // 标记所有消息为已读的逻辑
    setActiveTab("read"); // 切换到已读消息标签页
  };

  const items: TabsProps["items"] = [
    {
      key: "unread",
      label: "未读消息列表",
      children: (
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero
            itaque, accusamus totam repudiandae consectetur id facere cupiditate
            eos! Nulla ullam voluptatum natus ea, tenetur voluptate inventore
            deleniti officiis numquam? Sed!
          </p>
          <Button type="primary" onClick={handleMarkAllAsRead}>
            标记所有为已读
          </Button>
        </div>
      ),
    },
    {
      key: "read",
      label: "已读消息列表",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div>
      <Popover
        title="消息列表"
        trigger="click"
        content={
          <Tabs
            className="w-[500px]"
            defaultActiveKey={activeTab}
            items={items}
            onChange={handleTabChange}
          />
        }
      >
        <Badge className="cursor-pointer" count={unreadMessages} size="small">
          <BellOutlined />
        </Badge>
      </Popover>
    </div>
  );
};

export default MessageNotification;
