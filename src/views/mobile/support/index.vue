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
      <!-- 动态配置项列表 -->
      <div v-if="configList.length > 0" class="m-config-list">
        <van-cell
          v-for="(config, index) in configList"
          :key="index"
          :is-link="true"
          class="m-cell"
          @click="openConfigUrl(config)"
        >
          <template #title>
            <div class="m-col">
              <div class="m-title">{{ config.name }}</div>
              <div class="m-subtitle">{{ config.value }}</div>
              <div class="m-label">
                <span>点击打开</span>
              </div>
            </div>
          </template>
        </van-cell>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="m-loading">
        <van-loading type="spinner" size="24px" />
        <p class="loading-text">加载配置中...</p>
      </div>

      <!-- 无配置项 -->
      <div v-else class="m-empty">
        <van-empty description="暂无服务配置" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app'
import api from '@/api'

defineOptions({ name: 'SupportIndex' })

// 配置项类型定义
interface ConfigItem {
  name: string
  value: string
  remark?: string
}

// 游戏配置响应类型
interface GameConfigResponse {
  configs?: {
    [key: string]: string
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

// 响应式数据
const configList = ref<ConfigItem[]>([])
const loading = ref(false)

// 打开配置链接
function openConfigUrl(config: ConfigItem) {
  if (!config.value || config.value.length === 0) {
    showToast(`${config.name}链接未配置`)
    return
  }

  console.log('打开配置链接:', config.name, '->', config.value)

  try {
    // 统一使用 window.open 在新窗口打开
    window.open(config.value, '_blank')
  } catch (error) {
    console.error('打开链接失败:', error)
    showToast(`打开${config.name}失败`)
  }
}

// 获取配置数据
async function getConfigList() {
  loading.value = true

  try {
    console.log('开始获取配置数据...')
    const resp = await api.gameConfig()

    console.log('配置响应:', resp)

    if (resp && resp.code === 200 && resp.data) {
      const configData = resp.data as GameConfigResponse
      const tempList: ConfigItem[] = []

      // 方式1：从 configs 对象中获取（推荐，格式化后的数据）
      if (configData.configs) {
        Object.entries(configData.configs).forEach(([name, value]) => {
          if (value && value.trim().length > 0) {
            tempList.push({
              name: name,
              value: value.trim()
            })
          }
        })
        console.log('从 configs 获取到配置项:', tempList.length)
      }

      // 方式2：如果 configs 为空，从 raw_configs 获取
      if (tempList.length === 0 && configData.raw_configs) {
        configData.raw_configs.forEach(item => {
          if (item.value && item.value.trim().length > 0) {
            tempList.push({
              name: item.name,
              value: item.value.trim(),
              remark: item.remark
            })
          }
        })
        console.log('从 raw_configs 获取到配置项:', tempList.length)
      }

      // 更新配置列表
      configList.value = tempList

      if (tempList.length === 0) {
        console.warn('没有找到有效的配置项')
        showToast('暂无可用的服务配置')
      } else {
        console.log('配置加载成功，共', tempList.length, '项:', tempList)
      }

    } else {
      throw new Error(resp?.message || '获取配置失败')
    }
  } catch (error) {
    console.error('获取配置出错:', error)
    showToast('配置加载失败，请重试')

    // 出错时显示默认配置（可选）
    configList.value = [{
      name: '客服中心',
      value: 'https://www.baidu.com'
    }]
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取配置
onMounted(async () => {
  await getConfigList()
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
    min-height: 300px; // 设置更大的最小高度以适应多个配置项
    margin: -59px 16px 20px 16px;
    padding: 20px 20px 30px 20px;
    background-image: url('../../../assets/mobile/kf_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%; // 背景图片拉伸填满整个容器
    background-position: center;
    // 确保容器高度能包含所有内容
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    // 如果内容超出最小高度，容器会自动扩展
    height: auto;

    .m-config-list {
      display: flex;
      flex-direction: column;
      gap: 8px; // 减少间距让背景更好展示
    }

    .m-cell {
      padding: 0px;
      margin-bottom: 6px; // 减少边距

      &:last-child {
        margin-bottom: 0;
      }
    }

    .m-col {
      display: flex;
      flex-direction: column;
      min-height: 50px; // 减少高度让更多内容显示
      flex: 1;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: nowrap;
      padding: 3px 0; // 减少内边距

      .m-title {
        font-size: 16px; // 稍微减小字体
        font-weight: 500;
        margin-bottom: 2px;
      }

      .m-subtitle {
        font-size: 11px; // 减小字体
        opacity: 0.7;
        margin-bottom: 2px;
        word-break: break-all;
      }

      .m-label {
        font-size: 11px; // 减小字体
        opacity: 0.8;
      }
    }

    // 加载状态样式
    .m-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #fff;

      .loading-text {
        margin-top: 12px;
        font-size: 14px;
        opacity: 0.8;
      }
    }

    // 空状态样式
    .m-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #fff;
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

  .van-empty {
    .van-empty__description {
      color: #fff;
      opacity: 0.8;
    }
  }

  .van-loading {
    .van-loading__spinner {
      color: #fff;
    }
  }
}
</style>
