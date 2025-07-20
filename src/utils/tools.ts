import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

// ==================== Telegram Mini App 相关功能 ====================

/**
 * 检测是否在 Telegram Mini App 环境中
 */
export function isTelegramMiniApp(): boolean {
  return !!(window as any).Telegram?.WebApp
}

/**
 * 获取 Telegram 用户数据
 */
export function getTelegramUserData() {
  try {
    // 使用 any 类型避免 TypeScript 类型检查
    const tg = (window as any).Telegram?.WebApp
    if (!tg) {
      console.log('🚫 Telegram WebApp not available')
      return null
    }

    // 获取用户数据
    const initDataUnsafe = tg.initDataUnsafe
    if (!initDataUnsafe?.user) {
      console.log('🚫 Telegram user data not available')
      return null
    }

    const userData = {
      tg_id: initDataUnsafe.user.id?.toString(),
      username: initDataUnsafe.user.username,
      first_name: initDataUnsafe.user.first_name,
      last_name: initDataUnsafe.user.last_name,
      language_code: initDataUnsafe.user.language_code,
      is_premium: initDataUnsafe.user.is_premium
    }

    console.log('📱 Telegram user data:', userData)
    return userData
  } catch (error) {
    console.error('❌ Error getting Telegram user data:', error)
    return null
  }
}

/**
 * Telegram 自动登录功能
 */
export async function handleTelegramAutoLogin(): Promise<boolean> {
  try {
    // 检查是否在 Telegram 环境中
    if (!isTelegramMiniApp()) {
      console.log('🚫 Not in Telegram Mini App environment')
      return false
    }

    // 检查用户是否已经登录
    const store = useAppStore()
    if (store.getUser()) {
      console.log('✅ User already logged in')
      return true
    }

    // 获取 Telegram 用户数据
    const tgUserData = getTelegramUserData()
    if (!tgUserData?.tg_id) {
      console.log('🚫 No Telegram user ID available')
      return false
    }

    console.log('🔄 Attempting Telegram auto login...')

    // 调用 TG 登录接口
    const response = await api.tglogin({
      tg_id: tgUserData.tg_id
    })

    if (response?.data?.code === 200 && response.data.data) {
      const loginData = response.data.data

      // 保存登录信息到 store
      store.setToken(loginData.access_token)
      store.setUser(loginData.user_info)

      console.log('✅ Telegram auto login successful')
      showToast('Telegram 自动登录成功')
      return true
    } else {
      console.log('❌ Telegram auto login failed:', response?.data?.message)
      // 不显示错误提示，因为可能是用户未注册等正常情况
      return false
    }
  } catch (error) {
    console.error('❌ Telegram auto login error:', error)
    return false
  }
}

// ==================== 设备检测功能 ====================

export function isMobile_old(): boolean {
  const userAgent = navigator.userAgent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const rest = mobileRegex.test(userAgent)
  return rest
}

/**
 * 智能设备检测 - 支持 Telegram Mini App
 * 优先级：Telegram > URL参数 > 设备检测
 */
export function isMobile(): boolean {
  // 1. 首先检查是否在 Telegram Mini App 中
  if (isTelegramMiniApp()) {
    console.log('🔧 Force mobile for Telegram Mini App')
    return true
  }

  // 2. 检查URL参数
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

  // 3. 设备检测
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

// ==================== 图片和域名相关 ====================

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

// ==================== 时间相关功能 ====================

export function getCurrentTime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
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

// ==================== API 调用相关 ====================

/**
 * 通用 API 调用函数 - 修复版本
 */
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
        }
      }
      if (isLoad) {
        store.stopLoad()
      }
      return resp
    }
  } catch (err) {
    console.error('API调用错误:', err, 'method:', method)
    if (isLoad) {
      store.stopLoad()
    }
    showToast('网络请求失败')
  }
  return null
}

// ==================== 语言转换功能 ====================

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
