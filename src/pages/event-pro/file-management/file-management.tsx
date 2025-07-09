import { useEffect } from 'react'

const FileManagement: React.FC = () => {
  useEffect(() => {
    console.log('FileManagement')
  }, [])

  return (
    <div>
      <h2>此页面用于管理云端文件</h2>
    </div>
  )
}

export default FileManagement
