import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Image,
} from '@chakra-ui/react'

interface UploadModalProps {
  isOpen: boolean
  previewUrl: string | null
  caption: string
  onCaptionChange: (v: string) => void
  onCancel: () => void
  onConfirm: () => void
  uploading?: boolean
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  previewUrl,
  caption,
  onCaptionChange,
  onCancel,
  onConfirm,
  uploading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuovo post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              borderRadius="md"
              mb={3}
              maxH="300px"
              objectFit="cover"
              w="100%"
            />
          ) : null}
          <Textarea
            placeholder="Scrivi una descrizione..."
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onCancel} isDisabled={uploading}>
            Annulla
          </Button>
          <Button colorScheme="blue" onClick={onConfirm} isLoading={uploading}>
            Pubblica
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UploadModal
