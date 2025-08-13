<template>
  <div class="pc-supplier-games">
    <!-- 顶部导航栏 -->
    <div class="supplier-navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <el-button
            type="text"
            @click="onClickBack"
            class="back-button"
          >
            <el-icon><ArrowLeft /></el-icon>
            <span>{{ $t('common.back') || '返回' }}</span>
          </el-button>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              {{ $t('main.index') || '首页' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/games' }">
              {{ $t('game.all') || '全部游戏' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ supplierInfo.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="navbar-right">
          <!-- 搜索框 -->
          <el-input
            v-model="searchKeyword"
            :placeholder="$t('common.search') || '搜索游戏'"
            class="search-input"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <!-- 视图切换 -->
          <el-button-group class="view-switcher">
            <el-button
              :type="viewMode === 'grid' ? 'primary' : ''"
              @click="viewMode = 'grid'"
            >
              <el-icon><Grid /></el-icon>
            </el-button>
            <el-button
              :type="viewMode === 'list' ? 'primary' : ''"
              @click="viewMode = 'list'"
            >
              <el-icon><List /></el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 供应商信息头部 -->
    <div class="supplier-header" v-if="supplierInfo.name">
      <div class="header-container">
        <div class="supplier-banner">
          <!-- 供应商Logo/图标 -->
          <div class="supplier-logo">
            <el-image
              :src="supplierInfo.logo || getDefaultLogo()"
              fit="contain"
              class="logo-image"
            >
              <template #error>
                <div class="logo-placeholder">
                  <el-icon :size="60"><Box /></el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <!-- 供应商详情 -->
          <div class="supplier-details">
            <div class="details-top">
              <h1 class="supplier-name">{{ supplierInfo.name }}</h1>
              <el-tag
                :type="supplierInfo.is_can_run === 1 ? 'success' : 'danger'"
                size="large"
                class="status-tag"
              >
                <el-icon>
                  <CircleCheck v-if="supplierInfo.is_can_run === 1" />
                  <CircleClose v-else />
                </el-icon>
                {{ supplierInfo.is_can_run === 1 ? '正常运行' : '维护中' }}
              </el-tag>
            </div>

            <div class="details-info">
              <div class="info-item">
                <el-icon><Folder /></el-icon>
                <span>分类：{{ categoryName }}</span>
              </div>
              <div class="info-item">
                <el-icon><GameController /></el-icon>
                <span>游戏数量：{{ totalGames || gameList.length }} 个</span>
              </div>
              <div class="info-item" v-if="supplierInfo.description">
                <el-icon><Document /></el-icon>
                <span>{{ supplierInfo.description }}</span>
              </div>
            </div>

            <!-- 快速筛选标签 -->
            <div class="quick-filters">
              <el-tag
                v-for="filter in quickFilters"
                :key="filter.value"
                :type="activeFilter === filter.value ? 'primary' : 'info'"
                class="filter-tag"
                @click="handleQuickFilter(filter.value)"
                :effect="activeFilter === filter.value ? 'dark' : 'plain'"
              >
                {{ filter.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="games-container">
      <div class="container-wrapper">
        <!-- 侧边栏筛选（可选） -->
        <div class="sidebar-filters" v-if="showSidebar">
          <div class="filter-section">
            <h3 class="filter-title">游戏筛选</h3>

            <div class="filter-group">
              <h4>游戏状态</h4>
              <el-radio-group v-model="filterStatus" @change="handleFilterChange">
                <el-radio :label="'all'">全部</el-radio>
                <el-radio :label="'available'">可玩</el-radio>
                <el-radio :label="'maintenance'">维护中</el-radio>
              </el-radio-group>
            </div>

            <div class="filter-group">
              <h4>排序方式</h4>
              <el-radio-group v-model="sortBy" @change="handleSortChange">
                <el-radio :label="'default'">默认</el-radio>
                <el-radio :label="'name'">名称</el-radio>
                <el-radio :label="'popular'">热门</el-radio>
                <el-radio :label="'newest'">最新</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 游戏内容区域 -->
        <div class="games-content">
          <!-- 加载状态 -->
          <div v-if="initialLoading" class="loading-state">
            <el-icon class="is-loading" :size="60" color="#409eff">
              <Loading />
            </el-icon>
            <p>加载游戏中...</p>
          </div>

          <!-- 空状态 -->
          <el-empty
            v-else-if="filteredGameList.length === 0"
            :description="searchKeyword ? '没有找到相关游戏' : '暂无游戏'"
            class="empty-state"
          >
            <el-button type="primary" @click="resetFilters">
              重置筛选
            </el-button>
          </el-empty>

          <!-- 网格视图 -->
          <div v-else-if="viewMode === 'grid'" class="games-grid">
            <div
              v-for="(game, idx) in paginatedGames"
              :key="`${game.id}-${idx}`"
              class="game-card"
              @click="enterGame(game)"
            >
              <!-- 游戏状态标签 -->
              <div class="game-badges">
                <el-tag
                  v-if="game.is_hot_text"
                  type="danger"
                  size="small"
                  effect="dark"
                  class="hot-badge"
                >
                  <el-icon><Sunny /></el-icon>
                  {{ game.is_hot_text }}
                </el-tag>
                <el-tag
                  v-if="game.is_new"
                  type="success"
                  size="small"
                  effect="dark"
                  class="new-badge"
                >
                  NEW
                </el-tag>
              </div>

              <!-- 游戏图片 -->
              <div class="game-image">
                <el-image
                  :src="getImgUrl(game.game_img_url || game.img_url || '')"
                  fit="cover"
                  lazy
                  class="image"
                >
                  <template #placeholder>
                    <div class="image-loading">
                      <el-icon class="is-loading"><Loading /></el-icon>
                    </div>
                  </template>
                  <template #error>
                    <div class="image-error">
                      <el-icon :size="40"><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>

                <!-- 维护遮罩 -->
                <div v-if="game.is_can_run === 0" class="maintenance-overlay">
                  <el-icon :size="40"><Lock /></el-icon>
                  <span>维护中</span>
                </div>

                <!-- 悬浮操作层 -->
                <div class="game-overlay">
                  <el-button
                    type="primary"
                    size="default"
                    :disabled="game.is_can_run === 0"
                  >
                    {{ game.is_can_run === 0 ? '维护中' : '开始游戏' }}
                  </el-button>
                  <div class="overlay-actions">
                    <el-button
                      type="text"
                      @click.stop="handleFavorite(game)"
                      class="action-btn"
                    >
                      <el-icon :color="game.favorited ? '#f56c6c' : ''">
                        <Star />
                      </el-icon>
                    </el-button>
                    <el-button
                      type="text"
                      @click.stop="handleInfo(game)"
                      class="action-btn"
                    >
                      <el-icon><InfoFilled /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 游戏信息 -->
              <div class="game-info">
                <h3 class="game-name" :title="game.game_name || game.name">
                  {{ game.game_name || game.name }}
                </h3>
                <div class="game-meta">
                  <span class="supplier-code">
                    {{ game.supplier_code || supplierInfo.code }}
                  </span>
                  <el-tag
                    v-if="game.is_can_run === 0"
                    type="danger"
                    size="small"
                    effect="plain"
                  >
                    维护
                  </el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-else class="games-list">
            <el-table
              :data="paginatedGames"
              style="width: 100%"
              @row-click="enterGame"
              row-class-name="game-row"
            >
              <el-table-column
                label="游戏"
                min-width="300"
              >
                <template #default="{ row }">
                  <div class="game-cell">
                    <el-image
                      :src="getImgUrl(row.game_img_url || row.img_url || '')"
                      fit="cover"
                      class="game-thumb"
                      lazy
                    />
                    <div class="game-detail">
                      <div class="game-title">
                        {{ row.game_name || row.name }}
                        <el-tag
                          v-if="row.is_hot_text"
                          type="danger"
                          size="small"
                          class="hot-tag"
                        >
                          {{ row.is_hot_text }}
                        </el-tag>
                      </div>
                      <div class="game-code">
                        代码：{{ row.game_code }}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="supplier_code"
                label="供应商"
                width="150"
              >
                <template #default="{ row }">
                  {{ row.supplier_code || supplierInfo.code }}
                </template>
              </el-table-column>

              <el-table-column
                label="状态"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <el-tag
                    :type="row.is_can_run === 1 ? 'success' : 'danger'"
                    effect="plain"
                  >
                    {{ row.is_can_run === 1 ? '正常' : '维护' }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="200"
                align="center"
              >
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="row.is_can_run === 0"
                    @click.stop="enterGame(row)"
                  >
                    {{ row.is_can_run === 0 ? '维护中' : '进入游戏' }}
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="handleFavorite(row)"
                  >
                    <el-icon :color="row.favorited ? '#f56c6c' : ''">
                      <Star />
                    </el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper" v-if="filteredGameList.length > pageSize">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="filteredGameList.length"
              :page-sizes="[20, 40, 60, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>

          <!-- 加载更多（无限滚动） -->
          <div
            v-if="hasMore && !initialLoading"
            v-loading="loadingMore"
            element-loading-text="加载更多游戏..."
            class="load-more"
            @click="loadMoreGames"
          >
            <el-button v-if="!loadingMore" type="text">
              点击加载更多
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏详情弹窗 -->
    <el-dialog
      v-model="gameInfoDialog"
      :title="selectedGame?.game_name || selectedGame?.name"
      width="600px"
      class="game-info-dialog"
    >
      <div class="dialog-content" v-if="selectedGame">
        <el-image
          :src="getImgUrl(selectedGame.game_img_url || selectedGame.img_url || '')"
          fit="cover"
          class="dialog-image"
        />
        <el-descriptions :column="2" border>
          <el-descriptions-item label="游戏代码">
            {{ selectedGame.game_code }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商">
            {{ selectedGame.supplier_code || supplierInfo.code }}
          </el-descriptions-item>
          <el-descriptions-item label="游戏类型">
            {{ categoryName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedGame.is_can_run === 1 ? 'success' : 'danger'">
              {{ selectedGame.is_can_run === 1 ? '正常' : '维护中' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="gameInfoDialog = false">关闭</el-button>
        <el-button
          type="primary"
          :disabled="selectedGame?.is_can_run === 0"
          @click="enterGame(selectedGame)"
        >
          进入游戏
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Search,
  Grid,
  List,
  Box,
  CircleCheck,
  CircleClose,
  Folder,
  Document,
  Loading,
  Picture,
  Sunny,
  Lock,
  Star,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { getImgUrl, mobileFunc, convertFrontendToBackendLang } from '@/utils/tools'
import { useI18n } from 'vue-i18n'
import { getLanguage } from '@/lang'
import type { gameInfo } from 'typings'

// 自定义游戏控制器图标
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

defineOptions({ name: 'PcSupplierGames' })

// Props定义
interface SupplierProps {
  name: string
  type: string
  supplier_code: string
  category_code?: string
  supplier_name?: string
  supplier_id?: string
  currency_code?: string
}

const props = defineProps<SupplierProps>()

const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()

// 响应式数据
const initialLoading = ref(true)
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(20)
const totalGames = ref(0)

// UI状态
const viewMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')
const showSidebar = ref(false)
const activeFilter = ref('all')
const filterStatus = ref('all')
const sortBy = ref('default')
const gameInfoDialog = ref(false)
const selectedGame = ref<gameInfo | null>(null)

// 供应商信息
const supplierInfo = ref({
  code: props.supplier_code || props.name,
  name: props.supplier_name || route.query?.supplier_name?.toString() || props.name || '',
  categoryCode: props.category_code || route.query?.category_code?.toString() || 'SLOT',
  currencyCode: props.currency_code || route.query?.currency_code?.toString() || 'CNY',
  id: props.supplier_id || route.query?.supplier_id?.toString() || '',
  description: route.query?.supplier_desc?.toString() || '',
  is_can_run: Number(route.query?.is_can_run) || 1,
  logo: ''
})

// 游戏列表
const gameList = ref<gameInfo[]>([])

// 快速筛选选项
const quickFilters = ref([
  { label: '全部游戏', value: 'all' },
  { label: '热门游戏', value: 'hot' },
  { label: '最新游戏', value: 'new' },
  { label: '可玩游戏', value: 'available' }
])

// 计算属性
const categoryName = computed(() => {
  const categoryMap = {
    'SLOT': '老虎机',
    'LIVE': '真人娱乐',
    'FISH': '捕鱼游戏',
    'CARD': '棋牌游戏',
    'SPORT': '体育竞技',
    'LOTTERY': '彩票游戏'
  }
  return categoryMap[supplierInfo.value.categoryCode] || supplierInfo.value.categoryCode
})

// 过滤后的游戏列表
const filteredGameList = computed(() => {
  let result = [...gameList.value]

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(game =>
      (game.game_name || game.name || '').toLowerCase().includes(keyword) ||
      (game.game_code || '').toLowerCase().includes(keyword)
    )
  }

  // 状态过滤
  if (filterStatus.value === 'available') {
    result = result.filter(game => game.is_can_run === 1)
  } else if (filterStatus.value === 'maintenance') {
    result = result.filter(game => game.is_can_run === 0)
  }

  // 快速筛选
  if (activeFilter.value === 'hot') {
    result = result.filter(game => game.is_hot_text)
  } else if (activeFilter.value === 'new') {
    result = result.filter(game => game.is_new)
  } else if (activeFilter.value === 'available') {
    result = result.filter(game => game.is_can_run === 1)
  }

  // 排序
  if (sortBy.value === 'name') {
    result.sort((a, b) => (a.game_name || a.name || '').localeCompare(b.game_name || b.name || ''))
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.is_hot_text ? 1 : 0) - (a.is_hot_text ? 1 : 0))
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))
  }

  return result
})

// 分页后的游戏
const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGameList.value.slice(start, end)
})

// 方法
function onClickBack() {
  router.back()
}

function getDefaultLogo() {
  // 返回默认logo图片路径
  return '/default-supplier-logo.png'
}

// 进入游戏
function enterGame(game: gameInfo) {
  if (!store.isLogin()) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (game.is_can_run === 0) {
    ElMessage.warning('游戏维护中，暂时无法进入')
    return
  }

  if (supplierInfo.value.is_can_run === 0) {
    ElMessage.warning('该厂商正在维护中')
    return
  }

  router.push({
    name: 'to_game',
    params: {
      game: game.game_code,
      code: game.api_name || game.supplier_code || supplierInfo.value.code,
      mobile: mobileFunc() ? 1 : 0,
    },
  })
}

// 获取游戏列表
async function getGameList(page = 1, isLoadMore = false) {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    if (page === 1) {
      initialLoading.value = true
    }
  }

  try {
    const userInfo = store.getUser()
    const userCurrency = userInfo?.currency || 'CNY'

    const requestParams = {
      page: page,
      limit: 50, // PC端可以加载更多
      supplier_code: supplierInfo.value.code,
      game_type: supplierInfo.value.categoryCode,
      currency: userCurrency,
      language: convertFrontendToBackendLang(getLanguage()),
    }

    const resp = await invokeApi('gameList', requestParams)
    console.log('游戏列表响应:', resp)

    if (resp && resp.code === 200) {
      let newGames = []
      let pagination = null

      if (resp.data && Array.isArray(resp.data)) {
        newGames = resp.data
        hasMore.value = newGames.length === 50
      } else if (resp.data && resp.data.list && Array.isArray(resp.data.list)) {
        newGames = resp.data.list
        pagination = resp.data.pagination
        totalGames.value = resp.data.total || 0
        hasMore.value = pagination?.has_more || false
      }

      // 数据处理
      newGames.forEach(game => {
        if (!game.supplier_code) {
          game.supplier_code = supplierInfo.value.code
        }
        if (!game.api_name) {
          game.api_name = supplierInfo.value.code
        }
        // 添加模拟数据
        game.is_new = Math.random() > 0.8
        game.favorited = false
      })

      if (isLoadMore) {
        gameList.value.push(...newGames)
      } else {
        gameList.value = newGames
      }

    } else {
      throw new Error(resp?.message || '获取游戏列表失败')
    }
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    ElMessage.error((error as Error)?.message || '获取游戏列表失败')
  } finally {
    loading.value = false
    loadingMore.value = false
    initialLoading.value = false
  }
}

// 加载更多
async function loadMoreGames() {
  if (!hasMore.value || loadingMore.value || loading.value) {
    return
  }
  await getGameList(currentPage.value + 1, true)
}

// 搜索处理
function handleSearch() {
  currentPage.value = 1
}

// 快速筛选
function handleQuickFilter(value: string) {
  activeFilter.value = value
  currentPage.value = 1
}

// 筛选变化
function handleFilterChange() {
  currentPage.value = 1
}

// 排序变化
function handleSortChange() {
  currentPage.value = 1
}

// 分页大小变化
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

// 页码变化
function handlePageChange(val: number) {
  currentPage.value = val
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 收藏游戏
function handleFavorite(game: gameInfo) {
  game.favorited = !game.favorited
  if (game.favorited) {
    ElMessage.success('已添加到收藏')
  } else {
    ElMessage.info('已取消收藏')
  }
}

// 查看游戏信息
function handleInfo(game: gameInfo) {
  selectedGame.value = game
  gameInfoDialog.value = true
}

// 重置筛选
function resetFilters() {
  searchKeyword.value = ''
  activeFilter.value = 'all'
  filterStatus.value = 'all'
  sortBy.value = 'default'
  currentPage.value = 1
}

// 初始化
async function init() {
  try {
    await getGameList(1, false)
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('页面加载失败，请重试')
  }
}

onMounted(async () => {
  await init()
})
</script>

<style lang="less" scoped>
.pc-supplier-games {
  min-height: 100vh;
  background: #f5f7fa;

  // 顶部导航
  .supplier-navbar {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 20px;

        .back-button {
          font-size: 14px;
          color: #606266;

          &:hover {
            color: #409eff;
          }
        }
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 15px;

        .search-input {
          width: 250px;
        }

        .view-switcher {
          .el-button {
            padding: 8px 12px;
          }
        }
      }
    }
  }

  // 供应商头部
  .supplier-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 0;
    color: #fff;

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;

      .supplier-banner {
        display: flex;
        gap: 40px;
        align-items: center;

        .supplier-logo {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          .logo-image {
            width: 100%;
            height: 100%;
          }

          .logo-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c0c4cc;
          }
        }

        .supplier-details {
          flex: 1;

          .details-top {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 15px;

            .supplier-name {
              font-size: 32px;
              font-weight: 600;
              margin: 0;
            }

            .status-tag {
              .el-icon {
                margin-right: 4px;
              }
            }
          }

          .details-info {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 20px;

            .info-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              opacity: 0.95;

              .el-icon {
                font-size: 18px;
              }
            }
          }

          .quick-filters {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;

            .filter-tag {
              cursor: pointer;
              transition: all 0.3s;

              &:hover {
                transform: translateY(-2px);
              }
            }
          }
        }
      }
    }
  }

  // 游戏容器
  .games-container {
    padding: 30px 0;

    .container-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      gap: 20px;

      // 侧边栏筛选
      .sidebar-filters {
        width: 240px;
        flex-shrink: 0;

        .filter-section {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

          .filter-title {
            font-size: 18px;
            font-weight: 500;
            margin: 0 0 20px 0;
            color: #303133;
          }

          .filter-group {
            margin-bottom: 25px;

            h4 {
              font-size: 14px;
              color: #606266;
              margin: 0 0 10px 0;
            }

            .el-radio-group {
              display: flex;
              flex-direction: column;

              .el-radio {
                margin-bottom: 8px;
              }
            }
          }
        }
      }

      // 游戏内容
      .games-content {
        flex: 1;

        // 加载状态
        .loading-state {
          background: #fff;
          border-radius: 8px;
          padding: 80px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

          p {
            margin-top: 20px;
            font-size: 16px;
            color: #606266;
          }
        }

        // 空状态
        .empty-state {
          background: #fff;
          border-radius: 8px;
          padding: 80px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        // 网格视图
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;

          .game-card {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
            cursor: pointer;
            position: relative;

            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

              .game-overlay {
                opacity: 1;
              }
            }

            .game-badges {
              position: absolute;
              top: 10px;
              left: 10px;
              right: 10px;
              z-index: 2;
              display: flex;
              gap: 5px;
              flex-wrap: wrap;

              .hot-badge,
              .new-badge {
                font-size: 11px;
              }
            }

            .game-image {
              position: relative;
              width: 100%;
              padding-bottom: 100%;
              overflow: hidden;

              .image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }

              .image-loading,
              .image-error {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f7fa;
                color: #c0c4cc;
              }

              .maintenance-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                z-index: 3;

                span {
                  margin-top: 10px;
                  font-size: 14px;
                }
              }

              .game-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 1;

                .overlay-actions {
                  display: flex;
                  gap: 10px;
                  margin-top: 10px;

                  .action-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .el-icon {
                      font-size: 18px;
                      color: #fff;
                    }

                    &:hover {
                      background: rgba(255, 255, 255, 0.3);
                    }
                  }
                }
              }
            }

            .game-info {
              padding: 12px;

              .game-name {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin: 0 0 8px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .game-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .supplier-code {
                  font-size: 12px;
                  color: #909399;
                }
              }
            }
          }
        }

        // 列表视图
        .games-list {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;

          :deep(.game-row) {
            cursor: pointer;

            &:hover {
              background: #f5f7fa;
            }
          }

          .game-cell {
            display: flex;
            align-items: center;
            gap: 15px;

            .game-thumb {
              width: 60px;
              height: 60px;
              border-radius: 4px;
              flex-shrink: 0;
            }

            .game-detail {
              flex: 1;

              .game-title {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 8px;

                .hot-tag {
                  font-size: 11px;
                }
              }

              .game-code {
                font-size: 12px;
                color: #909399;
              }
            }
          }
        }

        // 分页
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }

        // 加载更多
        .load-more {
          text-align: center;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
      }
    }
  }

  // 游戏详情弹窗
  .game-info-dialog {
    .dialog-content {
      .dialog-image {
        width: 100%;
        height: 300px;
        margin-bottom: 20px;
        border-radius: 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .pc-supplier-games {
    .games-container {
      .container-wrapper {
        .sidebar-filters {
          display: none;
        }

        .games-content {
          .games-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .pc-supplier-games {
    .supplier-header {
      .header-container {
        .supplier-banner {
          flex-direction: column;
          text-align: center;

          .supplier-details {
            .details-top {
              flex-direction: column;

              .supplier-name {
                font-size: 24px;
              }
            }

            .details-info {
              justify-content: center;
            }

            .quick-filters {
              justify-content: center;
            }
          }
        }
      }
    }

    .games-container {
      .container-wrapper {
        .games-content {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      }
    }
  }
}
</style>
