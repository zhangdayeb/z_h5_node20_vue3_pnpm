<template>
  <div class="m-main">
    <!-- i18n -->
    <LanguageVue />

    <!-- banner -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, idx) in banners" :key="idx">
        <van-image :src="getImgUrl(item?.url)"></van-image>
      </van-swipe-item>
    </van-swipe>

    <!-- user -->
    <div class="m-col">
      <div class="m-row" v-if="store.getUser() === null">
        <span>{{ $t('main.noLogin') }}</span>
        <span class="m-link" @click.stop="loginHandler">{{
          $t('main.loginCheck')
        }}</span>
      </div>
      <div class="m-row" v-else>
        <div class="m-row m-user">
          <span>{{ store.getUser()?.name ?? '' }}</span>
          <div class="m-user-level">
            <div class="m-img-bg">VIP</div>
            <span class="m-level-txt">{{ store.getUser()?.level }}</span>
          </div>
          <van-button
            v-if="false"
            type="danger"
            size="mini"
            class="m-btn"
            @click="signDailyHandler"
            >{{ $t('daliySign') }}</van-button
          >
        </div>
        <span
          >${{
            Number(store.getUser()?.money ?? '0.00') <= 0
              ? '0.00'
              : Number(store.getUser()?.money).toFixed(2)
          }}</span
        >
      </div>
      <div class="m-row">
        <div class="m-row-item m-start" @click="operatHandler(1)">
          <van-image :src="depositImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">{{ $t('mine.deposit') }}</span>
        </div>
        <div class="m-row-item" @click="operatHandler(2)">
          <van-image :src="withdrawImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">{{ $t('mine.withdraw') }}</span>
        </div>
        <div class="m-row-item m-end" @click="operatHandler(3)">
          <van-image :src="vipImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">VIP</span>
        </div>
      </div>
    </div>

    <!-- main -->
    <div class="m-main-contain">
      <!-- 左侧游戏类型导航 -->
      <div class="m-con-left">
        <div class="m-scroll-wrapper">
          <div class="m-scroll-content">
            <div class="m-scroll-list-wrapper">
              <div class="m-gameNav-container">
                <div
                  class="m-gameNav-item"
                  v-for="(item, idx) in gameTypes"
                  :key="item.id"
                  :class="{ active: item.id === currentGameType?.id }"
                  :style="{
                    background:
                      idx > selectIdx
                        ? '-webkit-linear-gradient(90deg, #ccd7ed, #e0e4eb)'
                        : '',
                  }"
                  @click.stop="selectGameHandler(item, idx)"
                >
                  <van-image
                    :src="
                      getImgUrl(
                        currentGameType?.id === item.id
                          ? item.icon_after
                          : item.icon_before,
                      )
                    "
                    class="m-item-img"
                  ></van-image>
                  <div class="m-item-txt">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧游戏列表 -->
      <div class="m-con-right">
        <div class="m-scroll-wrapper" ref="scrollContainer">
          <div class="m-scroll-content">
            <div class="m-scroll-list-wrapper">
              <div class="m-gameNav-container-list">
                <!-- 游戏列表 -->
                <div
                  class="m-nav-list-item"
                  v-for="(item, idx) in filteredGameList()"
                  :key="item.id"
                  @click.stop="playGameHandler(item)"
                >
                  <van-image
                    :src="getImgUrl(item.game_img_url)"
                    class="m-item-img"
                    fit="fill"
                  >
                    <template v-slot:error>
                      <van-icon name="warning-o" class="m-ico" size="22" />
                    </template>
                  </van-image>
                  <div class="m-item-txt">{{ item.game_name }}</div>
                  <div class="m-item-tag">{{ item.is_hot_text }}</div>
                </div>

                <!-- 加载更多状态 -->
                <div v-if="loadingMore" class="m-loading-more">
                  <van-loading>加载中...</van-loading>
                </div>

                <!-- 没有更多数据 -->
                <div v-else-if="!hasMore && gameList.length > 0" class="m-no-more">
                  没有更多游戏了
                </div>

                <!-- 空数据状态 -->
                <div v-if="gameList.length === 0 && !loading" class="m-empty">
                  <van-empty description="暂无游戏数据" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NoticesPop />

    <!-- footer -->
    <div class="m-main-footer"></div>
  </div>
