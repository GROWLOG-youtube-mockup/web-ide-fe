/**
 * 회원가입 시 선택한 프로필 이미지를 임시 저장하고 로그인 후 업로드하는 유틸리티
 */

const PENDING_IMAGE_KEY = "pendingProfileImage"

interface PendingImageData {
  fileName: string
  fileType: string
  fileSize: number
  dataUrl: string
  timestamp: number
}

/**
 * 회원가입 시 프로필 이미지를 임시 저장
 */
export const savePendingProfileImage = async (file: File): Promise<void> => {
  try {
    // 파일을 Base64로 변환
    const dataUrl = await fileToDataUrl(file)

    const imageData: PendingImageData = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      dataUrl,
      timestamp: Date.now(),
    }

    localStorage.setItem(PENDING_IMAGE_KEY, JSON.stringify(imageData))
  } catch (error) {
    console.error("Failed to save pending (user) image:", error)
  }
}

/**
 * 저장된 프로필 이미지를 가져와서 File 객체로 변환
 */
export const getPendingProfileImage = async (): Promise<File | null> => {
  try {
    const data = localStorage.getItem(PENDING_IMAGE_KEY)
    if (!data) return null

    const imageData: PendingImageData = JSON.parse(data)

    // 1시간이 지난 데이터는 삭제
    if (Date.now() - imageData.timestamp > 60 * 60 * 1000) {
      clearPendingProfileImage()
      return null
    }

    // DataURL을 File 객체로 변환
    const file = await dataUrlToFile(imageData.dataUrl, imageData.fileName, imageData.fileType)
    return file
  } catch (error) {
    console.error("Failed to get pending (user) image:", error)
    return null
  }
}

/**
 * 저장된 프로필 이미지 데이터 삭제
 */
export const clearPendingProfileImage = (): void => {
  localStorage.removeItem(PENDING_IMAGE_KEY)
}

/**
 * 저장된 프로필 이미지가 있는지 확인
 */
export const hasPendingProfileImage = (): boolean => {
  return localStorage.getItem(PENDING_IMAGE_KEY) !== null
}

// Helper functions
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const dataUrlToFile = async (
  dataUrl: string,
  fileName: string,
  fileType: string
): Promise<File> => {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], fileName, { type: fileType })
}
