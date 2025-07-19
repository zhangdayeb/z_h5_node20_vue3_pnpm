<template>
  <div class="p-header">
    <div class="p-header-wrapper">
      <div class="p-header-bar">
        <div class="p-bar-wrapper" style="z-index: 120">
          <el-dropdown
            trigger="click"
            @visible-change="visibleChange"
            @command="selectLanguage"
          >
            <template #default>
              <div class="p-dropdown-default">
                <div :class="'p-lang p-' + currLang.lang"></div>
                <span class="p-lang-label">{{ currLang.label }}</span>
                <el-icon
                  class="el-icon--right"
                  :class="{ arrow: langIsVisible }"
                >
                  <CaretBottom />
                </el-icon>
              </div>
            </template>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, idx) in langList"
                  :key="idx"
                  :command="item"
                >
                  <template #default>
                    <div class="p-dd-item">
                      <el-image
                        :src="item.icon"
                        fit="fill"
                        class="p-lang-icon"
                      />
                      <span class="p-lang-txt">{{ item.label }}</span>
                    </div>
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <div class="p-header-right">
            <div class="p-app">
              <el-image
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAMAAAAlvKiEAAAAbFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8+T+BWAAAAI3RSTlMAChESFB8hNTZQWF5fYoCVlpiZnMHQ2d/i6e3v8PHy+Pr9/l1vnZ8AAACHSURBVCjP7ZJLEoIwEAUfHxFQB4Fggsr33f+OpBLUkuIALuxlV81sXgMICzNxZTJFCEtqyPEtSXMEAs3yIC8pSU0dQHi1H04XxzkCKgrUHOOLmArdDRv0E2y2suFf/pbs9M5winbifJgdQ+4nFlZA1j4cbeZjsNnUyefWZ+MC6+8rvQ9sL8UFUiIXxQU3Mc8AAAAASUVORK5CYII="
                fit="fill"
                class="p-img"
              />
              <span>下载手机版</span>
            </div>
            <el-button type="primary" class="p-btn-login">登录</el-button>
            <a
              class="p-a-register"
              href="javascript:;"
              v-if="(store.systemConf?.is_open_register ?? '0') === '1'"
              >立即注册</a
            >
          </div>
        </div>
      </div>
      <div class="p-header-menu">
        <div class="p-menu-wrapper">
          <RouterLink to="/">
            <div class="p-logo">
              <el-image
                :src="getImgUrl(store.systemConf?.site_logo ?? '')"
                fit="contain"
                class="p-logo-img"
              />
            </div>
          </RouterLink>
          <div class="p-other">
            <div class="p-nav">
              <div
                class="p-nav-item"
                v-for="(item, idx) in menuList"
                :key="idx"
                :class="{ active: idx === menuIndex }"
              >
                <a href="javascript:;" class="category">
                  <span>{{ item.label }}</span>
                  <el-image
                    v-if="item.is_hot"
                    src="data:image/png;base64,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"
                    fit="contain"
                    class="p-hot"
                  ></el-image>
                </a>
                <div class="p-submenu" v-if="gamesByType[`${item.game_type}`]">
                  <div class="p-submenu-wrapper">
                    <template
                      v-for="(it, ix) in gamesByType[`${item.game_type}`]"
                    >
                      <a
                        class="p-submenu-item"
                        href="javascript:;"
                        :key="ix"
                        v-if="ix < 4"
                      >
                        <el-image
                          :src="getImgUrl(it.logo_url)"
                          fit="contain"
                          class="p-item-img"
                        ></el-image>
                        <div class="p-item-right">
                          <p class="p-label">{{ it.title }}</p>
                          <div class="p-btn">开始</div>
                        </div>
                      </a>
                    </template>
                    <a
                      href="javascript:;"
                      class="p-item-more"
                      v-if="gamesByType[`${item.game_type}`].length > 4"
                    >
                      <p class="p-more">查看更多</p>
                      <span class="p-num">{{
                        gamesByType[`${item.game_type}`].length
                      }}</span>
                      <p class="p-txt">场馆</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-other-right">
              <div class="p-other-item">
                <el-image
                  src="data:image/png;base64,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"
                  fit="contain"
                  class="p-icon-img"
                ></el-image>
                <span>优惠活动</span>
              </div>
              <div class="p-other-item">
                <el-image
                  src="data:image/png;base64,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"
                  fit="contain"
                  class="p-icon-img"
                ></el-image>
                <span>在线客服</span>
              </div>
              <div class="p-other-item">
                <el-image
                  src="data:image/png;base64,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"
                  fit="contain"
                  class="p-icon-img"
                ></el-image>
                <span>LINE</span>
              </div>
              <div class="p-other-item">
                <el-image
                  src="data:image/png;base64,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"
                  fit="contain"
                  class="p-icon-img"
                ></el-image>
                <span>热线电话</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'
import { getLanguage, setLanguage } from '@/lang'

