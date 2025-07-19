<template>
  <div class="withdraw-record">
    <van-nav-bar
      left-arrow
      title="提现记录"
      @click-left="onClickLeft"
      class="nav-bar"
    />

    <!-- 状态筛选 -->
    <div class="filter-bar">
      <van-tabs v-model:active="activeStatus" @click-tab="onTabChange" sticky>
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="待审核" name="0"></van-tab>
        <van-tab title="已通过" name="1"></van-tab>
        <van-tab title="已拒绝" name="2"></van-tab>
      </van-tabs>
    </div>

    <!-- 提现记录列表 -->
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
          @click="showRecordDetail(item)"
        >
          <div class="record-header">
            <div class="record-title">
              <span class="amount" :class="getAmountClass(item.status)">
                ¥{{ item.amount }}
              </span>
              <van-tag
                :type="getStatusTagType(item.status)"
                size="small"
                class="status-tag"
              >
                {{ item.status_text }}
              </van-tag>
            </div>
          </div>
          <div class="record-info">
            <div class="info-row">
              <span class="label">申请时间：</span>
              <span class="value">{{ formatTime(item.create_time) }}</span>
            </div>
            <div class="info-row" v-if="item.success_time">
              <span class="label">完成时间：</span>
              <span class="value">{{ formatTime(item.success_time) }}</span>
            </div>
            <div class="info-row">
              <span class="label">实际到账：</span>
              <span class="value">¥{{ item.actual_amount }}</span>
            </div>
            <div class="info-row" v-if="item.bank_name">
              <span class="label">提现方式：</span>
              <span class="value">{{ item.pay_type_text }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 详情弹窗 -->
    <van-popup
      v-model:show="showDetail"
      position="bottom"
      round
      :style="{ height: '70%' }"
      class="detail-popup"
    >
      <div class="detail-content" v-if="selectedRecord">
        <div class="detail-header">
          <h3>提现详情</h3>
          <van-icon name="cross" @click="showDetail = false" />
        </div>

        <div class="detail-body">
          <div class="detail-amount">
            <span class="amount-label">提现金额</span>
            <span class="amount-value" :class="getAmountClass(selectedRecord.status)">
              ¥{{ selectedRecord.amount }}
            </span>
          </div>

          <div class="detail-status">
            <van-tag
              :type="getStatusTagType(selectedRecord.status)"
              size="large"
            >
              {{ selectedRecord.status_text }}
            </van-tag>
          </div>

          <van-cell-group class="detail-info">
            <van-cell title="订单号" :value="selectedRecord.id" />
            <van-cell title="申请时间" :value="formatTime(selectedRecord.create_time)" />
            <van-cell
              v-if="selectedRecord.success_time"
              title="完成时间"
              :value="formatTime(selectedRecord.success_time)"
            />
            <van-cell title="提现金额" :value="`¥${selectedRecord.amount}`" />
            <van-cell title="手续费" :value="`¥${selectedRecord.fee}`" />
            <van-cell title="实际到账" :value="`¥${selectedRecord.actual_amount}`" />
            <van-cell title="提现方式" :value="selectedRecord.pay_type_text" />
            <van-cell
              v-if="selectedRecord.bank_name"
              title="银行名称"
              :value="selectedRecord.bank_name"
            />
            <van-cell
              v-if="selectedRecord.account"
              title="收款账户"
              :value="selectedRecord.account"
            />
            <van-cell
              v-if="selectedRecord.account_name"
              title="户名"
              :value="selectedRecord.account_name"
            />
            <van-cell
              v-if="selectedRecord.remark"
              title="备注"
              :value="selectedRecord.remark"
              class="remark-cell"
            />
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { invokeApi } from '@/utils/tools'
import { showToast } from 'vant'

defineOptions({ name: 'WithdrawRecord' })

interface WithdrawRecordItem {
  id: number
  create_time: string
  success_time?: string
  amount: string
  fee: string
  actual_amount: string
  status: number
  status_text: string
  status_color: string
  pay_type: string
  pay_type_text: string
  bank_name?: string
  account?: string
  account_name?: string
  remark?: string
}

const router = useRouter()

const page = ref(0)
const list = ref<WithdrawRecordItem[]>([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const activeStatus = ref('')
const showDetail = ref(false)
const selectedRecord = ref<WithdrawRecordItem | null>(null)

// 获取状态样式类
function getAmountClass(status: number): string {
  switch (status) {
    case 1: // 已通过
      return 'amount-success'
    case 2: // 已拒绝
      return 'amount-error'
    case 0: // 待审核
    default:
      return 'amount-pending'
  }
}

// 获取状态标签类型
function getStatusTagType(status: number): string {
  switch (status) {
    case 1: // 已通过
      return 'success'
    case 2: // 已拒绝
      return 'danger'
    case 0: // 待审核
    default:
      return 'warning'
  }
}

// 格式化时间
function formatTime(timeStr: string): string {
  if (!timeStr) return '-'

  try {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return timeStr
  }
}

// 显示详情
function showRecordDetail(record: WithdrawRecordItem) {
  selectedRecord.value = record
  showDetail.value = true
}

// 标签切换
function onTabChange(event: { name: string }) {
  activeStatus.value = event.name
  onRefresh()
}

// 下拉刷新
const onRefresh = async () => {
  finished.value = false
  loading.value = true
  page.value = 0
  list.value = []
  await getWithdrawRecords()
  refreshing.value = false
}

// 加载更多
const onLoad = async () => {
  await getWithdrawRecords()
}

// 返回上一页
function onClickLeft() {
  router.back()
}

// 获取提现记录
async function getWithdrawRecords() {
  try {
    const params: any = {
      page: page.value + 1,
      limit: 20
    }

    // 添加状态筛选
    if (activeStatus.value !== '') {
      params.status = activeStatus.value
    }

    const resp = await invokeApi('withdrawRecord', params)

    if (!resp) {
      loading.value = false
      return
    }

    if (resp.data) {
      const data = resp.data
      page.value = data.pagination?.current_page ?? 1
      const newList = data.list ?? []

      if (page.value === 1) {
        list.value = newList
      } else {
        list.value = list.value.concat(newList)
      }

      // 判断是否还有更多数据
      finished.value = !data.pagination?.has_more
    }
  } catch (error) {
    console.error('获取提现记录失败:', error)
    showToast('获取提现记录失败')
  }

  loading.value = false
}

onMounted(async () => {
  await getWithdrawRecords()
})
</script>

<style lang="less" scoped>
.withdraw-record {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;

  .nav-bar {
    background-color: #fff;
  }

  .filter-bar {
    background-color: #fff;
    border-bottom: 1px solid #ebedf0;
  }

  .record-list {
    flex: 1;
    padding: 10px;
  }

  .record-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background-color: #f8f9fa;
    }

    .record-header {
      .record-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .amount {
          font-size: 18px;
          font-weight: 600;

          &.amount-success {
            color: #07c160;
          }

          &.amount-error {
            color: #fa5151;
          }

          &.amount-pending {
            color: #ff8f00;
          }
        }

        .status-tag {
          border-radius: 12px;
        }
      }
    }

    .record-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #969799;
          min-width: 80px;
        }

        .value {
          color: #323233;
          text-align: right;
          flex: 1;
        }
      }
    }
  }
}

.detail-popup {
  .detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #ebedf0;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #323233;
      }

      .van-icon {
        font-size: 20px;
        color: #969799;
        cursor: pointer;
      }
    }

    .detail-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;

      .detail-amount {
        text-align: center;
        margin-bottom: 16px;

        .amount-label {
          display: block;
          font-size: 14px;
          color: #969799;
          margin-bottom: 8px;
        }

        .amount-value {
          font-size: 28px;
          font-weight: 600;

          &.amount-success {
            color: #07c160;
          }

          &.amount-error {
            color: #fa5151;
          }

          &.amount-pending {
            color: #ff8f00;
          }
        }
      }

      .detail-status {
        text-align: center;
        margin-bottom: 24px;
      }

      .detail-info {
        border-radius: 8px;
        overflow: hidden;

        .remark-cell {
          .van-cell__value {
            word-break: break-all;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.amount-success {
  color: #07c160 !important;
}

.amount-error {
  color: #fa5151 !important;
}

.amount-pending {
  color: #ff8f00 !important;
}
</style>
