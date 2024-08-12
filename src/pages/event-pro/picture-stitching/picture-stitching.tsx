import { type ChangeEvent, useRef, useState } from "react";
import { Button, Col, Row, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import "./css/picture-stitching.css";

function PictureStitching() {
  const imgWrapper = useRef<HTMLDivElement>(null);
  const copyResult = useRef<HTMLCanvasElement>(null);
  const [srcList, setSrcList] = useState<string[]>([]);

  function handleUploadListChange(event: ChangeEvent<HTMLInputElement>): void {
    setSrcList([...srcList, URL.createObjectURL(event.target.files![0])]);
  }

  const copyImg = () => {
    const canvas = copyResult.current!;
    const ctx = canvas.getContext("2d")!;
    const images = imgWrapper.current!.getElementsByTagName("img");

    // Get the original dimensions of the images
    const imageDimensions = Array.from(images).map((img) => {
      return {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    });

    // Find the smallest width
    const smallestWidth = Math.min(...imageDimensions.map((dim) => dim.width));

    // Mark the image with the smallest width
    const smallestWidthIndex = imageDimensions.findIndex(
      (dim) => dim.width === smallestWidth
    );

    // Calculate the scaling factor
    const scaleFactor =
      smallestWidth / Math.max(...imageDimensions.map((dim) => dim.width));

    // Set the canvas width to the smallest width
    canvas.width = smallestWidth;

    // Calculate the total height of the scaled images
    const totalHeight = imageDimensions.reduce((acc, dim, index) => {
      if (index === smallestWidthIndex) {
        return acc + dim.height;
      } else {
        return acc + dim.height * scaleFactor;
      }
    }, 0);

    // Set the canvas height to the total height
    canvas.height = totalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let offsetY = 0;
    for (const img of images) {
      const index = Array.from(images).indexOf(img);
      if (index === smallestWidthIndex) {
        ctx.drawImage(img, 0, offsetY, img.naturalWidth, img.naturalHeight);
      } else {
        const scaledWidth = img.naturalWidth * scaleFactor;
        const scaledHeight = img.naturalHeight * scaleFactor;
        ctx.drawImage(img, 0, offsetY, scaledWidth, scaledHeight);
      }
      offsetY +=
        index === smallestWidthIndex
          ? img.naturalHeight
          : img.naturalHeight * scaleFactor;
    }
  };

  const downloadImg = () => {
    const canvas = copyResult.current!;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "picture-stitching.png";
    link.href = url;
    link.click();
  };

  return (
    <Row className="container">
      <Col span={12}>
        <input type="file" accept="image/*" onChange={handleUploadListChange} />

        <p>
          <Button type="primary" onClick={() => setSrcList([])}>
            清空
          </Button>
        </p>

        <div className="max-w-[400px] border-2" ref={imgWrapper}>
          {srcList.map((src) => (
            <div className="relative" key={src}>
              <img
                className="img-tocopy"
                src={src}
                alt="上传的图片"
                width="100%"
              />
              <DeleteOutlined
                className="img-del-btn"
                onClick={() =>
                  setSrcList(srcList.filter((item) => item !== src))
                }
              />
            </div>
          ))}
        </div>
      </Col>

      <Col span={12}>
        <Space size="middle">
          <Button type="primary" onClick={copyImg}>
            复制
          </Button>

          <Button onClick={downloadImg}>下载</Button>
        </Space>
        <canvas ref={copyResult}></canvas>
      </Col>
    </Row>
  );
}

export default PictureStitching;