import zhCnImg from '@/assets/mobile/lang/zh_cn.png'
import zhTwImg from '@/assets/mobile/lang/zh_tw.png'
import enUsImg from '@/assets/mobile/lang/en_us.png'
import thThImg from '@/assets/mobile/lang/th_th.png'
import viVnImg from '@/assets/mobile/lang/vi_vn.png'
import { getDomain, invokeApi, getImgUrl } from '@/utils/tools'
import { useAppStore } from '@/stores/app'
import type { gameType } from 'typings'

defineOptions({ name: 'PcCommonHeader' })
const store = useAppStore()
const langIsVisible = ref(false)
const currLang = ref()
const langList = ref<
  {
    icon: string
    lang: 'en-US' | 'zh-CN' | 'zh-TW' | 'th-TH' | 'vi-VN'
    label: string
  }[]
>([
  { icon: zhCnImg, lang: 'zh-CN', label: '中文' },
  { icon: zhTwImg, lang: 'zh-TW', label: '繁體中文' },
  { icon: enUsImg, lang: 'en-US', label: 'English' },
  { icon: thThImg, lang: 'th-TH', label: 'ภาษาไทย' },
  { icon: viVnImg, lang: 'vi-VN', label: 'ViệtName' },
])

const menuList = ref([
  { label: '热门游戏', game_type: 0, is_hot: true, sub_menu: false },
  { label: '体育赛事', game_type: 5, is_hot: false, sub_menu: true },
  { label: '视讯直播', game_type: 1, is_hot: false, sub_menu: true },
  { label: '电子游艺', game_type: 3, is_hot: false, sub_menu: true },
  { label: '棋牌游戏', game_type: 6, is_hot: false, sub_menu: true },
  { label: '捕鱼游戏', game_type: 2, is_hot: false, sub_menu: true },
  { label: '彩票游戏', game_type: 4, is_hot: false, sub_menu: true },
])
const menuIndex = ref(-1)
const gamesByType = ref<{ [key: string]: gameType[] }>({})
function visibleChange(b: boolean) {
  langIsVisible.value = b
}

function selectLanguage(lang: {
  icon: string
  lang: 'en-US' | 'zh-CN' | 'zh-TW' | 'th-TH' | 'vi-VN'
  label: string
}) {
  console.log('lang', lang)
  setLanguage(lang.lang)
  currLang.value = lang
}

async function getSysConfig() {
  if (store.systemConf) {
    return
  }
  const resp = await invokeApi('sysConfig', {
    group: 'system',
    url: getDomain(),
  })
  if (resp) {
    store.$patch({ systemConf: resp.data })
  }
}

async function getGameByType(type: number | string) {
  const resp = await invokeApi('gameApi', { gameType: type })
  if (resp && resp.data) {
    const data = resp.data as gameType[]
    gamesByType.value[`${type}`] = data
  }
}

const initLang = () => {
  let curr: {
    icon: string
    lang: 'en-US' | 'zh-CN' | 'zh-TW' | 'th-TH' | 'vi-VN'
    label: string
  } | null = null
  const lang = getLanguage()
  try {
    langList.value.forEach(item => {
      if (lang === item.lang) {
        curr = item
        throw new Error('over')
      }
    })
  } catch (err) {
    console.log((err as Error).message)
  }
  if (!curr) {
    curr = langList.value[0]
  }
  return curr
}

currLang.value = initLang()

onMounted(async () => {
  await getSysConfig()
  for (let i = 1; i <= 6; i++) {
    await getGameByType(`${i}`)
  }
})
</script>

