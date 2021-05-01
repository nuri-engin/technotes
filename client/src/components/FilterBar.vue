<template>
  <div class="filterbar-wrapper">
    <div class="filterbar-left-side">
      <div class="view-options">
        <div class="small-scale"></div>
        <span>|</span>
        <div class="big-scale"></div>
      </div>
      <div class="search-input-wrapper">
        <b-form-input
          class="search-input"
          v-model="searchStr"
          placeholder="Search"
        >
        </b-form-input>
        <b-icon class="search-icon" icon="search" />
      </div>
    </div>
    <div class="filterbar-right-side">
      <div class="filterbar-sortmenu">
        <b-dropdown class="sortby-dd" text="Sort By">
          <b-dropdown-item href="#">Date</b-dropdown-item>
          <b-dropdown-item href="#">Tag</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filterbar",
  data() {
    return {
      searchStr: "",
    };
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
  margin-left: 100px;
  position: relative;
}

.search-input {
  padding-top: 10px;
  background-color: transparent;
  border: none;
  color: white;
  padding-left: 30px;
}

.search-icon {
  position: absolute;
  top: 12px;
  left: 0px;
}

.sortby-dd > .btn-secondary{
    border: none !important;
    background-color: transparent;
}

</style>
