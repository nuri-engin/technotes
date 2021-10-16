<template>
  <div class="filterbar-wrapper">
    <div class="filterbar-top">
      <div class="filterbar-left-side">
        <div class="view-options">
          <div
            @click="smallView()"
            class="small-scale"
            :class="[{ 'active-view': smallCards }]"
          ></div>
          <span>|</span>
          <div
            @click="largeView()"
            class="big-scale"
            :class="[{ 'active-view': largeCards }]"
          ></div>
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
            class="search-input posts-search-input"
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
        <div class="filter-options-btn-wrapper">
          <b-button
            size="small"
            class="btn filter-options-btn"
            pill
            v-b-tooltip.hover
            title="Filters"
            @click="showFilters = !showFilters"
            ><b-icon class="search-icon" icon="filter" /> Filters
          </b-button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showFilters" class="filterbar-bottom">
        <div class="date-filters">
          <div class="startdate-wrapper">
            <b-form-datepicker
              id="startdate-picker"
              v-model="startdate"
              name="startdate-picker"
              placeholder="Start date"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              locale="en"
              size="sm"
              :max="enddate"
            ></b-form-datepicker>
          </div>
          <div class="enddate-wrapper">
            <b-form-datepicker
              id="enddate-picker"
              v-model="enddate"
              placeholder="End date"
              name="enddate-picker"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              locale="en"
              size="sm"
              :min="startdate"
            ></b-form-datepicker>
          </div>
        </div>
        <div class="filter-actions">
          <div class="apply-filter-btn-wrapper">
            <b-button
              v-b-tooltip.hover
              title="Apply Filters"
              pill
              size="sm"
              class="apply-filter-btn"
              style="display: flex"
              :disabled="startdate === null"
              @click="applyFilters"
            >
              <b-icon class="filter-icon" icon="filter"></b-icon>
            </b-button>
          </div>
          <div class="remove-filter-btn-wrapper">
            <b-button
              v-b-tooltip.hover
              title="Remove Filters"
              pill
              size="sm"
              class="btn btn-danger remove-filter-btn"
              @click="removeFilters"
            >
              x
            </b-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Filterbar",
  data() {
    return {
      searchStr: "",
      smallCards: true,
      largeCards: false,
      showFilters: false,
      startdate: null,
      enddate: null,
    };
  },
  methods: {
    ...mapActions(["fetchPosts", "clearPosts"]),
    updateSearchStr(value) {
      this.searchStr = value;
    },
    enterSearch(e) {
      if (e.keyCode === 13) {
        this.searchData();
      }
    },
    clearSearch() {
      if (this.searchStr === "") {
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
    smallView(e) {
      this.smallCards = true;
      this.largeCards = false;
      const cards = document.querySelectorAll(".techcard-wrapper");
      cards.forEach((card) => {
        card.classList.remove("large-view");
      });
    },
    largeView(e) {
      this.smallCards = false;
      this.largeCards = true;
      const cards = document.querySelectorAll(".techcard-wrapper");
      cards.forEach((card) => {
        card.classList.add("large-view");
      });
    },
    applyFilters(e) {
      if (!this.startdate && !this.enddate) {
        alert("Please select a date range.");
      } else {
        if (this.enddate === null) {
          this.enddate = this.startdate;
        }
        this.clearPosts();
        this.fetchPosts({
          searchBy: "createdAt",
          startDate: this.startdate,
          endDate: this.enddate,
        });
      }
    },
    removeFilters() {
      this.clearPosts();
      this.fetchPosts();
      this.startdate = null;
      this.enddate = null;
    },
  },
};
</script>

<style>
.b-form-datepicker {
  min-width: 120px;
  background-color: #f3fcf0 !important;
}

.large-view {
  width: 380px !important;
  max-height: 400px !important;
  height: 400px !important;
  justify-content: space-between !important;
  transition-property: width, height;
  transition-duration: 1s;
}

.date-filters,
.filter-actions {
  display: flex;
}

.filterbar-wrapper {
  font-family: "Quicksand", Helvetica, Arial !important;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
}

.filterbar-top {
  display: flex;
  width: 100%;
}

.filterbar-bottom {
  transition: all 300ms;
  display: flex;
  margin-top: 20px;
  padding: 10px;
  align-items: center !important;
  justify-content: space-between;
  border-bottom: 1px solid gray !important;
  box-shadow: 0px 23px 22px -20px rgb(215 204 204 / 75%);

  position: absolute;
  top: 18px;
  z-index: 100;
  width: 100%;
  background-color: #02252f;
}

.filterbar-right-side {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
}

.filterbar-left-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
}

.filterbar-left-side {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.filter-options-btn-wrapper {
  margin-left: 10px;
}

.filter-icon {
  margin-top: 3px;
  font-size: 20px;
}

.view-options {
  display: flex;
  margin-bottom: 5px;
}

.enddate-wrapper {
  margin-left: 15px;
}

.apply-filter-btn-wrapper {
  margin-left: 15px;
}

.remove-filter-btn-wrapper {
  margin-left: 5px;
}

.remove-filter-btn,
.apply-filter-btn {
  width: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}

.small-scale {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: #3c6562;
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

.active-view {
  background-color: #bef992;
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

.posts-search-input {
  border: 1px solid #f3fcf0 !important;
  z-index: 1;
  border-top-left-radius: 22px !important;
  border-bottom-left-radius: 22px !important;
  position: absolute;
  right: 17px;
  width: 200px !important;
  padding-left: 15px !important;
  height: 38px;
}

.search-icon {
  font-size: 15px !important;
  color: #3c6562;
}

.search-btn,
.filter-options-btn {
  background-color: #f3fcf0 !important;
  z-index: 2;
}

.filter-options-btn {
  color: #3c6562 !important;
  font-size: 14px !important;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
