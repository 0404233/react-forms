const MAX_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED = ['image/png', 'image/jpeg']


export function validateImageFile(file?: File) {
  if (!file) return { ok: true }
  if (!ALLOWED.includes(file.type)) return { ok: false, error: 'Only PNG or JPEG allowed' }
  if (file.size > MAX_SIZE_BYTES) return { ok: false, error: 'Max file size is 2MB' }
  return { ok: true }
}


export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}