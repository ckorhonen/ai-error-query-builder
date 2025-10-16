/**
 * Utility functions for clipboard operations
 */

/**
 * Copy text to clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    textArea.remove()
    
    return successful
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return (
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy')
  )
}
