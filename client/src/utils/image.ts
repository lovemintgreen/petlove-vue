const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export function resolveProductImage(image: string | null | undefined): string {
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/uploads/')) {
    return `${SERVER_ORIGIN}${image}`
  }
  return `${import.meta.env.BASE_URL}img/${image}`
}
