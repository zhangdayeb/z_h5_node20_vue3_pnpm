<template>
  <div class="m-card">
    <van-nav-bar
      left-arrow
      :title="$t('mine.bankManage')"
      @click-left="onClickLeft"
    />
    <div class="m-card-contain">
      <!-- 账户列表展示 -->
      <div class="m-bank-list" v-if="list.length > 0">
        <div class="m-bank-item" v-for="(item, idx) in list" :key="`account-${item.id}`" :class="{ 'is-default': item.is_default }">
          <div class="m-bank-info">
            <div class="m-bank-left">
              <div class="m-bank-name">
                {{ getDisplayName(item) }}
                <span v-if="item.is_default" class="m-default-badge">默认</span>
              </div>
              <div class="m-bank-details">{{ getAccountDetails(item) }}</div>
            </div>
            <div class="m-bank-actions">
              <!-- 设为默认按钮 - 始终显示，方便用户切换 -->
              <div
                class="m-btn-default"
                @click="setDefaultHandler(item)"
                :class="{
                  'loading': setDefaultLoading === item.id,
                  'is-current-default': item.is_default === 1 || item.is_default === '1'
                }"
              >
                {{ (item.is_default === 1 || item.is_default === '1') ? '当前默认' : '设为默认' }}
              </div>
              <div class="m-btn-edit" @click="editCardHandler(item)">
                {{ $t('mine.edit') }}
              </div>
            </div>
          </div>
          <div class="m-bank-card">{{ getFullAccountNumber(item) }}</div>
          <div class="m-bank-extra-info">
            <span class="m-account-holder">持卡人：{{ item.account_name }}</span>
            <span class="m-account-date">{{ formatDate(item.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- 无数据提示 -->
      <div class="m-empty-state" v-else>
        <div class="m-empty-icon">🏦</div>
        <div class="m-empty-text">暂无收款账户</div>
        <div class="m-empty-desc">请添加银行卡、汇旺或USDT账户</div>
      </div>

      <van-button
        type="primary"
        size="large"
        round
        class="m-btn-add"
        @click.stop="addBindHandler"
        >{{ $t('mine.addBind') }}</van-button
      >
    </div>

    <van-popup
      v-model:show="showBottom"
      position="bottom"
      :style="{ height: '70%' }"
      class="m-card-pop"
      @close="onPopupClose"
    >
      <van-tabs v-model:active="active" @click-tab="onClickTab">
        <!-- 银行卡 -->
        <van-tab title="银行卡">
          <div class="m-tab-contain">
            <van-cell-group inset style="margin-left: 0px; margin-right: 0">
              <van-field
                v-model="frm.bank_name"
                type="text"
                label="开户银行"
                input-align="right"
                required
                placeholder="请输入开户银行名称"
              />
              <van-field
                v-model="frm.account_name"
                type="text"
                label="开户人姓名"
                input-align="right"
                required
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
              <van-field
                v-model="frm.account_number"
                type="digit"
                input-align="right"
                label="银行账号"
                required
                placeholder="请输入开户银行账号"
              />
              <van-field
                v-model="frm.bank_branch"
                type="text"
                input-align="right"
                label="开户网点"
                required
                placeholder="请输入开户网点"
              />
              <van-field
                v-model="frm.id_number"
                type="text"
                input-align="right"
                label="身份证号"
                placeholder="请输入身份证号(可选)"
              />
              <van-field
                v-model="frm.phone_number"
                type="tel"
                input-align="right"
                label="手机号码"
                placeholder="请输入手机号码(可选)"
              />
              <!-- 添加设为默认选项 -->
              <van-cell title="设为默认账户" center>
                <template #right-icon>
                  <van-checkbox v-model="frm.is_default" />
                </template>
              </van-cell>
            </van-cell-group>

            <div class="m-btns">
              <van-button
                type="primary"
                size="small"
                class="m-btn"
                round
                block
                :loading="submitLoading"
                @click="submitBankHandler"
                >{{ isEditMode ? '更新' : '提交' }}</van-button
              >
            </div>
          </div>
        </van-tab>

        <!-- 汇旺 -->
        <van-tab title="汇旺">
          <div class="m-tab-contain">
            <van-cell-group inset style="margin-left: 0px; margin-right: 0">
              <van-field
                v-model="frm.account_name"
                type="text"
                label="开户人姓名"
                input-align="right"
                required
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
              <van-field
                v-model="frm.account_number"
                type="text"
                input-align="right"
                label="汇旺账号"
                required
                placeholder="请输入汇旺账号"
              />
              <van-field
                v-model="frm.phone_number"
                type="tel"
                input-align="right"
                label="手机号码"
                required
                placeholder="请输入手机号码"
              />
              <!-- 添加设为默认选项 -->
              <van-cell title="设为默认账户" center>
                <template #right-icon>
                  <van-checkbox v-model="frm.is_default" />
                </template>
              </van-cell>
            </van-cell-group>

            <div class="m-btns">
              <van-button
                type="primary"
                size="small"
                class="m-btn"
                round
                block
                :loading="submitLoading"
                @click="submitHuiwangHandler"
                >{{ isEditMode ? '更新' : '提交' }}</van-button
              >
            </div>
          </div>
        </van-tab>

        <!-- USDT -->
        <van-tab title="USDT">
          <div class="m-tab-contain">
            <van-cell-group inset style="margin-left: 0px; margin-right: 0">
              <van-field label="网络类型" :required="true" input-align="right">
                <template #input>
                  <van-dropdown-menu>
                    <van-dropdown-item
                      v-model="frm.network_type"
                      :options="networkTypes"
                    />
                  </van-dropdown-menu>
                </template>
              </van-field>
              <van-field
                v-model="frm.account_name"
                type="text"
                label="开户人姓名"
                input-align="right"
                required
                :readonly="isEditMode && frm.account_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
              <van-field
                v-model="frm.wallet_address"
                type="text"
                label="钱包地址"
                :required="true"
                input-align="right"
                placeholder="请输入USDT钱包地址"
              />
              <!-- 添加设为默认选项 -->
              <van-cell title="设为默认账户" center>
                <template #right-icon>
                  <van-checkbox v-model="frm.is_default" />
                </template>
              </van-cell>
            </van-cell-group>

            <div class="m-btns">
              <van-button
                type="primary"
                size="small"
                class="m-btn"
                round
                block
                :loading="submitLoading"
                @click="submitUsdtHandler"
                >{{ isEditMode ? '更新' : '提交' }}</van-button
              >
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import api from '@/api'
import { showToast, showConfirmDialog, type DropdownItemOption } from 'vant'

defineOptions({ name: 'BankCardManage' })

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
  // 后端返回的脱敏字段
  account_number_masked?: string
  phone_number_masked?: string
  wallet_address_masked?: string
}

const router = useRouter()
const store = useAppStore()

// 响应式数据
const list = ref<UserAccount[]>([])  // 确保初始化为空数组
const showBottom = ref(false)
const active = ref(0)
const editId = ref(0)
const submitLoading = ref(false)
const setDefaultLoading = ref(0) // 记录正在设置默认的账户ID

// 是否为编辑模式
const isEditMode = computed(() => editId.value > 0)

// 网络类型选项
const networkTypes: DropdownItemOption[] = [
  { text: 'TRC20', value: 'TRC20' },
  { text: 'ERC20', value: 'ERC20' }
]

// 表单数据 - 确保所有字段都有默认值
const frm = ref({
  account_type: 'bank' as 'bank' | 'huiwang' | 'usdt',
  account_name: '',
  bank_name: '',  // 银行名称改为手动输入
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
  active.value = 0
}

// 设为默认处理函数
async function setDefaultHandler(item: UserAccount) {
  // 如果点击的是当前默认账户，则提示用户
  if (item.is_default === 1 || item.is_default === '1') {
    showToast('该账户已经是默认账户')
    return
  }

  try {
    // 显示确认对话框
    await showConfirmDialog({
      title: '设为默认账户',
      message: `确定要将 ${getDisplayName(item)} 设为默认账户吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    // 设置加载状态
    setDefaultLoading.value = item.id

    // 调用API设置默认账户
    const resp = await api.setDefaultAccount({ account_id: item.id })
    console.log('设置默认账户响应:', resp)

    if (resp && resp.code === 200) {
      showToast('设置成功')
      // 重新加载账户列表
      await loadAccountList()
    } else {
      throw new Error(resp.message || '设置失败')
    }
  } catch (err) {
    // 用户取消操作时不显示错误
    if (err !== 'cancel') {
      console.error('设置默认账户错误:', err)
      const msg = (err as Error).message
      showToast(msg || '设置失败，请重试')
    }
  } finally {
    // 清除加载状态
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

// 获取完整账号信息（显示真实账号，便于用户识别）
function getFullAccountNumber(item: UserAccount): string {
  switch (item.account_type) {
    case 'bank':
      // 银行卡显示脱敏卡号，但保留更多可识别信息
      return item.account_number_masked || maskBankCardForDisplay(item.account_number || '')
    case 'huiwang':
      // 汇旺显示账号
      return `账号：${item.account_number_masked || maskAccount(item.account_number || '')}`
    case 'usdt':
      // USDT显示钱包地址
      return `地址：${item.wallet_address_masked || maskWalletAddressForDisplay(item.wallet_address || '')}`
    default:
      return item.account_number || ''
  }
}

// 银行卡号脱敏（显示更多信息便于识别）
function maskBankCardForDisplay(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo
  // 显示前6位和后4位，中间用*号
  return cardNo.slice(0, 6) + '*'.repeat(Math.max(cardNo.length - 10, 4)) + cardNo.slice(-4)
}

// 钱包地址脱敏（显示更多信息便于识别）
function maskWalletAddressForDisplay(address: string): string {
  if (!address || address.length < 12) return address
  // 显示前8位和后8位
  return address.slice(0, 8) + '...' + address.slice(-8)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function getDisplayNumber(item: UserAccount): string {
  switch (item.account_type) {
    case 'bank':
      return maskBankCard(item.account_number || '')
    case 'huiwang':
      return maskAccount(item.account_number || '')
    case 'usdt':
      return maskWalletAddress(item.wallet_address || '')
    default:
      return item.account_number || ''
  }
}

// 银行卡号脱敏
function maskBankCard(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo
  return cardNo.slice(0, 4) + '*'.repeat(cardNo.length - 8) + cardNo.slice(-4)
}

// 账号脱敏
function maskAccount(account: string): string {
  if (!account || account.length < 6) return account
  return account.slice(0, 3) + '*'.repeat(account.length - 6) + account.slice(-3)
}

// 钱包地址脱敏
function maskWalletAddress(address: string): string {
  if (!address || address.length < 10) return address
  return address.slice(0, 6) + '...' + address.slice(-6)
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

// 点击 tab事件
function onClickTab({ name }: { name: number }) {
  switch (name) {
    case 0: // 银行卡
      frm.value.account_type = 'bank'
      break
    case 1: // 汇旺
      frm.value.account_type = 'huiwang'
      break
    case 2: // USDT
      frm.value.account_type = 'usdt'
      frm.value.network_type = 'TRC20'
      break
  }
}

// 修改按钮事件
async function editCardHandler(item: UserAccount) {
  console.log('编辑账户:', item)
  editId.value = item.id

  // 填充表单数据
  frm.value.account_name = item.account_name || store.getUser()?.realname || ''
  frm.value.is_default = !!item.is_default // 编辑时显示当前默认状态

  switch (item.account_type) {
    case 'bank':
      active.value = 0
      frm.value.account_type = 'bank'
      frm.value.bank_name = item.remark_name || ''
      frm.value.account_number = item.account_number || ''
      frm.value.bank_branch = item.bank_branch || ''
      frm.value.phone_number = item.phone_number || ''
      frm.value.id_number = item.id_number || ''
      break
    case 'huiwang':
      active.value = 1
      frm.value.account_type = 'huiwang'
      frm.value.account_number = item.account_number || ''
      frm.value.phone_number = item.phone_number || ''
      break
    case 'usdt':
      active.value = 2
      frm.value.account_type = 'usdt'
      frm.value.wallet_address = item.wallet_address || ''
      frm.value.network_type = item.network_type || 'TRC20'
      break
  }

  showBottom.value = true
}

// 提交银行卡信息
async function submitBankHandler() {
  if (frm.value.bank_name.trim().length <= 0) {
    showToast('请输入开户银行名称')
    return
  }
  if (frm.value.account_name.trim().length <= 0) {
    showToast('请填写开户人姓名')
    return
  }
  if (frm.value.account_number.trim().length <= 0) {
    showToast('请填写银行账号')
    return
  }
  if (frm.value.bank_branch.trim().length <= 0) {
    showToast('请填写开户网点')
    return
  }

  const data = {
    account_type: 'bank',
    account_name: frm.value.account_name,
    remark_name: frm.value.bank_name,  // 银行名称作为备注名称
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
    showToast('请填写开户人姓名')
    return
  }
  if (frm.value.account_number.trim().length <= 0) {
    showToast('请填写汇旺账号')
    return
  }
  if (frm.value.phone_number.trim().length <= 0) {
    showToast('请填写手机号码')
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
    showToast('请选择网络类型')
    return
  }
  if (frm.value.account_name.trim().length <= 0) {
    showToast('请填写开户人姓名')
    return
  }
  if (frm.value.wallet_address.trim().length <= 0) {
    showToast('请填写钱包地址')
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
    const resp = await api.addAccount(data)
    console.log('添加账户响应:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      showToast('添加成功')
      await loadAccountList()
      resetForm()
    } else {
      throw new Error(resp.message || '添加失败')
    }
  } catch (err) {
    console.error('添加账户错误:', err)
    const msg = (err as Error).message
    showToast(msg || '添加失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 调用编辑账户API
async function editAccount(id: number, data: object) {
  submitLoading.value = true
  try {
    // 方案2：请求体中包含ID
    const editData = {
      id: id,
      ...data
    }
    const resp = await api.editAccount(editData) // 不在URL中传ID
    console.log('编辑账户响应:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      showToast('修改成功')
      await loadAccountList()
      resetForm()
    } else {
      throw new Error(resp.message || '修改失败')
    }
  } catch (err) {
    console.error('编辑账户错误:', err)
    const msg = (err as Error).message
    showToast(msg || '修改失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 获取用户账户列表
async function loadAccountList() {
  try {
    const resp = await api.accountList()
    console.log('账户列表响应:', resp)
    if (resp && resp.code === 200) {
      // 确保正确获取 list 数据，如果没有数据则设置为空数组
      list.value = resp.data?.list || []
    } else {
      console.warn('获取账户列表失败:', resp?.message)
      list.value = []
    }
  } catch (err) {
    console.error('获取账户列表错误:', err)
    list.value = []  // 出错时也要清空数据，避免显示旧数据
    showToast('获取账户列表失败')
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
.m-card {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-card-contain {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .m-bank-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      color: #fff;

      .m-bank-item {
        height: 160px;  // 增加高度以容纳更多信息
        background: url('../../../assets/mobile/bank_bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .m-bank-info {
          padding-left: 60px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;

          .m-bank-left {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .m-bank-name {
              font-size: 18px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;

              .m-default-badge {
                background: #ff6b35;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 8px;
                font-weight: normal;
              }
            }

            .m-bank-details {
              font-size: 14px;
              opacity: 0.9;
            }
          }

          .m-bank-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: flex-end;

            .m-btn-default {
              border: 1px solid #ff6b35;
              background: rgba(255, 107, 53, 0.1);
              font-size: 11px;
              padding: 3px 8px;
              border-radius: 3px;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;

              &:hover {
                background: rgba(255, 107, 53, 0.2);
              }

              &.loading {
                opacity: 0.6;
                pointer-events: none;
              }

              // 当前默认账户的样式
              &.is-current-default {
                background: rgba(255, 107, 53, 0.8);
                color: white;
                border-color: #ff6b35;

                &:hover {
                  background: rgba(255, 107, 53, 0.9);
                }
              }
            }

            .m-btn-edit {
              border: 1px solid #fff;
              font-size: 12px;
              padding: 3px 5px;
              border-radius: 3px;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;

              &:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }
            }
          }
        }

        .m-bank-card {
          padding-left: 52px;
          font-size: 18px;  // 减小字体，因为要显示更多信息
          font-weight: 600;
          word-break: break-all;  // 允许长地址换行
          line-height: 1.3;
        }

        .m-bank-extra-info {
          padding-left: 52px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          opacity: 0.8;
          margin-top: auto;

          .m-account-holder {
            font-size: 13px;
          }

          .m-account-date {
            font-size: 11px;
            opacity: 0.7;
          }
        }

        // 默认账户样式
        &.is-default {
          border: 2px solid #ff6b35;
          box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
        }
      }
    }

    // 空状态样式
    .m-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;

      .m-empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .m-empty-text {
        font-size: 16px;
        color: #666;
        margin-bottom: 8px;
      }

      .m-empty-desc {
        font-size: 14px;
        color: #999;
      }
    }

    .m-btn-add {
      margin: 60px 0px 20px 0px;
    }
  }

  .m-card-pop {
    .m-tab-contain {
      padding: 10px 0px;
      background-color: var(--color-m-background);
      min-height: 400px;

      .m-btns {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: var(--color-m-background);
        padding: 10px 20px;

        .m-btn {
          padding-left: 20px;
          padding-right: 20px;
          min-width: 100px;
        }
      }
    }
  }
}
</style>

<style lang="less">
@import url('@/views/mobile/common.less');
.m-card-pop {
  .van-tabs__nav {
    padding-bottom: 0px;
  }
  .van-tabs__line {
    bottom: 3px;
  }
  .van-dropdown-menu__bar {
    padding-right: 10px;
    height: 20px;
  }
}
</style>
