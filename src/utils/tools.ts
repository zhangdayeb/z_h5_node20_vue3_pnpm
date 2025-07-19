import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

export function isMobile_old(): boolean {
  const userAgent = navigator.userAgent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const rest = mobileRegex.test(userAgent)
  return rest
}

export function isMobile(): boolean {
  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search)
  const forceMobile = urlParams.get('mobile') === '1'
  const forcePC = urlParams.get('pc') === '1'

  if (forceMobile) {
    console.log('🔧 Force mobile via URL parameter')
    return true
  }

  if (forcePC) {
    console.log('🔧 Force PC via URL parameter')
    return false
  }

  // 设备检测
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileDevice = mobileRegex.test(userAgent)

  // 屏幕尺寸检测（小于768px认为是移动设备）
  const isSmallScreen = window.innerWidth < 768

  console.log('🔍 Device detection:', {
    userAgent: userAgent.substring(0, 50) + '...',
    isMobileDevice,
    screenWidth: window.innerWidth,
    isSmallScreen,
    finalResult: isMobileDevice && isSmallScreen
  })

  // 只有真正的移动设备且屏幕小才返回 true
  // 这样 iPad 等大屏设备会显示PC版本
  return isMobileDevice && isSmallScreen
}

export function getImgUrl(url: string): string {
  if (url.trim().length <= 0) {
    return ''
  }
  return url
}

export function getImgUrl_old(url: string): string {
  if (url.trim().length <= 0) {
    return ''
  }
  return `${domain}` + url
}

export function getDomain(): string {
  return domain
}

export function getCurrentTime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// 修复 invokeApi 函数的类型和逻辑错误
export async function invokeApi(
  method: string,
  d: object = {},
  id: string | number = '',
  isLoad: boolean = true,
): Promise<AxiosResponse<any> | null> {
  const store = useAppStore()
  if (isLoad) {
    store.loading()
  }

  try {
    let resp: AxiosResponse<any> | null = null

    // 修复：使用正确的 api 对象和类型检查
    if (typeof (api as any)[method] === 'function') {
      if (id !== '') {
        // 如果有 id 参数，传递 id 和 data
        resp = await (api as any)[method](id, d)
      } else {
        // 只传递 data 参数
        resp = await (api as any)[method](d)
      }
    } else {
      console.error(`API method '${method}' not found`)
      if (isLoad) {
        store.stopLoad()
      }
      return null
    }

    console.log(`api ${method} resp:`, resp ?? null)

    // 修复：使用可选链和类型安全的属性访问
    if (resp && (resp.data as any)?.code === 200) {
      if (isLoad) {
        store.stopLoad()
      }
      return resp
    } else {
      if (resp) {
        if (isLoad) {
          store.stopLoad()
        }
        const msg = (resp.data as any)?.message ?? ''
        if (msg.length > 0) {
          showToast(msg)
          return null
        }
        return resp
      }
    }
  } catch (err) {
    console.error('err:', err, 'method', method)
    if (isLoad) {
      store.stopLoad()
    }
  }
  return null
}

export function getDateRange(days: number): [string, string] {
  const start = dayjs().endOf('day')
  const end = dayjs().subtract(days, 'day').startOf('day')
  return [
    start.format('YYYY-MM-DD HH:mm:ss'),
    end.format('YYYY-MM-DD HH:mm:ss'),
  ]
}

export function getYestodayRange(): [string, string] {
  const curr = dayjs().subtract(1, 'day')
  return [
    curr.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    curr.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]
}

/**
 * 前端语言代码映射表
 * 前端使用的语言格式 -> 后端支持的语言格式
 */
const FRONTEND_TO_BACKEND_LANG_MAP: Record<string, string> = {
  'zh-CN': 'zh',  // 简体中文
  'zh-TW': 'hk',  // 繁体中文
  'en-US': 'en',  // 英语
  'th-TH': 'th',  // 泰语
  'vi-VN': 'vi',  // 越南语
  'ko-KR': 'ko',  // 韩语
}



/**
 * 将前端语言代码转换为后端语言代码
 * @param frontendLang 前端语言代码 (如: zh-CN, en-US)
 * @returns 后端语言代码 (如: zh, en) 或原值
 */
export function convertFrontendToBackendLang(frontendLang: string): string {
  const backendLang = FRONTEND_TO_BACKEND_LANG_MAP[frontendLang]
  if (backendLang) {
    console.log(`🌐 Language converted: ${frontendLang} -> ${backendLang}`)
    return backendLang
  }

  // 如果没有找到映射，检查是否已经是后端格式
  const supportedBackendLangs = ['de', 'en', 'es', 'fr', 'hi', 'hk', 'id', 'it', 'ja', 'ko', 'my', 'pt', 'ru', 'th', 'tl', 'tr', 'vi', 'zh']
  if (supportedBackendLangs.includes(frontendLang)) {
    console.log(`🌐 Language already in backend format: ${frontendLang}`)
    return frontendLang
  }

  console.warn(`⚠️ Unsupported frontend language: ${frontendLang}, using default 'en'`)
  return 'en' // 默认返回英语
}
