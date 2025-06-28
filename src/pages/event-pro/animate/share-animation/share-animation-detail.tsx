import share from '@/assets/imgs/share.jpg'
import useCustomNavigate from '@/hooks/useCustomNavigate'

/** 共享元素动画详情 */
function ShareAnimationDetail() {
  const navigate = useCustomNavigate()

  const goBack = () => {
    navigate('/event-pro/animate/share-animation')
  }

  return (
    <div>
      <img
        className="share-animation"
        src={share}
        style={{ height: '500px' }}
        alt="测试图片"
        onClick={goBack}
        onKeyUp={goBack}
      />
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quaerat officia doloremque
        sunt aut porro nemo excepturi tenetur quasi provident corrupti suscipit eius, laudantium,
        similique nostrum dolor debitis ea fugiat.
      </p>
    </div>
  )
}

export default ShareAnimationDetail
