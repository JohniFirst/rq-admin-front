import {
  Descriptions,
  Form,
  Image,
  Input,
  Masonry,
  Modal,
  Popconfirm,
  Switch,
  Tag,
  Tabs,
  Button,
  message,
} from 'antd'
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PictureOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getUploadImageList } from '@/api/api-event'
import albumAdd from '@/assets/svgs/system/album-add.svg'
import DoubleClickEdit from '@/components/base/double-click-edit'
import UploadCloudAlbum from '@/components/upload-cloud-album'
import { AlbumNameMaxLength } from '@/config/constants'
import type { CloudAlbumItem } from '@/types/global'

// 扩展 CloudAlbumItem 类型以包含业务特定字段
export type ExtendedCloudAlbumItem = CloudAlbumItem & {
  id: string | number
  src: string
  created_at: string
  updated_at: string
  album?: number
}

type Album = {
  id: number
  name: string
  description: string
  cover: string
  isPublic: boolean
  imageCount: number
  created_at: string
  updated_at: string
}

type NewAlbumFormItems = {
  name: string
  description: string
  cover: string
  isPublic: boolean
}

enum CloudAlbumItemType {
  ALL = 0,
  ALBUM = 1,
}

const CloudAlbumImageCard = ({
  item,
  onNameClick,
}: {
  item: ExtendedCloudAlbumItem
  onNameClick: (item: ExtendedCloudAlbumItem) => void
}) => {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: 'var(--box-shadow)',
        transition: 'all 0.3s ease',
        border: '1px solid var(--color-border)',
      }}
      className="hover:shadow-lg"
    >
      <Image
        src={item.src}
        alt={item.name}
        style={{ width: '100%', display: 'block' }}
        preview={{
          mask: <span style={{ color: '#fff' }}>点击预览</span>,
        }}
      />
      <div style={{ padding: '12px' }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: 'var(--color-primary)',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={() => onNameClick(item)}
          onKeyDown={e => e.key === 'Enter' && onNameClick(item)}
          title="点击查看详情"
        >
          {item.name}
        </p>
      </div>
    </div>
  )
}

