import Vue from "vue";
import Vuex from "vuex";
import service from "@/service";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    users: [],
    loggedIn: false,
    total: 0,
    filtered: false,
    posts: [],
    loadData: true,
    categories: [],
  },
  getters: {
    currUser: (state) => {
      return state.user;
    },
    total: (state) => {
      return state.total;
    },
    totalUsers: (state) => {
      return state.users
    },
    posts: (state) => {
      return state.posts;
    },
    categories: (state) => {
      return state.categories;
    },
    loggedIn: (state) => {
      return state.loggedIn;
    },
    loadData: (state) => {
      return state.loadData;
    },
    filtered: (state) => {
      return state.filtered;
    }
  },
  mutations: {
    fetchPosts(state, { posts }) {
      state.posts = posts;
    },
    fetchCategories(state, {categories}) {
      state.categories = categories
    },
    updateUser(state, { user }) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    loggedIn(state, { loggedIn }) {
      state.loggedIn = loggedIn;
    },
    initialiseStore(state) {
      if (localStorage.getItem("user")) {
        state.user = JSON.parse(localStorage.getItem("user"));
      }
    },
    setLoadData(state, isLoading) {
      state.loadData = isLoading
    },
    setTotal(state, count) {
      state.total = count;
    },
    setTotalUsers(state, users) {
      state.users = users;
    },
    isFiltered(state, isFiltered) {
      state.filtered = isFiltered;
    }
  },
  actions: {
    async fetchPosts({ commit, dispatch }, params) {
      commit('setLoadData', true)
      try {
        if (params) {
          const { data } = await service().get(
            "posts",
            { params },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          commit("fetchPosts", { posts: data });
          if(!params.page) {
            commit("isFiltered", true);
          }
          commit('setLoadData', false);
        } else {
          const { data } = await service().get("posts",
            { page: 1 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
          commit("fetchPosts", { posts: data });
          commit("isFiltered", false);
          dispatch("totalPosts");
          commit('setLoadData', false)
        }
      } catch (e) {
        console.error(e.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch("logoutUser");
      }
    },
    async fetchCategories({ commit }) {
      try {
        const { data } = await service().get(
          "posts/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        commit("fetchCategories", { categories: data });
      } catch (e) {
        console.error(e.message);
      }
    },
    clearPosts({ commit }) {
      commit("fetchPosts", { posts: [] });
    },
    loginUser({ commit, dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        service()
          .post("accounts/authenticate", {
            email: email,
            password: password,
          })
          .then((response) => {
            if (response.status === 200) {
              localStorage.setItem("token", response.data.jwtToken);
              document.getElementById("app").classList.remove("blur");
              commit("updateUser", { user: response.data });
              dispatch("loginState", { login: true });
              dispatch("fetchPosts");
              dispatch('totalUsers');
              resolve(response);
            }
          })
          .catch((error) => {
            resolve(error);
            dispatch("loginState", { login: false });
            localStorage.removeItem("token");
          });
      });
    },
    loginState({ commit }, login) {
      commit("loggedIn", { loggedIn: login });
    },
    logoutUser({ commit, dispatch }) {
      dispatch("loginState", { login: false });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    },
    totalPosts({ commit }) {
      service().get('/posts/count').then(response => {
        if (response.status === 200) {
          commit("setTotal", response.data.total)
        }
      }).catch(error => console.error(error))
    },
    async totalUsers({commit}) {
      try {
        const users = await service().get(
          "accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        users.data.length > 0 && commit('setTotalUsers', users.data)
      } catch (error) {
        console.error(error.message);
      }
    }
  },
});

export default store;
