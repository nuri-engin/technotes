<template>
  <div>
    <div id="app">
      <Navbar :logout="logout" :username="currUser && currUser.role" />
      <Filterbar />
      <div class="card-area-wrapper">
        <div v-if="posts.length === 0" class="spinner-container">
          <b-spinner variant="light"></b-spinner>
          <div class="loading-text">Loading posts</div>
        </div>
        <div v-else v-for="(post, index) in posts" :key="index">
          <Card :post="post" />
        </div>
      </div>
    </div>
    <Login :loggedIn="loggedIn" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import service from "@/service";
import Filterbar from "@/components/FilterBar.vue";
import Card from "@/components/Card.vue";
import Login from "@/components/Login.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Navbar,
    Filterbar,
    Card,
    Login,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    if (this.currUser && !this.currUser.isVerified) {
      this.checkVerification();
    } else {
      if (localStorage.getItem("token")) {
        document.getElementById("app").classList.remove("blur");
        this.isLoggedIn = true;
        this.fetchPosts();
      } else {
        document.getElementById("app").classList.add("blur");
        this.isLoggedIn = false;
      }
    }
  },
  computed: {
    ...mapGetters(["currUser", "posts", "loggedIn"]),
  },
  methods: {
    ...mapActions(["fetchPosts", "loginState", "logoutUser"]),
    logout() {
      document.getElementById("app").classList.add("blur");
      this.logoutUser();
      this.isLoggedIn = false;
    },
    checkVerification() {
      let pathname = document.location.href;
      if (pathname.includes("verify-email")) {
        let token = pathname.slice(pathname.lastIndexOf("=") + 1);
        service()
          .post("accounts/verify-email", {
            token: token,
          })
          .then((response) => {
            if (response.status == 200) {
              alert("verification successful");
            } else {
              alert("verification failed");
            }
          });
      }
    },
  },
};
</script>

<style>
body {
  color: #fcf0f3 !important;
  background-color: #02252f !important;
}
.card-area-wrapper {
  margin-top: 40px;
  padding: 20px 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner-container .spinner-border {
  width: 5rem;
  height: 5rem;
}

.spinner-container .loading-text {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

#app {
  font-family: "Heiti-Medium", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.blur {
  filter: blur(5px);
}
</style>
