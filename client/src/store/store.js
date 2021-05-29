import Vue from 'vue'
import Vuex from 'vuex'
import service from "@/service"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: null,
        loggedIn: false,
        posts: []
    },
    getters: {
        currUser: state => {
            return state.user
        },
        posts: state => {
            return state.posts
        },
        loggedIn: state => {
            return state.loggedIn
        }
    },
    mutations: {
        fetchPosts(state, { posts }) {
            state.posts = posts;
        },
        updateUser(state, { user }) {
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        loggedIn(state, { loggedIn }) {
            state.loggedIn = loggedIn;
        },
        initialiseStore(state) {
            if (localStorage.getItem('user')) {
                state.user = JSON.parse(localStorage.getItem('user'));
            }
        },
    },
    actions: {
        async fetchPosts({ commit }) {
            try {
                const { data } = await service().get('posts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                commit('fetchPosts', { posts: data })
            } catch (e) {
                console.error(e.message)
            }
        },
        loginUser({ commit, dispatch }, { email, password }) {
            return new Promise((resolve, reject) => {
                service().post('accounts/authenticate', {
                    email: email,
                    password: password
                }).then(response => {
                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.jwtToken)
                        document.getElementById('app').classList.remove('blur');
                        commit('updateUser', { user: response.data })
                        dispatch('loginState', { login: true })
                        dispatch('fetchPosts')
                        resolve(response)
                    }
                }).catch(error => {
                    reject(error)
                    dispatch('loginState', { login: true })
                })
            })
        },
        loginState({ commit }, login) {
            commit('loggedIn', { loggedIn: login })
        }
    }
})

export default store