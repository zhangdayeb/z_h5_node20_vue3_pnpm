<template>
  <div class="m-person">
    <van-nav-bar
      left-arrow
      :title="$t('mine.baseInfo')"
      @click-left="onClickLeft"
      class="m-nav"
    />

    <!-- 基础信息 -->
    <van-cell-group>
      <van-cell
        :title="$t('register.username')"
        :value="userInfo?.name ?? ''"
      />
    </van-cell-group>

    <!-- 资金信息 -->
    <van-cell-group class="m-top10">
      <van-cell class="money-cell">
        <template #title>
          <span class="money-title">用户余额</span>
        </template>
        <template #value>
          <span class="money-value">{{ formatMoney(userInfo?.money) }}</span>
        </template>
      </van-cell>

      <van-cell class="money-cell">
        <template #title>
          <span class="money-title">返水金额</span>
        </template>
        <template #value>
          <span class="money-value rebate">{{ formatMoney(userInfo?.money_rebate) }}</span>
        </template>
      </van-cell>

      <van-cell class="money-cell">
        <template #title>
          <span class="money-title">返佣金额</span>
        </template>
        <template #value>
          <span class="money-value commission">{{ formatMoney(userInfo?.money_fanyong) }}</span>
        </template>
      </van-cell>

      <van-cell
        title="货币类型"
        :value="formatCurrency(userInfo?.currency)"
      />
    </van-cell-group>

    <!-- 个人资料 -->
    <van-cell-group class="m-top10">
      <van-cell
        :title="$t('register.realName')"
        :value="userInfo?.realname ?? userInfo?.real_name ?? ''"
      />
      <van-cell
        :title="$t('register.phone')"
        :value="userInfo?.phone ?? ''"
        :is-link="true"
        @click="editUserInfo('phone')"
      />
      <van-cell
        title="昵称"
        :value="userInfo?.nick_name ?? userInfo?.nickname ?? ''"
        :is-link="true"
        @click="editUserInfo('nick_name')"
      />
    </van-cell-group>

    <!-- 编辑基础信息弹窗 -->
    <van-popup
      v-model:show="showEditBasic"
      position="bottom"
      closeable
      :style="{ height: '50%' }"
    >
      <van-cell-group inset class="m-pop-frm">
        <van-field
          v-model="basicForm.nick_name"
          label="昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
          placeholder="请输入昵称"
          v-if="editField === 'nick_name'"
        />
        <van-field
          v-model="basicForm.phone"
          label="手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
          placeholder="请输入手机号"
          v-if="editField === 'phone'"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" @click="updateBasicInfo">
          {{ $t('submit') }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { userApi } from '@/api/index'
import { showToast } from 'vant'

defineOptions({ name: 'PersonalVue' })

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()

// 响应式数据
const showEditBasic = ref(false)
const editField = ref('')

// 表单数据
const basicForm = ref({
  nick_name: '',
  phone: '',
})

// 计算属性：获取用户信息
const userInfo = computed(() => store.getUser())

// 格式化金额显示
function formatMoney(amount: string | number | undefined): string {
  if (!amount) return '0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return num.toFixed(2)
}

// 格式化货币类型显示
function formatCurrency(currency: string | undefined): string {
  const currencyMap: Record<string, string> = {
    'CNY': '人民币 (CNY)',
    'USD': '美元 (USD)',
    'EUR': '欧元 (EUR)',
    'JPY': '日元 (JPY)',
    'KRW': '韩元 (KRW)',
    'THB': '泰铢 (THB)',
    'VND': '越南盾 (VND)',
    'SGD': '新加坡元 (SGD)',
    'MYR': '马来西亚令吉 (MYR)',
    'PHP': '菲律宾比索 (PHP)',
    'IDR': '印尼盾 (IDR)',
    'BTC': '比特币 (BTC)',
    'ETH': '以太坊 (ETH)',
    'USDT': '泰达币 (USDT)'
  }

  return currencyMap[currency || 'CNY'] || `${currency || 'CNY'}`
}

// 返回
function onClickLeft() {
  router.back()
}

// 编辑基础信息
function editUserInfo(field: string) {
  editField.value = field

  if (field === 'nick_name') {
    basicForm.value.nick_name = userInfo.value?.nick_name || userInfo.value?.nickname || ''
  } else if (field === 'phone') {
    basicForm.value.phone = userInfo.value?.phone || ''
  }

  showEditBasic.value = true
}

// 更新基础信息
async function updateBasicInfo() {
  try {
    let updateData: any = {}

    if (editField.value === 'nick_name') {
      if (!basicForm.value.nick_name.trim()) {
        showToast('请输入昵称')
        return
      }
      updateData.nick_name = basicForm.value.nick_name.trim()
    } else if (editField.value === 'phone') {
      if (!basicForm.value.phone.trim()) {
        showToast('请输入手机号')
        return
      }
      updateData.phone = basicForm.value.phone.trim()
    }

    // 调用后端 updateUserInfo 接口
    const response = await userApi.updateUserInfo(updateData)

    if (response && response.code === 200) {
      showToast('更新成功')

      // 更新本地存储的用户信息
      const currentUser = store.getUser()
      if (currentUser) {
        store.setUser({ ...currentUser, ...updateData })
      }

      showEditBasic.value = false

      // 重新获取用户信息确保数据同步
      await refreshUserInfo()
    } else {
      showToast(response?.message || '更新失败')
    }
  } catch (error: any) {
    console.error('更新基础信息失败:', error)
    showToast(error?.message || '更新失败')
  }
}

// 刷新用户信息
async function refreshUserInfo() {
  try {
    const response = await userApi.getUserInfo()

    if (response && response.code === 200 && response.data) {
      store.setUser(response.data)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 组件挂载时获取最新用户信息
onMounted(() => {
  refreshUserInfo()
})
</script>

<style lang="less" scoped>
.m-person {
  display: flex;
  flex-direction: column;
  flex: 1;

  .m-top10 {
    margin-top: 10px;
  }

  .m-pop-frm {
    margin-top: 46px;
  }

  .money-cell {
    .money-title {
      font-size: 14px;
      color: #323233;
      font-weight: 500;
    }

    .money-value {
      font-size: 16px;
      font-weight: 600;
      color: #07c160;

      &.rebate {
        color: #1989fa;
      }

      &.commission {
        color: #ff976a;
      }
    }
  }
}

.m-person :deep(.van-cell__title) {
  font-size: 14px;
  color: #323233;
}

.m-person :deep(.van-cell__value) {
  font-size: 14px;
  color: #646566;
}
</style>

<style lang="less">
@import url('@/views/mobile/common.less');
</style>
