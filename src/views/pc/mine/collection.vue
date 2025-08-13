<template>
  <div class="m-collection">
    <van-nav-bar
      left-arrow
      :title="$t('mine.myCollection')"
      @click-left="onClickLeft"
      class="m-nav"
    />

    <van-tabs v-model:active="active">
      <van-tab :title="$t('all')" name="all">
        <van-empty :description="$t('noRecord')" v-if="list.all.length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list.all"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.en_name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('dianzi')" name="3">
        <van-empty :description="$t('noRecord')" v-if="list['3'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['3']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.en_name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('zhenren')" name="1">
        <van-empty :description="$t('noRecord')" v-if="list['1'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['1']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.en_name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('tiyu')" name="5">
        <van-empty :description="$t('noRecord')" v-if="list['5'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['5']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('lottery')" name="4">
        <van-empty :description="$t('noRecord')" v-if="list['4'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['4']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('qipai')" name="6">
        <van-empty :description="$t('noRecord')" v-if="list['6'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['6']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab :title="$t('fishGame')" name="2">
        <van-empty :description="$t('noRecord')" v-if="list['2'].length <= 0" />
        <van-cell-group v-else>
          <van-cell
            class="m-tab-item"
            v-for="(item, idx) in list['2']"
            :key="idx"
          >
            <template #default>
              <div class="m-row">
                <van-image
                  :src="item.img_url"
                  fit="contain"
                  class="m-img"
                ></van-image>
                <div class="m-game">
                  <div class="m-title">{{ item.name }}</div>
                  <div class="m-code">{{ item.api_name }}</div>
                </div>
                <van-icon
                  name="star"
                  size="20"
                  color="#ff6363"
                  @click="cancelFavor(item)"
                />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <div class="m-tab-contain"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { invokeApi } from '@/utils/tools'
import type { ApiCollectGame } from 'typings'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
defineOptions({ name: 'myCollection' })

const { t } = useI18n()
const router = useRouter()
const active = ref('all')
const list = ref<{ [key: string]: ApiCollectGame[] }>({
  all: [],
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
})
function onClickLeft() {
  router.back()
}

async function cancelFavor(it: ApiCollectGame) {
  //{"game_type":3,"api_name":"AG","model_id":3584}
  const resp = await invokeApi('favorDelete', {
    game_type: it.game_type,
    api_name: it.api_name,
    model_id: it.id,
  })
  if (!resp) {
    return
  }
  await getMyGames()
  showToast({
    message: t('success'),
    onClose: async () => {},
  })
}
async function getMyGames() {
  const resp = await invokeApi('favorList')
  if (!resp) {
    return
  }

  const gamelist: ApiCollectGame[] = resp.gamelists as ApiCollectGame[]
  if (gamelist.length > 0) {
    Object.keys(list.value).forEach((key: string) => {
      if (key === 'all') {
        list.value[key] = gamelist
      } else {
        list.value[key] = gamelist.filter(it => it.game_type === Number(key))
      }
    })
    console.log('list', list.value)
  }
}

onMounted(async () => {
  await getMyGames()
})
</script>

<style lang="less" scoped>
.m-collection {
  display: flex;
  flex-direction: column;
  flex: 1;

  .m-tab-item {
    .m-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      background-color: #fff;

      .m-game {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex: 1;
        gap: 25px;

        .m-title {
          font-size: 18px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }
        .m-code {
          background: #f4f4f4;
          border-radius: 4px;
          padding: 5px;
          font-size: 12px;
          color: rgba(138, 146, 157, 0.85);
        }
      }
      .m-img {
        width: 83px;
        height: 120px;
      }
    }
  }
}

// PC端样式适配
@media (min-width: 768px) {
  .m-collection {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;

    // 导航栏PC端优化
    .m-nav {
      background: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      margin-bottom: 30px;

      :deep(.van-nav-bar__content) {
        padding: 0 30px;
        height: 60px;
      }

      :deep(.van-nav-bar__title) {
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }

      :deep(.van-nav-bar__left) {
        .van-icon {
          font-size: 20px;
          color: #606266;
        }
      }
    }

    // 标签页PC端优化
    :deep(.van-tabs) {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;

      .van-tabs__wrap {
        background: #f8f9fa;

        .van-tabs__nav {
          background: transparent;

          .van-tab {
            font-size: 16px;
            font-weight: 500;
            color: #606266;
            padding: 20px 30px;
            transition: all 0.3s;

            &.van-tab--active {
              color: #409eff;
              font-weight: 600;
            }

            &:hover {
              color: #409eff;
              background: rgba(64, 158, 255, 0.1);
            }
          }
        }

        .van-tabs__line {
          background: #409eff;
          height: 3px;
          border-radius: 2px;
        }
      }

      .van-tabs__content {
        padding: 30px;
        min-height: 500px;

        .van-tab__panel {
          // 空状态优化
          .van-empty {
            padding: 80px 20px;

            :deep(.van-empty__description) {
              font-size: 16px;
              color: #909399;
            }
          }

          // 列表容器优化
          .van-cell-group {
            background: transparent;

            .van-cell {
              margin-bottom: 16px;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              border: 1px solid #f0f2f5;
              transition: all 0.3s;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                border-color: #409eff;
              }
            }
          }
        }
      }
    }

    // 游戏项PC端优化
    .m-tab-item {
      .m-row {
        padding: 20px;
        gap: 24px;
        border-radius: 12px;

        .m-img {
          width: 100px;
          height: 140px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .m-game {
          gap: 12px;

          .m-title {
            font-size: 20px;
            font-weight: 600;
            color: #303133;
            line-height: 1.4;
          }

          .m-code {
            background: #f0f9ff;
            color: #409eff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #b3d8ff;
          }
        }

        // 收藏按钮优化
        .van-icon {
          cursor: pointer;
          transition: all 0.3s;
          padding: 8px;
          border-radius: 50%;

          &:hover {
            background: rgba(255, 99, 99, 0.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }
}

// 大屏幕优化 (1200px+)
@media (min-width: 1200px) {
  .m-collection {
    max-width: 1400px;
    padding: 60px;

    :deep(.van-tabs) {
      .van-tabs__content {
        padding: 40px;

        .van-tab__panel {
          .van-cell-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;

            .van-cell {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}

// 超大屏幕优化 (1600px+)
@media (min-width: 1600px) {
  .m-collection {
    :deep(.van-tabs) {
      .van-tabs__content {
        .van-tab__panel {
          .van-cell-group {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
@import url('@/views/mobile/common.less');

// PC端全局样式覆盖
@media (min-width: 768px) {
  .m-collection {
    .van-tabs__nav--line {
      padding-bottom: 0px;
    }
    .van-tabs__line {
      bottom: 0px;
    }
  }
}
</style>
