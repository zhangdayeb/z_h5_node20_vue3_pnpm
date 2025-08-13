<template>
  <div class="pc-mine">
    <div class="pc-header">
      <div class="pc-user">
        <el-avatar :size="80" class="pc-ava">
          <el-icon :size="40"><UserFilled /></el-icon>
        </el-avatar>
        <div class="pc-user-right">
          <h5 v-if="store.getUser() === null" @click.stop="loginHandler">
            {{ $t('mine.loginRegister') }}
          </h5>
          <div class="pc-user-info" v-else>
            <span class="pc-level-name">{{ store.getUser()?.name }}</span>
            <div class="pc-user-level">
              <div class="pc-img-bg">VIP</div>
              <span class="pc-level-txt">{{ store.getUser()?.level }}</span>
            </div>
          </div>
          <span>{{ $t('mine.welcomeTo') }} {{ siteConfig?.site_name ?? '' }}</span>
        </div>
        <div class="pc-settings" @click="settingHandler">
          <el-icon :size="24"><Setting /></el-icon>
        </div>
      </div>
      <div class="pc-info">
        <div class="pc-col pc-gap10" @click="refreshBalance" :class="{ 'pc-clickable': true }">
          <p>
            {{ $t('mine.centerWallet') }}
            <el-icon class="pc-p-icon"><ArrowRight /></el-icon>
          </p>
          <h6 v-if="!balanceLoading">{{ Number(store.getUser()?.money ?? '0').toFixed(2) }}</h6>
          <h6 v-else class="pc-loading-text">
            <el-icon class="is-loading"><Loading /></el-icon>
            加载中...
          </h6>
        </div>
        <!-- 条件渲染：只有当配置允许时才显示返水钱包 -->
        <div class="pc-col pc-gap10" v-if="shouldShowFanshui">
          <p>
            {{ $t('mine.fsWallet') }}
            <el-icon class="pc-p-icon"><ArrowRight /></el-icon>
          </p>
          <h6>{{ Number(store.getUser()?.money_rebate ?? '0').toFixed(2) }}</h6>
        </div>
        <div class="pc-col pc-action-btn" @click="dwHandler(0)">
          <el-icon :size="32" color="#4CAF50"><Wallet /></el-icon>
          <p>{{ $t('mine.deposit') }}</p>
        </div>
        <div class="pc-col pc-action-btn" @click="dwHandler(1)">
          <el-icon :size="32" color="#2196F3"><Money /></el-icon>
          <p>{{ $t('mine.withdraw') }}</p>
        </div>
      </div>
    </div>

    <div class="pc-content">
      <div class="pc-func">
        <h5 class="pc-label">{{ $t('mine.normalFunc') }}</h5>
        <div class="pc-func-contain">
          <div class="pc-func-item" @click.stop="recordHandler(1)">
            <el-icon :size="40" color="#FF9800"><Document /></el-icon>
            <p>{{ $t('mine.moneyLog') }}</p>
          </div>
          <div class="pc-func-item" @click.stop="recordHandler(2)">
            <el-icon :size="40" color="#9C27B0"><TrophyBase /></el-icon>
            <p>{{ $t('mine.gameLog') }}</p>
          </div>
          <div class="pc-func-item" @click.stop="recordHandler(3)">
            <el-icon :size="40" color="#F44336"><Star /></el-icon>
            <p>{{ $t('mine.levelRight') }}</p>
          </div>
          <div class="pc-func-item" @click.stop="recordHandler(4)">
            <el-icon :size="40" color="#00BCD4"><Share /></el-icon>
            <p>{{ $t('mine.pullMoney') }}</p>
          </div>
        </div>
      </div>

      <!-- menu -->
      <div class="pc-menu-container">
        <div class="pc-menu-section">
          <el-card shadow="hover" class="pc-mine-menu">
            <div class="pc-menu-item" @click="menuHandler(0)">
              <el-icon><User /></el-icon>
              <span>{{ $t('mine.persionalInfo') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="menuHandler(1)">
              <el-icon><Lock /></el-icon>
              <span>{{ $t('mine.accountSafe') }}</span>
              <span class="pc-menu-value">{{ $t('mine.safest') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="menuHandler(2)">
              <el-icon><CreditCard /></el-icon>
              <span>{{ $t('mine.bankCard') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
          </el-card>
        </div>

        <div class="pc-menu-section">
          <el-card shadow="hover" class="pc-mine-menu">
            <div class="pc-menu-item" @click="menuHandler(3)">
              <el-icon><List /></el-icon>
              <span>{{ $t('rechargeRecord') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="menuHandler(4)">
              <el-icon><Tickets /></el-icon>
              <span>{{ $t('mine.moneyLog') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <!-- 条件渲染：只有当配置允许时才显示返水记录菜单 -->
            <div class="pc-menu-item" @click="menuHandler(5)" v-if="shouldShowFanshui">
              <el-icon><Coin /></el-icon>
              <span>{{ $t('rebateRecord') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="menuHandler(6)">
              <el-icon><Present /></el-icon>
              <span>{{ $t('commissionRecord') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="menuHandler(7)">
              <el-icon><UserFilled /></el-icon>
              <span>{{ $t('subordinateMembers') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
            <div class="pc-menu-item" @click="logoutHandler">
              <el-icon><SwitchButton /></el-icon>
              <span>{{ $t('user.logout') }}</span>
              <el-icon class="pc-menu-arrow"><ArrowRight /></el-icon>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog
      v-model="show"
      :title="$t('user.settings')"
      width="500px"
      class="pc-settings-dialog"
    >
      <div class="pc-pop-contain">
        <el-card class="pc-settings-card">
          <div class="pc-settings-item" @click="router.push('/safeSettings')">
            <el-icon><Lock /></el-icon>
            <span>{{ $t('mine.safeSetting') }}</span>
            <el-icon class="pc-settings-arrow"><ArrowRight /></el-icon>
          </div>
        </el-card>

        <el-card class="pc-settings-card">
          <div class="pc-settings-item">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ $t('user.conactUs') }}</span>
            <el-icon class="pc-settings-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="pc-settings-item">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ $t('mine.aboutUs') }}</span>
            <el-icon class="pc-settings-arrow"><ArrowRight /></el-icon>
          </div>
        </el-card>

        <el-button type="danger" class="pc-logout-btn" @click="logoutHandler">
          {{ $t('user.logout') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { userApi } from '@/api'
import { useAppStore } from '@/stores/app'
import { useConfigStore } from '@/stores/config'
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { SiteConfig } from 'typings'
import { useRouter } from 'vue-router'
import {
  UserFilled,
  Setting,
  ArrowRight,
  Loading,
  Wallet,
  Money,
  Document,
  TrophyBase,
  Star,
  Share,
  User,
  Lock,
  CreditCard,
  List,
  Tickets,
  Coin,
  Present,
  SwitchButton,
  ChatDotRound,
  InfoFilled
} from '@element-plus/icons-vue'

defineOptions({ name: 'MineIndex' })
const router = useRouter()
const store = useAppStore()
const configStore = useConfigStore()
const siteConfig = ref<SiteConfig | null>(null)
const show = ref(false)

// 新增：余额刷新加载状态
const balanceLoading = ref(false)

// 计算属性：判断是否显示返水相关功能
const shouldShowFanshui = computed(() => {
  const fanshuiConfig = configStore.getConfigValue('default_user_fanshui', '0')
  // 兼容字符串和数字，只要是0就不显示
  const value = typeof fanshuiConfig === 'string' ? parseFloat(fanshuiConfig) : fanshuiConfig
  return value > 0
})

// 新增：刷新余额功能
async function refreshBalance() {
  // 检查用户是否登录
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }

  // 防止重复点击
  if (balanceLoading.value) {
    return
  }

  try {
    balanceLoading.value = true

    // 调用获取用户信息API
    const response = await userApi.getUserInfo()

    if (response && response.code === 200 && response.data) {
      // 更新用户信息到store
      store.setUser(response.data)
      ElMessage.success('余额已更新')
    } else {
      ElMessage.error('刷新失败，请重试')
    }
  } catch (error) {
    console.error('刷新余额失败:', error)
    ElMessage.error('刷新失败，请重试')
  } finally {
    balanceLoading.value = false
  }
}

async function getSiteConfig() {
  store.loading()
  store.stopLoad()
}

function loginHandler() {
  store.$patch({ loginShow: true })
}

// 设置
function settingHandler() {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  show.value = true
}

// 存/取款
function dwHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 0:
      router.push({ path: '/deposit' })
      break
    case 1:
      router.push({ path: '/withdraw' })
      break
  }
}

//记录
function recordHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 1:
      router.push({ path: '/moneyLog' })
      break
    case 2:
      router.push({ path: '/gameRecord' })
      break
    case 3:
      router.push({ path: '/vip' })
      break
    case 4:
      router.push({ path: '/extension' })
      break
  }
}

//菜单
function menuHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 0:
      router.push({ path: '/personal' })
      break
    case 1:
      router.push({ path: '/safeSettings' })
      break
    case 2:
      router.push({ path: '/card' })
      break
    case 3:
      router.push({ path: '/topUpLog' })
      break
    case 4:
      router.push({ path: '/withdrawLog' })
      break
    case 5:
      router.push({ path: '/fanshuiRecord' })
      break
    case 6:
      router.push({ path: '/fanyongRecord' })
      break
    case 7:
      router.push({ path: '/dailiRecord' })
      break
  }
}

// 退出
async function logoutHandler() {
  store.loading()
  try {
    const resp = await api.logout()
    if (resp && resp.code === 200) {
      store.logout()
      store.stopLoad()
      ElMessage.success({
        message: resp.message,
        onClose: () => {
          window.location.href = '/'
        },
      })
    }
  } catch (err) {
    console.log('logout err', err)
    ElMessage.error((err as Error).message)
    store.stopLoad()
  }
}

onMounted(async () => {
  await getSiteConfig()
})
</script>

<style lang="less" scoped>
.pc-mine {
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;

  .pc-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 30px;
    min-height: 320px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);

    .pc-user {
      padding: 50px;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 160px;
      gap: 25px;

      .pc-ava {
        background: rgba(255, 255, 255, 0.2);
        border: 3px solid rgba(255, 255, 255, 0.3);
      }

      &-right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;

        .pc-user-info {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 12px;

          .pc-level-name {
            font-size: 28px;
            font-weight: 600;
            color: #fff;
          }

          .pc-user-level {
            height: 32px;
            background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4px;
            padding: 0 12px;
            border-radius: 16px;

            .pc-img-bg,
            .pc-level-txt {
              color: #333;
              font-size: 16px;
              font-weight: 600;
            }
          }
        }

        h5 {
          font-size: 28px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          transition: opacity 0.3s ease;

          &:hover {
            opacity: 0.8;
          }
        }

        span {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .pc-settings {
        position: absolute;
        right: 40px;
        top: 40px;
        cursor: pointer;
        transition: transform 0.3s ease;
        color: #fff;

        &:hover {
          transform: rotate(90deg);
        }
      }
    }

    .pc-info {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-end;
      flex: 1;
      padding: 0 50px 40px 50px;
      background: rgba(0, 0, 0, 0.1);

      .pc-col {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        min-width: 150px;
        color: #fff;

        .pc-p-icon {
          margin-left: 5px;
          vertical-align: middle;
        }

        p {
          font-size: 16px;
          text-align: center;
          display: flex;
          align-items: center;
        }

        h6 {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 8px;

          .is-loading {
            animation: rotate 1s linear infinite;
          }
        }
      }

      .pc-gap10 {
        gap: 15px;
      }

      .pc-action-btn {
        cursor: pointer;
        transition: transform 0.3s ease;
        padding: 15px;
        border-radius: 12px;

        &:hover {
          transform: translateY(-3px);
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .pc-clickable {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 15px;
        border-radius: 12px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .pc-loading-text {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .pc-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .pc-func {
    background-color: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .pc-label {
      font-size: 20px;
      font-weight: 700;
      color: #303133;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e4e7ed;
    }

    &-contain {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;

      .pc-func-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #606266;
        gap: 15px;
        padding: 30px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        background: #f7f8fa;

        &:hover {
          background-color: #fff;
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        }

        p {
          font-size: 16px;
          text-align: center;
          font-weight: 500;
        }
      }
    }
  }

  .pc-menu-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;

    .pc-menu-section {
      .pc-mine-menu {
        border-radius: 16px;
        padding: 20px;

        .pc-menu-item {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            background-color: #f5f7fa;
            padding-left: 25px;
          }

          .el-icon {
            font-size: 20px;
            color: #667eea;
            margin-right: 15px;
          }

          span {
            flex: 1;
            font-size: 16px;
            color: #303133;
          }

          .pc-menu-value {
            color: #67c23a;
            margin-right: 10px;
            flex: none;
          }

          .pc-menu-arrow {
            color: #c0c4cc;
            margin-right: 0;
          }
        }
      }
    }
  }
}

.pc-settings-dialog {
  .pc-pop-contain {
    padding: 20px;

    .pc-settings-card {
      margin-bottom: 20px;

      .pc-settings-item {
        display: flex;
        align-items: center;
        padding: 15px;
        cursor: pointer;
        transition: background 0.3s ease;
        border-radius: 8px;

        &:hover {
          background-color: #f5f7fa;
        }

        .el-icon {
          font-size: 20px;
          color: #667eea;
          margin-right: 15px;
        }

        span {
          flex: 1;
          font-size: 16px;
        }

        .pc-settings-arrow {
          color: #c0c4cc;
          margin-right: 0;
        }
      }
    }

    .pc-logout-btn {
      width: 100%;
      height: 45px;
      font-size: 16px;
      margin-top: 10px;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