</template>

<script setup lang="ts">
import depositImg from '@/assets/mobile/deposit.png'
import withdrawImg from '@/assets/mobile/withdraw.png'
import vipImg from '@/assets/mobile/home_vip.png'

defineOptions({ name: 'HomeMain' })
import { onMounted, ref, nextTick } from 'vue'
import LanguageVue from './components/language.vue'
import api from '@/api'
import { getImgUrl, isMobile } from '@/utils/tools'
import { showNotify, showToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import NoticesPop from '@/views/mobile/components/notices.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useAppStore()
const { t } = useI18n()

// ==================== 响应式数据 ====================
const banners = ref([])
const gameTypes = ref([])
const currentGameType = ref(null)
const gameList = ref([])
const selectIdx = ref(6)
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const scrollContainer = ref(null)

// ==================== 计算属性和方法 ====================
const filteredGameList = () => {
  return gameList.value
}

// ==================== 游戏类型相关方法 ====================
async function getGameTypes() {
  try {
    const resp = await api.gameTypeList()
    console.log('game types resp:', resp)

    // 适配后端响应格式：数据在message字段
    if (resp && resp.code === 200 && resp.data) {
      gameTypes.value = resp.data

      // 按权重排序
      gameTypes.value.sort((a, b) => a.sort_weight - b.sort_weight)

      console.log('游戏类型加载成功:', gameTypes.value)
    } else {
      console.warn('游戏类型数据格式异常:', resp)
    }
  } catch (error) {
    console.error('获取游戏类型失败:', error)
    showToast('获取游戏类型失败')
  }
}

// ==================== 游戏列表相关方法 ====================
async function getGames(gameType = 'HOT', page = 1, isLoadMore = false) {
  const loadingKey = isLoadMore ? 'loadingMore' : 'loading'

  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      game_type: gameType,
      page: page,
      limit: 20
    }

    console.log('请求游戏列表:', params)

    const resp = await api.gameList(params)
    console.log('games resp:', resp)

    if (resp && resp.code === 200 && resp.data) {
      const newGames = resp.data.list || []

      if (isLoadMore) {
        // 加载更多：追加到现有列表
        gameList.value.push(...newGames)
      } else {
        // 新类型：替换列表
        gameList.value = newGames
        currentPage.value = 1
      }

      // 更新分页信息
      const pagination = resp.data.pagination
      hasMore.value = pagination?.has_more || false
      currentPage.value = pagination?.current_page || page

      console.log('游戏列表加载成功:', {
        count: newGames.length,
        total: gameList.value.length,
        hasMore: hasMore.value
      })
    } else {
      throw new Error(resp?.message || '获取游戏列表失败')
    }
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    showToast('获取游戏列表失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// ==================== 交互逻辑方法 ====================
async function selectGameHandler(gameItem, idx) {
  console.log('selectGameHandler', gameItem, idx)

  // 权限检查
  if (idx > selectIdx.value) {
    console.log('权限不足，无法切换到此类型')
    return
  }

  // 避免重复切换
  if (currentGameType.value?.id === gameItem.id) {
    console.log('已经是当前类型，无需切换')
    return
  }

  // 更新当前选中类型
  currentGameType.value = gameItem

  // 重置状态
  gameList.value = []
  hasMore.value = true
  currentPage.value = 1

  // 加载对应类型的游戏
  await getGames(gameItem.game_type, 1, false)
}

// 加载更多游戏
async function loadMoreGames() {
  if (!currentGameType.value || !hasMore.value || loadingMore.value) {
    return
  }

  const nextPage = currentPage.value + 1
  await getGames(currentGameType.value.game_type, nextPage, true)
}

// 设置滚动监听
function setupScrollListener() {
  const container = scrollContainer.value

  if (!container) return

  container.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = container

    // 距离底部50px时触发加载更多
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMoreGames()
    }
  })
}

