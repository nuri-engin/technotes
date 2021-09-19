<template>
  <div class="filterbar-wrapper">
    <div class="filterbar-left-side">
      <div class="view-options">
        <div class="small-scale"></div>
        <span>|</span>
        <div class="big-scale"></div>
      </div>
    </div>
    <div class="filterbar-right-side">
      <!-- <div class="filterbar-sortmenu">
        <b-dropdown class="sortby-dd" text="Sort By">
          <b-dropdown-item href="#">Date</b-dropdown-item>
          <b-dropdown-item href="#">Tag</b-dropdown-item>
        </b-dropdown>
      </div> -->
      <div class="search-input-wrapper">
        <b-form-input
          class="search-input"
          v-model="searchStr"
          placeholder="Search"
          @change="updateSearchStr"
          @keydown="enterSearch"
          @keyup="clearSearch"
        >
        </b-form-input>
        <b-button class="search-btn" pill @click="searchData"
          ><b-icon class="search-icon" icon="search"
        /></b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Filterbar",
  data() {
    return {
      searchStr: "",
    };
  },
  methods: {
    ...mapActions(["fetchPosts", "clearPosts"]),
    updateSearchStr(value) {
      this.searchStr = value.toLowerCase();
    },
    enterSearch(e) {
      if (e.keyCode === 13) {
        this.searchData();
      }
    },
    clearSearch() {
      if (this.searchStr === '') {
        this.clearPosts();
        this.fetchPosts();
      }
    },
    searchData() {
      if (this.searchStr) {
        this.clearPosts();
        this.fetchPosts({
          search: this.searchStr,
          searchBy: "title",
        });
      } else {
        this.clearPosts();
        this.fetchPosts();
      }
    },
  },
};
</script>

<style>
.filterbar-wrapper {
  margin-top: 20px;
  display: flex;
  padding: 0 25px;
}

.filterbar-left-side {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.filterbar-left-side {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.view-options {
  display: flex;
  margin-bottom: 5px;
}

.small-scale {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: #bef992;
  margin-right: 5px;
  margin-top: 3px;
  cursor: pointer;
}

.big-scale {
  width: 17px;
  height: 20px;
  border-radius: 3px;
  background-color: #3c6562;
  margin-left: 5px;
  margin-top: 0px;
  cursor: pointer;
}

.search-input-wrapper {
  display: flex;
  margin-left: 100px;
  position: relative;
}

.search-input {
  padding-top: 10px !important;
  background-color: transparent !important;
  border: none !important;
  color: white !important;
  padding-left: 5px !important;
}

.search-icon {
  font-size: 15px !important;
  color: #3c6562;
}

.search-btn {
  background-color: #f3fcf0 !important;
}

.sortby-dd > .btn-secondary {
  border: none !important;
  background-color: transparent;
}

.search-spinner .spinner-border {
  width: 1.2rem !important;
  height: 1.2rem !important;
  margin-right: 16px !important;
}
</style>
