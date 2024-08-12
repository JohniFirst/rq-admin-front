import React, { useState, useEffect, useRef } from 'react';

interface VideoVolumeProps {
  value: number;
  onChange: (newValue: number) => void;
}

const VideoVolume: React.FC<VideoVolumeProps> = ({ value, onChange }) => {
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const volumeDragDotRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dotY, setDotY] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === volumeDragDotRef.current) {
      setIsDragging(true);
      setDotY(volumeDragDotRef.current.offsetTop);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const moveY = e.clientY - dotY;
      const newDotY = dotY + moveY;
      const totalHeight = volumeBarRef.current.clientHeight - volumeDragDotRef.current.offsetHeight;

      const clampedDotY = Math.max(0, Math.min(newDotY, totalHeight));
      const newValue = (clampedDotY / totalHeight) * 100;

      volumeDragDotRef.current.style.top = `${clampedDotY}px`;
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const volumeBar = volumeBarRef.current;
    volumeBar.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      volumeBar.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const volumeBar = volumeBarRef.current;
    const totalHeight = volumeBar.clientHeight - volumeDragDotRef.current.offsetHeight;
    const dotY = (value / 100) * totalHeight;

    volumeDragDotRef.current.style.top = `${dotY}px`;
  }, [value]);

  return (
    <div className="volume-bar" ref={volumeBarRef}>
      <div className="volume-drag-dot" ref={volumeDragDotRef} />
    </div>
  );
};

export default VideoVolume;