/** 云相册管理页面 */
const CloudAlbum = () => {
  const [newAlbumForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ExtendedCloudAlbumItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [newAlbumModalVisible, setNewAlbumModalVisible] = useState(false)
  const [editAlbumModalVisible, setEditAlbumModalVisible] = useState(false)
  const [managePhotosModalVisible, setManagePhotosModalVisible] = useState(false)
  const [defaultActive, setDefaultActive] = useState<CloudAlbumItemType>(CloudAlbumItemType.ALL)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ExtendedCloudAlbumItem | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [albumPhotos, setAlbumPhotos] = useState<ExtendedCloudAlbumItem[]>([])

  // Mock 相册数据
  const mockAlbums: Album[] = [
    {
      id: 1,
      name: '风景摄影',
      description: '记录大自然的美丽瞬间',
      cover: 'https://picsum.photos/id/1018/400/600',
      isPublic: true,
      imageCount: 12,
      created_at: '2024-09-01',
      updated_at: '2024-09-20',
    },
    {
      id: 2,
      name: '宠物天地',
      description: '可爱的小动物们',
      cover: 'https://picsum.photos/id/1015/400/300',
      isPublic: true,
      imageCount: 8,
      created_at: '2024-09-05',
      updated_at: '2024-09-19',
    },
    {
      id: 3,
      name: '美食记录',
      description: '舌尖上的美味',
      cover: 'https://picsum.photos/id/1021/400/550',
      isPublic: false,
      imageCount: 15,
      created_at: '2024-09-10',
      updated_at: '2024-09-18',
    },
    {
      id: 4,
      name: '旅行日记',
      description: '走遍天下的足迹',
      cover: 'https://picsum.photos/id/1023/400/620',
      isPublic: true,
      imageCount: 20,
      created_at: '2024-09-12',
      updated_at: '2024-09-17',
    },
  ]

  // Mock 图片数据
  const mockImages: ExtendedCloudAlbumItem[] = [
    {
      id: 1,
      name: '美丽风景1',
      src: 'https://picsum.photos/id/1018/400/600',
      description: '风景图片',
      created_at: '2024-09-20',
      updated_at: '2024-09-20',
    },
    {
      id: 2,
      name: '可爱猫咪',
      src: 'https://picsum.photos/id/1015/400/300',
      description: '猫咪图片',
      created_at: '2024-09-19',
      updated_at: '2024-09-19',
    },
    {
      id: 3,
      name: '高山流水',
      src: 'https://picsum.photos/id/1019/400/500',
      description: '山水图片',
      created_at: '2024-09-18',
      updated_at: '2024-09-18',
    },
    {
      id: 4,
      name: '城市夜景',
      src: 'https://picsum.photos/id/1016/400/400',
      description: '夜景图片',
      created_at: '2024-09-17',
      updated_at: '2024-09-17',
    },
    {
      id: 5,
      name: '森林小径',
      src: 'https://picsum.photos/id/1012/400/700',
      description: '森林图片',
      created_at: '2024-09-16',
      updated_at: '2024-09-16',
    },
    {
      id: 6,
      name: '大海沙滩',
      src: 'https://picsum.photos/id/1013/400/350',
      description: '海滩图片',
      created_at: '2024-09-15',
      updated_at: '2024-09-15',
    },
    {
      id: 7,
      name: '艺术画作',
      src: 'https://picsum.photos/id/1020/400/450',
      description: '艺术图片',
      created_at: '2024-09-14',
      updated_at: '2024-09-14',
    },
    {
      id: 8,
      name: '美食图片',
      src: 'https://picsum.photos/id/1021/400/550',
      description: '美食图片',
      created_at: '2024-09-13',
      updated_at: '2024-09-13',
    },
    {
      id: 9,
      name: '咖啡时光',
      src: 'https://picsum.photos/id/1022/400/380',
      description: '咖啡图片',
      created_at: '2024-09-12',
      updated_at: '2024-09-12',
    },
    {
      id: 10,
      name: '旅行日记',
      src: 'https://picsum.photos/id/1023/400/620',
      description: '旅行图片',
      created_at: '2024-09-11',
      updated_at: '2024-09-11',
    },
    {
      id: 11,
      name: '花卉特写',
      src: 'https://picsum.photos/id/1024/400/480',
      description: '花卉图片',
      created_at: '2024-09-10',
      updated_at: '2024-09-10',
    },
    {
      id: 12,
      name: '建筑艺术',
      src: 'https://picsum.photos/id/1025/400/520',
      description: '建筑图片',
      created_at: '2024-09-09',
      updated_at: '2024-09-09',
    },
  ]

  const loadMoreData = async () => {
    if (loading) return
    try {
      setLoading(true)
      const res = await getUploadImageList({ current: 1, pageSize: 20 })
      // 如果API返回数据则使用API数据，否则使用mock数据展示瀑布流效果
      setData((res.length > 0 ? res : mockImages) as ExtendedCloudAlbumItem[])
      setAlbums(mockAlbums)
      setLoading(false)
    } catch {
      // API失败时使用mock数据确保能展示效果
      setData(mockImages as ExtendedCloudAlbumItem[])
      setAlbums(mockAlbums)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMoreData()
  }, [])

  const addNewAlbum = () => {
    setNewAlbumModalVisible(true)
  }

  const handleImageNameClick = (item: ExtendedCloudAlbumItem) => {
    setSelectedImage(item)
    setDetailModalVisible(true)
  }

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album)
    // 模拟该相册的照片（实际应从API获取）
    const albumImageList = mockImages
      .filter((_, index) => index % album.id === 0)
      .slice(0, album.imageCount || 4)
    setAlbumPhotos(albumImageList.length > 0 ? albumImageList : mockImages.slice(0, 4))
  }

  const handleEditAlbum = (album: Album, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingAlbum(album)
    setEditAlbumModalVisible(true)
  }

  const handleSaveAlbum = (values: NewAlbumFormItems) => {
    if (!editingAlbum) return
    setAlbums(
      albums.map(a =>
        a.id === editingAlbum.id
          ? {
              ...a,
              name: values.name,
              description: values.description,
              cover: values.cover || a.cover,
              isPublic: values.isPublic,
              updated_at: new Date().toISOString().split('T')[0],
            }
          : a,
      ),
    )
    setEditAlbumModalVisible(false)
    setEditingAlbum(null)
    message.success('更新成功')
  }

  const handleManagePhotos = (album: Album, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingAlbum(album)
    const albumImageList = mockImages
      .filter((_, index) => index % album.id === 0)
      .slice(0, album.imageCount || 4)
    setAlbumPhotos(albumImageList.length > 0 ? albumImageList : mockImages.slice(0, 4))
    setManagePhotosModalVisible(true)
  }

  const handleAddPhotoToAlbum = (image: ExtendedCloudAlbumItem) => {
    if (!editingAlbum) return
    if (albumPhotos.some(p => p.id === image.id)) {
      message.warning('这张照片已在相册中')
      return
    }
    setAlbumPhotos([...albumPhotos, image])
    setAlbums(
      albums.map(a => (a.id === editingAlbum.id ? { ...a, imageCount: a.imageCount + 1 } : a)),
    )
    message.success('添加成功')
  }

  const handleRemovePhotoFromAlbum = (imageId: string | number) => {
    if (!editingAlbum) return
    setAlbumPhotos(albumPhotos.filter(p => p.id !== imageId))
    setAlbums(
      albums.map(a =>
        a.id === editingAlbum.id ? { ...a, imageCount: Math.max(0, a.imageCount - 1) } : a,
      ),
    )
    message.success('移除成功')
  }

  const handleDeleteAlbum = (albumId: number) => {
    setAlbums(albums.filter(a => a.id !== albumId))
    message.success('删除成功')
  }

  const onCreateAlbum = (values: NewAlbumFormItems) => {
    const newAlbum: Album = {
      id: Date.now(),
      name: values.name,
      description: values.description,
      cover: values.cover || 'https://picsum.photos/id/1025/400/520',
      isPublic: values.isPublic,
      imageCount: 0,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    }
    setAlbums([...albums, newAlbum])
    setNewAlbumModalVisible(false)
    newAlbumForm.resetFields()
    message.success('创建成功')
  }

  const AllCloudImage = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
          加载中...
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
          暂无图片
        </div>
      )
    }

    return (
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        gutter={16}
        items={data.map(item => ({
          key: item.id,
          data: item,
        }))}
        itemRender={itemInfo => (
          <CloudAlbumImageCard item={itemInfo.data} onNameClick={handleImageNameClick} />
        )}
      />
    )
  }

  const updateAlbumName = (newName: string, albumId: number) => {
    setAlbums(albums.map(a => (a.id === albumId ? { ...a, name: newName } : a)))
    message.success('更新成功')
  }

  const AlbumPage = () => {
    return (
      <>
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {albums.map(album => (
            <li
              key={album.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              className="hover:shadow-lg"
              onClick={() => handleAlbumClick(album)}
            >
              <div style={{ position: 'relative', height: 140 }}>
                <Image
                  src={album.cover}
                  alt={album.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  preview={false}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 4,
                    opacity: 0.7,
                    transition: 'opacity 0.3s',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <Popconfirm
                    title="确定删除这个相册？"
                    description="删除后可以在回收站恢复"
                    onConfirm={() => handleDeleteAlbum(album.id)}
                    okText="确定"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      size="small"
                      style={{
                        color: '#fff',
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: 4,
                        padding: 4,
                      }}
                    />
                  </Popconfirm>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    style={{
                      color: '#fff',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: 4,
                      padding: 4,
                    }}
                    onClick={e => handleEditAlbum(album, e)}
                  />
                  <Button
                    type="text"
                    icon={<PictureOutlined />}
                    size="small"
                    style={{
                      color: '#fff',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: 4,
                      padding: 4,
                    }}
                    onClick={e => handleManagePhotos(album, e)}
                  />
                </div>
                <Tag
                  color={album.isPublic ? 'green' : 'orange'}
                  style={{ position: 'absolute', top: 8, left: 8 }}
                >
                  {album.isPublic ? '公开' : '私密'}
                </Tag>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ marginBottom: 8 }}>
                  <DoubleClickEdit
                    value={album.name}
                    inputProps={{ maxLength: AlbumNameMaxLength }}
                    editFinished={newName => updateAlbumName(newName, album.id)}
                  />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <PictureOutlined />
                  <span>{album.imageCount} 张照片</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                    marginTop: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {album.description}
                </div>
              </div>
            </li>
          ))}

          <li
            style={{
              height: 220,
              background: 'var(--color-surface)',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px dashed var(--color-border)',
              transition: 'all 0.3s',
            }}
            className="hover:border-blue-400 hover:bg-blue-50"
            onClick={addNewAlbum}
            onKeyUp={addNewAlbum}
          >
            <img src={albumAdd} alt="添加相册" style={{ height: 60, opacity: 0.6 }} />
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8 }}>
              创建新相册
            </span>
          </li>
        </ul>

        <Modal
          open={newAlbumModalVisible}
          title="创建新相册"
          okText="立即创建"
          cancelText="取消"
          okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
          onCancel={() => setNewAlbumModalVisible(false)}
          destroyOnHidden
          modalRender={dom => (
            <Form
              layout="vertical"
              form={newAlbumForm}
              name="cloud-album-form"
              clearOnDestroy
              onFinish={values => onCreateAlbum(values)}
              scrollToFirstError={true}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item<NewAlbumFormItems>
            name="cover"
            label="封面"
            rules={[{ required: true, message: '请上传' }]}
          >
            <Input placeholder="选择相册封面" />
          </Form.Item>

          <Form.Item<NewAlbumFormItems>
            name="name"
            label="相册名称"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="最长10个字符" maxLength={10} allowClear showCount />
          </Form.Item>

          <Form.Item<NewAlbumFormItems> name="description" label="相册描述">
            <Input.TextArea placeholder="这里面都放的是什么类型的照片" showCount />
          </Form.Item>

          <Form.Item<NewAlbumFormItems>
            name="isPublic"
            label="是否公开"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Switch defaultChecked />
          </Form.Item>
        </Modal>
      </>
    )
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '24px',
        background: 'var(--color-background)',
        minHeight: '100vh',
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: 'var(--color-text)',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        📷 云相册
      </h2>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Input.Search
          placeholder="输入照片名字进行模糊查询"
          enterButton="搜索"
          size="large"
          style={{ maxWidth: 500 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <UploadCloudAlbum />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 24,
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <motion.p
          style={{
            fontSize: 18,
            fontWeight: defaultActive === CloudAlbumItemType.ALL ? 'bold' : 'normal',
            color: defaultActive === CloudAlbumItemType.ALL ? '#1677ff' : '#666',
            borderBottom: defaultActive === CloudAlbumItemType.ALL ? '2px solid #1677ff' : 'none',
            paddingBottom: 8,
            cursor: 'pointer',
            margin: 0,
          }}
          onClick={() => setDefaultActive(CloudAlbumItemType.ALL)}
          whileHover={{ scale: 1.05 }}
        >
          所有照片 ({data.length})
        </motion.p>
        <motion.p
          style={{
            fontSize: 18,
            fontWeight: defaultActive === CloudAlbumItemType.ALBUM ? 'bold' : 'normal',
            color: defaultActive === CloudAlbumItemType.ALBUM ? '#1677ff' : '#666',
            borderBottom: defaultActive === CloudAlbumItemType.ALBUM ? '2px solid #1677ff' : 'none',
            paddingBottom: 8,
            cursor: 'pointer',
            margin: 0,
          }}
          onClick={() => setDefaultActive(CloudAlbumItemType.ALBUM)}
          whileHover={{ scale: 1.05 }}
        >
          相册
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {defaultActive === CloudAlbumItemType.ALL ? <AllCloudImage /> : <AlbumPage />}
      </motion.div>

      {/* 图片详情弹窗 */}
      <Modal
        open={detailModalVisible}
        title="图片详情"
        footer={[
          <div key="footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Image
              key="preview"
              src={selectedImage?.src}
              style={{ display: 'none' }}
              preview={{
                visible: false,
                onVisibleChange: () => {},
                toolbarRender: () => null,
              }}
            />
            <Input.Search
              key="search"
              placeholder="输入关键字搜索"
              style={{ width: 200 }}
              onSearch={value => console.log('搜索:', value)}
            />
            <Tag key="status" color="green">
              已上传
            </Tag>
          </div>,
        ]}
        onCancel={() => setDetailModalVisible(false)}
        width={700}
        destroyOnHidden
      >
        {selectedImage && (
          <div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: '0 0 300px' }}>
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.name}
                  style={{ width: '100%', borderRadius: 8 }}
                  preview={{
                    mask: <span style={{ color: '#fff' }}>点击放大</span>,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="图片名称">{selectedImage.name}</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    {selectedImage.description || '暂无描述'}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">{selectedImage.created_at}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{selectedImage.updated_at}</Descriptions.Item>
                  <Descriptions.Item label="图片ID">{selectedImage.id}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16 }}>
                  <Tag color="blue">图片</Tag>
                  <Tag color="cyan">云存储</Tag>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 相册详情弹窗 */}
      <Modal
        open={!!selectedAlbum}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => setSelectedAlbum(null)}
              size="small"
            />
            <span>{selectedAlbum?.name}</span>
          </div>
        }
        onCancel={() => setSelectedAlbum(null)}
        width={900}
        footer={null}
        destroyOnHidden
      >
        {selectedAlbum && (
          <div>
            <Descriptions column={3} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="相册名称">{selectedAlbum.name}</Descriptions.Item>
              <Descriptions.Item label="可见性">
                <Tag color={selectedAlbum.isPublic ? 'green' : 'orange'}>
                  {selectedAlbum.isPublic ? '公开' : '私密'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="照片数量">
                <Tag icon={<PictureOutlined />} color="blue">
                  {selectedAlbum.imageCount} 张
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {selectedAlbum.description || '暂无描述'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedAlbum.created_at}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginBottom: 8, color: 'var(--color-text-secondary)' }}>
              相册照片预览
            </div>
            <Masonry
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gutter={8}
              items={mockImages.slice(0, 8).map(item => ({
                key: item.id,
                data: item,
              }))}
              itemRender={itemInfo => (
                <Image
                  src={itemInfo.data.src}
                  alt={itemInfo.data.name}
                  style={{ width: '100%', borderRadius: 4 }}
                  preview={{ mask: <span style={{ color: '#fff' }}>点击预览</span> }}
                />
              )}
            />
          </div>
        )}
      </Modal>

      {/* 编辑相册弹窗 */}
      <Modal
        open={editAlbumModalVisible}
        title="编辑相册"
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setEditAlbumModalVisible(false)
          setEditingAlbum(null)
        }}
        onOk={() => {
          newAlbumForm.submit()
        }}
        destroyOnHidden
      >
        <Form
          form={newAlbumForm}
          layout="vertical"
          initialValues={{
            name: editingAlbum?.name,
            description: editingAlbum?.description,
            cover: editingAlbum?.cover,
            isPublic: editingAlbum?.isPublic,
          }}
          onFinish={handleSaveAlbum}
        >
          <Form.Item
            name="cover"
            label="封面"
            rules={[{ required: true, message: '请输入封面URL' }]}
          >
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>
          <Form.Item
            name="name"
            label="相册名称"
            rules={[{ required: true, message: '请输入相册名称' }]}
          >
            <Input placeholder="最长10个字符" maxLength={10} showCount allowClear />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入相册描述" rows={3} showCount maxLength={100} />
          </Form.Item>
          <Form.Item name="isPublic" label="可见性" valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私密" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 管理相册照片弹窗 */}
      <Modal
        open={managePhotosModalVisible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <span>管理照片 - {editingAlbum?.name}</span>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {albumPhotos.length} 张照片
              </Tag>
            </div>
          </div>
        }
        onCancel={() => {
          setManagePhotosModalVisible(false)
          setEditingAlbum(null)
        }}
        width={1000}
        footer={null}
        destroyOnHidden
      >
        {editingAlbum && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  message.info('上传功能即将推出')
                }}
              >
                上传照片
              </Button>
            </div>
            <Tabs defaultActiveKey="album">
              {/* 相册内照片 */}
              <Tabs.TabPane tab={`相册内照片 (${albumPhotos.length})`} key="album">
                {albumPhotos.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    相册暂无照片，从右侧添加吧
                  </div>
                ) : (
                  <Masonry
                    columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
                    gutter={8}
                    items={albumPhotos.map(item => ({
                      key: item.id,
                      data: item,
                    }))}
                    itemRender={itemInfo => (
                      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                        <Image
                          src={itemInfo.data.src}
                          alt={itemInfo.data.name}
                          style={{ width: '100%', aspectRatio: '1' }}
                          preview={{ mask: <span style={{ color: '#fff' }}>点击预览</span> }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            padding: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                            }}
                            title={itemInfo.data.name}
                          >
                            {itemInfo.data.name}
                          </span>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => handleRemovePhotoFromAlbum(itemInfo.data.id)}
                            style={{ color: '#fff', padding: 0 }}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
              </Tabs.TabPane>

              {/* 可添加照片 */}
              <Tabs.TabPane
                tab={`可添加照片 (${data.filter(img => !albumPhotos.some(p => p.id === img.id)).length})`}
                key="available"
              >
                <div style={{ marginBottom: 12 }}>
                  <Input.Search placeholder="搜索照片" style={{ width: 250 }} />
                </div>
                {data.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    暂无可用照片
                  </div>
                ) : (
                  <Masonry
                    columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
                    gutter={8}
                    items={data
                      .filter(img => !albumPhotos.some(p => p.id === img.id))
                      .map(item => ({
                        key: item.id,
                        data: item,
                      }))}
                    itemRender={itemInfo => (
                      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                        <Image
                          src={itemInfo.data.src}
                          alt={itemInfo.data.name}
                          style={{ width: '100%', aspectRatio: '1', opacity: 0.9 }}
                          preview={{ mask: <span style={{ color: '#fff' }}>点击预览</span> }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            padding: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                            }}
                            title={itemInfo.data.name}
                          >
                            {itemInfo.data.name}
                          </span>
                          <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddPhotoToAlbum(itemInfo.data)}
                            style={{ padding: '2px 8px', height: 24, fontSize: 12 }}
                          />
                        </div>
                      </div>
                    )}
                  />
                )}
              </Tabs.TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CloudAlbum
