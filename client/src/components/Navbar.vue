<template>
  <div>
    <div class="navbar-wrapper">
      <div class="navbar-left-side">
        <div class="navbar-title">Tech Notes</div>
        <div class="navbar-left-buttons">
          <b-button class="btn" @click="toggleNewNoteModal()">+ Note</b-button>
        </div>
      </div>
      <div class="navbar-right-side">
        <div class="user">
          <div class="user-img">
            <img width="60" src="@/assets/images/no-image.png" />
          </div>
          <div>
            <span>{{ username }}</span>
          </div>
        </div>
        <div class="logout-btn-wrapper">
          <b-button @click="logoutUser()" class="logout-btn">Logout</b-button>
        </div>
      </div>
    </div>
    <!--------------------- New Note Modal --------------------------->
    <transition name="modal">
      <div v-if="showNewNoteModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <b-icon
                class="close-icon"
                icon="x"
                scale="2"
                @click="showNewNoteModal = false"
              />
              New Note
            </div>

            <div class="modal-body">
              <b-form>
                <b-form-group
                  id="input-group-1"
                  label="Title *"
                  label-for="input-1"
                >
                  <b-form-input
                    name="title"
                    id="input-1"
                    @input="(value) => updateTitle(value)"
                    required
                    style="
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
                      background: #f3fcf0;
                      border-radius: 5px;
                    "
                  ></b-form-input>
                  <div v-if="displayError" class="error-content">
                    <b-icon
                      icon="exclamation-circle"
                      aria-hidden="true"
                    ></b-icon>
                    Required
                  </div>
                </b-form-group>

                <b-form-group
                  id="input-group-2"
                  label="Description"
                  label-for="input-2"
                >
                  <b-form-textarea
                    id="input-2"
                    name="description"
                    placeholder="Add more details ..."
                    @input="(value) => updateDescription(value)"
                    rows="4"
                    max-rows="6"
                    style="
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
                      background: #f3fcf0;
                      border-radius: 5px;
                      height: 160px;
                      overflow: hidden;
                      overflow-y: scroll;
                    "
                  ></b-form-textarea>
                </b-form-group>

                <div class="form-group">
                  <span>Category</span>
                  <div class="category-options-wrapper">
                    <v-select
                      class="category-options"
                      v-model="selected_category"
                      label="value"
                      :options="categories"
                    >
                    </v-select>
                    <b-button
                      class="modal-default-button add-category-button"
                      style="border-radius: 8px"
                      size="sm"
                      @click="showCategoriesModal = true"
                    >
                      <b-icon icon="table" />
                      Categories
                    </b-button>
                  </div>
                </div>

                <b-form-group
                  id="input-group-3"
                  label="Tags"
                  label-for="input-3"
                >
                  <b-form-input
                    name="tags"
                    id="input-3"
                    @input="(value) => updateTags(value)"
                    required
                    style="
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
                      margin-bottom: 0px;
                      background: #f3fcf0;
                      border-radius: 5px;
                    "
                  ></b-form-input>
                  <span style="opacity: 0.4; font-size: 12px; margin-top: 0px"
                    >(Please use comma to separate the tags)</span
                  >
                </b-form-group>
              </b-form>
            </div>

            <div class="modal-footer">
              <b-button
                class="modal-default-button"
                @click="generateNote()"
                style="border-radius: 8px"
              >
                Create
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!--------------------- Categories Modal --------------------------->
    <transition name="modal">
      <div v-if="showCategoriesModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <b-icon
                class="close-icon"
                icon="x"
                scale="2"
                @click="showCategoriesModal = false"
              />
              Categories
            </div>

            <div class="modal-body categories-modal">
              <b-form
                style="display: flex; align-items: center; margin-top: 20px"
              >
                <b-form-group
                  id="input-group-1"
                  label="New Category Name"
                  label-for="input-8"
                >
                  <b-form-input
                    name="category_name"
                    v-model="new_category_name"
                    id="input-8"
                    @input="(value) => newCategoryName(value)"
                    required
                    style="
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
                      background: #f3fcf0;
                      border-radius: 5px;
                    "
                  ></b-form-input>
                </b-form-group>
                <b-button
                  size="sm"
                  class="add-category-button"
                  @click="AddCategory"
                  >Add</b-button
                >
              </b-form>
              <div class="categories-table">
              <b-table
                hover
                :items="categories"
                :busy="isBusy"
                :fields="['id', 'value', 'actions']"
              >
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(id)="data">
                  <span style="font-size: 13px">{{ data.value }}</span>
                </template>
                <template #cell(value)="data">
                  <span style="font-weight: bold">{{ data.value }}</span>
                </template>
                <template #cell(actions)="data">
                  <b-button
                    size="sm"
                    class="btn-delete-category"
                    variant="danger"
                    @click="deleteCategory(data.item.id)"
                    >Delete</b-button
                  >
                </template>
              </b-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import service from "@/service";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",
  props: ["logout", "username"],
  data() {
    return {
      showNewNoteModal: false,
      showCategoriesModal: false,
      title: "",
      description: "",
      tags: [],
      new_category_name: "",
      displayError: false,
      selected_category: "",
      isBusy: false,
    };
  },
  computed: {
    ...mapGetters(["currUser", "categories"]),
  },
  methods: {
    ...mapActions(["fetchPosts", "fetchCategories"]),
    logoutUser() {
      this.logout();
    },
    updateTitle(value) {
      this.title = value;
    },
    updateDescription(value) {
      this.description = value;
    },
    updateTags(value) {
      this.tags = value && value.split(",");
    },
    newCategoryName(value) {
      this.new_category_name = value;
    },
    toggleNewNoteModal() {
      this.displayError = false;
      this.showNewNoteModal = !this.showNewNoteModal;
      this.fetchCategories()
    },
    generateNote() {
      if ([this.title, this.description].includes("")) {
        this.displayError = true;
      } else {
        this.displayError = false;
        service()
          .post("posts", {
            title: this.title,
            message: this.description,
            tags: this.tags,
            creatorId: this.currUser.id,
            category: this.selected_category.value || '',
          })
          .then((res) => {
            if (res.status === 200) {
              this.showNewNoteModal = false;
              this.fetchPosts();
              this.selected_category= '';
            }
          });
      }
    },
    AddCategory() {
      this.isBusy = true;
      if (this.new_category_name !== "") {
        service()
          .post("posts/categories", {
            value: this.new_category_name,
          })
          .then((res) => {
            if (res.status === 200) {
              this.new_category_name = "";
              this.fetchCategories();
              this.isBusy = false;
            }
          });
      }
    },
    deleteCategory(id) {
      this.isBusy = true;
      service()
        .delete(`posts/categories/${id}`)
        .then((res) => {
          if (res.status === 200) {
            this.fetchCategories();
            this.isBusy = false;
          }
        });
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-family: "Quicksand-light", Helvetica, Arial !important;
}
.navbar-wrapper {
  margin-top: 30px;
  padding: 2px 30px;
  background-color: #3c6562;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.navbar-left-side {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.navbar-right-side {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.navbar-left-buttons {
  padding-top: 2px;
  margin-left: 25px;
}

.btn {
  background: transparent;
  border-color: white;
  margin-left: 10px;
  padding: 0 15px;
}

.btn:hover {
  background: #bef992;
}

.btn-delete-category {
  color: #fff;
  background: #c82333;
  border: none;
}

.btn-delete-category:hover {
  background: #e74a5a;
  box-shadow: 3px 3px 4px #c82333;
}

.navbar-title {
  font-weight: 200;
  font-size: 20px;
}

.logout-btn {
  border-color: #bef992;
  color: #bef992;
  z-index: 100;
  border-radius: 10px;
  padding: 2px 15px;
  background: #02252f;
}

.user {
  color: #bef992;
  margin-right: 40px;
  padding-bottom: 4px;
  display: flex;
  position: relative;
  width: 150px;
}

.user-img {
  position: relative;
}

.user img {
  position: absolute;
  left: -64px;
  top: -15px;
}

.error-content {
  color: red;

  position: absolute;
  top: 80px;
  right: 10px;
  font-size: 14px;
}

.category-error-content {
  color: red;
  font-size: 14px;
  margin-left: 15px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 31%;
  height: max-content;
  margin: 0px auto;
  padding: 10px;
  background-color: #cdd9d1;
  border-radius: 10px;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: "Quicksand-light", Helvetica, Arial, sans-serif !important;
  position: relative;
}

.category-options-wrapper {
  display: flex;
  align-items: center;
  border-bottom: none !important;
  margin-bottom: 40px;
}

.category-options-wrapper .v-select {
  width: 50%;
}

.category-options {
  box-shadow: rgb(0 0 0 / 33%) 0px 2px 8px !important;
  background: rgb(243, 252, 240) !important;
  border-radius: 5px !important;
}

@media (max-width: 600px) {
  .modal-container {
    width: 90%;
  }
}

@media screen and (max-width: 720px) {
  .navbar-wrapper {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
  }

  .navbar-left-side,
  .navbar-right-side {
    width: 100%;
    justify-content: space-between;
  }

  .navbar-right-side {
    margin: 10px;
  }

  .navbar-left-side {
    margin: 15px 0px;
  }

  .user {
    margin-left: 50px;
  }

  .user-img img {
    width: 45px;
  }
}

@media (min-width: 600px) and (max-width: 1400px) {
  .modal-container {
    width: 65%;
  }
}

.modal-default-button {
  padding: 10px 30px;
  color: #3c6562;
  border: 1px solid #3c6562;
}

.add-category-button {
  padding: 6px 8px;
  height: 37px;
}

.modal-header {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-size: 24px;
  margin-top: 0;
  color: #3c6562;
  position: relative;
  border: none;
  font-weight: bold;
  z-index: 10;
}

.form-control,
.form-control:focus {
  background: transparent;
  border: none;
  border-bottom: 1px solid #8cadab;
  border-radius: 0px;
  margin-bottom: 40px;
}

textarea.form-control,
textarea.form-control:focus {
  border: 1px solid #8cadab;
  border-radius: 5px;
  background: #e3e4e2;
}

label {
  color: #3c6562 !important;
}

.close-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.modal-body {
  font-size: 17px;
  margin: -30px 0;
  border: none;
}

.categories-modal {
  min-height: 600px;
  overflow-y: scroll;
}

.categories-modal .add-category-button {
  background-color:#3c6562 ;
}

.categories-table{
  max-height: 400px;
  overflow-y: scroll;
}

.categories-modal .form-group {
  width: 50% !important;
}

.categories-modal .form-control {
  margin-top: 15px;
}

.modal-footer {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-size: 18px;
  border: none;
  text-align: center;
  justify-content: center;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
