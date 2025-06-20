import { http } from '@/utils/http'

/** 获取已经上传到服务器的图片列表 */
export function getUploadImageList(data: SearchPagination): Promise<CloudAlbumItem[]> {
	return http.post('/uploaded-image-list', data)
}
