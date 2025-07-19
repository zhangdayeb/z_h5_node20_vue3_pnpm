<template>
  <div class="m-support">
    <div class="m-header">
      <van-image
        src="/src/assets/mobile/avatar.png"
        fit="contain"
        class="m-avatar"
      ></van-image>
      <div class="m-header-right">
        <h5 class="m-title">Hi,</h5>
        <span class="m-sub-title">{{ $t('support.welcome') }}</span>
      </div>
    </div>
    <div class="m-kf">
      <van-cell :is-link="true" class="m-cell" @click="goServiceHandler">
        <template #title>
          <div class="m-col">
            <div class="m-title">{{ $t('support.mainCustom') }}</div>
            <div class="m-subtitle">{{ $t('support.agentCoustom') }}</div>
            <div class="m-label">
              <span>7*24 </span><span>{{ $t('support.serviceTop') }}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { getDomain } from '@/utils/tools'
import api from '@/api'

defineOptions({ name: 'SupportIndex' })

// 游戏配置响应类型
interface GameConfigResponse {
  configs?: {
    kefu_url?: string
    mainCustom?: string
    agentCoustom?: string
    serviceTop?: string
    [key: string]: any
  }
  raw_configs?: Array<{
    id: number
    group_prefix: string
    name: string
    value: string
    remark: string
  }>
}

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const serviceUrl = ref<string>('')

// 客服跳转处理函数
function goServiceHandler() {
  if (!serviceUrl.value || serviceUrl.value.length === 0) {
    showToast('客服链接未配置')
    return
  }

  console.log('跳转到客服:', serviceUrl.value)

  // 在新窗口中打开客服链接
  try {
    window.open(serviceUrl.value, '_blank')
  } catch (error) {
    console.error('打开客服链接失败:', error)
    showToast('打开客服失败')
  }
}

// 使用 gameConfig 接口获取客服配置
async function getServiceConfig() {
  store.loading()
  try {
    // 使用 gameConfig 接口获取配置
    const resp = await api.gameConfig()

    console.log('游戏配置响应:', resp)

    if (resp && resp.code === 200 && resp.data) {
      const configData = resp.data as GameConfigResponse

      // 方式1：从 configs 对象中获取 kefu_url
      if (configData.configs?.kefu_url) {
        serviceUrl.value = configData.configs.kefu_url
      }
      // 方式2：从 raw_configs 数组中查找 kefu_url
      else if (configData.raw_configs) {
        const kefuConfig = configData.raw_configs.find(item => item.name === 'kefu_url')
        if (kefuConfig?.value) {
          serviceUrl.value = kefuConfig.value
        }
      }

      // 如果都没找到，使用默认值（根据数据库截图中的数据）
      if (!serviceUrl.value) {
        serviceUrl.value = 'https://www.baidu.com'
        console.log('使用默认客服链接:', serviceUrl.value)
      }

      console.log('最终客服链接:', serviceUrl.value)
    } else {
      throw new Error(resp?.message || '获取配置失败')
    }
  } catch (err) {
    console.error('获取客服配置出错:', err)
    // 出错时使用默认值
    serviceUrl.value = 'https://www.baidu.com'
    console.log('配置获取失败，使用默认客服链接:', serviceUrl.value)
    showToast('配置加载失败，使用默认客服')
  } finally {
    store.stopLoad()
  }
}

// 组件挂载时获取配置
onMounted(async () => {
  await getServiceConfig()
})
</script>

<style lang="less" scoped>
.m-support {
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);

  .m-header {
    padding: 40px 34px 86px 34px;
    background-image: url('../../../assets/mobile/support_user_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;

    .m-avatar {
      width: 50px;
      height: 50px;
    }

    .m-header-right {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;

      .m-title {
        margin: 0px;
        color: #333;
        font-weight: 700;
        font-size: 16px;
        line-height: 22px;
      }

      .m-sub-title {
        color: #95a2b4;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }

  .m-kf {
    height: 150px;
    margin: -59px 16px 0px 16px;
    padding: 20px 20px 50px 20px;
    background-image: url('../../../assets/mobile/kf_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .m-cell {
      padding: 0px;
    }

    .m-col {
      display: flex;
      flex-direction: column;
      height: 80px;
      flex: 1;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: nowrap;

      .m-title {
        font-size: 20px;
        font-weight: 400;
      }

      .m-subtitle {
        font-size: 14px;
        opacity: 0.6;
      }

      .m-label {
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="less">
.m-support {
  .van-cell {
    background-color: transparent;
    color: #fff;
    align-items: center;

    .van-cell__right-icon {
      color: #fff;
      font-size: 22px;
    }
  }
}
</style>