// ==================== 游戏相关方法 ====================
function playGameHandler(gameItem) {
  // 登录检查
  if (!store.isLogin()) {
    loginHandler()
    return
  }

  try {
    // 直接使用后端返回的字段跳转
    router.push({
      name: 'to_game',
      params: {
        game: gameItem.game_code,
        code: gameItem.supplier_code,
        mobile: isMobile() ? 1 : 0,
      },
    })
  } catch (error) {
    console.error('游戏跳转失败:', error)
    showToast('游戏启动失败')
  }
}

// ==================== 用户相关方法 ====================
function loginHandler() {
  store.$patch({ loginShow: true })
  console.log('login show', store.getUser(), store.loginShow)
}

function signDailyHandler() {
  console.log('签到功能待实现')
}

function operatHandler(operationType) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }

  switch (operationType) {
    case 1:
      router.push({ name: 'deposit' })
      break
    case 2:
      router.push({ name: 'withdraw' })
      break
    case 3:
      router.push({ name: 'vip' })
      break
    default:
      console.warn('未知的操作类型:', operationType)
  }
}

// ==================== API 调用方法 ====================
async function getNotices() {
  console.log('获取通知 - 待实现')
}

async function getBanners() {
  try {
    const resp = await api.bannerList({ group: 'mobile1' })
    console.log('banner resp:', resp)

    if (resp && resp.data && Array.isArray(resp.data)) {
      banners.value = resp.data
      // 如果有banner数据，复制第一个用于无缝轮播
      if (banners.value.length >= 1) {
        banners.value.push(resp.data[0])
      }
    } else {
      console.warn('Banner数据格式异常:', resp)
    }
  } catch (error) {
    console.error('获取Banner失败:', error)
    const message = error?.message
    if (message && message.length > 0) {
      showToast(message)
    }
  }
}

