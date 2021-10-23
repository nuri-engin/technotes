<template>
  <div class="pagination-wrapper pb-3">
    <b-pagination
      v-model="page"
      :total-rows="rows"
      @change="(page) => updatePage(page)"
      align="center"
    ></b-pagination>
    <div class="total-notes">
      {{rows}} of {{rows}} Notes
    </div>
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.page-item.active .page-link {
  background-color: #3c6562 !important;
  border-color: #3c6562 !important;
  font-weight: bold !important;
  color: #fff !important;
}

.total-notes {
  margin-top: 0px;
}

.page-link {
  color: #3c6562 !important;
}
</style>