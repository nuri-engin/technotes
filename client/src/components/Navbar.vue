<template>
  <div>
    <div class="navbar-wrapper">
      <div class="navbar-left-side">
        <div class="navbar-title">Tech Notes</div>
        <div class="navbar-left-buttons">
          <b-button class="btn" @click="toggleNewNoteModal()">+ Note</b-button>
          <b-button class="btn">filter</b-button>
        </div>
      </div>
      <div class="navbar-right-side">
        <div class="user">
          <div class="user-img">
            <img width="60" src="@/assets/images/no-image.png" />
          </div>
          <div>
            <span>Username</span>
          </div>
        </div>
        <div class="logout-btn-wrapper">
          <b-button class="logout-btn">Logout</b-button>
        </div>
      </div>
    </div>
    <!--------------------- New Note Modal --------------------------->
    <transition name="modal">
      <div v-if="showNewNoteModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <b-icon class="close-icon" icon="x" scale="2" @click="showNewNoteModal = false"/>
                Modal Header
            </div>

            <div class="modal-body">
                Modal Body
            </div>

            <div class="modal-footer">
                <b-button class="modal-default-button" @click="showNewNoteModal = false">
                  Close
                </b-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      showNewNoteModal: false
    }
  },
  methods: {
    toggleNewNoteModal() {
      this.showNewNoteModal = !this.showNewNoteModal
    }
  }
};
</script>

<style scoped>
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
  width: 50%;
  height: 30%;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
    position: relative;
}

.modal-default-button {
  color: #02252f;
}

.modal-header {
  margin-top: 0;
  color: black;
  position: relative;
}

.close-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.modal-body {
  margin: 20px 0;
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
