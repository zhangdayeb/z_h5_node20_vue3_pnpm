<template>
  <div class="daili-record">
    <van-nav-bar
      left-arrow
      title="代理记录"
      @click-left="onClickLeft"
      class="nav-bar"
    />

    <!-- 代理记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        class="record-list"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="record-item"
        >
          <div class="record-info">
            <div class="record-title">{{ item.name }}</div>
            <div class="record-time">{{ item.created_at }}</div>
          </div>
          <div class="record-action">
            <div class="record-proportion">{{ item.fanyong_proportion }}%</div>
            <van-button
              type="primary"
              size="small"
              @click="handleEdit(item)"
              class="edit-btn"
            >
              调整比例
            </van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 空状态 -->
    <van-empty
      v-if="!loading && !refreshing && list.length === 0"
      description="暂无代理记录"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
    />

    <!-- 编辑弹窗 -->
    <van-dialog
      v-model:show="showEditDialog"
      title="调整返佣比例"
      show-cancel-button
      confirm-button-text="确认"
      cancel-button-text="取消"
      :before-close="handleDialogAction"
    >
      <div class="edit-content">
        <div class="edit-info">
          <p>代理：{{ currentEditItem?.name || '' }}</p>
          <p>当前比例：{{ currentEditItem?.fanyong_proportion || '0.00' }}</p>
          <p>您的比例：{{ currentUserInfo?.fanyong_proportion || '0.00' }}</p>
        </div>
        <van-field
          v-model="editProportion"
          type="number"
          label="新比例"
          placeholder="请输入小数，如：0.05"
          step="0.01"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { invokeApi } from '@/utils/tools'
import { showToast } from 'vant'

defineOptions({ name: 'DailiRecord' })

interface DailiRecordItem {
  id: number
  name: string
  created_at: string
  fanyong_proportion: string
}

interface UserInfo {
  fanyong_proportion: string
}

const router = useRouter()

