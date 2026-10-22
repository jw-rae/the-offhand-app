import { Button } from '@payloadcms/ui'

export function MediaUploadAction() {
  return (
    <Button el="link" to="/admin/collections/media/create" buttonStyle="primary">
      Upload Image
    </Button>
  )
}
