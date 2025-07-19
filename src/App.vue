<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isMobile as mobileFunc } from '@/utils/tools'
import type { ConfigProviderTheme } from 'vant'

const isMobile = ref(false)
const theme = ref<ConfigProviderTheme>('light')

const isMobileFunc = () => {
  isMobile.value = mobileFunc()
  // console.log('-----------------', isMobile.value)
}

isMobileFunc()

window.addEventListener('resize', isMobileFunc)
onMounted(() => {
  // console.log('----------', isMobile.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', isMobileFunc)
})

watch(
  () => isMobile.value,
  (n, o) => {
    console.log('>>', n, o)
    window.location.reload()
  },
)
</script>

<template>
  <van-config-provider :theme="theme" style="height: 100%">
    <RouterView v-if="isMobile" />
    <RouterView v-else />
  </van-config-provider>
</template>

<style></style>
