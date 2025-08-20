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
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
} from '@chakra-ui/react'

interface UploadModalProps {
  isOpen: boolean
  previewUrl: string | null
  caption: string
  onCaptionChange: (v: string) => void
  onCancel: () => void
  onConfirm: () => void
  uploading?: boolean
  imageDateISO: string
  onImageDateChange: (v: string) => void
  sameAsPublish: boolean
  onSameAsPublishChange: (v: boolean) => void
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  previewUrl,
  caption,
  onCaptionChange,
  onCancel,
  onConfirm,
  uploading,
  imageDateISO,
  onImageDateChange,
  sameAsPublish,
  onSameAsPublishChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuovo post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                borderRadius="md"
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
            <FormControl>
              <FormLabel>Data dell'immagine</FormLabel>
              <Checkbox
                isChecked={sameAsPublish}
                onChange={(e) => onSameAsPublishChange(e.target.checked)}
                mb={2}
              >
                Uguale alla data di pubblicazione
              </Checkbox>
              <Input
                type="date"
                value={imageDateISO}
                onChange={(e) => onImageDateChange(e.target.value)}
                isDisabled={sameAsPublish}
              />
            </FormControl>
          </VStack>
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
