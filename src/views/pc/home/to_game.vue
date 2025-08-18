<template>
  <div class="pc-to-game">
    <!-- 简单头部 -->
    <div class="page-header">
      <button @click="onClickLeft" class="back-btn">
        ← 返回
      </button>
      <h1>启动游戏</h1>
    </div>

    <!-- 游戏启动区域 -->
    <div class="game-launch-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-icon">⟳</div>
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 游戏启动卡片 -->
      <div v-else class="game-card">
        <div class="card-header">
          <h2>🎮 启动游戏</h2>
        </div>

        <div class="card-content">
          <div class="game-info">
            <div class="info-item">
              <span class="label">游戏厂商:</span>
              <span class="value">{{ route.params.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">游戏代码:</span>
              <span class="value">{{ route.params.game }}</span>
            </div>
          </div>

          <button
            @click="enterGame"
            :disabled="entering"
            class="launch-btn"
          >
            {{ entering ? '启动中...' : '▶ 开始游戏' }}
          </button>

          <div class="tips">
            💡 请确保已登录账户
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的链接元素 -->
    <a ref="gameLink" href="" target="_self" style="display: none"></a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { invokeApi, mobileFunc } from '@/utils/tools'

defineOptions({ name: 'PcToGame' })

const store = useAppStore()
const route = useRoute()
const router = useRouter()

// 响应式数据
const gameLink = ref<HTMLAnchorElement>()
const loading = ref(true)
const entering = ref(false)

// 获取当前域名作为lobby地址
const lobbyUrl = window.location.origin

console.log('PC游戏启动页面初始化')
console.log('游戏参数:', route.params)
console.log('Lobby URL:', lobbyUrl)

// 返回上一页
function onClickLeft() {
  console.log('点击返回按钮')
  router.back()
}

// 启动游戏
async function enterGame() {
  console.log('开始启动游戏...')
  entering.value = true

  try {
    // 调用游戏URL API
    const resp = await invokeApi('gameUrl', {
      gameCode: route.params.game,
      api_code: route.params.code,
      ismobile: route.params.mobile || 0, // PC端默认为0
      lobby: lobbyUrl
    })

    console.log('游戏URL API响应:', resp)

    if (resp && resp.code === 200) {
      const gameUrl = resp?.data?.game_url?.toString() ?? ''
      console.log('获取到游戏URL:', gameUrl)

      if (gameUrl) {
        // PC端处理方式
        const isMobile = mobileFunc()

        if (!isMobile && window.parent && window.parent !== window) {
          // 在iframe中：在父窗口打开
          console.log('在父窗口中打开游戏')
          window.parent.location.href = gameUrl
        } else {
          // 普通窗口：直接跳转
          console.log('直接跳转到游戏')
          window.location.href = gameUrl
        }
      } else {
        console.error('游戏URL为空')
        alert('获取游戏链接失败')
      }
    } else {
      console.error('API响应错误:', resp)
      alert(resp?.message || '游戏启动失败')
    }
  } catch (error) {
    console.error('游戏启动异常:', error)
    alert('游戏启动失败，请稍后重试')
  } finally {
    entering.value = false
  }
}

// 页面初始化
onMounted(async () => {
  console.log('PC游戏启动页面mounted')

  // 检查用户登录状态
  if (!store.isLogin()) {
    alert('请先登录才能开始游戏')
    router.push('/')
    return
  }

  // 简单的初始化延迟
  setTimeout(() => {
    loading.value = false
    console.log('页面初始化完成')
  }, 1000)
})
</script>

<style lang="less" scoped>
.pc-to-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  // 页面头部
  .page-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 20px 30px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(-2px);
      }
    }

    h1 {
      margin: 0;
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  // 游戏启动区域
  .game-launch-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;

    // 加载状态
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      color: #fff;

      .loading-icon {
        font-size: 48px;
        animation: spin 2s linear infinite;
      }

      .loading-text {
        font-size: 18px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }

    // 游戏卡片
    .game-card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      width: 100%;
      max-width: 480px;
      transform: translateY(0);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 64px rgba(0, 0, 0, 0.25);
      }

      .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        padding: 24px;
        text-align: center;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }
      }

      .card-content {
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        .game-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .label {
              color: #666;
              font-size: 14px;
              font-weight: 500;
            }

            .value {
              color: #333;
              font-size: 14px;
              font-weight: 600;
              background: #fff;
              padding: 4px 8px;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
            }
          }
        }

        .launch-btn {
          width: 100%;
          height: 48px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        .tips {
          color: #666;
          font-size: 13px;
          text-align: center;
          padding: 12px;
          background: #f0f4ff;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
      }
    }
  }
}

// 旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .pc-to-game {
    .page-header {
      padding: 15px 20px;

      h1 {
        font-size: 20px;
      }
    }

    .game-launch-area {
      padding: 20px 15px;

      .game-card {
        .card-header {
          padding: 20px;

          h2 {
            font-size: 18px;
          }
        }

        .card-content {
          padding: 24px 20px;
        }
      }
    }
  }
}
</style>
