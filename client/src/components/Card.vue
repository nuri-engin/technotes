<template>
  <div>
    <div class="techcard-wrapper">
      <div class="techcard-header">
        <div class="writer-data">
          <div class="writer-img">
            <img width="40" src="@/assets/images/no-image.png" />
          </div>
          <div class="writer-name-date">
            <span class="name">{{ post.name }}</span>
            <span class="date">{{ post.createdAt }}</span>
          </div>
        </div>
        <div class="more-dd">
          <b-dropdown class="more-dd-btn" no-caret>
            <template #button-content>
              <b-icon icon="three-dots-vertical" aria-hidden="true"></b-icon>
            </template>
            <b-dropdown-item-button @click="showEditModal = true"
              >Edit</b-dropdown-item-button
            >
            <b-dropdown-item-button @click="showDeleteModal = true"
              >Delete</b-dropdown-item-button
            >
          </b-dropdown>
        </div>
      </div>
      <div class="techcard-content">
        <div class="techcard-content-title">{{ post.title }}</div>
        <div class="techcard-content-text">
          {{ post.message }}
        </div>
      </div>
      <div class="techcard-tags">
        <span v-for="tag in post.tags[0].split(',')" :key="tag">
          #{{ tag }}
        </span>
      </div>
      <div class="techcard-actions">
        <div class="heart-icon"><b-icon icon="suit-heart" scale="1" /></div>
        <div class="comment-icon">
          <b-button @click="openCommentModal()">
            <b-icon icon="chat-left-fill" />
          </b-button>
        </div>
      </div>
    </div>
    <!-------- Edit Modal --------------->
    <transition name="modal">
      <div v-if="showEditModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header" style="border: 0">
              <b-icon
                class="close-icon"
                icon="x"
                scale="2"
                @click="showEditModal = false"
              />
              <b-form>
                <b-form-input
                  class="title-modal"
                  v-if="descEditMode"
                  name="title"
                  id="input-1"
                  @input="(value) => updateTitle(value)"
                  required
                  v-model="postTitle"
                ></b-form-input>
                <span v-else>
                  <span v-if="!commentMode">{{ post.title }}</span>
                  <span v-else><b-icon icon="chat-left-fill" />Comments</span>
                </span>
              </b-form>
            </div>

            <div v-if="!commentMode" class="modal-body">
              <b-form>
                <div style="display: flex" class="label">
                  <div>Description</div>
                  <br />
                  <b-button
                    v-if="!descEditMode"
                    @click="descEditMode = !descEditMode"
                    >Edit</b-button
                  >
                </div>
                <b-form-textarea
                  class="description-input"
                  v-if="descEditMode"
                  id="input-2"
                  name="description"
                  placeholder="Add more details ..."
                  @input="(value) => updateDescription(value)"
                  v-model="postDescription"
                  rows="4"
                  max-rows="6"
                ></b-form-textarea>
                <span v-else>{{ post.description }}</span>
                <div v-if="descEditMode" class="edit-save-close">
                  <b-button class="edit-close" @click="descEditMode = !descEditMode">X</b-button>
                  <b-button class="edit-save" @click="updateDesc()">Save</b-button>
                </div>

                <br />

                <div style="display: flex" class="tags">
                  <div>Tags</div>
                  <b-button
                    v-if="!tagsEditMode"
                    @click="tagsEditMode = !tagsEditMode"
                    >Edit</b-button
                  >
                  <b-button v-else @click="tagsEditMode = !tagsEditMode"
                    >Save</b-button
                  >
                </div>
                <b-form-input
                  v-if="tagsEditMode"
                  name="tags"
                  id="input-3"
                  @input="(value) => updateTags(value)"
                  required
                  v-model="postTags"
                  style="margin-bottom: 0px"
                ></b-form-input>
                <span v-else>{{ post.tags.join(",") }}</span>
              </b-form>
            </div>

            <div v-else>
              <div class="comments-header">
                <b-form class="comments-form">
                  <div class="writer-img">
                    <img width="40" src="@/assets/images/no-image.png" />
                  </div>
                  <b-form-input
                    name="comment"
                    id="input-comment"
                    @input="(value) => updateComment(value)"
                    placeholder="text..."
                    required
                  ></b-form-input>
                </b-form>
              </div>
              <b-button @click="sendComment()"> Send </b-button>
              <div class="comments-content">
                <div v-for="(comment, index) in comments" :key="index">
                  {{ comment.message }}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <b-button
                class="modal-default-button"
                @click="checkEditCommentStatus()"
              >
                <div v-if="commentMode">- Description</div>
                <div v-else>Comments ></div>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!---------- Delete Modal -------------->
    <transition name="modal">
      <div v-if="showDeleteModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="delete-modal-container">
            <div class="delete-modal-header">
              <b-icon
                class="close-icon"
                icon=""
                scale="2"
                @click="showDeleteModal = false"
              />
              Delete
            </div>

            <div class="delete-modal-body">
              <span> Are you sure to delete this card? </span>
            </div>

            <div class="modal-footer" style="border: 0">
              <b-button id="delete-modal-default-button" @click="deletePost()">
                Yes
              </b-button>
              <b-button
                id="delete-modal-default-button"
                @click="showDeleteModal = false"
              >
                No
              </b-button>
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
  name: "Card",
  props: ["post"],
  data() {
    return {
      showEditModal: false,
      postTitle: this.post.title,
      postDescription: this.post.message,
      postTags: this.post.tags.join(","),
      descEditMode: false,
      tagsEditMode: false,
      comments: [],
      commentMode: false,
      newComment: "",
      showDeleteModal: false,
    };
  },
  computed: {
    ...mapGetters(["currUser"]),
  },
  methods: {
    ...mapActions(["fetchPosts"]),
    updateDesc() {
      this.descEditMode = false;
      let { id } = this.post;
      service()
        .put(`posts/${id}`, {
          title: this.postTitle,
          message: this.postDescription,
          tags: this.postTags.split(","),
          name: this.currUser.userName,
          creator: this.currUser.id,
        })
        .then((res) => {
          if (res.status === 200) {
            this.fetchPosts();
          }
        });
    },
    deletePost() {
      let { id } = this.post;
      service()
        .delete(`posts/${id}`)
        .then((res) => {
          if (res.status === 200) {
            this.fetchPosts();
            console.log(res);
          }
        });
    },
    async fetchComments() {
      try {
        const { data } = await service().get(`comments/${this.post.id}`);
        this.comments = data;
      } catch (e) {
        console.error(e.message);
      }
    },
    sendComment() {
      if (this.newComment !== "") {
        service()
          .post(`comments/`, {
            postmessage_id: this.post.id,
            message: this.newComment,
            creator: this.currUser.id,
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
            }
          });
      }
    },
    openCommentModal() {
      this.showEditModal = true;
      this.checkEditCommentStatus();
    },
    checkEditCommentStatus() {
      this.commentMode = !this.commentMode;
      if (this.commentMode) {
        this.fetchComments();
      }
    },
    updateComment(value) {
      this.newComment = value;
    },
  },
};
</script>

