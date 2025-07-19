<template>
  <div class="m-exten">
    <van-nav-bar
      left-arrow
      :title="$t('mine.tuiguanG')"
      @click-left="onClickLeft"
      class="m-nav"
    />

    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <div class="user-card">
        <div class="user-details">
          <div class="user-id">ID: {{ userInfo?.id }}</div>
        </div>
      </div>

      <div class="invite-code-card">
        <div class="card-title">我的邀请码</div>
        <div class="invite-code">{{ userInfo?.inviteCode || 'LOADING...' }}</div>
        <van-button
          type="primary"
          size="small"
          @click="copyInviteCode"
          :loading="copyingCode"
        >
          复制邀请码
        </van-button>
      </div>
    </div>

    <!-- 推广链接区域 -->
    <div class="promotion-link-section">
      <div class="link-card">
        <div class="card-title">推广链接</div>
        <div class="link-content">
          <div class="link-text">{{ promotionLink }}</div>
          <van-button
            type="primary"
            size="small"
            @click="copyPromotionLink"
            :loading="copyingLink"
          >
            复制链接
          </van-button>
        </div>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-section">
      <van-button
        type="primary"
        block
        round
        @click="sharePromotion"
        class="share-btn"
      >
        分享推广链接
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { userApi } from '@/api'

defineOptions({ name: 'ExtensionVue' })

// 假设的用户信息类型
interface UserInfo {
  id: string | number
  username?: string
  nickname?: string
  avatar?: string
  inviteCode?: string
}

const router = useRouter()

// 响应式数据
const userInfo = ref<UserInfo | null>(null)
const copyingCode = ref(false)
const copyingLink = ref(false)

// 计算推广链接
const promotionLink = computed(() => {
  if (!userInfo.value?.inviteCode) return ''

  const currentDomain = window.location.origin
  return `${currentDomain}/register?invite=${userInfo.value.inviteCode}`
})

// 返回
function onClickLeft() {
  router.back()
}

// 复制邀请码
async function copyInviteCode() {
  if (!userInfo.value?.inviteCode) {
    showToast('邀请码不存在')
    return
  }

  copyingCode.value = true
  try {
    await navigator.clipboard.writeText(userInfo.value.inviteCode)
    showToast('邀请码已复制')
  } catch (err) {
    // 兼容性处理
    const textArea = document.createElement('textarea')
    textArea.value = userInfo.value.inviteCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('邀请码已复制')
  } finally {
    copyingCode.value = false
  }
}

// 复制推广链接
async function copyPromotionLink() {
  if (!promotionLink.value) {
    showToast('推广链接生成中...')
    return
  }

  copyingLink.value = true
  try {
    await navigator.clipboard.writeText(promotionLink.value)
    showToast('推广链接已复制')
  } catch (err) {
    // 兼容性处理
    const textArea = document.createElement('textarea')
    textArea.value = promotionLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('推广链接已复制')
  } finally {
    copyingLink.value = false
  }
}

// 分享推广
function sharePromotion() {
  if (navigator.share) {
    navigator.share({
      title: '邀请注册',
      text: '快来注册吧！',
      url: promotionLink.value
    }).catch(err => {
      console.log('分享取消或失败:', err)
      // 降级到复制链接
      copyPromotionLink()
    })
  } else {
    // 不支持原生分享，直接复制链接
    copyPromotionLink()
  }
}

// 获取用户信息
async function fetchUserInfo() {
  try {
    const response = await userApi.getUserInfo()

    if (response && response.data) {
      userInfo.value = {
        id: response.data.id,
        username: response.data.name,
        nickname: response.data.nick_name,
        avatar: response.data.avatar,
        inviteCode: response.data.invite_code || generateInviteCode(response.data.id)
      }
    } else {
      throw new Error('获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    showToast('获取用户信息失败')
  }
}

// 生成邀请码（如果接口没有返回）
function generateInviteCode(userId: string | number): string {
  // 简单的邀请码生成逻辑，实际应该由后端生成
  const base = userId.toString().padStart(6, '0')
  return `INV${base}`
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style lang="less" scoped>
.m-exten {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #f5f5f5;
  min-height: 100vh;
}

// 用户信息区域
.user-info-section {
  padding: 16px;

  .user-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .user-details {
      .user-id {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .invite-code-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .card-title {
      font-size: 16px;
      color: #666;
      margin-bottom: 12px;
    }

    .invite-code {
      font-size: 24px;
      font-weight: bold;
      color: #1989fa;
      letter-spacing: 2px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
      border: 2px dashed #1989fa;
    }
  }
}

// 推广链接区域
.promotion-link-section {
  padding: 0 16px 16px;

  .link-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .card-title {
      font-size: 16px;
      color: #666;
      margin-bottom: 12px;
    }

    .link-content {
      .link-text {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        color: #666;
        word-break: break-all;
        margin-bottom: 12px;
        border: 1px solid #e9ecef;
      }
    }
  }
}

// 操作按钮区域
.action-section {
  padding: 16px;
  margin-top: auto;

  .share-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>

<style lang="less">
@import url('@/views/mobile/common.less');
</style>
