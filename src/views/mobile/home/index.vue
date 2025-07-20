<template>
  <div v-if="configStore.isAppReady">
    <RouterView />
    <TabBar />
    <loginPop :isShow="store.loginShow" />
  </div>
  <div v-else-if="configStore.isConfigLoading" class="loading-container">
    <van-loading type="spinner" size="24px" />
    <p class="loading-text">正在加载站点配置...</p>
  </div>
  <div v-else-if="configStore.configLoadError" class="error-container">
    <van-empty description="配置加载失败">
      <van-button type="primary" size="small" @click="configStore.retryLoadConfig">
        重试
      </van-button>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomeIndex' })
import TabBar from './components/tab_bar.vue'
import loginPop from '@/components/loginPop.vue'
import { useAppStore } from '@/stores/app'
import { useConfigStore } from '@/stores/config'
import { onMounted, watch, nextTick } from 'vue'
import { handleTelegramAutoLogin, isTelegramMiniApp } from '@/utils/tools'

const store = useAppStore()
const configStore = useConfigStore()

// ==================== Telegram 自动登录逻辑 ====================

/**
 * 尝试 Telegram 自动登录
 */
async function attemptTelegramAutoLogin() {
  try {
    // 只在 Telegram 环境中且用户未登录时尝试自动登录
    if (!isTelegramMiniApp()) {
      console.log('🚫 Not in Telegram Mini App environment')
      return
    }

    if (store.getUser()) {
      console.log('✅ User already logged in, skipping auto login')
      return
    }

    console.log('📱 Telegram Mini App detected, attempting auto login...')

    // 延迟一点时间确保 Telegram API 完全可用
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = await handleTelegramAutoLogin()

    if (success) {
      console.log('✅ Telegram auto login completed successfully')
    } else {
      console.log('⚠️ Telegram auto login failed or user not registered')
    }
  } catch (error) {
    console.error('❌ Error in Telegram auto login attempt:', error)
  }
}

// ==================== 生命周期和监听器 ====================

// 监听应用就绪状态，当配置加载完成后尝试 Telegram 自动登录
watch(
  () => configStore.isAppReady,
  async (isReady) => {
    if (isReady) {
      console.log('🚀 App is ready, checking for Telegram auto login...')

      // 等待下一个 tick 确保组件完全渲染
      await nextTick()
      await attemptTelegramAutoLogin()
    }
  },
  { immediate: true }
)

// 组件挂载时的处理
onMounted(async () => {
  console.log('🏠 HomeIndex mounted')

  // 如果应用已经就绪，立即尝试 Telegram 自动登录
  if (configStore.isAppReady) {
    await nextTick()
    await attemptTelegramAutoLogin()
  }

  // 如果是 Telegram 环境，设置一些 Telegram 特定的配置
  if (isTelegramMiniApp()) {
    try {
      // 使用 any 类型避免 TypeScript 类型检查
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        // 通知 Telegram 应用已准备就绪
        tg.ready()

        // 设置主题色（可选）
        if (tg.themeParams) {
          console.log('🎨 Telegram theme params:', tg.themeParams)
        }

        // 扩展视窗（可选）
        if (!tg.isExpanded) {
          tg.expand()
        }

        console.log('📱 Telegram WebApp initialized successfully')
      }
    } catch (error) {
      console.error('❌ Error initializing Telegram WebApp:', error)
    }
  }
})
</script>

<style lang="less" scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.loading-text {
  margin-top: 12px;
  color: #646566;
  font-size: 14px;
}
</style>

<style lang="less">
@import url('@/views/mobile/common.less');
</style>
