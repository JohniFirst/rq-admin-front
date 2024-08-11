import { useEffect, useState } from "react";
import "./css/video.css";

import type { MouseEvent, ChangeEvent } from "react";
import VideoPlayProgress from "./VideoPlayProgress";

function VideoPlayer() {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    initControlsSize();
    videoPlayingTimer();
  }, []);

  /**
   * 初始化控制层大小
   */
  const initControlsSize = () => {
    // 不要迷信框架，业务实现怎么方便怎么来
    // 获取video-wp的宽高
    const video = document.querySelector("#video") as HTMLVideoElement;
    const videoWpWidth = video.offsetWidth;
    const videoWpHeight = video.offsetHeight;

    const videoControls = document.querySelector(
      ".video-controls"
    ) as HTMLDivElement;
    videoControls.style.width = `${videoWpWidth}px`;
    videoControls.style.height = `${videoWpHeight}px`;
  };

  /**
   * 视频播放计时器
   */
  const videoPlayingTimer = () => {
    const video = document.querySelector("#video") as HTMLVideoElement;

    video.oncanplay = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", (e: Event) => {
      const video = e.target as HTMLVideoElement;

      setCurrentTime(video.currentTime);
    });
  };

  /**
   * 格式化时间
   * @param time 当前播放进度，单位 s
   * @returns 如果时长大于一小时 hh:mm:ss，否则 mm:ss
   */
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const timePadStart = (time: number, length = 2) => {
      return time.toString().padStart(length, "0");
    };

    let formatResult = `${timePadStart(minutes)}:${timePadStart(seconds)}`;

    if (hours > 0) {
      formatResult += `${timePadStart(hours)}:`;
    }

    return formatResult;
  };

  /**
   * 处理视频播放/暂停
   * @param _event
   */
  const handleVideoPlay = (e: MouseEvent): void => {
    e.stopPropagation();
    const video = document.querySelector("#video") as HTMLVideoElement;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVideoFullScreen = (event: MouseEvent): void => {
    event.stopPropagation();
    console.log(event, "这里写全屏实现代码");
  };

  function handleVideoPlayProgress(event: ChangeEvent<HTMLInputElement>): void {
    const video = document.querySelector("#video") as HTMLVideoElement;

    video.currentTime = +event.target.value;
  }

  return (
    <div className="video-controls-wp" onDoubleClick={handleVideoFullScreen}>
      <video id="video" width="960" src="/demo.mp4" height="540"></video>

      <div onClick={handleVideoPlay} className="video-controls">
        {/* 播放/暂停按钮 */}
        <svg width="205" height="231" className="play-pause-btn">
          <path
            xmlns="http://www.w3.org/2000/svg"
            id="play-icon"
            d="M195 97.97L30 2.7C16.66 -4.99 0 4.63 0 20.02L1.52e-5 210.55C1.52e-5 225.95 16.66 235.57 30 227.87L195 132.61C208.33 124.91 208.33 105.67 195 97.97Z"
            fill="#FFFFFF"
            fillOpacity="1.000000"
            fillRule="evenodd"
          />
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="pause-icon"
            clipPath="url(#clip10_1)"
          >
            <rect
              width="205.000000"
              height="231.000000"
              fill="#FFFFFF"
              fillOpacity="1.000000"
            />
            <rect
              x="62.000000"
              width="80.000000"
              height="231.000000"
              fill="#000000"
              fillOpacity="1.000000"
            />
          </g>
        </svg>

        <div className="controls-bottom-wp">
          <div className="progress-wp">
            {/* 小的播放/暂停按钮 */}
            <div></div>

            {/* 播放进度条 */}
            <VideoPlayProgress max={duration} value={currentTime} />

            {/* 播放时间展示 */}
            <p className="paly-time">
              {formatTime(currentTime)}/{formatTime(duration)}
            </p>
          </div>
          <p>3132132513</p>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
