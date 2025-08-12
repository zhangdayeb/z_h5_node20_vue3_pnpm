<template>
  <footer class="p-footer">
    <!-- 合作伙伴区域 -->
    <div class="p-footer-wrapper">
      <div class="p-partner-icons">
        <el-icon v-for="i in 10" :key="i" class="p-partner-icon">
          <Trophy />
        </el-icon>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="p-footer-wrapper2">
      <!-- 品牌信息 -->
      <div class="p-brand">
        <div class="p-logo-area">
          <el-icon class="p-logo-icon">
            <Medal />
          </el-icon>
          <span class="p-logo-text">ATB</span>
        </div>
        <p>{{ $t('footer.brandInfo1') }}</p>
        <p>{{ $t('footer.brandInfo2') }}</p>
      </div>

      <!-- 认证信息 -->
      <div class="p-brand2">
        <section>
          <el-icon class="p-cert-icon">
            <Stamp />
          </el-icon>
          <p>{{ $t('footer.mga') }}</p>
        </section>
        <section>
          <el-icon class="p-cert-icon">
            <Checked />
          </el-icon>
          <p>{{ $t('footer.bvi') }}</p>
        </section>
        <section>
          <el-icon class="p-cert-icon">
            <CircleCheck />
          </el-icon>
          <p>{{ $t('footer.gc') }}</p>
        </section>
        <section>
          <el-icon class="p-cert-icon">
            <SuccessFilled />
          </el-icon>
          <p>{{ $t('footer.pagcor') }}</p>
        </section>
      </div>

      <!-- 关于我们链接 -->
      <div class="p-brand3">
        <RouterLink
          v-for="(item, idx) in abouts"
          :key="idx"
          :to="`/aboutUs/${item.id}`"
          class="p-about-link"
        >{{ item.title }}</RouterLink>
      </div>

      <!-- 客服入口 -->
      <div class="p-brand4">
        <div class="p-one" @click="goToSupport">
          <div class="p-online">
            <el-icon class="p-on-img">
              <Service />
            </el-icon>
            <span>{{ $t('main.kf') }}</span>
          </div>
          <div class="p-btn">{{ $t('footer.consultNow') }}</div>
        </div>
        <div class="p-one" @click="goToSupport">
          <div class="p-online">
            <el-icon class="p-on-img">
              <Phone />
            </el-icon>
            <span>{{ $t('main.hotline') }}</span>
          </div>
          <div class="p-btn">{{ $t('footer.consultNow') }}</div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="p-footer-wrapper3">
      <p>{{ $t('footer.disclaimer') }}</p>
      <p>{{ $t('footer.copyright') }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Service,
  Phone,
  Trophy,
  Medal,
  Stamp,
  Checked,
  CircleCheck,
  SuccessFilled
} from '@element-plus/icons-vue'
import type { About } from 'typings'
import { onMounted, ref } from 'vue'
import { invokeApi } from '@/utils/tools'

defineOptions({ name: 'PcCommonFooter' })

const router = useRouter()
const abouts = ref<About[]>([])

// 跳转到客服页面
function goToSupport() {
  router.push('/support')
}

// 获取关于我们列表
async function getAboutList() {
  try {
    const resp = await invokeApi('aboutList')
    if (resp) {
      abouts.value = resp.data as About[]
    }
  } catch (error) {
    console.error('获取关于我们列表失败', error)
    // 使用默认数据
    abouts.value = [
      { id: 1, title: '关于我们' },
      { id: 2, title: '使用条款' },
      { id: 3, title: '隐私政策' },
      { id: 4, title: '负责任博彩' }
    ]
  }
}

onMounted(async () => {
  await getAboutList()
})
</script>

<style lang="less" scoped>
.p-footer {
  width: 100%;
  background: #343d4a;
  color: #828e9e;
  font-size: 14px;
  min-height: calc(370px / var(--Cardinality));
  text-align: center;
  position: relative;

  &-wrapper {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #4e5665;
    margin: 0 auto;
    padding: 20px 0;

    .p-partner-icons {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 30px;

      .p-partner-icon {
        font-size: 40px;
        color: #828e9e;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          color: #fff;
          transform: scale(1.1);
        }
      }
    }
  }

  &-wrapper2 {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: calc(1120px / var(--Cardinality));
    min-height: calc(194px / var(--Cardinality));
    margin: 0 auto;
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0;

    .p-brand {
      .p-logo-area {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;

        .p-logo-icon {
          font-size: 40px;
          color: #fff;
        }

        .p-logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }
      }

      p {
        font-size: calc(14px / var(--Cardinality));
        line-height: 20px;
        margin: 5px 0;
      }
    }

    .p-brand2 {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      width: calc(500px / var(--Cardinality));
      gap: 20px;

      section {
        width: calc(215px / var(--Cardinality));
        text-align: left;
        margin-bottom: calc(8px / var(--Cardinality));
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          .p-cert-icon {
            color: #409eff;
            transform: scale(1.1);
          }
          p {
            color: #fff;
          }
        }

        .p-cert-icon {
          font-size: 40px;
          color: #828e9e;
          transition: all 0.3s;
          margin-bottom: 10px;
        }

        p {
          padding-left: calc(10px / var(--Cardinality));
          font-size: calc(14px / var(--Cardinality));
        }
      }
    }

    .p-brand3 {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .p-about-link {
        color: #828e9e;
        font-size: calc(14px / var(--Cardinality));
        line-height: 20px;
        text-decoration: none;
        transition: all 0.3s;

        &:hover {
          color: #fff;
          padding-left: 5px;
        }
      }
    }

    .p-brand4 {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;

      .p-one {
        cursor: pointer;

        .p-online {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;

          .p-on-img {
            font-size: calc(20px / var(--Cardinality));
            color: #828e9e;
            transition: all 0.3s;
          }

          span {
            color: #828e9e;
            font-size: 14px;
            transition: all 0.3s;
          }
        }

        .p-btn {
          border-radius: 4px;
          border: 1px solid #707684;
          width: calc(84px / var(--Cardinality));
          height: calc(30px / var(--Cardinality));
          line-height: calc(30px / var(--Cardinality));
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s;

          &:hover {
            border: 1px solid #fff;
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
          }
        }

        &:hover {
          .p-on-img,
          span {
            color: #fff;
          }
        }
      }
    }
  }

  &-wrapper3 {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: 100%;
    margin: 0 auto;
    font-size: calc(14px / var(--Cardinality));
    line-height: 25px;
    padding: 20px 0;
    border-top: 1px solid #4e5665;

    p {
      margin: 5px 0;
      color: #828e9e;
    }
  }
}
</style>
