type CloudAlbumItem = {
  id: number
  name: string
  src: string
  description: string
  album?: number
  created_at: string
  updated_at: string
}

type UploadCloudAlbumProps = {
	uploadButtonText?: string
}

type NewAlbumFormItems = {
  name: string
  description: string
  cover: string
  isPublic: boolean
}