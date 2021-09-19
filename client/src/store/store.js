import Vue from "vue";
import Vuex from "vuex";
import service from "@/service";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    loggedIn: false,
    posts: [],
    loadData: true,
  },
  getters: {
    currUser: (state) => {
      return state.user;
    },
    posts: (state) => {
      return state.posts;
    },
    loggedIn: (state) => {
      return state.loggedIn;
    },
    loadData: (state) => {
      return state.loadData;
    },
  },
  mutations: {
    fetchPosts(state, { posts }) {
      state.posts = posts;
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
  },
  actions: {
    async fetchPosts({ commit, dispatch }, params) {
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
        } else {
          const { data } = await service().get("posts", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          commit("fetchPosts", { posts: data });
        }
      } catch (e) {
        console.error(e.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch("logoutUser");
      }
    },
    clearPosts({commit}) {
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
    }
  },
});

export default store;
