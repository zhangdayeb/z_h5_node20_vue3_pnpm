<template>
  <div class="m-toGame-par">
    <van-nav-bar
      left-arrow
      :title="$t('mine.toGame')"
      @click-left="onClickLeft"
    />
    <div class="m-toGame">
      <div class="m-loading" v-if="loading">
        <van-loading size="24" color="#fff">{{ $t('loading') }}</van-loading>
      </div>
      <div class="m-game-info" v-else>
        <div class="m-title">{{ $t('enterGame') }}</div>
        <div class="m-content">
          <van-button
            size="large"
            color="#8b0000"
            class="m-enter-btn"
            @click="enterGame"
            :loading="entering"
            >{{ $t('enterGame') }}</van-button
          >
        </div>
      </div>
    </div>
    <a ref="gameLink" href="" target="_self" style="display: none"></a>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { invokeApi, mobileFunc } from '@/utils/tools'
import { showDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
const lobbyUrl = window.location.origin;
defineOptions({ name: 'ToGame' })
const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const gameLink = ref<HTMLAnchorElement>()
const loading = ref(false)
const entering = ref(false)


//返回
function onClickLeft() {
  router.back()
}

async function enterGame() {
  entering.value = true

  try {


    const resp = await invokeApi('gameUrl', {
      gameCode: route.params.game,
      api_code: route.params.code,
      ismobile: route.params.mobile,
      lobby:lobbyUrl
    })

    if (resp && resp.code === 200) {
      const gameUrl = resp?.data?.game_url?.toString() ?? ''
      console.log("=======================game_url======================")
      console.log(gameUrl)

      if (gameUrl) {
        const h = mobileFunc()
        if (h === false && window.parent) {
          // PC端：在父窗口中跳转
          window.parent.location.href = gameUrl
        } else {
          // 移动端：直接跳转
          window.location.href = gameUrl
        }
      } else {
        showDialog({ message: '获取游戏链接失败' })
      }
    } else {
      showDialog({ message: resp?.message || '游戏启动失败' })
    }
  } catch (error) {
    console.error('游戏启动异常:', error)
    showDialog({ message: '游戏启动失败，请稍后重试' })
  } finally {
    entering.value = false
  }
}

onMounted(async () => {
  loading.value = true
  // 简单的页面初始化，不再需要获取余额等复杂逻辑
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style lang="less" scoped>
.m-toGame-par {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-toGame {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);

    .m-loading {
      color: #fff;
      text-align: center;
    }

    .m-game-info {
      margin: 0px 16px;
      width: calc(100% - 32px);
      max-width: 400px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;

      .m-title {
        background-color: #333;
        color: #fff;
        height: 42px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-weight: 500;
      }

      .m-content {
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .m-enter-btn {
          width: 200px;
          height: 44px;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