<style lang="less" scoped>
.p-dd-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  .p-lang-icon {
    width: 26px;
    height: 26px;
  }
  .p-lang-txt {
    flex: 1;
  }
}
.p-header {
  display: flex;
  flex-direction: column;
  height: 140px;

  &-bar {
    height: 47px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: var(--herder-top);
    z-index: 100;

    .p-bar-wrapper {
      max-width: var(--web-max-width);
      min-width: var(--web-min-width);
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .p-dropdown-default {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: rgba(2, 40, 108, 0.08);
        border-radius: 20px;
        padding-right: 10px;

        .el-icon--right {
          color: var(--el-color-white);
          transition: transform 500ms ease-in-out;
        }
        .arrow {
          transform: rotate(180deg);
        }
      }

      .p-header-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 20px;

        .p-app {
          display: none;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          color: var(--el-color-white);
          cursor: pointer;
          gap: 5px;

          .p-img {
            width: 10px;
            height: 16px;
          }
        }
        .p-btn-login {
          padding: 0 10px;
          min-width: 66px;
          height: 28px;
          cursor: pointer;
          border-radius: 14px;
          color: #fff;
          line-height: 28px;
          text-align: center;
          font-size: 14px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          background: var(--home-top-btn);
          -webkit-box-shadow: 0 1px 2px 0 rgba(6, 39, 121, 0.16);
          box-shadow: 0 1px 2px 0 rgba(6, 39, 121, 0.16);
          border-radius: 4px;
          border-width: 0px;
        }
        .p-a-register {
          font-size: 14px;
          color: var(--el-color-white);
          height: 28px;
          line-height: 28px;
          text-decoration: none;
        }
      }
    }
  }
  &-wrapper {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    justify-content: center;
    align-items: center;
    height: 140px;
    position: relative;

    .p-lang-label {
      text-align: left;
      color: var(--el-color-white);
      font-weight: 700;
    }
  }

  &-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    border: 0px solid #75abf1;
    border-top-width: 1px;
    background: url(data:image/png;base64,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)
      repeat;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    position: relative;

    .p-menu-wrapper {
      max-width: var(--web-max-width);
      min-width: var(--web-min-width);
      display: flex;
      flex-direction: row;
      height: 100%;
      flex: 1;

      .p-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        z-index: 1;

        &-img {
          width: 200px;
        }
      }

      .p-other {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex: 1;

        .p-nav {
          display: flex;
          flex-direction: row;
          height: 100%;
          gap: 10px;

          .p-nav-item {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            min-width: 75px;
            position: relative;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
            cursor: pointer;

            &::after {
              content: '';
              position: absolute;
              opacity: 0;
              left: 50%;
              bottom: 21px;
              height: 2px;
              width: 60%;
              background: #fff;
              -webkit-transition: all 0.3s ease-out;
              transition: all 0.3s ease-out;
              -webkit-transform: translateX(-50%) scaleX(0);
              transform: translateX(-50%) scaleX(0);
            }
            &:hover {
              &:after {
                opacity: 1;
                transform: translateX(-50%) scaleX(1);
              }
              .p-submenu {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .category {
              padding: 0;
              font-size: 16px;
              color: #fbfbfb;
              text-shadow: 0 0 2px #6698c5;
              -webkit-transition: all 0.3s;
              transition: all 0.3s;
              position: relative;
              z-index: 1;

              .p-hot {
                position: absolute;
                right: 0px;
                top: -13px;
                height: 16px;
                width: 21px;
              }
            }

            .p-submenu {
              position: fixed;
              right: 0;
              left: 0;
              top: 0;
              width: 100%;
              -webkit-transition: all 0.4s;
              transition: all 0.4s;
              -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
              opacity: 0;
              padding-top: 94px;
              background: var(--herder-bg-down);
              z-index: -1;
              // display: none;

              .p-submenu-wrapper {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                overflow: hidden;
                max-width: var(--web-submenu-max-width);
                width: 100%;
                justify-content: flex-start;
                margin: 0 auto;
                gap: 20px;

                .p-submenu-item {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  gap: 20px;

                  .p-item-img {
                    width: 168px;
                    height: 150px;
                  }
                  .p-item-right {
                    display: flex;
                    flex-direction: column;
                    width: 120px;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;

                    .p-label {
                      color: var(--el-color-white);
                      font-size: 25px;
                    }
                    .p-btn {
                      background: url('@/assets/web/start.png') no-repeat;
                      background-size: 100% 100%;
                      width: 80px;
                      height: 28px;
                      font-size: 12px;
                      color: var(--el-color-white);
                      line-height: 28px;
                    }
                  }
                }

                .p-item-more {
                  height: 150px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-around;
                  align-items: center;
                  margin: 20px 0;

                  .p-more {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--el-color-white);
                    text-shadow: 0 2px 4px rgba(83, 138, 224, 0.5);
                  }
                  .p-num {
                    font-size: 60px;
                    font-weight: 700;
                    color: var(--el-color-white);
                    flex: 1;
                  }
                  .p-txt {
                    .p-more;
                  }
                }
              }
            }
          }
          .active {
            &::after {
              opacity: 1;
              transform: translateX(-50%) scaleX(1);
            }
          }
        }

        .p-other-right {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: 30px;

          .p-other-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            z-index: 10;
            cursor: pointer;

            .p-icon-img {
              width: 27px;
              height: 27px;
            }

            span {
              text-shadow: 0 0 2px #6698c5;
              margin: 5px 0 0 4px;
              font-size: 16px;
              color: var(--el-color-white);
            }
          }
        }
      }
    }
  }
  .p-lang {
    width: 26px;
    height: 26px;
    background: url('@/assets/web/icon-lang.png') no-repeat;
    background-size: 26px 182px;
    margin-right: 6px;
  }
  .p-en-US {
    background-position: 0 -26px;
  }
  .p-zh-CN {
    background-position: 0 0;
  }
  .p-zh-TW {
    background-position: 0 0;
    background: url('@/assets/mobile/lang/zh_tw.png') no-repeat;
    background-size: 100% 100%;
  }
  .p-th-TH {
    background-position: 0 -52px;
  }
  .p-vi-VN {
    background-position: 0 -78px;
  }
  .p-id-ID {
    background-position: 0 -104px;
  }
  .p-km-KH {
    background-position: 0 -130px;
  }
  .p-ko-KR {
    background-position: 0 -156px;
  }
}
</style>
