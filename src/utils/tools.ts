import dayjs from 'dayjs'
import api from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin

// ==================== 设备检测功能 ====================

export function mobileFunc(): boolean {
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

// 返回主页类型
export function mainTypeFunc(): string {
  const urlParams = new URLSearchParams(window.location.search)

  // 1. URL 参数强制
  if (urlParams.get('mt') == '1') {
    return 'main_game'
  }else if(urlParams.get('mt') == '2') {
    return 'main_supplier'
  }else{
    return 'main_game'
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

// ==================== Telegram Mini App 功能 ====================

/**
 * 简化的 Telegram 用户数据获取 - 优先使用 URL fragment 方案
 */
export function getTelegramUserData() {
  try {
    console.log('🔄 获取 Telegram 用户数据...');
    console.log('🔍 当前完整URL:', window.location.href);

    // 方法1: 从 URL fragment (hash) 获取 - 你要的主要方案
    const hash = window.location.hash;
    console.log('🔍 URL fragment:', hash);

    if (hash && hash.length > 1) {
      try {
        // 移除开头的 #
        const hashContent = hash.substring(1);
        console.log('🔍 处理 hash 内容:', hashContent);

        const hashParams = new URLSearchParams(hashContent);

        // 直接获取 tg_id
        const fragmentTgId = hashParams.get('tg_id');
        if (fragmentTgId) {
          console.log('📱 从 URL fragment 获取 tg_id:', fragmentTgId);
          alert(`✅ 从 URL fragment 获取到 tg_id: ${fragmentTgId}`);
          return { tg_id: fragmentTgId };
        }

        // 解析 Telegram initData 格式中的 user 字段
        const userStr = hashParams.get('user');
        if (userStr) {
          const user = JSON.parse(decodeURIComponent(userStr));
          if (user.id) {
            console.log('📱 从 fragment initData 解析 tg_id:', user.id);
            alert(`✅ 从 fragment initData 解析到 tg_id: ${user.id}`);
            return { tg_id: user.id.toString() };
          }
        }

        // 如果不是标准格式，尝试直接在 hash 中查找 tg_id
        const tgIdMatch = hashContent.match(/tg_id[=:](\d+)/);
        if (tgIdMatch) {
          const tg_id = tgIdMatch[1];
          console.log('📱 从 fragment 正则匹配 tg_id:', tg_id);
          alert(`✅ 从 fragment 正则匹配到 tg_id: ${tg_id}`);
          return { tg_id };
        }

        console.log('🔍 fragment 存在但未找到有效的 tg_id 数据');
      } catch (error) {
        console.log('❌ 解析 URL fragment 失败:', error);
      }
    } else {
      console.log('🔍 URL fragment 为空');
    }

    // 方法2: 标准 Telegram WebApp API (官方推荐)
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;

      // 确保 WebApp 已初始化
      if (typeof tg.ready === 'function') {
        tg.ready();
      }

      console.log('🔍 Telegram WebApp 检测成功');

      // 方式 A: 从 initDataUnsafe 获取 (推荐)
      if (tg.initDataUnsafe?.user?.id) {
        const tg_id = tg.initDataUnsafe.user.id.toString();
        console.log('📱 从 initDataUnsafe 获取 tg_id:', tg_id);
        return { tg_id };
      }

      // 方式 B: 解析 initData 字符串
      if (tg.initData) {
        try {
          const params = new URLSearchParams(tg.initData);
          const userStr = params.get('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.id) {
              const tg_id = user.id.toString();
              console.log('📱 从 initData 解析 tg_id:', tg_id);
              return { tg_id };
            }
          }
        } catch (parseError) {
          console.error('❌ 解析 initData 失败:', parseError);
        }
      }

      console.log('❌ Telegram WebApp 存在但无用户数据');
      return null;
    }

    // 方法3: 从 URL 参数获取 (测试用)
    const urlParams = new URLSearchParams(window.location.search);
    const urlTgId = urlParams.get('tg_id');
    if (urlTgId) {
      console.log('📱 从 URL 参数获取 tg_id:', urlTgId);
      return { tg_id: urlTgId };
    }

    console.log('❌ 未找到 tg_id');
    return null;

  } catch (error) {
    console.error('❌ 获取 Telegram 用户数据出错:', error);
    return null;
  }
}

/**
 * 检测是否在 Telegram 环境中
 */
export function isTelegramMiniApp(): boolean {
  try {
    // 检查 Telegram WebApp 对象
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      console.log('✅ Telegram WebApp 对象存在');
      return true;
    }

    // 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('is_tg') === '1') {
      console.log('✅ 通过 URL 参数判断为 Telegram 环境');
      return true;
    }

    // 检查 URL fragment 中是否有 Telegram 相关数据
    const hash = window.location.hash;
    if (hash && (hash.includes('tg_id') || hash.includes('user='))) {
      console.log('✅ 通过 URL fragment 判断为 Telegram 环境');
      return true;
    }

    console.log('❌ 不是 Telegram 环境');
    return false;
  } catch (error) {
    console.log('❌ 检测 Telegram 环境出错:', error);
    return false;
  }
}

/**
 * Telegram 自动登录 - 使用简化的数据获取方式
 */
export async function handleTelegramAutoLogin(): Promise<boolean> {
  try {
    console.log('🔄 开始 Telegram 自动登录...');

    const store = useAppStore();

    // 检查是否已登录
    if (store.getUser() && store.getToken()) {
      console.log('✅ 用户已登录');
      return true;
    }

    // 获取 tg_id
    const tgUserData = getTelegramUserData();
    if (!tgUserData?.tg_id) {
      console.log('❌ 无法获取 tg_id');
      return false;
    }

    console.log('📱 准备登录，tg_id:', tgUserData.tg_id);

    // 调用登录接口
    const response = await api.tglogin({ tg_id: tgUserData.tg_id });

    if (response?.code === 200) {
      const loginData = response.data;

      // 保存 token
      store.setToken(loginData.access_token);
      console.log('✅ Token 已保存');

      const user_info = loginData.user_info;
      console.log('✅ 用户信息:', user_info);

      const userForStore = {
        id: user_info.id,
        name: user_info.name,
        nick_name: user_info.nick_name,
        money: user_info.money,
        level: user_info.vip_grade,
        vip_grade: user_info.vip_grade
      };

      store.setUser(userForStore);
      showToast('自动登录成功');
      console.log('✅ Telegram 自动登录成功!');

      return true;
    } else {
      console.log('❌ 登录失败:', response);
      return false;
    }
  } catch (error) {
    console.error('❌ 自动登录出错:', error);
    return false;
  }
}
