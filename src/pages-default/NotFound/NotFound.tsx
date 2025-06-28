import type { FC } from 'react'
import notFound from '@/assets/svgs/system/not-found.svg'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const NotFound: FC = () => {
  const navigate = useCustomNavigate()
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <img width={'800px'} src={notFound} alt="not-found" />
        <p>页面不存在</p>
        <p>请检查您输入的路径是否正确</p>
        <p>如有疑问请联系管理员</p>
        <p
          className="cursor-pointer text-blue-400 hover:text-blue-700 text-lg"
          onClick={() => navigate('/dashboard')}
          onKeyUp={() => navigate('/dashboard')}
        >
          回到首页
        </p>
      </div>
    </div>
  )
}

export default NotFound
