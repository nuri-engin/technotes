<template>
  <div class="pagination-wrapper pb-3">
    <b-pagination
      v-model="page"
      :total-rows="rows"
      @change="(page) => updatePage(page)"
      align="center"
    ></b-pagination>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Pagination",
  props: ["currentPage", "rows"],
  computed: {
    page: {
      get() {
        return this.currentPage;
      },
      set(newPage) {
        return newPage;
      },
    },
  },
  methods: {
    ...mapActions(["fetchPosts"]),
    updatePage(page) {
        this.fetchPosts({page})
    }
  },
};
</script>

<style>
.pagination-wrapper {
    position: fixed;
    bottom: 0px;
    width: 100%;
}
.page-item.active .page-link {
  background-color: #3c6562 !important;
  border-color: #3c6562 !important;
  font-weight: bold !important;
  color: #fff !important;
}

.page-link {
  color: #3c6562 !important;
}
</style>