const page = ref(0)
const list = ref<DailiRecordItem[]>([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const currentUserInfo = ref<UserInfo | null>(null) // 当前登录用户信息

// 编辑相关
const showEditDialog = ref(false)
const currentEditItem = ref<DailiRecordItem | null>(null)
const editProportion = ref('')

// 验证比例
const validateProportion = (value: string) => {
  console.log('验证比例:', {
    value,
    currentUserInfo: currentUserInfo.value
  })

  if (!currentUserInfo.value?.fanyong_proportion) {
    console.log('当前用户返佣比例信息不存在')
    return false
  }

  const inputValue = parseFloat(value)
  const userProportion = parseFloat(currentUserInfo.value.fanyong_proportion)

  console.log('比例比较:', {
    inputValue,
    userProportion,
    isValid: !isNaN(inputValue) && inputValue <= userProportion && inputValue >= 0
  })

  return !isNaN(inputValue) && inputValue <= userProportion && inputValue >= 0
}

// 下拉刷新
const onRefresh = async () => {
  console.log('开始刷新数据')
  finished.value = false
  page.value = 0  // 重置页码
  list.value = []  // 清空现有数据
  await getDailiRecords()  // 获取第一页数据
  refreshing.value = false
  console.log('刷新完成，当前数据条数:', list.value.length)
}

// 加载更多
const onLoad = async () => {
  await getDailiRecords()
}

// 返回上一页
function onClickLeft() {
  router.back()
}

// 获取代理记录
async function getDailiRecords() {
  try {
    const resp = await invokeApi('dailiRecord', {
      page: page.value + 1,
      limit: 20
    })

    if (!resp) {
      loading.value = false
      return
    }

    // 后端返回的数据在 resp.message 中，因为后端使用的是 success() 方法
    if (resp.message) {
      const data = resp.message

      // 每次加载数据时都更新当前用户信息
      if (data.user_info) {
        currentUserInfo.value = data.user_info
        console.log('更新当前用户信息:', currentUserInfo.value)
      }

      page.value = data.pagination?.current_page ?? 1
      const newList = data.list ?? []

      if (page.value === 1) {
        // 首次加载或刷新
        list.value = newList
      } else {
        // 加载更多
        list.value.push(...newList)
      }

      // 判断是否还有更多数据
      finished.value = !data.pagination?.has_more
    } else {
      finished.value = true
    }
  } catch (error) {
    console.error('获取代理记录失败:', error)
    finished.value = true
  } finally {
    loading.value = false
  }
}

// 处理编辑
function handleEdit(item: DailiRecordItem) {
  console.log('点击编辑按钮，目标用户:', item)
  console.log('当前用户信息:', currentUserInfo.value)

  currentEditItem.value = item
  editProportion.value = item.fanyong_proportion
  showEditDialog.value = true

  console.log('弹窗状态设置完成:', {
    showEditDialog: showEditDialog.value,
    currentEditItem: currentEditItem.value,
    editProportion: editProportion.value
  })
}

// 处理弹窗操作
function handleDialogAction(action: string) {
  console.log('弹窗操作:', action)

  if (action === 'confirm') {
    return handleConfirmEdit()
  } else {
    handleCancelEdit()
    return true
  }
}

// 确认编辑
async function handleConfirmEdit() {
  console.log('点击确认按钮')
  console.log('当前编辑项:', currentEditItem.value)
  console.log('输入的比例:', editProportion.value)
  console.log('用户信息:', currentUserInfo.value)

  if (!currentEditItem.value) {
    console.log('没有选中的编辑项')
    return false
  }

  // 验证输入
  if (!editProportion.value) {
    console.log('比例为空')
    showToast('请输入返佣比例')
    return false
  }

  const isValid = validateProportion(editProportion.value)
  console.log('比例验证结果:', isValid)

  if (!isValid) {
    const userProp = currentUserInfo.value?.fanyong_proportion || '0.00'
    showToast(`比例不能超过您的返佣比例 ${userProp}，且不能小于0`)
    return false
  }

  console.log('验证通过，准备发送请求')

  try {
    const requestData = {
      user_id: currentEditItem.value.id,
      fanyong_proportion: parseFloat(editProportion.value).toFixed(2)
    }

    console.log('发送编辑请求:', requestData)

    const resp = await invokeApi('dailiEdit', requestData)

    console.log('编辑响应:', resp)

    if (resp && resp.code === 200) {
      showToast('修改成功')
      showEditDialog.value = false

      // 直接更新当前列表中的数据，而不是重新刷新整个列表
      const targetIndex = list.value.findIndex(item => item.id === currentEditItem.value?.id)
      if (targetIndex !== -1) {
        list.value[targetIndex].fanyong_proportion = parseFloat(editProportion.value).toFixed(2)
        console.log('直接更新列表数据，索引:', targetIndex)
      }

      return true
    } else {
      showToast(resp?.data || resp?.message || '修改失败')
      return false
    }
  } catch (error) {
    console.error('修改失败:', error)
    showToast(error?.message || '修改失败')
    return false
  }
}

// 取消编辑
function handleCancelEdit() {
  showEditDialog.value = false
  currentEditItem.value = null
  editProportion.value = ''
}

// 移除多余的函数，直接从API获取用户信息
</script>

<style scoped>
.daili-record {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.nav-bar {
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

.record-list {
  padding: 16px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-info {
  flex: 1;
}

.record-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.record-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.record-proportion {
  font-size: 14px;
  color: #07c160;
  font-weight: 600;
}

.edit-btn {
  min-width: 80px;
  height: 32px;
  font-size: 12px;
}

.edit-content {
  padding: 16px;
}

.edit-info {
  margin-bottom: 16px;
}

.edit-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.proportion-unit {
  color: #999;
  font-size: 14px;
}

.daili-record :deep(.van-list__finished-text) {
  color: #999;
  font-size: 12px;
  padding: 20px 0;
}

.daili-record :deep(.van-empty) {
  padding: 100px 0;
}

.daili-record :deep(.van-dialog) {
  border-radius: 12px;
}

.daili-record :deep(.van-field__label) {
  font-size: 14px;
  color: #333;
}

.daili-record :deep(.van-field__control) {
  font-size: 14px;
}
</style>
