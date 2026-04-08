import http from '@/plugins/http';
import {saveStarCard} from '@/utils';

const state = {
  userInfo: {
    id: '',
    username: '',
    nickname: '',
    firstname: '',
    isAdmin: false,
    avatar: ''
  },
  applyCount: 0
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_APPLY_COUNT: (state, count) => {
    state.applyCount = count
  },
}
const actions = {
  // 更新申请数
  refreshApplyCount({commit}) {
    return http.get('/api/v1/apply/cards/count')
      .then(res => {
        commit('SET_APPLY_COUNT', res);
      })
  },
  // 登录
  Login({commit}, userInfo) {
    const username = userInfo.username.trim()
    const password = userInfo.password
    return http.post('/api/v1/quick/login', {username, password});
  },
  // 获取用户信息
  GetUserInfo({commit, state}) {
    return http.get('/api/v1/login/user').then(res => {
      let user = res;
      if (!user) {
        user = {
          id: '',
          username: '',
          nickname: '未登录',
          isAdmin: false,
          avatar: '',
        }
      }
      // 只初始拉取一次，以后都以本地为准
      if(!localStorage.hasOwnProperty('starCardIds')){
        saveStarCard(user.starCardIds);
      }
      user.firstname = user.nickname.substring(user.nickname.length - 3);
      user.isAdmin = user.id === '1' || (Array.isArray(user.roleIds) && user.roleIds.includes('1'));
      commit('SET_USER_INFO', user)
      return Promise.resolve(user);
    })
  },

  /**
   * 退出系统：通知后端注销会话，并立即清空前端 userInfo，
   * 侧栏等依赖 loginUser.id 的界面无需整页刷新即可回到「未登录」。
   */
  LogOut({commit}) {
    const emptyUser = {
      id: '',
      username: '',
      nickname: '',
      firstname: '',
      isAdmin: false,
      avatar: '',
    };
    return http.post('/logout')
      .then(() => {
        window.localStorage.userLogout = true;
        commit('SET_USER_INFO', emptyUser);
      })
      .catch(() => {
        commit('SET_USER_INFO', emptyUser);
      });
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
