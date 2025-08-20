import { useCallback, useState } from 'react'
import { uploadImageAndCreatePost } from '@services/posts'

export function useUploadPost() {
  const [isOpen, setIsOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageDateISO, setImageDateISO] = useState<string>('')
  const [sameAsPublish, setSameAsPublish] = useState<boolean>(true)

  const pickFile = useCallback((f: File) => {
    setFile(f)
    setCaption('')
    const localUrl = URL.createObjectURL(f)
    setPreviewUrl(localUrl)
    setIsOpen(true)
  }, [])

  const cancel = useCallback(() => {
    setIsOpen(false)
    setCaption('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFile(null)
    setImageDateISO('')
    setSameAsPublish(true)
  }, [previewUrl])

  const confirmUpload = useCallback(
    async (uid: string): Promise<string> => {
      if (!uid || !file) throw new Error('Missing file or user')
      setUploading(true)
      try {
        const { imageUrl } = await uploadImageAndCreatePost({
          uid,
          file,
          caption,
          imageDateISO: sameAsPublish ? undefined : imageDateISO || undefined,
          sameAsPublish,
        })
        return imageUrl
      } finally {
        setUploading(false)
      }
    },
    [file, caption, imageDateISO, sameAsPublish]
  )

  return {
    isOpen,
    caption,
    setCaption,
    previewUrl,
    uploading,
    pickFile,
    cancel,
    confirmUpload,
    imageDateISO,
    setImageDateISO,
    sameAsPublish,
    setSameAsPublish,
  }
}
