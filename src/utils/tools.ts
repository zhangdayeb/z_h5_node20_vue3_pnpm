import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

// ==================== Telegram Mini App 相关功能 ====================

/**
 * 检测是否在 Telegram Mini App 环境中
 * 简化版本：直接检查 URL 参数
 */
export function isTelegramMiniApp(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('is_tg') === '1'
}

/**
 * 获取 Telegram 用户数据
 * 支持从 URL 参数直接获取 tg_id
 */
export function getTelegramUserData() {
  try {
    // 方法1: 从 URL 参数直接获取 tg_id（优先，方便测试）
    const urlParams = new URLSearchParams(window.location.search)
    const urlTgId = urlParams.get('tg_id')
    if (urlTgId) {
      console.log('📱 Got tg_id from URL parameter:', urlTgId)
      return { tg_id: urlTgId }
    }

    // 方法2: 从 window.Telegram.WebApp 获取
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp

      if (tg.initDataUnsafe?.user?.id) {
        const tg_id = tg.initDataUnsafe.user.id.toString()
        console.log('📱 Got tg_id from WebApp:', tg_id)
        return { tg_id }
      }
    }

    console.log('🚫 No tg_id found')
    return null
  } catch (error) {
    console.error('❌ Error getting Telegram user data:', error)
    return null
  }
}

/**
 * Telegram 自动登录功能
 * 简化版本 - 确保正确保存和更新状态
 */
export async function handleTelegramAutoLogin(): Promise<boolean> {
  try {
    console.log('🔄 Telegram auto login...')

    const store = useAppStore()
    if (store.getUser()) {
      console.log('✅ Already logged in')
      return true
    }

    const tgUserData = getTelegramUserData()
    if (!tgUserData?.tg_id) {
      console.log('🚫 No tg_id available')
      return false
    }

    console.log('🔄 Login with tg_id:', tgUserData.tg_id)

    const response = await api.tglogin({ tg_id: tgUserData.tg_id })

    if (response?.data?.code === 200 && response.data.data) {
      const loginData = response.data.data

      // 设置 token - 会自动保存到 localStorage
      store.setToken(loginData.access_token)
      console.log('✅ Token saved:', loginData.access_token)

      // 转换用户信息格式以匹配 store 期望的格式（参考 loginPop.vue）
      const userForStore = {
        id: loginData.user_info.id,
        name: loginData.user_info.name,
        nick_name: loginData.user_info.nick_name,
        money: loginData.user_info.money,
        level: loginData.user_info.vip_grade, // 将 vip_grade 映射为 level
        vip_grade: loginData.user_info.vip_grade,
        group_prefix: loginData.user_info.group_prefix,
        tg_id: loginData.user_info.tg_id,
        tg_username: loginData.user_info.tg_username
      }

      // 设置用户信息 - 会自动保存到 localStorage
      store.setUser(userForStore)
      console.log('✅ User info saved:', userForStore)

      console.log('✅ Telegram login successful')
      showToast('自动登录成功')

      return true
    } else {
      console.log('❌ Login failed:', response?.data?.message)
      return false
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    return false
  }
}

// ==================== 设备检测功能 ====================

export function isMobile_old(): boolean {
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent)
}

/**
 * 智能设备检测
 * 优先级：is_tg=1 > is_mobile=1 > 设备检测
 */
export function isMobile(): boolean {
  const urlParams = new URLSearchParams(window.location.search)

  // 1. Telegram 环境强制移动端
  if (urlParams.get('is_tg') === '1') {
    console.log('🔧 Force mobile for Telegram')
    return true
  }

  // 2. URL 参数强制
  if (urlParams.get('is_mobile') === '1') {
    console.log('🔧 Force mobile via URL')
    return true
  }

  if (urlParams.get('pc') === '1') {
    console.log('🔧 Force PC via URL')
    return false
  }

  // 3. 设备检测
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileDevice = mobileRegex.test(userAgent)
  const isSmallScreen = window.innerWidth < 768

  return isMobileDevice && isSmallScreen
}

// ==================== 其他工具函数 ====================

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

    if (typeof (api as any)[method] === 'function') {
      if (id !== '') {
        resp = await (api as any)[method](id, d)
      } else {
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

const FRONTEND_TO_BACKEND_LANG_MAP: Record<string, string> = {
  'zh-CN': 'zh',
  'zh-TW': 'hk',
  'en-US': 'en',
  'th-TH': 'th',
  'vi-VN': 'vi',
  'ko-KR': 'ko',
}

export function convertFrontendToBackendLang(frontendLang: string): string {
  const backendLang = FRONTEND_TO_BACKEND_LANG_MAP[frontendLang]
  if (backendLang) {
    console.log(`🌐 Language converted: ${frontendLang} -> ${backendLang}`)
    return backendLang
  }

  const supportedBackendLangs = ['de', 'en', 'es', 'fr', 'hi', 'hk', 'id', 'it', 'ja', 'ko', 'my', 'pt', 'ru', 'th', 'tl', 'tr', 'vi', 'zh']
  if (supportedBackendLangs.includes(frontendLang)) {
    console.log(`🌐 Language already in backend format: ${frontendLang}`)
    return frontendLang
  }

  console.warn(`⚠️ Unsupported frontend language: ${frontendLang}, using default 'en'`)
  return 'en'
}