async function refreshUserInfo() {
  if (!store.isLogin()) {
    return
  }

  try {
    const resp = await api.getUserInfo()
    console.log('user info resp:', resp)

    if (resp && resp.data) {
      store.setUser(resp.data)
    } else {
      console.warn('用户信息数据格式异常:', resp)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// ==================== 初始化方法 ====================
async function init() {
  try {
    // 隐藏登录弹窗
    store.$patch({ loginShow: false })

    // 开始加载
    store.loading()

    // 1. 并行获取基础数据
    const promises = [
      getNotices(),
      getBanners(),
      getGameTypes(),
    ]

    await Promise.allSettled(promises)

    // 2. 默认选择HOT类型 (热门游戏)
    const hotGameType = gameTypes.value.find(type => type.game_type === 'HOT')
    if (hotGameType) {
      currentGameType.value = hotGameType
      await getGames('HOT', 1, false)
    } else if (gameTypes.value.length > 0) {
      // 如果没有HOT类型，选择第一个类型
      const firstType = gameTypes.value[0]
      currentGameType.value = firstType
      await getGames(firstType.game_type, 1, false)
    }

    // 3. 如果用户已登录，获取最新用户信息
    if (store.getUser()) {
      await refreshUserInfo()
    }

    // 4. 设置滚动监听
    nextTick(() => {
      setupScrollListener()
    })

    console.log('首页数据初始化完成')
  } catch (error) {
    console.error('首页初始化失败:', error)
    showToast('页面加载失败，请重试')
  } finally {
    // 停止加载
    store.stopLoad()
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.m-main {
  background: var(--color-m-background);
  height: 100vh;
  display: flex;
  flex-direction: column;

  .my-swipe {
    height: 140px;
    .van-swipe-item {
      color: var(--m-label-gb);
      font-size: 20px;
      height: 140px;
      text-align: center;
      background-color: #39a9ed;
    }
  }

  .m-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 16px;
    color: var(--van-field-label-color);
    background: var(--color-m-background);
    box-shadow:
      0 0.08rem 0.32rem 0 rgba(209, 221, 242, 0.4),
      0 -0.05333rem 0 0 hsla(0, 0%, 100%, 0.5);
    border-radius: 0 0 0.13333rem 0.13333rem;

    .m-link {
      color: #3ea4f7;
    }
  }

  .m-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 16px;

    .m-row-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex: 1;
      gap: 5px;

      .m-img {
        width: 34px;
        height: 32px;
      }

      .m-label {
        color: var(--m-label-gb);
        font-size: 16px;
      }
    }

    .m-start {
      justify-content: flex-start;
    }

    .m-end {
      justify-content: flex-end;
    }
  }

  .m-user {
    gap: 10px;

    .m-user-level {
      height: 20px;
      background-image: url('../../../assets/mobile/level_bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 2px;
      padding: 0 5px;
      justify-content: flex-start;

      .m-img-bg {
        color: #fff;
        font-size: 14px;
      }

      .m-level-txt {
        color: #fff;
        font-size: 14px;
      }
    }

    .m-btn {
      height: 20px;
    }
  }

  .m-main-contain {
    display: flex;
    flex-direction: row;
    flex: 1;
    height: calc(100vh - 270px);
    background-color: var(--color-m-background);
    gap: 10px;

    .m-con-left {
      display: flex;
      flex-direction: column;
      width: 70px;
      height: 100%;
      background-color: var(--color-m-background);
      background-image: var(--m-label-gb);
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 60px 95%;

      .m-gameNav-container {
        padding-top: 10px;
        padding-bottom: 10px;

        .m-gameNav-item {
          width: 60px;
          height: 67.5px;
          background-image: var(--m-label-gb);
          box-shadow: 0 0.08rem 0.32rem 0 rgba(209, 221, 242, 0.5);
          font-size: 14px;
          transition: 0.35s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--m-left-menu-color);

          .m-item-img {
            width: 24px;
            height: 24px;
          }

          .m-item-txt {
            font-size: 10px;
          }
        }

        .active {
          width: 69.5px;
          height: 76.5px;
          color: #fff;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-image: url('../../../assets/mobile/nav_active.png');
          box-shadow: none;
        }
      }
    }

    .m-con-right {
      display: flex;
      flex-direction: column;
      flex: 1;

      .m-gameNav-container-list {
        padding: 10px 10px 10px 0px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 9px;

        .m-nav-list-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: space-between;
          align-items: flex-start;
          width: 138px;
          height: 108px;
          background: var(--m-main-img-item-bg-color);
          box-shadow: 0 0 0 2px rgb(0 0 0 / 5%);
          border-radius: 2px;

          .m-item-img {
            width: 137.7px;
            height: 80px;
          }

          .m-item-txt {
            color: var(--m-left-menu-color);
            font-size: 12px;
            line-height: 18px;
            margin-left: 5px;
            margin-bottom: 5px;
          }

          .m-item-tag {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 12px;
            color: #fff;
            background: rgba(0, 0, 0, 0.25);
            border-radius: 3px;
            padding: 2px 5px;
          }
        }

        // 加载状态样式
        .m-loading-more {
          width: 100%;
          text-align: center;
          padding: 20px;
          color: #999;
        }

        .m-no-more {
          width: 100%;
          text-align: center;
          padding: 20px;
          color: #999;
          font-size: 14px;
        }

        .m-empty {
          width: 100%;
          text-align: center;
          padding: 40px 20px;
        }
      }
    }

    .m-scroll-wrapper {
      position: relative;
      height: 100%;
      overflow-y: scroll;

      .m-scroll-content {
        position: relative;

        .m-scroll-list-wrapper {
          overflow: hidden;
        }
      }
    }
  }

  .m-main-footer {
    display: flex;
    height: 50px;
  }
}
</style>

<style lang="less">
.m-main {
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
}
</style>
