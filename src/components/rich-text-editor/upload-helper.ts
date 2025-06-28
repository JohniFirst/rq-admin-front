// 用于图片和视频上传的辅助函数
export function uploadFile(file: File): Promise<string> {
  // 这里应替换为实际上传逻辑，返回文件URL
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}
