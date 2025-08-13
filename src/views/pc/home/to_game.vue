<template>
  <div class="pc-togame-container">
    <!-- 顶部导航栏 -->
    <div class="game-navbar">
      <div class="navbar-content">
        <el-button
          type="text"
          @click="onClickBack"
          class="back-button"
        >
          <el-icon><ArrowLeft /></el-icon>
          <span>{{ $t('common.back') || '返回' }}</span>
        </el-button>

        <h2 class="page-title">{{ $t('mine.toGame') || '进入游戏' }}</h2>

        <div class="navbar-right">
          <!-- 预留右侧操作区 -->
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="game-main">
      <!-- 加载状态 -->
      <div class="loading-wrapper" v-if="loading">
        <div class="loading-content">
          <el-icon class="is-loading" :size="60" color="#409eff">
            <Loading />
          </el-icon>
          <p class="loading-text">{{ $t('loading') || '加载中...' }}</p>
        </div>
      </div>

      <!-- 游戏启动界面 -->
      <div class="game-launcher" v-else>
        <div class="launcher-card">
          <!-- 游戏封面/预览图 -->
          <div class="game-preview">
            <div class="preview-image">
              <el-image
                :src="gameInfo.thumbnail || '/default-game-bg.jpg'"
                fit="cover"
                class="game-thumbnail"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon :size="80"><GameController /></el-icon>
                  </div>
                </template>
              </el-image>

              <!-- 游戏信息遮罩 -->
              <div class="preview-overlay">
                <div class="game-logo" v-if="gameInfo.logo">
                  <el-image :src="gameInfo.logo" fit="contain" />
                </div>
                <h1 class="game-name">{{ gameInfo.name || '游戏' }}</h1>
                <p class="game-provider" v-if="gameInfo.provider">
                  {{ gameInfo.provider }}
                </p>
              </div>
            </div>
          </div>

          <!-- 游戏信息和操作区 -->
          <div class="game-content">
            <div class="content-header">
              <h2 class="section-title">
                <el-icon><Promotion /></el-icon>
                {{ $t('enterGame') || '进入游戏' }}
              </h2>
              <el-tag type="success" v-if="gameInfo.status === 'online'">
                在线
              </el-tag>
              <el-tag type="info" v-else-if="gameInfo.status === 'maintenance'">
                维护中
              </el-tag>
            </div>

            <!-- 游戏描述 -->
            <div class="game-description" v-if="gameInfo.description">
              <p>{{ gameInfo.description }}</p>
            </div>

            <!-- 游戏特性 -->
            <div class="game-features" v-if="gameInfo.features && gameInfo.features.length">
              <div
                v-for="(feature, index) in gameInfo.features"
                :key="index"
                class="feature-item"
              >
                <el-icon :color="feature.color || '#409eff'">
                  <component :is="feature.icon || 'Star'" />
                </el-icon>
                <span>{{ feature.text }}</span>
              </div>
            </div>

            <!-- 游戏信息列表 -->
            <div class="game-info-list">
              <div class="info-item">
                <span class="info-label">游戏类型：</span>
                <span class="info-value">{{ gameInfo.type || '电子游戏' }}</span>
              </div>
              <div class="info-item" v-if="gameInfo.minBet">
                <span class="info-label">最小投注：</span>
                <span class="info-value">¥{{ gameInfo.minBet }}</span>
              </div>
              <div class="info-item" v-if="gameInfo.maxBet">
                <span class="info-label">最大投注：</span>
                <span class="info-value">¥{{ gameInfo.maxBet }}</span>
              </div>
              <div class="info-item" v-if="gameInfo.rtp">
                <span class="info-label">RTP：</span>
                <span class="info-value">{{ gameInfo.rtp }}%</span>
              </div>
            </div>

            <!-- 操作按钮区 -->
            <div class="action-area">
              <el-button
                type="primary"
                size="large"
                class="enter-button"
                @click="enterGame"
                :loading="entering"
                :disabled="gameInfo.status === 'maintenance'"
              >
                <el-icon v-if="!entering"><GameController /></el-icon>
                {{ entering ? '启动中...' : '立即开始' }}
              </el-button>

              <div class="sub-actions">
                <el-button
                  type="default"
                  @click="tryDemo"
                  v-if="gameInfo.hasDemo"
                >
                  <el-icon><View /></el-icon>
                  试玩模式
                </el-button>
                <el-button
                  type="default"
                  @click="toggleFavorite"
                >
                  <el-icon :color="isFavorite ? '#f56c6c' : ''">
                    <Star />
                  </el-icon>
                  {{ isFavorite ? '已收藏' : '收藏游戏' }}
                </el-button>
              </div>
            </div>

            <!-- 提示信息 -->
            <div class="tips-area">
              <el-alert
                :title="$t('game.tips') || '温馨提示'"
                type="info"
                :closable="false"
                show-icon
              >
                <template #default>
                  <ul class="tips-list">
                    <li>请确保您的账户余额充足</li>
                    <li>游戏加载可能需要一些时间，请耐心等待</li>
                    <li>如遇问题，请联系客服获取帮助</li>
                  </ul>
                </template>
              </el-alert>
            </div>
          </div>
        </div>

        <!-- 相关游戏推荐 -->
        <div class="related-games" v-if="relatedGames.length > 0">
          <h3 class="section-title">
            <el-icon><Grid /></el-icon>
            相关推荐
          </h3>
          <div class="games-grid">
            <div
              v-for="game in relatedGames"
              :key="game.id"
              class="related-game-card"
              @click="switchGame(game)"
            >
              <div class="game-thumb">
                <el-image
                  :src="game.thumbnail"
                  fit="cover"
                  lazy
                />
              </div>
              <div class="game-info">
                <p class="game-title">{{ game.name }}</p>
                <p class="game-type">{{ game.type }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的链接元素 -->
    <a ref="gameLink" href="" target="_self" style="display: none"></a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Loading,
  Promotion,
  Star,
  View,
  Grid
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { invokeApi, mobileFunc } from '@/utils/tools'
import { useI18n } from 'vue-i18n'

// 自定义游戏控制器图标组件
const GameController = {
  name: 'GameController',
  render() {
    return h('svg', {
      viewBox: '0 0 1024 1024',
      width: '1em',
      height: '1em',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M832 384h-128c-35.2 0-64 28.8-64 64v128c0 35.2 28.8 64 64 64h128c35.2 0 64-28.8 64-64V448c0-35.2-28.8-64-64-64zM320 384H192c-35.2 0-64 28.8-64 64v128c0 35.2 28.8 64 64 64h128c35.2 0 64-28.8 64-64V448c0-35.2-28.8-64-64-64z'
      })
    ])
  }
}

