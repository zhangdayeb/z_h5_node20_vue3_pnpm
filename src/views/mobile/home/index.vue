<template>
  <RouterView />
  <TabBar />
  <loginPop :isShow="store.loginShow" />
</template>

<script setup lang="ts">
defineOptions({ name: 'HomeIndex' })
import { onMounted } from 'vue'
import TabBar from './components/tab_bar.vue'
import loginPop from '@/components/loginPop.vue'
import { useAppStore } from '@/stores/app'
import api from '@/api'
import { getDomain } from '@/utils/tools'

const store = useAppStore()

async function systemConfig() {
  if (store.systemConf) {
    return
  }
  try {
    const resp = await api.sysConfig({
      group: 'system',
      url: getDomain(),
      is_mobile: 1,
    })
    if (resp && resp.code === 200 && resp.data) {
      store.$patch({ systemConf: resp.data })
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await systemConfig()
})
</script>

<style lang="less" scoped>
.m-index {
  width: 375px;
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
</style>
