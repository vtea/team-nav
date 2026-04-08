import http from '@/plugins/http';

let storageSetting = {}
try {
  const raw = localStorage.getItem('layout-setting')
  storageSetting = raw ? JSON.parse(raw) : {}
} catch (e) {
  storageSetting = {}
}

const state = {
  title: process.env.VUE_APP_TITLE,
  /** 侧栏激活项与 CSS 变量 --current-color，对齐 Apple Blue */
  theme: storageSetting.theme || '#0071e3',
  /** 默认浅色侧栏，对齐工具目录站布局 */
  sideTheme: storageSetting.sideTheme || 'theme-light',
  showSettings: false,
  cutOverSpeed: 10,
  logoPath: '/assets/images/logo.png',
  logoToFavicon: false,
  showDoc: false,
  menuDefaultOpen: storageSetting.menuDefaultOpen === 'true',
  menuAccordion: storageSetting.menuAccordion === 'true',
  cardIconShape: storageSetting.cardIconShape || 'circle',
  cardSize: storageSetting.cardSize || 'small',
  version: {},
  cardTypes: [
    {
      id: 'default',
      name: '普通卡片',
    },
    {
      id: 'zip',
      name: '静态网站',
    },
    {
      id: 'dynamic-http',
      name: 'http动态卡片',
    },
    {
      id: 'dynamic-sql',
      name: 'sql动态卡片',
    },
  ],
}
const mutations = {
  CHANGE_SETTING: (state, {key, value}) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_VERSION: (state, version) => {
    state.version = version;
  }
}

const actions = {
  // 修改布局设置
  changeSetting({commit}, data) {
    commit('CHANGE_SETTING', data)
  },
  // 加载配置
  loadSettings({commit}) {
    return http.get('/api/v1/setting').then(res => {
      commit('CHANGE_SETTING', {key: 'title', value: res.navName});
      commit('CHANGE_SETTING', {key: 'cutOverSpeed', value: res.cutOverSpeed});
      commit('CHANGE_SETTING', {key: 'logoPath', value: res.logoPath});
      commit('CHANGE_SETTING', {key: 'logoToFavicon', value: res.logoToFavicon});
      commit('CHANGE_SETTING', {key: 'showDoc', value: res.showDoc});
      return res;
    });
  },
  // 加载版本信息
  loadVersion({commit}) {
    return http.get('/api/v1/app/version').then(res => {
      commit('CHANGE_VERSION', res);
      return res;
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

