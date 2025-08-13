<template>
  <div class="pc-card">
    <div class="pc-header">
      <el-button
        type="text"
        icon="ArrowLeft"
        @click="onClickLeft"
        class="pc-back-btn"
      >
        返回
      </el-button>
      <h2 class="pc-title">{{ $t('mine.bankManage') }}</h2>
    </div>

    <div class="pc-card-contain">
      <!-- 账户列表展示 -->
      <div class="pc-bank-list" v-if="list.length > 0">
        <div class="pc-bank-item" v-for="(item, idx) in list" :key="`account-${item.id}`" :class="{ 'is-default': item.is_default }">
          <div class="pc-bank-info">
            <div class="pc-bank-left">
              <div class="pc-bank-name">
                {{ getDisplayName(item) }}
                <el-tag v-if="item.is_default" type="danger" size="small" effect="dark">默认</el-tag>
              </div>
              <div class="pc-bank-details">{{ getAccountDetails(item) }}</div>
            </div>
            <div class="pc-bank-actions">
              <el-button
                size="small"
                @click="setDefaultHandler(item)"
                :loading="setDefaultLoading === item.id"
                :type="(item.is_default === 1 || item.is_default === '1') ? 'success' : 'default'"
              >
                {{ (item.is_default === 1 || item.is_default === '1') ? '当前默认' : '设为默认' }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="editCardHandler(item)"
              >
                {{ $t('mine.edit') }}
              </el-button>
            </div>
          </div>
          <div class="pc-bank-card">{{ getFullAccountNumber(item) }}</div>
          <div class="pc-bank-extra-info">
            <span class="pc-account-holder">持卡人：{{ item.account_name }}</span>
            <span class="pc-account-date">{{ formatDate(item.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- 无数据提示 -->
      <div class="pc-empty-state" v-else>
        <el-empty description="暂无收款账户">
          <template #image>
            <div class="pc-empty-icon">🏦</div>
          </template>
          <div class="pc-empty-desc">请添加银行卡、汇旺或USDT账户</div>
        </el-empty>
      </div>

      <el-button
        type="primary"
        size="large"
        class="pc-btn-add"
        @click.stop="addBindHandler"
      >
        <el-icon><Plus /></el-icon>
        {{ $t('mine.addBind') }}
      </el-button>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="showBottom"
      :title="isEditMode ? '编辑账户' : '添加账户'"
      width="600px"
      @close="onPopupClose"
      class="pc-card-dialog"
    >
      <el-tabs v-model="activeTab" @tab-click="onClickTab">
        <!-- 银行卡 -->
        <el-tab-pane label="银行卡" name="bank">
          <el-form :model="frm" label-position="right" label-width="120px">
            <el-form-item label="开户银行" required>
              <el-input v-model="frm.bank_name" placeholder="请输入开户银行名称" />
            </el-form-item>
            <el-form-item label="开户人姓名" required>
              <el-input
                v-model="frm.account_name"
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
            </el-form-item>
            <el-form-item label="银行账号" required>
              <el-input v-model="frm.account_number" placeholder="请输入开户银行账号" />
            </el-form-item>
            <el-form-item label="开户网点" required>
              <el-input v-model="frm.bank_branch" placeholder="请输入开户网点" />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="frm.id_number" placeholder="请输入身份证号(可选)" />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="frm.phone_number" placeholder="请输入手机号码(可选)" />
            </el-form-item>
            <el-form-item label="设为默认账户">
              <el-checkbox v-model="frm.is_default" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 汇旺 -->
        <el-tab-pane label="汇旺" name="huiwang">
          <el-form :model="frm" label-position="right" label-width="120px">
            <el-form-item label="开户人姓名" required>
              <el-input
                v-model="frm.account_name"
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
            </el-form-item>
            <el-form-item label="汇旺账号" required>
              <el-input v-model="frm.account_number" placeholder="请输入汇旺账号" />
            </el-form-item>
            <el-form-item label="手机号码" required>
              <el-input v-model="frm.phone_number" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="设为默认账户">
              <el-checkbox v-model="frm.is_default" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- USDT -->
        <el-tab-pane label="USDT" name="usdt">
          <el-form :model="frm" label-position="right" label-width="120px">
            <el-form-item label="网络类型" required>
              <el-select v-model="frm.network_type" placeholder="请选择">
                <el-option label="TRC20" value="TRC20" />
                <el-option label="ERC20" value="ERC20" />
              </el-select>
            </el-form-item>
            <el-form-item label="开户人姓名" required>
              <el-input
                v-model="frm.account_name"
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
            </el-form-item>
            <el-form-item label="钱包地址" required>
              <el-input v-model="frm.wallet_address" placeholder="请输入USDT钱包地址" />
            </el-form-item>
            <el-form-item label="设为默认账户">
              <el-checkbox v-model="frm.is_default" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="showBottom = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ isEditMode ? '更新' : '提交' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { invokeApi } from '@/utils/tools'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

defineOptions({ name: 'PcBankCardManage' })

// 账户类型接口
interface UserAccount {
  id: number
  account_type: 'bank' | 'huiwang' | 'usdt'
  account_name: string
  account_number?: string
  bank_branch?: string
  phone_number?: string
  wallet_address?: string
  network_type?: string
  id_number?: string
  remark_name?: string
  is_default: number
  display_info?: string
  created_at?: string
  account_number_masked?: string
  phone_number_masked?: string
  wallet_address_masked?: string
}

const router = useRouter()
const store = useAppStore()

// 响应式数据
const list = ref<UserAccount[]>([])
const showBottom = ref(false)
const activeTab = ref('bank')
const editId = ref(0)
const submitLoading = ref(false)
const setDefaultLoading = ref(0)

// 是否为编辑模式
const isEditMode = computed(() => editId.value > 0)

// 表单数据
const frm = ref({
  account_type: 'bank' as 'bank' | 'huiwang' | 'usdt',
  account_name: '',
  bank_name: '',
  account_number: '',
  bank_branch: '',
  phone_number: '',
  wallet_address: '',
  network_type: 'TRC20',
  id_number: '',
  is_default: false
})

// 重置表单
function resetForm() {
  frm.value = {
    account_type: 'bank',
    account_name: store.getUser()?.realname ?? '',
    bank_name: '',
    account_number: '',
    bank_branch: '',
    phone_number: '',
    wallet_address: '',
    network_type: 'TRC20',
    id_number: '',
    is_default: false
  }
  editId.value = 0
  activeTab.value = 'bank'
}

// 设为默认处理函数
async function setDefaultHandler(item: UserAccount) {
  if (item.is_default === 1 || item.is_default === '1') {
    ElMessage.warning('该账户已经是默认账户')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要将 ${getDisplayName(item)} 设为默认账户吗？`,
      '设为默认账户',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    setDefaultLoading.value = item.id

    const resp = await invokeApi('setDefaultAccount', { account_id: item.id })
    console.log('设置默认账户响应:', resp)

    if (resp && resp.code === 200) {
      ElMessage.success('设置成功')
      await loadAccountList()
    } else {
      throw new Error(resp.message || '设置失败')
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error('设置默认账户错误:', err)
      const msg = (err as Error).message
      ElMessage.error(msg || '设置失败，请重试')
    }
  } finally {
    setDefaultLoading.value = 0
  }
}

// 获取显示名称
function getDisplayName(item: UserAccount): string {
  switch (item.account_type) {
    case 'bank':
      return item.remark_name || item.bank_branch || '银行卡'
    case 'huiwang':
      return '汇旺'
    case 'usdt':
      return `USDT-${item.network_type || 'TRC20'}`
    default:
      return item.account_name || '未知类型'
  }
}

// 获取账户详细信息
function getAccountDetails(item: UserAccount): string {
  switch (item.account_type) {
    case 'bank':
      return `${item.bank_branch || '开户网点'}`
    case 'huiwang':
      return `手机号：${item.phone_number_masked || '未设置'}`
    case 'usdt':
      return `网络：${item.network_type || 'TRC20'}`
    default:
      return ''
  }
}

// 获取完整账号信息
function getFullAccountNumber(item: UserAccount): string {
  switch (item.account_type) {
    case 'bank':
      return item.account_number_masked || maskBankCardForDisplay(item.account_number || '')
    case 'huiwang':
      return `账号：${item.account_number_masked || maskAccount(item.account_number || '')}`
    case 'usdt':
      return `地址：${item.wallet_address_masked || maskWalletAddressForDisplay(item.wallet_address || '')}`
    default:
      return item.account_number || ''
  }
}

// 银行卡号脱敏
function maskBankCardForDisplay(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo
  return cardNo.slice(0, 6) + '*'.repeat(Math.max(cardNo.length - 10, 4)) + cardNo.slice(-4)
}

// 钱包地址脱敏
function maskWalletAddressForDisplay(address: string): string {
  if (!address || address.length < 12) return address
  return address.slice(0, 8) + '...' + address.slice(-8)
}

// 账号脱敏
function maskAccount(account: string): string {
  if (!account || account.length < 6) return account
  return account.slice(0, 3) + '*'.repeat(account.length - 6) + account.slice(-3)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 添加绑定按钮事件
function addBindHandler() {
  resetForm()
  showBottom.value = true
}

// 弹窗关闭事件
function onPopupClose() {
  if (!submitLoading.value) {
    resetForm()
  }
}

// 点击tab事件
function onClickTab(tab: any) {
  const name = tab.props.name
  switch (name) {
    case 'bank':
      frm.value.account_type = 'bank'
      break
    case 'huiwang':
      frm.value.account_type = 'huiwang'
      break
    case 'usdt':
      frm.value.account_type = 'usdt'
      frm.value.network_type = 'TRC20'
      break
  }
}

// 修改按钮事件
async function editCardHandler(item: UserAccount) {
  console.log('编辑账户:', item)
  editId.value = item.id

  frm.value.account_name = item.account_name || store.getUser()?.realname || ''
  frm.value.is_default = !!item.is_default

  switch (item.account_type) {
    case 'bank':
      activeTab.value = 'bank'
      frm.value.account_type = 'bank'
      frm.value.bank_name = item.remark_name || ''
      frm.value.account_number = item.account_number || ''
      frm.value.bank_branch = item.bank_branch || ''
      frm.value.phone_number = item.phone_number || ''
      frm.value.id_number = item.id_number || ''
      break
    case 'huiwang':
      activeTab.value = 'huiwang'
      frm.value.account_type = 'huiwang'
      frm.value.account_number = item.account_number || ''
      frm.value.phone_number = item.phone_number || ''
      break
    case 'usdt':
      activeTab.value = 'usdt'
      frm.value.account_type = 'usdt'
      frm.value.wallet_address = item.wallet_address || ''
      frm.value.network_type = item.network_type || 'TRC20'
      break
  }

  showBottom.value = true
}

// 统一提交处理
function handleSubmit() {
  switch (activeTab.value) {
    case 'bank':
      submitBankHandler()
      break
    case 'huiwang':
      submitHuiwangHandler()
      break
    case 'usdt':
      submitUsdtHandler()
      break
  }
}

// 提交银行卡信息
async function submitBankHandler() {
  if (frm.value.bank_name.trim().length <= 0) {
    ElMessage.warning('请输入开户银行名称')
    return
  }
  if (frm.value.account_name.trim().length <= 0) {
    ElMessage.warning('请填写开户人姓名')
    return
  }
  if (frm.value.account_number.trim().length <= 0) {
    ElMessage.warning('请填写银行账号')
    return
  }
  if (frm.value.bank_branch.trim().length <= 0) {
    ElMessage.warning('请填写开户网点')
    return
  }

  const data = {
    account_type: 'bank',
    account_name: frm.value.account_name,
    remark_name: frm.value.bank_name,
    account_number: frm.value.account_number,
    bank_branch: frm.value.bank_branch,
    phone_number: frm.value.phone_number,
    id_number: frm.value.id_number,
    is_default: frm.value.is_default
  }

  if (isEditMode.value) {
    await editAccount(editId.value, data)
  } else {
    await addAccount(data)
  }
}

// 提交汇旺信息
async function submitHuiwangHandler() {
  if (frm.value.account_name.trim().length <= 0) {
    ElMessage.warning('请填写开户人姓名')
    return
  }
  if (frm.value.account_number.trim().length <= 0) {
    ElMessage.warning('请填写汇旺账号')
    return
  }
  if (frm.value.phone_number.trim().length <= 0) {
    ElMessage.warning('请填写手机号码')
    return
  }

  const data = {
    account_type: 'huiwang',
    account_name: frm.value.account_name,
    account_number: frm.value.account_number,
    phone_number: frm.value.phone_number,
    is_default: frm.value.is_default
  }

  if (isEditMode.value) {
    await editAccount(editId.value, data)
  } else {
    await addAccount(data)
  }
}

// 提交USDT信息
async function submitUsdtHandler() {
  if (frm.value.network_type.trim().length <= 0) {
    ElMessage.warning('请选择网络类型')
    return
  }
  if (frm.value.account_name.trim().length <= 0) {
    ElMessage.warning('请填写开户人姓名')
    return
  }
  if (frm.value.wallet_address.trim().length <= 0) {
    ElMessage.warning('请填写钱包地址')
    return
  }

  const data = {
    account_type: 'usdt',
    account_name: frm.value.account_name,
    wallet_address: frm.value.wallet_address,
    network_type: frm.value.network_type,
    is_default: frm.value.is_default
  }

  if (isEditMode.value) {
    await editAccount(editId.value, data)
  } else {
    await addAccount(data)
  }
}

// 调用添加账户API
async function addAccount(data: object) {
  submitLoading.value = true
  try {
    const resp = await invokeApi('addAccount', data)
    console.log('添加账户响应:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      ElMessage.success('添加成功')
      await loadAccountList()
      resetForm()
    } else {
      throw new Error(resp.message || '添加失败')
    }
  } catch (err) {
    console.error('添加账户错误:', err)
    const msg = (err as Error).message
    ElMessage.error(msg || '添加失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 调用编辑账户API
async function editAccount(id: number, data: object) {
  submitLoading.value = true
  try {
    const editData = {
      id: id,
      ...data
    }
    const resp = await invokeApi('editAccount', editData)
    console.log('编辑账户响应:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      ElMessage.success('修改成功')
      await loadAccountList()
      resetForm()
    } else {
      throw new Error(resp.message || '修改失败')
    }
  } catch (err) {
    console.error('编辑账户错误:', err)
    const msg = (err as Error).message
    ElMessage.error(msg || '修改失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 获取用户账户列表
async function loadAccountList() {
  try {
    const resp = await invokeApi('accountList')
    console.log('账户列表响应:', resp)
    if (resp && resp.code === 200) {
      list.value = resp.data?.list || []
    } else {
      console.warn('获取账户列表失败:', resp?.message)
      list.value = []
    }
  } catch (err) {
    console.error('获取账户列表错误:', err)
    list.value = []
    ElMessage.error('获取账户列表失败')
  }
}

// 初始化
async function init() {
  store.loading()
  try {
    await loadAccountList()
  } finally {
    store.stopLoad()
  }
}

// 返回按钮
function onClickLeft() {
  router.back()
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.pc-card {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;

  .pc-header {
    max-width: 1200px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;

    .pc-back-btn {
      font-size: 14px;
    }

    .pc-title {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
  }

  .pc-card-contain {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    padding: 30px;

    .pc-bank-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;

      .pc-bank-item {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 20px;
        color: #fff;
        position: relative;
        transition: all 0.3s;
        min-height: 180px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        &.is-default {
          border: 2px solid #ff6b35;
          box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
        }

        .pc-bank-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          .pc-bank-left {
            .pc-bank-name {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .pc-bank-details {
              font-size: 14px;
              opacity: 0.9;
            }
          }

          .pc-bank-actions {
            display: flex;
            gap: 10px;
          }
        }

        .pc-bank-card {
          font-size: 18px;
          font-weight: 500;
          word-break: break-all;
          line-height: 1.5;
        }

        .pc-bank-extra-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          opacity: 0.85;
          margin-top: auto;

          .pc-account-holder {
            font-size: 14px;
          }

          .pc-account-date {
            font-size: 12px;
            opacity: 0.7;
          }
        }
      }
    }

    .pc-empty-state {
      padding: 60px 0;
      text-align: center;

      .pc-empty-icon {
        font-size: 80px;
        margin-bottom: 20px;
      }

      .pc-empty-desc {
        margin-top: 10px;
        color: #909399;
        font-size: 14px;
      }
    }

    .pc-btn-add {
      display: block;
      margin: 40px auto 0;
      width: 200px;
      height: 44px;
    }
  }
}

// 弹窗样式
.pc-card-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .el-form {
    padding: 20px 0;
  }
}
</style>
