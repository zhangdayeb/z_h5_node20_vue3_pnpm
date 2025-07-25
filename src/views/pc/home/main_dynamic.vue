<template>
  <div class="np-main">
    <swiper-container
      class="p-swiper"
      :loop="true"
      :navigation="true"
      speed="500"
      :autoplay="true"
    >
      <swiper-slide
        class="p-swiper-slide"
        v-for="(item, idx) in banners"
        :key="idx"
      >
        <el-image
          :src="getImgUrl(item.url)"
          fit="contain"
          class="p-banner-img"
        ></el-image>
      </swiper-slide>
    </swiper-container>
    <div class="p-notices">
      <div class="p-notices-content">
        <el-image
          fit="contain"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkI3QTBFRTMwOTk3MTFFQjk2RUY5RTMxRkZBNDBGN0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkI3QTBFRTQwOTk3MTFFQjk2RUY5RTMxRkZBNDBGN0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowQ0FGNUQ0MDA5MjQxMUVCOTZFRjlFMzFGRkE0MEY3QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QjdBMEVFMjA5OTcxMUVCOTZFRjlFMzFGRkE0MEY3QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuZs/a8AAAHtSURBVHjaYvz//z/DQAImhgEGw84BMUBcAcQyROsApQEKsQQSe+Z/CPgDxMuBWIGQfkpDYBEQdyPx/0BpZiCOAOI7QFxOqxAogvp2EpKYExAf+I8JluIyh1zLs5AMr8Ei7wXEF9AcsZxaDshFM7gBj9o1aGrrKXVAEZbgbSCgZyqaejVyHZD3HztAdoAFEMtj0XsRSf02chxQ8B83QHYAKJ5/AbEcmn5FND0GuLLhcSB+AMT3kPB9IO4nMlteA2JWID4JxNxI4iAzNiLxY3GVhCZALA/EikhYgYRygRlKSwDxJDS5eUhsB1wOeEnFYjkRiPmQ+BeQ2DL0qIwYgdgGzXPvoGweetWGYkjsn0D8HMr+Ry8HfEJLHyLo9tLaAcfQQkMcyv6OywGcVLR8OxC/QOJrYUvs6A6gtIH4G4mdjSYXiVbegAELmiJzIGYD4r9IDgKl5nwgziLCATpQ2gVa+DAgpfo4JP5SctoDfUQUxRFA7I9F7zYk9acpqQ0nkFEblqGpN6S0PTCZBAc0oamdTq0W0SQkQ+uwyINqv7Volu+nZpMMuQXchiSmA8SzoVUyMjgOxCzUdgAIH4X6FFvIwMB8fGawUJjv7YHYAEt1DAKnoZ2UfXhrLCp3TlOhNeBMtGKYbg4Yep1TgAADAF9eeYBSJ5ZyAAAAAElFTkSuQmCC"
          class="p-notices-icon"
        ></el-image>
        <div class="p-right">
          <div class="p-list">
            <a href="javascript:;" v-for="(it, idx) in notices" :key="idx"
              ><p v-html="it.content"></p
            ></a>
          </div>
        </div>
      </div>
    </div>
    <div class="p-main-bd">
      <div class="p-main-bd-wrapper">
        <div class="p-main-top">
          <div class="p-item">
            <div class="p-title">新会员优惠</div>
            <div class="p-desc">更多优惠尽在VIP</div>
            <div class="p-btn">查看详情</div>
            <el-image :src="topImg1" fit="contain" class="p-top-img" />
          </div>
          <div class="p-item">
            <div class="p-title">电子游戏专属优惠</div>
            <div class="p-desc">电子游艺专属存款送25%优惠</div>
            <div class="p-btn">查看详情</div>
            <el-image :src="topImg2" fit="contain" class="p-top-img" />
          </div>
          <div class="p-item">
            <div class="p-title">真人视讯专属优惠</div>
            <div class="p-desc">会员首笔存款得30％的奖金</div>
            <div class="p-btn">查看详情</div>
            <el-image :src="topImg3" fit="contain" class="p-top-img" />
          </div>
        </div>
        <div class="p-aq-title">安全畅快 实时投注</div>
        <div class="p-jzlc">
          <div class="p-flow" style="transform: translate(0px, 0px)">
            <el-image
              :src="intqdImg"
              fit="contain"
              class="p-brand-img"
            ></el-image>
          </div>
          <div class="p-jie_shao">
            <h3>纵想指尖畅快体验</h3>
            <p>
              全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、捕鱼游戏，真人娱乐、彩票投注及电子游艺等，
              最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！
            </p>
            <div class="p-qrcode"></div>
            <div class="p-info">
              (提示：用手机自带浏览器扫码或者使用手机自带的照相机扫描二维码下载）
            </div>
            <div class="p-info2">
              <el-image
                fit="contain"
                style="width: 20px"
                src="data:image/png;base64,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"
              ></el-image>
              <span>手机浏览器也能直接访问</span>
              <a href="" target="_blank">https://ssss</a>
            </div>
          </div>
        </div>
        <div class="p-brwx">
          <div class="p-bt">包容万象 从容选择</div>
        </div>
        <div class="p-yzwd animation-show"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { invokeApi, getImgUrl } from '@/utils/tools'
import { register } from 'swiper/element/bundle'
import type { ApiBanner, ApiNotice } from 'typings/api'
import { onMounted, ref } from 'vue'

defineOptions({ name: 'WebHomeMian' })
import topImg1 from '@/assets/web/image_1.png'
import topImg2 from '@/assets/web/image_2.png'
import topImg3 from '@/assets/web/image_3.png'
import intqdImg from '@/assets/web/intqd_brand.png'

const store = useAppStore()
const banners = ref<ApiBanner[]>([])
const notices = ref<ApiNotice[]>([])
register()

//banner
async function getBanners() {
  const resp = await invokeApi('banners', { group: 'new1' }, '', false)
  if (resp) {
    const data = resp.data as ApiBanner[]
    if (data.length === 1) {
      banners.value = [...data, ...data]
    } else {
      banners.value = data
    }
  }
}
// notice
async function getNotices() {
  const resp = await invokeApi('notices', {}, '', false)
  if (resp) {
    const data = resp.data as ApiNotice[]
    notices.value = data
  }
}
onMounted(async () => {
  store.loading()
  await getBanners()
  await getNotices()
  store.stopLoad()
})
</script>

<style lang="less" scoped>
.np-main {
  flex: 1;
  // max-width: var(--web-max-width);
  min-width: var(--web-min-width);
  width: 100%;
  margin: 0 auto;
  background: #eff5fb;

  .p-swiper {
    width: 100%;
    height: auto;

    &-slide {
      display: flex;
      justify-content: center;
      align-items: center;

      .p-banner-img {
        width: 100%;
        min-height: 200px;
      }
    }
  }
  .p-notices {
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    background: #87b7f4;
    backdrop-filter: blur(8px);
    background-color: rgba(54, 66, 76, 0.46);

    &-content {
      width: calc(1350px / var(--Cardinality));
      max-width: var(--web-max-width);
      height: 100%;
      overflow: hidden;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .p-notices-icon {
        height: 18px;
        width: 18px;
        margin: 0 10px 0 20px;
        position: relative;
        font-size: 22px;
        color: #fff;
      }
      .p-right {
        height: 100%;
        width: calc(1300px / var(--Cardinality));
        max-width: var(--web-max-width);
        overflow: hidden;
        position: relative;

        .p-list {
          position: absolute;
          top: 0;
          left: 0;
          min-width: 100%;
          height: auto;
          white-space: nowrap;
          font-size: 14px;

          cursor: pointer;
          animation: scrollUp 8s linear infinite;

          p {
            color: #fff;
          }
        }
      }
    }
  }

  .p-main-bd {
    min-height: 940px;
    background: url('@/assets/web/home-bg.png') no-repeat;
    background-size: 100% 100%;
    overflow-x: hidden;

    &-wrapper {
      margin: 0 auto;

      .p-main-top {
        padding-top: 60px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;

        .p-item {
          background-image: url('@/assets/web/ss.png');
          -webkit-transition: all 0.15s linear;
          transition: all 0.15s linear;
          -webkit-transform: translateZ(0) scale(1);
          transform: translateZ(0) scale(1);
          width: calc(480px / var(--Cardinality));
          height: calc(228px / var(--Cardinality));
          background-size: 100%;
          margin: 0 -21px -16px 0;
          position: relative;
          cursor: pointer;

          .p-title {
            position: absolute;
            left: calc(50px / var(--Cardinality));
            color: #4c5d6f;
            -o-object-fit: contain;
            object-fit: contain;
            text-shadow:
              1px 1px 0 rgba(134, 161, 197, 0.4),
              -1px -1px 0 #fff;
            width: calc(200px / var(--Cardinality));
            top: calc(51px / var(--Cardinality));
            font-size: calc(18px / var(--Cardinality));
            font-weight: 600;
          }
          .p-desc {
            position: absolute;
            left: calc(50px / var(--Cardinality));
            color: #4c5d6f;
            -o-object-fit: contain;
            object-fit: contain;
            text-shadow:
              1px 1px 0 rgba(134, 161, 197, 0.4),
              -1px -1px 0 #fff;
            width: calc(215px / var(--Cardinality));
            top: calc(90px / var(--Cardinality));
            font-size: calc(16px / var(--Cardinality));
          }

          .p-btn {
            width: calc(100px / var(--Cardinality));
            height: calc(30px / var(--Cardinality));
            position: absolute;
            left: calc(50px / var(--Cardinality));
            top: calc(135px / var(--Cardinality));
            text-align: center;
            line-height: calc(30px / var(--Cardinality));
            font-size: calc(12px / var(--Cardinality));
            color: var(--home-btn-font);
            border: 1px solid var(--home-btn-border);
            font-weight: 700;
            border-radius: 100px;
          }
          .p-top-img {
            position: absolute;
            width: calc(190px / var(--Cardinality));
            right: calc(35px / var(--Cardinality));
            top: calc(-13px / var(--Cardinality));
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }
      }
      .p-aq-title {
        width: calc(1400px / var(--Cardinality));
        text-align: center;
        margin: 80px auto 42px;
        font-size: 40px;
        font-weight: 700;
      }
      .p-jzlc {
        width: calc(1400px / var(--Cardinality));
        margin: 0 auto;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .p-flow {
          width: calc(750px / var(--Cardinality));
          -webkit-transition: 0.35s ease;
          transition: 0.35s ease;

          .p-brand-img {
            width: calc(726px / var(--Cardinality));
            margin: 0 auto;
            display: block;
          }
        }
        .p-jie_shao {
          width: calc(530px / var(--Cardinality));
          text-align: left;
          margin-left: 50px;
        }
      }
      .p-brwx {
        width: calc(1400px / var(--Cardinality));
        min-height: calc(820px / var(--Cardinality));
        margin: 0 auto;
        position: relative;

        .p-bt {
          margin: 80px 0 42px 0;
          text-align: center;
          font-size: 40px;
          font-weight: 700;
        }
      }
      .p-yzwd {
        min-height: 830px;
      }
    }
  }
}
@keyframes scrollUp {
  0% {
    top: 100%;
  }
  100% {
    top: -200%;
  }
}
</style>
