import { useEffect, useState } from 'react';
import { Divider, Skeleton, Image } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUploadImageList } from '@/api/api-event';

const CloudAlbum = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CloudAlbumList[]>([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);

      const res = await getUploadImageList({ current: 1, pageSize: 10 })

      setData([...data, ...res]);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div id="scrollableDiv" className='container'>
      <h2>这是云相册页面</h2>
      <p>这是介绍</p>
      <InfiniteScroll
        className='columns-5'
        scrollableTarget="scrollableDiv"
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<Skeleton paragraph={{ rows: 2 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      >
        <Image.PreviewGroup items={data.map(item => item.src)}>
          {data.map((item, index) => (
            <Image className='break-inside-avoid' key={index} src={item.src} width='100%' />
          ))}
        </Image.PreviewGroup>
      </InfiniteScroll>
    </div>
  )
}

export default CloudAlbum