import { useEffect, useRef, useState } from "react";

interface VideoPlayProgressProps {
  max: number;
  value: number;
  onChange: (newValue: number) => void;
}


/**
 * A video play progress bar component that allows users to drag and drop to change the video playback progress.
 *
 * @param {Object} props - The component props.
 * @param {number} props.max - The maximum value of the progress bar.
 * @param {number} props.value - The current value of the progress bar.
 * @param {function} props.onChange - A callback function that is called when the progress bar value changes.
 * @return {JSX.Element} The video play progress bar component.
 */
function VideoPlayProgress({ max, value, onChange }: VideoPlayProgressProps) {
  const progressDragDotRef = useRef<HTMLDivElement>(null);
  const progressFinishedRef = useRef<HTMLDivElement>(null);
  const progressWPRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dotX, setDotX] = useState(0);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLDivElement;
    if (target !== progressDragDotRef.current) {
      const progressFinished = progressFinishedRef.current!;
      const progressWP = progressWPRef.current!;
      const totalWidth =
        progressWP.clientWidth - progressDragDotRef.current!.clientWidth;

      progressFinished.style.transition = "width 0.2s ease";
      progressDragDotRef.current!.style.transition = "width 0.2s ease";

      const newValue = (e.offsetX / totalWidth) * max;
      progressDragDotRef.current!.style.left = `${
        e.offsetX - progressDragDotRef.current!.offsetWidth / 2
      }px`;
      progressFinished.style.width = `${
        e.offsetX + progressDragDotRef.current!.offsetWidth / 2
      }px`;

      onChange(newValue);

      setTimeout(() => {
        progressFinished.style.transition = "none";
        progressDragDotRef.current!.style.transition = "none";
      }, 200);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target === progressDragDotRef.current) {
      setIsDragging(true);
      setDotX(progressDragDotRef.current!.offsetLeft);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const moveX = e.clientX - dotX;
      const newDotX = dotX + moveX;
      const totalWidth =
        progressWPRef.current!.clientWidth -
        progressDragDotRef.current!.clientWidth;

      const clampedDotX = Math.max(0, Math.min(newDotX, totalWidth));
      const newValue = (clampedDotX / totalWidth) * max;

      progressDragDotRef.current!.style.left = `${clampedDotX}px`;
      progressFinishedRef.current!.style.width = `${
        clampedDotX + progressDragDotRef.current!.offsetWidth / 2
      }px`;

      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.documentElement.addEventListener("mousedown", handleMouseDown);
    document.documentElement.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.removeEventListener(
        "mousedown",
        handleMouseDown
      );
      document.documentElement.removeEventListener(
        "mousemove",
        handleMouseMove
      );
      document.documentElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const progressWP = progressWPRef.current!;
    const totalWidth =
      progressWP.clientWidth - progressDragDotRef.current!.clientWidth;
    const dotX = (value / max) * totalWidth;

    progressDragDotRef.current!.style.left = `${dotX}px`;
    progressFinishedRef.current!.style.width = `${
      dotX + progressDragDotRef.current!.offsetWidth / 2
    }px`;
  }, [value]);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <div ref={progressWPRef} id="progress-wp" onClick={handleClick}>
      <div ref={progressFinishedRef} id="progress-finished"></div>
      <div ref={progressDragDotRef} id="progress-drag-dot"></div>
    </div>
  );
}

export default VideoPlayProgress;
