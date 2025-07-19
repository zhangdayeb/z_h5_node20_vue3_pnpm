<template>
  <div class="m-notices">
    <van-nav-bar
      left-arrow
      :title="$t('mine.myNotices')"
      @click-left="onClickLeft"
      class="m-nav"
    />

    <van-tabs v-model:active="active">
      <van-tab :title="$t('unread')">
        <van-empty
          :description="$t('noRecord')"
          v-if="unread.data.length <= 0"
        />
        <van-list
          :immediate-check="false"
          v-else
          v-model:loading="unread.loading"
          :finished="unread.finished"
          :finished-text="$t('noMore')"
          @load="unreadOnLoad"
        >
          <van-cell
            v-for="(item, idx) in unread.data"
            :key="idx"
            is-link
            :title="item.title"
            :value="$t('unread')"
            :label="item.created_at"
            value-class="m-green m-f12"
          />
        </van-list>
      </van-tab>
      <van-tab :title="$t('readed')">
        <van-empty :description="$t('noRecord')" v-if="read.data.length <= 0" />
        <van-list
          :immediate-check="false"
          v-else
          v-model:loading="unread.loading"
          :finished="unread.finished"
          :finished-text="$t('noMore')"
          @load="unreadOnLoad"
        >
          <van-cell
            v-for="(item, idx) in read.data"
            :key="idx"
            is-link
            :title="item.title"
            :value="$t('readed')"
            :label="item.created_at"
            value-class="m-c-red m-f12"
          />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { invokeApi } from '@/utils/tools'
import type { ApiRead } from 'typings'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'myNotices' })

interface ListData {
  data: ApiRead[]
  loading: boolean
  finished: boolean
  total: number
  page: number
}
const router = useRouter()
const active = ref(0)
const read = ref<ListData>({
  data: [],
  loading: false,
  finished: false,
  total: 0,
  page: 0,
})
const unread = ref<ListData>({
  data: [],
  loading: false,
  finished: false,
  total: 0,
  page: 0,
})

async function unreadOnLoad() {
  await getMessage(unread.value.page + 1)
}

function onClickLeft() {
  router.back()
}

async function getMessage(p: number) {
  await invokeApi('message', { page: p })
  const resp = {
    status: 'success',
    code: 200,
    message: '',
    data: {
      current_page: 1,
      data: [
        {
          id: 6,
          title: '晋级礼金发放通知',
          url: '',
          content:
            '恭喜您升级到【 VIP1】，升级奖励为金额【1.00 元】，信用额度奖励【50.00 元】',
          created_at: '2024-11-02 05:08:25',
          is_read: 1,
          pid: 0,
          user_id: 1,
          deleted_at: null,
          format_created_at: '1天前',
          parent: null,
        },
        {
          id: 7,
          title: '每日礼金发放通知',
          url: '',
          content: '恭喜您领取【 1 级】每日礼金【 0.50 元】',
          created_at: '2024-11-02 05:08:25',
          is_read: 0,
          pid: 0,
          user_id: 1,
          deleted_at: null,
          format_created_at: '1天前',
          parent: null,
        },
        {
          id: 8,
          title: '每周礼金发放通知',
          url: '',
          content: '恭喜您领取【 1 级】每周礼金【 1.50 元】',
          created_at: '2024-11-02 05:08:25',
          is_read: 0,
          pid: 0,
          user_id: 1,
          deleted_at: null,
          format_created_at: '1天前',
          parent: null,
        },
        {
          id: 9,
          title: '每月礼金发放通知',
          url: '',
          content: '恭喜您领取【 1 级】每月礼金【 8.00 元】',
          created_at: '2024-11-02 05:08:25',
          is_read: 0,
          pid: 0,
          user_id: 1,
          deleted_at: null,
          format_created_at: '1天前',
          parent: null,
        },
        {
          id: 10,
          title: '每年礼金发放通知',
          url: '',
          content: '恭喜您领取【 1 级】每年礼金【 88.00 元】',
          created_at: '2024-11-02 05:08:25',
          is_read: 0,
          pid: 0,
          user_id: 1,
          deleted_at: null,
          format_created_at: '1天前',
          parent: null,
        },
      ],
    },
    unread: 4,
    notice: 0,
  }
  //const resp = await invokeApi('message')
  if (resp) {
    const data = resp.data.data as ApiRead[]

    data.forEach(it => {
      if (it.is_read === 0) {
        unread.value.data.push(it)
      }
      if (it.is_read === 1) {
        read.value.data.push(it)
      }
    })
    unread.value.finished = read.value.finished = true
    console.log('unread', unread.value, read.value)
  }
}
onMounted(async () => {
  unread.value.data = []
  unread.value.page = 0
  await unreadOnLoad()
})
</script>

<style lang="less" scoped>
.m-notices {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-notices {
  .van-tabs__nav--line {
    padding-bottom: 0px;
  }
  .van-tabs__line {
    bottom: 0px;
  }
  .van-cell {
    align-items: center;
  }
  .m-green {
    color: green;
  }
  .m-f12 {
    font-size: 12px;
  }
}
</style>
