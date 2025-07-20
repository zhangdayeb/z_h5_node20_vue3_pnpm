import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

// ==================== 设备检测功能 ====================

/**
 * 智能设备检测
 * 不再依赖 is_tg 参数判断移动端
 */
export function isMobile(): boolean {
  return true
  const urlParams = new URLSearchParams(window.location.search)

  // 1. URL 参数强制
  if (urlParams.get('is_mobile') === '1') {
    return true
  }

  if (urlParams.get('pc') === '1') {
    return false
  }

  // 2. 设备检测
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileDevice = mobileRegex.test(userAgent)
  const isSmallScreen = window.innerWidth < 768

  return isMobileDevice && isSmallScreen
}

// ==================== Telegram Mini App 功能 ====================

/**
 * 检测是否在 Telegram Mini App 环境中
 * 通过检测 window.Telegram.WebApp 对象
 */
export function isTelegramMiniApp(): boolean {
  try {
    // 检查是否存在 Telegram WebApp 对象
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      console.log('✅ Telegram WebApp 对象存在')
      return true
    }

    // 备用：检查 URL 参数（测试用）
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('is_tg') === '1') {
      console.log('✅ 通过 URL 参数判断为 Telegram 环境')
      return true
    }

    console.log('❌ 不是 Telegram 环境')
    return false
  } catch (error) {
    console.log('❌ 检测 Telegram 环境出错:', error)
    return false
  }
}

/**
 * 调试 Telegram WebApp 数据 - 简化版
 */
export function debugTelegramWebApp() {
  try {
    alert('开始调试 Telegram WebApp')

    // 检查 Telegram 对象
    if ((window as any).Telegram) {
      alert('✅ window.Telegram 存在')

      if ((window as any).Telegram.WebApp) {
        alert('✅ Telegram.WebApp 存在')

        const webApp = (window as any).Telegram.WebApp

        // 检查 initDataUnsafe
        if (webApp.initDataUnsafe) {
          alert(`✅ initDataUnsafe 存在: ${JSON.stringify(webApp.initDataUnsafe)}`)

          if (webApp.initDataUnsafe.user) {
            alert(`✅ 用户数据: ${JSON.stringify(webApp.initDataUnsafe.user)}`)
          } else {
            alert('❌ initDataUnsafe 中没有用户数据')
          }
        } else {
          alert('❌ initDataUnsafe 不存在')
        }

        // 检查 initData
        if (webApp.initData) {
          alert(`✅ initData 存在: ${webApp.initData}`)
        } else {
          alert('❌ initData 不存在')
        }

      } else {
        alert('❌ Telegram.WebApp 不存在')
      }
    } else {
      alert('❌ window.Telegram 不存在')
    }

  } catch (error) {
    alert(`❌ 调试出错: ${error}`)
  }
}

/**
 * 获取 Telegram 用户数据 - 简化版
 */
export function getTelegramUserData() {
  try {
    console.log('🔄 获取 Telegram 用户数据...')

    // 方法1: 从 URL 参数获取（测试用）
    const urlParams = new URLSearchParams(window.location.search)
    const urlTgId = urlParams.get('tg_id')

    if (urlTgId) {
      console.log('📱 从 URL 获取 tg_id:', urlTgId)
      alert(`从 URL 获取到 tg_id: ${urlTgId}`)
      return { tg_id: urlTgId }
    }

    // 方法2: 从 Telegram WebApp API 获取
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp

      // 方式 A: initDataUnsafe.user.id
      if (tg.initDataUnsafe?.user?.id) {
        const tg_id = tg.initDataUnsafe.user.id.toString()
        console.log('📱 从 initDataUnsafe 获取 tg_id:', tg_id)
        alert(`从 initDataUnsafe 获取到 tg_id: ${tg_id}`)
        return { tg_id }
      }

      // 方式 B: 解析 initData 字符串
      if (tg.initData) {
        try {
          const params = new URLSearchParams(tg.initData)
          const userStr = params.get('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            if (user.id) {
              const tg_id = user.id.toString()
              console.log('📱 从 initData 解析 tg_id:', tg_id)
              alert(`从 initData 解析到 tg_id: ${tg_id}`)
              return { tg_id }
            }
          }
        } catch (parseError) {
          console.error('❌ 解析 initData 失败:', parseError)
          alert(`解析 initData 失败: ${parseError}`)
        }
      }

      // 如果都没获取到，显示调试信息
      alert('❌ 无法获取 tg_id，开始调试...')
      debugTelegramWebApp()
    } else {
      alert('❌ Telegram WebApp 不存在')
    }

    console.log('❌ 未找到 tg_id')
    return null
  } catch (error) {
    console.error('❌ 获取 Telegram 用户数据出错:', error)
    alert(`获取用户数据出错: ${error}`)
    return null
  }
}

/**
 * Telegram 自动登录
 */
export async function handleTelegramAutoLogin(): Promise<boolean> {
  try {
    console.log('🔄 开始 Telegram 自动登录...')

    const store = useAppStore()

    // 检查是否已登录
    if (store.getUser() && store.getToken()) {
      console.log('✅ 用户已登录')
      return true
    }

    // 获取 tg_id
    const tgUserData = getTelegramUserData()
    if (!tgUserData?.tg_id) {
      console.log('❌ 无法获取 tg_id')
      return false
    }

    console.log('📱 准备登录，tg_id:', tgUserData.tg_id)

    // 调用登录接口
    const response = await api.tglogin({ tg_id: tgUserData.tg_id })

    if (response?.code === 200) {
      const loginData = response.data

      // 保存 token
      store.setToken(loginData.access_token)
      console.log('✅ Token 已保存')

      const user_info = loginData.user_info
      console.log('✅ 用户信息:', user_info)

      const userForStore = {
        id: user_info.id,
        name: user_info.name,
        nick_name: user_info.nick_name,
        money: user_info.money,
        level: user_info.vip_grade,
        vip_grade: user_info.vip_grade
      }

      store.setUser(userForStore)
      showToast('自动登录成功')
      alert('✅ Telegram 自动登录成功!')

      return true
    } else {
      console.log('❌ 登录失败:', response)
      alert(`❌ 登录失败: ${response?.message || '未知错误'}`)
      return false
    }
  } catch (error) {
    console.error('❌ 自动登录出错:', error)
    alert(`❌ 自动登录出错: ${error}`)
    return false
  }
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
      if (isLoad) {
        store.stopLoad()
      }
      return null
    }

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
    return backendLang
  }

  const supportedBackendLangs = ['de', 'en', 'es', 'fr', 'hi', 'hk', 'id', 'it', 'ja', 'ko', 'my', 'pt', 'ru', 'th', 'tl', 'tr', 'vi', 'zh']
  if (supportedBackendLangs.includes(frontendLang)) {
    return frontendLang
  }

  return 'en'
}
