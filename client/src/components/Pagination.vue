<template>
  <div class="pagination-wrapper pb-3">
    <b-pagination
      v-model="page"
      per-page="24"
      :total-rows="rows"
      @change="(page) => updatePage(page)"
      align="center"
    ></b-pagination>
    <div v-if="rows" class="total-notes">
      {{current_page_total}} of {{rows}} Notes
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Pagination",
  props: ["currentPage", "rows", "posts"],
  data() {
    return { 
      current_page_total: 24,
      current_page: 1,
    }
  },
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
  watch: {
    posts(newValue) {
       newValue.length > 0 &&  this.calculateCurrentTotal(this.current_page)
    }
  },
  methods: {
    ...mapActions(["fetchPosts"]),
    updatePage(page) {
        this.fetchPosts({page})
        this.current_page = page;
    },
    calculateCurrentTotal(page) {
      let lastPagesTotal = 0;
      for(let i=1;i<page;i++) {
        lastPagesTotal = lastPagesTotal + ( i * 24)
      }
      this.current_page_total = this.posts.length + lastPagesTotal;
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