// Helper function to safely parse photos field
export function parsePhotosField(fotos: string | null): string[] {
  if (!fotos || fotos === '[]') return []
  
  try {
    const parsed = JSON.parse(fotos)
    return Array.isArray(parsed) ? parsed : [fotos]
  } catch (error) {
    // If it's not valid JSON, treat as single URL
    return [fotos]
  }
}

// Helper function to safely parse JSON fields
export function safeJSONParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue
  
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error)
    return defaultValue
  }
}