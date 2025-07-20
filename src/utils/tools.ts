import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

// ==================== 设备检测功能 ====================

/**
 * 智能设备检测
 * 优先级：is_tg=1 > is_mobile=1 > 设备检测
 */
export function isMobile(): boolean {
  const urlParams = new URLSearchParams(window.location.search)

  // 1. Telegram 环境强制移动端
  if (urlParams.get('is_tg') === '1') {
    return true
  }

  // 2. URL 参数强制
  if (urlParams.get('is_mobile') === '1') {
    return true
  }

  if (urlParams.get('pc') === '1') {
    return false
  }

  // 3. 设备检测
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileDevice = mobileRegex.test(userAgent)
  const isSmallScreen = window.innerWidth < 768

  return isMobileDevice && isSmallScreen
}

// ==================== Telegram Mini App 功能 ====================

/**
 * 检测是否在 Telegram Mini App 环境中
 */
export function isTelegramMiniApp(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('is_tg') === '1'
}

/**
 * 全面调试 Telegram WebApp 数据
 */
export function debugTelegramWebApp() {
  console.log('🔍 开始调试 Telegram WebApp...')

  try {
    // 1. 检查基本环境
    console.log('📱 User Agent:', navigator.userAgent)
    console.log('🌐 Location:', window.location.href)
    console.log('🔗 Search Params:', window.location.search)

    // 2. 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search)
    console.log('📋 URL Parameters:')
    for (const [key, value] of urlParams.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    // 3. 检查 window.Telegram 对象
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram
      console.log('📡 window.Telegram exists:', !!telegram)

      if (telegram) {
        console.log('🔍 Telegram object keys:', Object.keys(telegram))

        if (telegram.WebApp) {
          const webApp = telegram.WebApp
          console.log('📱 WebApp exists:', !!webApp)
          console.log('🔍 WebApp keys:', Object.keys(webApp))

          // 4. 检查 initDataUnsafe
          if (webApp.initDataUnsafe) {
            console.log('📊 initDataUnsafe:', JSON.stringify(webApp.initDataUnsafe, null, 2))

            if (webApp.initDataUnsafe.user) {
              console.log('👤 User data found:', JSON.stringify(webApp.initDataUnsafe.user, null, 2))
            } else {
              console.log('❌ No user data in initDataUnsafe')
            }
          } else {
            console.log('❌ No initDataUnsafe')
          }

          // 5. 检查 initData 原始字符串
          if (webApp.initData) {
            console.log('📝 Raw initData:', webApp.initData)

            try {
              const params = new URLSearchParams(webApp.initData)
              console.log('📋 initData parsed:')
              for (const [key, value] of params.entries()) {
                console.log(`  ${key}: ${value}`)

                if (key === 'user') {
                  try {
                    const user = JSON.parse(value)
                    console.log('👤 Parsed user:', JSON.stringify(user, null, 2))
                  } catch (e) {
                    console.error('❌ Failed to parse user JSON:', e)
                  }
                }
              }
            } catch (e) {
              console.error('❌ Failed to parse initData:', e)
            }
          } else {
            console.log('❌ No initData')
          }

          // 6. 检查其他有用的属性
          const checkProps = [
            'version', 'isExpanded', 'viewportHeight', 'viewportStableHeight',
            'headerColor', 'backgroundColor', 'isClosingConfirmationEnabled',
            'MainButton', 'BackButton', 'SettingsButton', 'HapticFeedback',
            'CloudStorage', 'BiometricManager'
          ]

          checkProps.forEach(prop => {
            if (webApp[prop] !== undefined) {
              console.log(`🔍 ${prop}:`, webApp[prop])
            }
          })

        } else {
          console.log('❌ No WebApp in Telegram object')
        }
      } else {
        console.log('❌ No Telegram object found')
      }
    }

  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

/**
 * 等待 Telegram WebApp 初始化
 */
export function waitForTelegramWebApp(): Promise<any> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 50 // 最多等待5秒

    const checkWebApp = () => {
      attempts++
      console.log(`⏳ 检查 Telegram WebApp (${attempts}/${maxAttempts})`)

      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const webApp = (window as any).Telegram.WebApp
        console.log('✅ Telegram WebApp found!')
        resolve(webApp)
        return
      }

      if (attempts >= maxAttempts) {
        console.log('❌ Telegram WebApp timeout')
        reject(new Error('Telegram WebApp not found'))
        return
      }

      setTimeout(checkWebApp, 100)
    }

    checkWebApp()
  })
}

/**
 * 获取 Telegram 用户数据 - 增强版
 */
