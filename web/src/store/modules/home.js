import http from '@/plugins/http';
import {buildStarCard, saveStarCard, loadCardDynamicContent} from "@/utils";

/**
 * 侧栏默认展开的子菜单 id（与后端返回的树结构一致）
 * @param {Array<Object>|undefined} menus 菜单树根
 * @returns {string[]}
 */
function computeOpenIds(menus) {
  if (!Array.isArray(menus)) {
    return [];
  }
  return menus
    .filter(it => Array.isArray(it.children) && it.children.length > 0)
    .map(it => it.id);
}

const state = {
  menus: [],
  datas: [],
  openIds: [],
  /** 无关键词时接口返回的侧栏菜单深拷贝，搜索时只换 datas，不换侧栏树 */
  sidebarMenusSnapshot: null,
}
const mutations = {
  CHANGE_DATA: (state, payload) => {
    const menus = payload.menus;
    const datas = payload.datas;
    const kw = payload.keywords == null ? '' : String(payload.keywords).trim();

    state.datas = datas;

    if (!kw) {
      state.menus = menus;
      try {
        state.sidebarMenusSnapshot = menus ? JSON.parse(JSON.stringify(menus)) : null;
      } catch (e) {
        state.sidebarMenusSnapshot = null;
      }
    } else if (state.sidebarMenusSnapshot && state.sidebarMenusSnapshot.length) {
      try {
        state.menus = JSON.parse(JSON.stringify(state.sidebarMenusSnapshot));
      } catch (e) {
        state.menus = menus;
      }
    } else {
      state.menus = menus;
    }

    state.openIds = computeOpenIds(state.menus);
  },
  LOAD_STAR_CARD: state => {
    const starCategory = buildStarCard(state.datas);
    if (state.datas.find(item => item.id === '1')) {
      state.menus.splice(0, 1);
      state.datas.splice(0, 1);
    }
    if (starCategory) {
      state.menus.splice(0, 0, starCategory);
      state.datas.splice(0, 0, starCategory);
    }
    state.openIds = computeOpenIds(state.menus);
  }
}

const actions = {
  setStarCard({commit}, card) {
    const star = card.star;
    if (star) {
      if (localStorage.starCardIds) {
        const arr = localStorage.starCardIds.split(',');
        arr.splice(arr.indexOf(card.id), 1);
        localStorage.starCardIds = arr.join(',');
      }
    } else {
      saveStarCard([card.id]);
    }
    commit('LOAD_STAR_CARD');
    const params = localStorage.starCardIds ? localStorage.starCardIds.split(',') : [];
    http.patch('/api/v1/user/star/card', params);
    return Promise.resolve(!star);
  },
  // 加载
  loadHomeCards({commit}, keywords) {
    const kw = keywords == null ? '' : keywords;
    return http
      .get('/api/v1/card/tree', {params: {keywords: kw}})
      .then(res => {
        commit('CHANGE_DATA', {
          menus: res.menus,
          datas: res.datas,
          keywords: kw,
        });
        commit('LOAD_STAR_CARD');
        loadCardDynamicContent(state.datas);
        return res;
      });
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

