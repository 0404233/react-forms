import { describe, it, expect, vi } from 'vitest'
import { validateImageFile, fileToBase64 } from './image'

describe('validateImageFile', () => {
  it('returns ok: true if no file is provided', () => {
    expect(validateImageFile()).toEqual({ ok: true })
  })

  it('returns an error if the file type is not allowed', () => {
    const file = new File(['dummy'], 'test.gif', { type: 'image/gif' })
    expect(validateImageFile(file)).toEqual({ ok: false, error: 'Only PNG or JPEG allowed' })
  })

  it('returns an error if the file size exceeds 2MB', () => {
    const bigFile = new File(['a'.repeat(2 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' })
    expect(validateImageFile(bigFile)).toEqual({ ok: false, error: 'Max file size is 2MB' })
  })

  it('returns ok: true if the file is valid', () => {
    const validFile = new File(['a'.repeat(1024)], 'valid.png', { type: 'image/png' })
    expect(validateImageFile(validFile)).toEqual({ ok: true })
  })
})

describe('fileToBase64', () => {
  it('converts a file to a base64 string', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    const result = await fileToBase64(file)
    expect(result.startsWith('data:image/png;base64,')).toBe(true)
  })

  it('handles file read error', async () => {
    const file = new File(['fail'], 'fail.png', { type: 'image/png' })

    const originalReader = globalThis.FileReader
    class MockReader {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      readAsDataURL() {
        if (this.onerror) this.onerror()
      }
    }
    vi.stubGlobal('FileReader', MockReader as any)

    await expect(fileToBase64(file)).rejects.toThrow('Failed to read file')

    vi.stubGlobal('FileReader', originalReader)
  })
})