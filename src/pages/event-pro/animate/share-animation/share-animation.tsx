import share from "@/assets/imgs/share.jpg";
import useCustomNavigate from "@/hooks/useCustomNavigate";

const showList = [
  {
    src: share,
    title: "给你一个炫彩的标题",
    descriptions: "lorem ",
    time: "2024-08-14",
  },
];

/**
 *
 * @returns
 */
function ShareAnimation() {
  const navigate = useCustomNavigate();

  function viewDetail() {
    document.startViewTransition(() => {
      navigate("/event-pro/animate/share-animation-detail");
    });
  }

  return (
    <ul className="container">
      {showList.map((item, index) => (
        <li
          className="flex mb-4 border-b-2 py-3"
          onClick={viewDetail}
          key={index}
        >
          <img
            className="mr-4 share-animation"
            src={item.src}
            alt={item.title}
            width={300}
          />
          <div>
            <p className="text-lg">{item.title}</p>
            <p>{item.descriptions}</p>
            <p>{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ShareAnimation;
