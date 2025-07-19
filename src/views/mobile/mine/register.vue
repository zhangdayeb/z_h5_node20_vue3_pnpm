<template>
  <div class="m-mine-register">
    <van-nav-bar
      left-arrow
      :title="$t('user.register')"
      @click-left="onClickLeft"
    />
    <div class="m-regiter-frm">
      <van-form ref="regiFrmRefs">
        <van-cell-group inset>
          <van-field
            v-model="frm.name"
            label-align="top"
            :required="true"
            :name="$t('register.username')"
            :label="$t('register.username')"
            :placeholder="$t('register.username')"
            :rules="[{ required: true, message: $t('register.inputUsername') }]"
          />
          <van-field
            v-model="frm.password"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.password')"
            :label="$t('register.password')"
            :placeholder="$t('register.password')"
            :rules="[{ required: true, message: $t('register.inputPassword') }]"
          />
          <van-field
            v-model="frm.password_confirmation"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.confirmPassword')"
            :label="$t('register.confirmPassword')"
            :placeholder="$t('register.confirmPassword')"
            :rules="[
              { required: true, message: $t('register.inputConfirmPassword') },
              { validator: validatePasswordConfirmation }
            ]"
          />
          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isRealNameRequred ??
                0) === '1'
            "
            v-model="frm.realname"
            :required="true"
            label-align="top"
            type="text"
            :name="$t('register.realName')"
            :label="$t('register.realName')"
            :placeholder="$t('register.realName')"
            :rules="[{ required: true, message: $t('register.inputRealname') }]"
          />

          <van-field
            v-model="frm.qk_pwd"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.qkPwd')"
            :label="$t('register.qkPwd')"
            :placeholder="$t('register.qkPwd')"
            :rules="[{ required: true, message: $t('register.inputQkpwd') }]"
          />

          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isPhoneRequired ??
                0) === '1'
            "
            v-model="frm.phone"
            :required="true"
            label-align="top"
            type="digit"
            :name="$t('register.phone')"
            :label="$t('register.phone')"
            :placeholder="$t('register.phone')"
            :rules="[{ required: true, message: $t('register.inputPhone') }]"
          />

          <!-- 修复后的货币选择器 -->
          <van-field
            v-model="frm.currency"
            :required="true"
            :is-link="true"
            :readonly="true"
            label-align="top"
            type="text"
            :name="$t('register.currency')"
            :label="$t('register.currency')"
            :placeholder="$t('register.inputCurrency')"
            :rules="[{ required: true, message: $t('register.inputCurrency') }]"
            @click="showPopHandler"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
              :columns="columns"
              @confirm="onConfirm"
              @cancel="cancelHandler"
              title="选择货币"
            />
          </van-popup>

          <van-field
            v-model="frm.invite_code"
            :required="false"
            label-align="top"
            type="text"
            :name="$t('register.inviteCode')"
            :label="$t('register.inviteCode')"
            :placeholder="$t('register.inputInviterCode')"
            :rules="[
              { required: false, message: $t('register.inputInviterCode') },
            ]"
          />
          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isCaptchaRequired ??
                0) === '1'
            "
            v-model="frm.captcha"
            :required="true"
            label-align="top"
            type="digit"
            :name="$t('register.captcha')"
            :label="$t('register.captcha')"
            :placeholder="$t('register.inputCaptcha')"
            :rules="[{ required: true, message: $t('register.inputCaptcha') }]"
          >
            <template #button>
              <van-image
                :src="captchaImg"
                fit="contain"
                class="m-img"
                @click.stop="refreshCaptcha"
              />
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="button"
            :loading="isSubmitting"
            @click.stop="submitRegisterHandler"
          >
            {{ $t('submit') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, type PickerConfirmEventParams } from 'vant'
import { useAppStore } from '@/stores/app'
import api from '@/api'

defineOptions({ name: 'RegisterVue' })

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const regiFrmRefs = ref()

const captchaImg = ref('')
const showPicker = ref(false)
const isSubmitting = ref(false)

// 更新货币选项 - 添加更多实用货币
const columns = ref([
  { text: '¥ CNY 【人民币】', value: 'zh_cn', code: 'CNY' },
  { text: '$ USD 【美元】', value: 'en', code: 'USD' },
  { text: 'HK$ HKD 【港币】', value: 'zh_hk', code: 'HKD' },
  { text: '€ EUR 【欧元】', value: 'en', code: 'EUR' },
  { text: '£ GBP 【英镑】', value: 'en', code: 'GBP' },
  { text: '¥ JPY 【日元】', value: 'ja', code: 'JPY' },
  { text: '₩ KRW 【韩元】', value: 'ko', code: 'KRW' },
  { text: '฿ THB 【泰铢】', value: 'th', code: 'THB' },
  { text: '₫ VND 【越南盾】', value: 'vi', code: 'VND' },
  { text: 'S$ SGD 【新加坡元】', value: 'en', code: 'SGD' },
])

const currencyIndex = ref<number>(0) // 默认选择人民币
const frm = ref({
  name: '',
  password: '',
  password_confirmation: '',
  realname: '',
  qk_pwd: '',
  phone: '',
  currency: columns.value[currencyIndex.value].text,
  captcha: '',
  key: '',
  invite_code: route.query?.invite_code ?? route.params?.invite_code ?? '',
  lang: columns.value[currencyIndex.value].value,
  register_site: '',
  sms_code: '',
})

// 密码确认验证器
function validatePasswordConfirmation(value: string) {
  if (value !== frm.value.password) {
    return '两次输入的密码不一致'
  }
  return true
}

function showPopHandler() {
  showPicker.value = true
}

function cancelHandler() {
  showPicker.value = false
}

function onConfirm({
  selectedOptions,
  selectedIndexes,
}: PickerConfirmEventParams) {
  frm.value.currency = `${selectedOptions[0]?.text}`
  currencyIndex.value = selectedIndexes[0]
  frm.value.lang = columns.value[currencyIndex.value].value
  console.log('选择货币:', frm.value.currency, currencyIndex.value)
  showPicker.value = false
}

function submitRegisterHandler() {
  regiFrmRefs.value
    ?.validate()
    .then(async () => {
      if (isSubmitting.value) return

      try {
        isSubmitting.value = true

        // 确保语言参数正确设置
        frm.value.lang = columns.value[currencyIndex.value].value

        // 修正参数名称以匹配后端API
        const registerData = {
          ...frm.value,
          invitation_code: frm.value.invite_code, // 后端期望 invitation_code
          currency: columns.value[currencyIndex.value].code, // 使用货币代码而不是显示文本
        }

        console.log('注册数据:', registerData)

        // 调用正确的API方法名称
        const resp = await api.register(registerData)

        console.log('register resp:', resp, resp?.message)

        if (resp && resp.code === 200) {
          // 如果返回了token，保存它
          if (resp.token) {
            store.setToken(resp.token)
            await store.getMeForApi()
          }

          showToast({
            message: resp.message || '注册成功',
            onClose: () => {
              router.replace({ name: 'main' })
            },
          })
        } else {
          showToast({
            message: resp?.message || '注册失败',
          })
        }
      } catch (err: any) {
        console.error('注册错误:', err)
        showToast({
          message: err?.message || err?.error?.message || '注册失败，请重试',
        })
      } finally {
        isSubmitting.value = false
      }
    })
    .catch(e => {
      console.log('表单验证失败:', e)
    })
}

// 刷新验证码
async function refreshCaptcha() {
  try {
    if (
      (store.registerConf?.register_setting_json?.isCaptchaRequired ?? 0) !==
      '1'
    ) {
      return
    }
    const resp = await api.authCaptcha()
    console.log('authCaptcha resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      captchaImg.value = resp.data?.img ?? ''
      frm.value.key = resp.data?.key
    }
  } catch (err) {
    console.log('获取验证码失败:', err)
  }
}

async function getConfig() {
  try {
    const resp = await api.sysConfig({
      group: 'register',
      url: 'm001.7484i3927.top',
      is_mobile: 1,
    })
    console.log('register config resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      const tmp = resp.data
      tmp.register_setting_json = JSON.parse(resp.data.register_setting_json)
      store.$patch({ registerConf: tmp })
    }
  } catch (err) {
    console.log('获取配置失败:', err)
  }
}

// 返回
function onClickLeft() {
  router.go(-1)
}

// 初始化
async function init() {
  store.loading()

  await getConfig()
  await refreshCaptcha()

  store.stopLoad()
}

onMounted(async () => {
  init()
})
</script>

<style scoped lang="less">
.m-mine-register {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-regiter-frm {
    margin: 16px 0px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .m-img {
      width: 100px;
      height: 25px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
</style>