defineOptions({ name: 'PcToGame' })

const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()

const lobbyUrl = window.location.origin
const gameLink = ref<HTMLAnchorElement>()
const loading = ref(false)
const entering = ref(false)
const isFavorite = ref(false)

// 游戏信息（模拟数据，实际应从API获取）
const gameInfo = ref({
  id: route.params.game,
  name: '幸运大转盘',
  provider: 'Evolution Gaming',
  type: '电子游戏',
  thumbnail: '',
  logo: '',
  description: '体验刺激的转盘游戏，赢取丰厚奖励！',
  status: 'online', // online, maintenance
  hasDemo: true,
  minBet: 1,
  maxBet: 10000,
  rtp: 96.5,
  features: [
    { icon: 'Trophy', text: '高额奖金', color: '#f56c6c' },
    { icon: 'Timer', text: '快速游戏', color: '#67c23a' },
    { icon: 'VideoPlay', text: '真人直播', color: '#409eff' }
  ]
})

// 相关游戏推荐（模拟数据）
const relatedGames = ref([
  {
    id: 1,
    name: '百家乐',
    type: '真人游戏',
    thumbnail: '/game-thumb-1.jpg'
  },
  {
    id: 2,
    name: '疯狂老虎机',
    type: '电子游戏',
    thumbnail: '/game-thumb-2.jpg'
  },
  {
    id: 3,
    name: '德州扑克',
    type: '棋牌游戏',
    thumbnail: '/game-thumb-3.jpg'
  },
  {
    id: 4,
    name: '轮盘赌',
    type: '真人游戏',
    thumbnail: '/game-thumb-4.jpg'
  }
])

// 返回
function onClickBack() {
  router.back()
}

// 进入游戏
async function enterGame() {
  entering.value = true

  try {
    // 检查登录状态
    if (!store.isLogin()) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return
    }

    // 获取游戏URL
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
        // 显示加载提示
        ElMessage.success('游戏启动中，请稍候...')

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          const h = mobileFunc()
          if (h === false && window.parent) {
            // PC端：在父窗口中跳转
            window.parent.location.href = gameUrl
          } else {
            // 移动端或独立窗口：直接跳转
            window.location.href = gameUrl
          }
        }, 1000)
      } else {
        ElMessage.error('获取游戏链接失败')
      }
    } else {
      ElMessage.error(resp?.message || '游戏启动失败')
    }
  } catch (error) {
    console.error('游戏启动异常:', error)
    ElMessage.error('游戏启动失败，请稍后重试')
  } finally {
    entering.value = false
  }
}

// 试玩模式
async function tryDemo() {
  ElMessageBox.confirm(
    '试玩模式不会消耗真实金额，仅供体验游戏。是否进入试玩模式？',
    '试玩模式',
    {
      confirmButtonText: '进入试玩',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    entering.value = true
    try {
      // 调用试玩API
      const resp = await invokeApi('gameDemoUrl', {
        gameCode: route.params.game,
        api_code: route.params.code
      })

      if (resp && resp.code === 200) {
        const demoUrl = resp?.data?.demo_url
        if (demoUrl) {
          window.open(demoUrl, '_blank')
        } else {
          ElMessage.error('获取试玩链接失败')
        }
      }
    } catch (error) {
      ElMessage.error('试玩模式暂不可用')
    } finally {
      entering.value = false
    }
  }).catch(() => {
    // 用户取消
  })
}

