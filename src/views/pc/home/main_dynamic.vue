<template>
  <div class="np-main">
    <!-- 轮播图 -->
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

    <!-- 公告栏 -->
    <div class="p-notices">
      <div class="p-notices-content">
        <el-icon class="p-notices-icon">
          <Bell />
        </el-icon>
        <div class="p-right">
          <div class="p-list">
            <a href="javascript:;" v-for="(it, idx) in notices" :key="idx">
              <p v-html="it.content"></p>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="p-main-bd">
      <div class="p-main-bd-wrapper">
        <!-- 顶部三个优惠卡片 -->
        <div class="p-main-top">
          <div class="p-item" @click="goToGift">
            <div class="p-title">{{ $t('home.newMemberOffer') }}</div>
            <div class="p-desc">{{ $t('home.moreOffersInVip') }}</div>
            <div class="p-btn">{{ $t('common.viewDetails') }}</div>
            <el-image :src="topImg1" fit="contain" class="p-top-img" />
          </div>
          <div class="p-item" @click="goToGift">
            <div class="p-title">{{ $t('home.electronicOffer') }}</div>
            <div class="p-desc">{{ $t('home.electronicOfferDesc') }}</div>
            <div class="p-btn">{{ $t('common.viewDetails') }}</div>
            <el-image :src="topImg2" fit="contain" class="p-top-img" />
          </div>
          <div class="p-item" @click="goToGift">
            <div class="p-title">{{ $t('home.liveOffer') }}</div>
            <div class="p-desc">{{ $t('home.liveOfferDesc') }}</div>
            <div class="p-btn">{{ $t('common.viewDetails') }}</div>
            <el-image :src="topImg3" fit="contain" class="p-top-img" />
          </div>
        </div>

        <!-- 安全投注标题 -->
        <div class="p-aq-title">{{ $t('home.safeBetting') }}</div>

        <!-- APP推广区域 -->
        <div class="p-jzlc">
          <div class="p-flow">
            <el-image
              :src="intqdImg"
              fit="contain"
              class="p-brand-img"
            ></el-image>
          </div>
          <div class="p-jie_shao">
            <h3>{{ $t('home.enjoyExperience') }}</h3>
            <p>{{ $t('home.appDescription') }}</p>
            <div class="p-qrcode">
              <!-- TODO: 二维码图片 -->
            </div>
            <div class="p-info">
              {{ $t('home.scanTip') }}
            </div>
            <div class="p-info2">
              <el-icon style="font-size: 20px">
                <Cellphone />
              </el-icon>
              <span>{{ $t('home.browserAccess') }}</span>
              <a :href="store.systemConf?.mobile_url" target="_blank">
                {{ store.systemConf?.mobile_url }}
              </a>
            </div>
          </div>
        </div>

        <!-- 包容万象标题 -->
        <div class="p-brwx">
          <div class="p-bt">{{ $t('home.comprehensiveChoice') }}</div>
        </div>

        <!-- 底部动画区域 -->
        <div class="p-yzwd animation-show"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { invokeApi, getImgUrl } from '@/utils/tools'
import { register } from 'swiper/element/bundle'
import type { ApiBanner, ApiNotice } from 'typings/api'
import { onMounted, ref } from 'vue'
import { Bell, Cellphone } from '@element-plus/icons-vue'

defineOptions({ name: 'WebHomeMain' })

// 导入图片资源
import topImg1 from '@/assets/web/image_1.png'
import topImg2 from '@/assets/web/image_2.png'
import topImg3 from '@/assets/web/image_3.png'
import intqdImg from '@/assets/web/intqd_brand.png'

const store = useAppStore()
const router = useRouter()
const banners = ref<ApiBanner[]>([])
const notices = ref<ApiNotice[]>([])

// 注册Swiper
register()

// 跳转到优惠页面
function goToGift() {
  router.push('/gift')
}

// 获取轮播图
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

// 获取公告
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
        font-size: 18px;
        margin: 0 10px 0 20px;
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
        display: flex;
        justify-content: center;

        .p-item {
          background-image: url('@/assets/web/ss.png');
          transition: all 0.15s linear;
          transform: translateZ(0) scale(1);
          width: calc(480px / var(--Cardinality));
          height: calc(228px / var(--Cardinality));
          background-size: 100%;
          margin: 0 -21px -16px 0;
          position: relative;
          cursor: pointer;

          &:hover {
            transform: translateZ(0) scale(1.05);
          }

          .p-title {
            position: absolute;
            left: calc(50px / var(--Cardinality));
            color: #4c5d6f;
            text-shadow: 1px 1px 0 rgba(134, 161, 197, 0.4), -1px -1px 0 #fff;
            width: calc(200px / var(--Cardinality));
            top: calc(51px / var(--Cardinality));
            font-size: calc(18px / var(--Cardinality));
            font-weight: 600;
          }

          .p-desc {
            position: absolute;
            left: calc(50px / var(--Cardinality));
            color: #4c5d6f;
            text-shadow: 1px 1px 0 rgba(134, 161, 197, 0.4), -1px -1px 0 #fff;
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
        display: flex;
        align-items: center;

        .p-flow {
          width: calc(750px / var(--Cardinality));
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

          h3 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
          }

          p {
            font-size: 14px;
            line-height: 1.8;
            color: #666;
            margin-bottom: 20px;
          }

          .p-qrcode {
            width: 120px;
            height: 120px;
            background: #f5f5f5;
            margin: 20px 0;
            border: 1px solid #ddd;
          }

          .p-info {
            font-size: 12px;
            color: #999;
            margin: 10px 0;
          }

          .p-info2 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;

            span {
              font-size: 14px;
              color: #666;
            }

            a {
              color: #409eff;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
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
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
