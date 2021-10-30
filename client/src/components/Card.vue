<template>
  <div style="z-index: 1 !important">
    <div class="techcard-wrapper">
      <div class="techcard-header">
        <div class="writer-data">
          <div class="writer-img">
            <img width="40" src="@/assets/images/no-image.png" />
          </div>
          <div class="writer-name-date">
            <span class="name">{{ post.creatorName }}</span>
            <span class="date">{{ setDateTimeFormat(post.createdAt) }}</span>
          </div>
        </div>
        <div v-if="post.creatorId === currUser.id" class="more-dd">
          <b-dropdown
            size="sm"
            variant="link"
            toggle-class="text-decoration-none"
            class="more-dd-btn more-menu"
            no-caret
          >
            <template #button-content>
              <b-icon icon="three-dots-vertical" aria-hidden="true"></b-icon>
            </template>
            <b-dropdown-item-button
              style="width: 100px; left: -78px"
              @click="showEditModal = true"
              >Edit</b-dropdown-item-button
            >
            <b-dropdown-item-button
              style="width: 100px; left: -78px"
              @click="showDeleteModal = true"
              >Delete</b-dropdown-item-button
            >
          </b-dropdown>
        </div>
      </div>
      <div class="techcard-content">
        <div class="techcard-content-title">{{ post.title }}</div>
        <div :id="`post-${post.id}`" :refs="`post-${post.id}`" class="techcard-content-text">
        </div>
      </div>
      <div class="techcard-footer">
        <div v-if="post.tags.length > 0" class="techcard-tags">
          <span v-for="(tag, index) in post.tags" :key="index">
            #{{ tag.trim() }}
          </span>
        </div>
        <div class="techcard-actions">
          <div class="techcard-like-comment">
              <div class="heart-icon"><b-icon icon="suit-heart" scale="1" /></div>
              <div class="comment-icon">
                <b-button @click="openCommentModal()">
                  <b-icon icon="chat-left-fill" />
                </b-button>
              </div>
          </div>
          <div v-if="post.category" class="category-label">{{post.category}}</div>
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
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    word-break: break-all;
                  "
                  class="label"
                >
                  <div v-if="!descEditMode">{{ post.message }}</div>
                  <b-button
                    v-if="!descEditMode"
                    @click="descEditMode = !descEditMode"
                    style="width: 70px"
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
                  <b-button
                    class="edit-close"
                    @click="descEditMode = !descEditMode"
                    >X</b-button
                  >
                  <b-button class="edit-save" @click="updateDesc()"
                    >Save</b-button
                  >
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
                    :value="newComment"
                    id="input-comment"
                    @input="(value) => updateComment(value)"
                    placeholder="text..."
                    required
                  >
                  </b-form-input>
                  <b-button
                    @click="sendComment()"
                    :disabled="newComment === ''"
                  >
                    <b-icon icon="cursor-fill"></b-icon>
                  </b-button>
                </b-form>
              </div>
              <div class="comments-content">
                <div v-if="!commentsLoaded" class="spinner-container">
                  <b-spinner variant="secondary"></b-spinner>
                  <div class="loading-text">Loading comments</div>
                </div>
                <div v-else v-for="(comment, index) in comments" :key="index">
                  <div class="comment-wrapper">
                    <div
                      class="
                        comment-header
                        d-flex
                        justify-content-start
                        align-items-center
                      "
                    >
                      <span class="comment-line"></span>
                      <span class="comment-time">{{
                        setTimeFormat(comment.createdAt)
                      }}</span>
                    </div>
                    <div class="comment-content d-flex flex-column my-2 mb-3">
                      <div class="comment-user-name">
                        @{{ comment.creator_name }}
                      </div>
                      <div class="comment-msg">
                        {{ comment.message }}
                        <div class="comment-action d-flex justify-content-end">
                          <div
                            class="comment-delete-action"
                            @click="deleteComment(comment.id)"
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="post.creatorId === currUser.id" class="modal-footer">
              <b-button
                class="modal-default-button"
                @click="checkEditCommentStatus()"
              >
                <div v-if="commentMode">Description</div>
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
                id="delete-modal-default-button-2"
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
import { linkify } from "@/utils/linkify.js";
import {setDateTimeFormat, setTimeFormat} from "@/utils/date.js"
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
      commentsLoaded: false,
    };
  },
  mounted() {
    // insert clickable content for posts
    document.getElementById(`post-${this.post.id}`).innerHTML =  linkify(this.post.message)
  },
  computed: {
    ...mapGetters(["currUser"]),
  },
  methods: {
    ...mapActions(["fetchPosts"]),
    setDateTimeFormat,
    setTimeFormat,
    updateDesc() {
      this.descEditMode = false;
      let { id } = this.post;
      service()
        .put(`posts/${id}`, {
          title: this.postTitle,
          message: this.postDescription,
          tags: this.postTags.split(","),
          creatorId: this.currUser.id,
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
            this.showDeleteModal = false;
          }
        });
    },
    async fetchComments() {
      try {
        const { data } = await service().get(`comments/post/${this.post.id}`);
        this.comments = data;
        this.commentsLoaded = true;
      } catch (e) {
        console.error(e.message);
      }
    },
    sendComment() {
      this.commentsLoaded = false;
      if (this.newComment !== "") {
        service()
          .post(`comments/`, {
            postmessage_id: this.post.id,
            message: this.newComment,
            creator_id: this.currUser.id,
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              this.fetchComments();
              this.newComment = "";
            }
          });
      }
    },
    deleteComment(commentId) {
      this.commentsLoaded = false;
      service()
        .delete(`comments/${commentId}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            this.fetchComments();
          }
        });
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
    }
  },
};
</script>

<style scoped>
body {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-family: "Quicksand-light", Helvetica, Arial !important;
}

.description-input {
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
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  z-index: 1;
  margin: 10px;
  transition-property: width, height;
  transition-duration: 1s;
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

.techcard-footer {
}

.more-dd {
  font-family: "Quicksand", Helvetica, Arial !important;
  position: absolute;
  right: 15px;
  top: 10px;
  z-index: 10;
}

.more-dd-btn svg {
  color: black !important;
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

/deep/ .dropdown-menu {
  left: -65px !important;
  min-width: 1rem !important;
  box-shadow: -5px 6px 10px -7px rgb(0 0 0 / 49%);
}

.writer-img {
  margin-top: 6px;
}

.writer-data {
  display: flex;
}
.writer-name-date {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-size: 19px !important;
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

  word-break: break-word;
}

.techcard-content-title {
  font-weight: bold;
}

.link {
  margin-top: 6px;
}

.techcard-tags {
  background-color: #5c7a79;
  vertical-align: middle;
  padding: 5px;
  opacity: 1;
  height: 32px;
  font-size: 14px;

  overflow-y: scroll;
  white-space: nowrap;
}

.techcard-actions {
  background-color: #3c6562;
  height: 40px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.techcard-like-comment {
  display: flex;
}

.category-label {
  font-size: 12px;
  background-color:#bef992;
  padding: 0px 10px;
  border-radius: 100px;
  border:1px solid #3b4547;
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

  background-color: transparent !important;

  font-size: 13px;
  background-color: transparent;
}

/* .comment-icon:after {
  position: absolute;
  content: "";
  width: 8px;
  background-color: #bef992;
  height: 8px;
  border-radius: 5px;
  right: -2px;
} */

.comments-form {
  position: relative;
  display: flex;
  height: 48px;
  max-height: 48px;
}

.comments-form .form-control {
  width: 90%;
  margin-bottom: 0px;
  height: 48px;
}

.comments-form button {
  position: absolute;
  border: none !important;
  right: 15px;
  bottom: 5px;
}

.comments-content {
  max-height: 280px;
  overflow-y: scroll;
  word-break: break-all;
  margin-top: 30px;
  padding: 0px 15px;
}

.comments-content .loading-text {
  font-weight: normal !important;
  font-size: 13px;
}

.comments-content .spinner-container .spinner-border {
  width: 2rem;
  height: 2rem;
}

.comment-wrapper {
  display: flex;
  flex-direction: column;
}

.comment-line {
  width: 50%;
  height: 1px;
  box-sizing: border-box;
  background-color: #bbbbbb;
}

.comment-time {
  margin-left: 5px;
  font-size: 12px;
  color: #7d7474;
}

.comment-user-name {
  font-size: 14px;
  font-weight: 200;
}

.comment-content {
  font-size: 13px;
}

.comment-msg {
  position: relative;
  padding: 8px;
  border: 1px solid #bbbbbb;
  border-radius: 10px;
  width: max-content;
}

.comment-delete-action {
  cursor: pointer;
  position: absolute;
  right: 7px;
  top: 35px;
  text-decoration: underline;
  font-size: 10px;
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
  font-family: "Quicksand-light", Helvetica, Arial, sans-serif;
  position: relative;
}

@media (max-width: 600px) {
  .modal-container {
    width: 90%;
  }
}

@media (min-width: 600px) and (max-width: 1400px) {
  .modal-container {
    width: 65%;
  }
}

.modal-default-button {
  color: #3c6562 !important;
  border: 0 !important;
  background: #d6e5db !important;
  margin-bottom: -15px !important;
}

.modal-header {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-size: 18px;
  margin-top: 0;
  color: #3c6562;
  position: relative;
  border: 0;
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

.edit-save-close {
  float: right;
  margin-top: -35px;
}

.edit-close {
  background: #d6e5db !important;
  border: 0 !important;
  margin-right: 9px;
  color: #3c6562 !important;
}

.edit-save {
  border-radius: 5px !important;
  width: 75px;
  height: 32px;
  border: 1px solid #3c6562 !important;
  background: #d6e5db !important;
  color: #3c6562 !important;
  margin-right: 9px;
  padding: 5px !important;
}
.title-modal {
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
  font-family: "Quicksand", Helvetica, Arial !important;
  border: none;
  text-align: center;
  justify-content: flex-start;
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
  font-family: "Quicksand-light", Helvetica, Arial, sans-serif;
  position: relative;
  text-align: center;
}

@media (max-width: 600px) {
  .delete-modal-container {
    width: 90%;
  }
}

@media (min-width: 600px) and (max-width: 1400px) {
  .delete-modal-container {
    width: 65%;
  }
}

.delete-modal-header {
  font-family: "Quicksand", Helvetica, Arial !important;
  font-size: 22px;
  margin-top: 0;
  padding-bottom: 5px;
  color: #3c6562;
  position: relative;
  border: none;
  font-weight: bold;
  z-index: 10;
}

.delete-modal-body {
  margin: 15px 10px;
  border: none;
  margin-bottom: 7px;
}
#delete-modal-default-button-2 {
  color: #3c6562;
  background: #cdd9d1;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: -20px;
  padding: 1%;
  width: 75px;
  margin-left: 15px;
}

#delete-modal-default-button {
  color: #3c6562;
  background: #cdd9d1;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: -20px;
  padding: 1%;
  width: 75px;
  margin-left: 33%;
}

#delete-modal-default-button {
  float: right !important;
}
</style>
