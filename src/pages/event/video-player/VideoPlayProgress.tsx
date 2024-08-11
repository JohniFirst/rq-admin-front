import { useEffect } from "react";
import "./css/video.css";

function VideoPlayProgress() {
  useEffect(() => {
    const target = document.getElementById("progress-drag-dot")!;
    const progressFinished = document.getElementById("progress-finished")!;
    const progressWP = document.getElementById("progress-wp")!;
    // 进度条的总宽度
    const totalWidth = progressWP.clientWidth - target.clientWidth;

    let isDraging = false;
    // 鼠标按下的初始位置
    let mouseX = 0;
    // 表示进度的小点的初始位置
    let dotX = 0;

    progressWP.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target !== target) {
        progressFinished.style.transition = "width 0.2s ease";
        target.style.transition = "width 0.2s ease";

        target.style.left = e.offsetX - target.offsetWidth / 2 + "px";
        progressFinished.style.width =
          e.offsetX + target.offsetWidth / 2 + "px";

        setTimeout(() => {
          progressFinished.style.transition = "none";
          target.style.transition = "none";
        }, 200);
      }
    });

    document.documentElement.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (e.target === target) {
        isDraging = true;
        // 鼠标按下的初始位置
        mouseX = e.clientX;
        // 表示进度的小点的初始位置
        dotX = target.offsetLeft;
      }
    });

    document.documentElement.addEventListener("mousemove", (e) => {
      e.preventDefault();
      if (isDraging) {
        const moveX = e.clientX - mouseX;

        let newDotX = dotX + moveX;

        // 限制小点只能在进度条内拖动
        if (newDotX < 0) {
          newDotX = 0;
        } else if (newDotX > totalWidth) {
          newDotX = totalWidth;
        }

        target.style.left = newDotX + "px";
        progressFinished.style.width = newDotX + target.offsetWidth / 2 + "px";
      }
    });

    document.documentElement.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (isDraging) {
        isDraging = false;
      }
    });
  }, []);

  return (
    <div id="progress-wp" onClick={(event) => event.stopPropagation()}>
      <div id="progress-finished"></div>
      <div id="progress-drag-dot"></div>
    </div>
  );
}

export default VideoPlayProgress;