// 收藏/取消收藏
function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  if (isFavorite.value) {
    ElMessage.success('已添加到收藏')
  } else {
    ElMessage.info('已取消收藏')
  }
}

// 切换游戏
function switchGame(game: any) {
  router.push({
    name: 'toGame',
    params: {
      game: game.id,
      code: route.params.code,
      mobile: route.params.mobile
    }
  })
}

// 获取游戏详情
async function getGameInfo() {
  try {
    // 这里应该调用实际的API获取游戏信息
    // const resp = await invokeApi('gameInfo', { gameCode: route.params.game })
    // if (resp && resp.data) {
    //   gameInfo.value = resp.data
    // }
  } catch (error) {
    console.error('获取游戏信息失败:', error)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // 获取游戏信息
    await getGameInfo()

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
})
</script>

<style lang="less" scoped>
.pc-togame-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;

  // 顶部导航
  .game-navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .back-button {
        font-size: 14px;
        color: #606266;

        &:hover {
          color: #409eff;
        }
      }

      .page-title {
        font-size: 20px;
        font-weight: 500;
        color: #303133;
        margin: 0;
      }

      .navbar-right {
        width: 100px;
      }
    }
  }

  // 主体内容
  .game-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;

    // 加载状态
    .loading-wrapper {
      text-align: center;

      .loading-content {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 60px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

        .loading-text {
          margin-top: 20px;
          font-size: 18px;
          color: #606266;
        }
      }
    }

    // 游戏启动器
    .game-launcher {
      width: 100%;
      max-width: 1200px;

      .launcher-card {
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        min-height: 600px;

        // 游戏预览
        .game-preview {
          width: 50%;
          position: relative;

          .preview-image {
            width: 100%;
            height: 100%;
            position: relative;

            .game-thumbnail {
              width: 100%;
              height: 100%;
              min-height: 600px;
            }

            .image-error {
              width: 100%;
              height: 600px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: rgba(255, 255, 255, 0.8);
            }

            .preview-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
              padding: 40px;
              color: #fff;

              .game-logo {
                width: 120px;
                height: 60px;
                margin-bottom: 20px;
              }

              .game-name {
                font-size: 36px;
                font-weight: 600;
                margin: 0 0 10px 0;
              }

              .game-provider {
                font-size: 18px;
                opacity: 0.9;
              }
            }
          }
        }

        // 游戏内容
        .game-content {
          width: 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;

          .content-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;

            .section-title {
              font-size: 24px;
              font-weight: 500;
              color: #303133;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
          }

          .game-description {
            margin-bottom: 25px;

            p {
              font-size: 16px;
              color: #606266;
              line-height: 1.6;
            }
          }

          .game-features {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 25px;

            .feature-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #606266;

              .el-icon {
                font-size: 18px;
              }
            }
          }

          .game-info-list {
            background: #f5f7fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;

            .info-item {
              display: flex;
              align-items: center;
              margin-bottom: 12px;

              &:last-child {
                margin-bottom: 0;
              }

              .info-label {
                font-size: 14px;
                color: #909399;
                width: 100px;
              }

              .info-value {
                font-size: 14px;
                color: #303133;
                font-weight: 500;
              }
            }
          }

          .action-area {
            margin-bottom: 30px;

            .enter-button {
              width: 100%;
              height: 56px;
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 15px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;

              &:hover:not(:disabled) {
                opacity: 0.9;
              }
            }

            .sub-actions {
              display: flex;
              gap: 15px;

              .el-button {
                flex: 1;
                height: 44px;
              }
            }
          }

          .tips-area {
            margin-top: auto;

            .tips-list {
              margin: 10px 0 0 0;
              padding-left: 20px;

              li {
                margin-bottom: 8px;
                color: #606266;
                font-size: 13px;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }

      // 相关游戏推荐
      .related-games {
        margin-top: 40px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 30px;

        .section-title {
          font-size: 20px;
          font-weight: 500;
          color: #303133;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;

          .related-game-card {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }

            .game-thumb {
              width: 100%;
              height: 120px;
              overflow: hidden;

              .el-image {
                width: 100%;
                height: 100%;
              }
            }

            .game-info {
              padding: 15px;

              .game-title {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin: 0 0 5px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .game-type {
                font-size: 12px;
                color: #909399;
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .pc-togame-container {
    .game-main {
      .game-launcher {
        .launcher-card {
          flex-direction: column;

          .game-preview,
          .game-content {
            width: 100%;
          }

          .game-preview {
            .preview-image {
              .game-thumbnail {
                min-height: 300px;
              }

              .image-error {
                height: 300px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .pc-togame-container {
    .game-main {
      padding: 20px 15px;

      .game-launcher {
        .launcher-card {
          .game-content {
            padding: 20px;

            .content-header {
              .section-title {
                font-size: 20px;
              }
            }

            .action-area {
              .sub-actions {
                flex-direction: column;
              }
            }
          }
        }

        .related-games {
          padding: 20px;

          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      }
    }
  }
}
</style>
