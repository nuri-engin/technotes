<template>
  <div class="techcard-wrapper">
    <div class="techcard-header">
      <div class="writer-data">
        <div class="writer-img">
          <img width="40" src="@/assets/images/no-image.png" />
        </div>
        <div class="writer-name-date">
          <span class="name">{{post.name}}</span>
          <span class="date">{{post.createdAt}}</span>
        </div>
      </div>
      <div class="more-dd">
        <b-dropdown class="more-dd-btn" no-caret>
          <template #button-content>
            <b-icon icon="three-dots-vertical" aria-hidden="true"></b-icon>
          </template>
          <b-dropdown-item-button>Edit</b-dropdown-item-button>
          <b-dropdown-item-button>Delete</b-dropdown-item-button>
        </b-dropdown>
      </div>
    </div>
    <div class="techcard-content">
      <div class="techcard-content-title">{{post.title}}</div>
      <div class="techcard-content-text">
        {{post.message}}
      </div>
    </div>
    <div class="techcard-tags">
      <span v-for="tag in post.tags[0].split(',')" :key="tag">
        #{{tag}}
      </span>
    </div>
    <div class="techcard-actions">
      <div class="heart-icon"><b-icon icon="suit-heart" scale="1" /></div>
      <div class="comment-icon"><b-icon icon="chat-left-fill" /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ['post'],
};
</script>

<style>
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

.comment-icon:after {
  position: absolute;
  content: "";
  width: 8px;
  background-color: #bef992;
  height: 8px;
  border-radius: 5px;
  right: -2px;
}
</style>
