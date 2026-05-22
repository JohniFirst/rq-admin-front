export type CloudAlbumItem = {
  id: number
  name: string
  src: string
  description: string
  album?: number
  created_at: string
  updated_at: string
}

export type Album = {
  id: number
  name: string
  description: string
  cover: string
  isPublic: boolean
  imageCount: number
  created_at: string
  updated_at: string
}

type UploadCloudAlbumProps = {
  uploadButtonText?: string
}

export type NewAlbumFormItems = {
  name: string
  description: string
  cover: string
  isPublic: boolean
}
