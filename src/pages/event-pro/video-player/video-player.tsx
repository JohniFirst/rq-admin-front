import { Card, Tabs } from 'antd'
import type React from 'react'
import VideoPlayer from '@/components/video-player'

const VideoPlayerPage: React.FC = () => {
  // 使用更长的测试视频
  const videos = [
    {
      key: '1',
      title: '长视频示例 (20分钟)',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    },
    {
      key: '2',
      title: '另一个长视频示例 (25分钟)',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      poster:
        'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card title="视频播放器演示" className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">功能说明</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>点击视频区域或中央播放按钮可以播放/暂停视频</li>
            <li>鼠标悬停在进度条上可以预览对应时间的视频画面</li>
            <li>点击进度条可以跳转到对应时间点</li>
            <li>使用音量控制、播放速度、清晰度、弹幕等功能</li>
            <li>点击截屏按钮可以截取当前视频画面</li>
            <li>点击全屏按钮或按F键可以切换全屏模式</li>
          </ul>
        </div>

        <Tabs
          defaultActiveKey="1"
          items={videos.map(video => ({
            key: video.key,
            label: video.title,
            children: (
              <div className="my-4">
                <VideoPlayer src={video.url} poster={video.poster} width="100%" height="auto" />
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  )
}

export default VideoPlayerPage
