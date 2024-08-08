/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useState } from "react";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons"

function FullScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    // 监听全屏变化事件
    const fullscreenchange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement
          ? true
          : false
      );
    };

    document.addEventListener("fullscreenchange", fullscreenchange);
    document.addEventListener("mozfullscreenchange", fullscreenchange);
    document.addEventListener("webkitfullscreenchange", fullscreenchange);
    document.addEventListener("msfullscreenchange", fullscreenchange);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenchange);
      document.removeEventListener("mozfullscreenchange", fullscreenchange);
      document.removeEventListener("webkitfullscreenchange", fullscreenchange);
      document.removeEventListener("msfullscreenchange", fullscreenchange);
    };
  }, []);

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    </button>
  );
}

export default FullScreen;