<style>
.description-input{
  overflow-y: hidden !important;
  height: 180px !important;
  background: #f3fcf0 !important;
  border: 1px solid #3c6562 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.techcard-wrapper {
  border-radius: 15px;
  background-color: #f3fcf0;
  color: #02252f;
  width: 260px;
  height: 320px;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  margin: 10px;
}

.techcard-header {
  z-index: 0;
  height: 60px;
  padding: 5px;
  padding-left: 25px;
  background-color: #3c6562;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  position: relative;
}

.more-dd {
  position: absolute;
  right: 15px;
  top: 10px;
}

.more-dd-btn > .btn-secondary,
.more-dd-btn > .btn-secondary:hover,
.more-dd-btn > .btn-secondary:focus,
.more-dd-btn > .btn-secondary:active {
  background-color: transparent;
  border: none;
  color: black;
  font-size: 18px;
}

.writer-img {
  margin-top: 6px;
}

.writer-data {
  display: flex;
}

.writer-name-date {
  display: flex;
  flex-direction: column;
  margin-top: 7px;
  margin-left: 6px;
}

.name {
  font-size: 14px;
  font-weight: bold;
  color: #bef992;
}

.date {
  font-size: 12px;
}

.techcard-content {
  height: 190px;
  padding: 15px 20px;
  overflow-y: scroll;
}

.techcard-content-title {
  font-weight: bold;
}

.techcard-content-text {
  margin-top: 6px;
}

.techcard-tags {
  background-color: #3c6562;
  vertical-align: middle;
  padding: 5px;
  opacity: 0.5;
  height: 32px;
  font-size: 14px;
}

.techcard-actions {
  background-color: #3c6562;
  height: 40px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 10px;
  display: flex;
}

.heart-icon {
  font-weight: bold;
  margin-left: 5px;
  margin-right: 15px;
  cursor: pointer;
}

.comment-icon {
  position: relative;
  cursor: pointer;
}

.comment-icon > button {
  padding: 0px;
  color: #02252f !important;
  border: none !important;
  font-size: 13px;
}

.comment-icon:after {
  position: absolute;
  content: "";
  width: 8px;
  background-color: #bef992;
  height: 8px;
  border-radius: 5px;
  right: -2px;
}

.comments-form {
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
  width: 34%;
  height: max-content;
  margin: 0px auto;
  padding: 15px;
  background-color: #d6e5db;
  border-radius: 10px;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

.modal-default-button {
  color: #3c6562 !important;
  border: 0 !important;
  background: #d6e5db !important;
  margin-bottom: -15px !important;
}

.modal-header {
  font-size: 18px;
  margin-top: 0;
  color: #3c6562;
  position: relative;
  border: 0;
  font-weight: bold;
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
  border-radius: 10px;
  background: #e3e4e2;
}

label {
  color: #3c6562 !important;
}

.close-icon {
  position: absolute;
  right: 8px;
  top: 8px;
  cursor: pointer;
}

.edit-save-close{
  float: right;
  margin-top: -35px;
}

.edit-close{
  background: #d6e5db !important;
  border: 0 !important;
  margin-right: 9px;
  color: #3c6562 !important;
}

.edit-save{
  border-radius: 5px !important;
  width: 75px;
  height: 32px;
  border: 1px solid #3c6562 !important;
  background: #d6e5db !important;
  color: #3c6562 !important;
  margin-right: 9px;
  padding: 5px !important;
}
.title-modal{
  border-radius: 8px !important;
  background: #f3fcf0 !important;
  border: 1px solid #3c6562 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  width: 350px !important;
}

.modal-body {
  margin: -25px 0;
  border: none;
}

.modal-footer {
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

.delete-modal-container {
  width: 32%;
  height: max-content;
  margin: 0px auto;
  padding: 25px;
  background-color: #cdd9d1;
  border-radius: 3px;
  color: #3c6562;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

.delete-modal-header {
  font-size: 18px;
  margin-top: 0;
  padding-bottom: 5px;
  color: #3c6562;
  position: relative;
  border: none;
  font-weight: bold;
}

.delete-modal-body {
  margin: 15px 10px;
  border: none;
  margin-bottom: 7px;
}

#delete-modal-default-button {
  color: #3c6562;
  background: #cdd9d1;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: -20px;
  padding: 1%;
  width: 75px;
  margin-right: 10px;
}

#delete-modal-default-button {
  float: right;
}
</style>