export async function getTelegramUserData() {
  console.log('🔄 获取 Telegram 用户数据...')

  try {
    // 先运行详细调试
    debugTelegramWebApp()

    // 方法1: 从 URL 参数获取（测试用）
    const urlParams = new URLSearchParams(window.location.search)
    const urlTgId = urlParams.get('tg_id')
    const urlTgUsername = urlParams.get('tg_username')

    if (urlTgId) {
      console.log('📱 从 URL 获取 tg_id:', urlTgId)
      return {
        tg_id: urlTgId,
        tg_username: urlTgUsername || '',
        source: 'url'
      }
    }

    // 方法2: 等待并从 Telegram WebApp API 获取
    try {
      const webApp = await waitForTelegramWebApp()

      // 尝试多种方式获取用户 ID
      let userData = null

      // 方式 A: initDataUnsafe.user
      if (webApp.initDataUnsafe?.user?.id) {
        userData = {
          tg_id: webApp.initDataUnsafe.user.id.toString(),
          tg_username: webApp.initDataUnsafe.user.username || '',
          first_name: webApp.initDataUnsafe.user.first_name || '',
          last_name: webApp.initDataUnsafe.user.last_name || '',
          language_code: webApp.initDataUnsafe.user.language_code || '',
          source: 'initDataUnsafe'
        }
        console.log('✅ 从 initDataUnsafe 获取用户数据:', userData)
        return userData
      }

      // 方式 B: 解析 initData 字符串
      if (webApp.initData) {
        try {
          const params = new URLSearchParams(webApp.initData)
          const userStr = params.get('user')

          if (userStr) {
            const user = JSON.parse(userStr)
            if (user.id) {
              userData = {
                tg_id: user.id.toString(),
                tg_username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                language_code: user.language_code || '',
                source: 'initData'
              }
              console.log('✅ 从 initData 解析用户数据:', userData)
              return userData
            }
          }
        } catch (parseError) {
          console.error('❌ 解析 initData 失败:', parseError)
        }
      }

      // 方式 C: 检查是否有 start_param 或其他有用信息
      if (webApp.initDataUnsafe) {
        console.log('ℹ️ 可用的 initDataUnsafe 数据:', webApp.initDataUnsafe)

        // 检查是否有 chat 信息
        if (webApp.initDataUnsafe.chat?.id) {
          console.log('💬 发现 chat.id:', webApp.initDataUnsafe.chat.id)
        }

        // 检查 start_param
        if (webApp.initDataUnsafe.start_param) {
          console.log('🚀 发现 start_param:', webApp.initDataUnsafe.start_param)
        }
      }

    } catch (webAppError) {
      console.log('⚠️ 无法获取 Telegram WebApp:', webAppError.message)
    }

    console.log('❌ 未找到 Telegram 用户数据')
    return null

  } catch (error) {
    console.error('❌ 获取 Telegram 用户数据出错:', error)
    return null
  }
}

/**
 * Telegram 自动登录 - 增强版
 */
export async function handleTelegramAutoLogin(): Promise<boolean> {
  console.log('🔄 开始 Telegram 自动登录...')

  try {
    const store = useAppStore()

    // 检查是否已登录
    if (store.getUser() && store.getToken()) {
      console.log('✅ 用户已登录，跳过自动登录')
      return true
    }

    // 获取 tg_id
    const tgUserData = await getTelegramUserData()
    if (!tgUserData?.tg_id) {
      console.log('❌ 无法获取 Telegram 用户 ID')
      return false
    }

    console.log('📱 准备使用 tg_id 登录:', tgUserData.tg_id)

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
      showToast('Telegram 自动登录成功')

      return true
    } else {
      console.log('❌ 登录接口返回失败:', response)
      return false
    }

  } catch (error) {
    console.error('❌ Telegram 自动登录出错:', error)
    return false
  }
}

/**
 * Telegram WebApp 初始化
 */
export function initTelegramWebApp() {
  console.log('🚀 初始化 Telegram WebApp...')

  // 立即检查环境
  debugTelegramWebApp()

  // 如果在 Telegram 环境中，等待并初始化
  if (isTelegramMiniApp()) {
    waitForTelegramWebApp()
      .then(webApp => {
        console.log('✅ Telegram WebApp 初始化完成')

        // 设置主题
        if (webApp.ready) {
          webApp.ready()
        }

        // 展开应用
        if (webApp.expand) {
          webApp.expand()
        }

        // 禁用关闭确认
        if (webApp.disableClosingConfirmation) {
          webApp.disableClosingConfirmation()
        }

      })
      .catch(error => {
        console.log('❌ Telegram WebApp 初始化失败:', error)
      })
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
