<template>
  <div class="m-toGame-par">
    <van-nav-bar
      left-arrow
      :title="$t('mine.toGame')"
      @click-left="onClickLeft"
    />
    <div class="m-toGame">
      <!-- 页面初始加载状态 -->
      <div class="m-loading" v-if="loading">
        <van-loading size="24" color="#fff">{{ $t('loading') }}</van-loading>
      </div>

      <!-- 主内容区域 -->
      <div class="m-game-info" v-else>
        <div class="m-title">{{ $t('enterGame') }}</div>
        <div class="m-content">
          <!-- 游戏启动加载状态 -->
          <div v-if="entering" class="m-entering-overlay">
            <div class="m-entering-content">
              <van-loading type="spinner" size="32" color="#fff" />
              <div class="m-entering-text">
                <p class="main-text">{{ currentLoadingText }}</p>
                <p class="sub-text">{{ $t('pleaseWait') }}</p>
              </div>
              <div class="m-progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 进入游戏按钮 -->
          <van-button
            size="large"
            color="#8b0000"
            class="m-enter-btn"
            @click="enterGame"
            :loading="entering"
            :disabled="entering"
          >
            {{ entering ? currentLoadingText : $t('enterGame') }}
          </van-button>
        </div>
      </div>
    </div>
    <a ref="gameLink" href="" target="_self" style="display: none"></a>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { invokeApi } from '@/utils/tools'
import { showDialog } from 'vant'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const lobbyUrl = window.location.origin;
defineOptions({ name: 'ToGame' })

const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const gameLink = ref<HTMLAnchorElement>()
const loading = ref(false)
const entering = ref(false)

// 加载进度相关
const progress = ref(0)
const loadingStep = ref(0)
let progressTimer: NodeJS.Timeout | null = null

// 加载步骤文案
const loadingSteps = [
  '正在验证用户信息',
  '正在同步游戏数据',
  '正在连接游戏服务器',
  '正在启动游戏环境',
  '启动完成，正在跳转'
]

// 当前加载文案
const currentLoadingText = computed(() => {
  return loadingSteps[loadingStep.value] || '正在处理'
})

// 模拟加载进度
function startLoadingProgress() {
  progress.value = 0
  loadingStep.value = 0

  progressTimer = setInterval(() => {
    if (progress.value < 90) {
      // 前90%进度较快
      progress.value += Math.random() * 15 + 5

      // 根据进度更新加载步骤
      const stepIndex = Math.floor(progress.value / 20)
      if (stepIndex < loadingSteps.length) {
        loadingStep.value = stepIndex
      }
    }
  }, 300)
}

// 完成加载进度
function completeLoadingProgress() {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }

  loadingStep.value = loadingSteps.length - 1
  progress.value = 100
}

// 返回
function onClickLeft() {
  router.back()
}

async function enterGame() {
  if (entering.value) return

  entering.value = true
  startLoadingProgress()

  try {
    const resp = await invokeApi('gameUrl', {
      gameCode: route.params.game,
      api_code: route.params.code,
      ismobile: route.params.mobile,
      lobby: lobbyUrl
    })

    if (resp && resp.code === 200) {
      const gameUrl = resp?.data?.game_url?.toString() ?? ''
      console.log("=======================game_url======================")
      console.log(gameUrl)

      if (gameUrl) {
        // 完成进度条动画
        completeLoadingProgress()

        // 等待进度条完成动画后直接跳转
        setTimeout(() => {
          // 移动端直接跳转
          window.location.href = gameUrl
        }, 800)
      } else {
        if (progressTimer) {
          clearInterval(progressTimer)
          progressTimer = null
        }
        entering.value = false
        showDialog({ message: '获取游戏链接失败' })
      }
    } else {
      if (progressTimer) {
        clearInterval(progressTimer)
        progressTimer = null
      }
      entering.value = false
      showDialog({ message: resp?.message || '游戏启动失败' })
    }
  } catch (error) {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
    entering.value = false
    console.error('游戏启动异常:', error)
    showDialog({ message: '游戏启动失败，请稍后重试' })
  }
}

onMounted(async () => {
  loading.value = true
  // 简单的页面初始化，不再需要获取余额等复杂逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
})

onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
})
</script>

<style lang="less" scoped>
.m-toGame-par {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-toGame {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);

    .m-loading {
      color: #fff;
      text-align: center;
    }

    .m-game-info {
      margin: 0px 16px;
      width: calc(100% - 32px);
      max-width: 400px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      position: relative;

      .m-title {
        background-color: #333;
        color: #fff;
        height: 42px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-weight: 500;
      }

      .m-content {
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .m-enter-btn {
          width: 200px;
          height: 44px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;

          &:disabled {
            opacity: 0.7;
          }
        }

        // 游戏启动加载遮罩
        .m-entering-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(139, 0, 0, 0.95) 0%,
            rgba(70, 0, 0, 0.95) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          border-radius: inherit;
          z-index: 10;

          .m-entering-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            max-width: 280px;
            padding: 20px;

            .m-entering-text {
              margin-top: 20px;
              margin-bottom: 20px;

              .main-text {
                font-size: 16px;
                font-weight: 500;
                margin: 0 0 8px 0;
                color: #fff;
              }

              .sub-text {
                font-size: 14px;
                opacity: 0.8;
                margin: 0;
                color: #fff;
              }
            }

            .m-progress-bar {
              width: 200px;
              height: 4px;
              background-color: rgba(255, 255, 255, 0.2);
              border-radius: 2px;
              overflow: hidden;
              position: relative;

              .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #fff 0%, #f0f0f0 100%);
                border-radius: 2px;
                transition: width 0.3s ease;
                position: relative;

                &::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    transparent 100%);
                  animation: shimmer 1.5s infinite;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 进度条光效动画
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 加载点动画
@keyframes loading-dots {
  0%, 20% {
    color: rgba(255, 255, 255, 0.4);
  }
  50% {
    color: rgba(255, 255, 255, 1);
  }
  80%, 100% {
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
