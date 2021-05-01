<template>
  <div class="navbar-wrapper">
    <div class="navbar-left-side">
      <div class="navbar-title">Tech Notes</div>
      <div class="navbar-left-buttons">
        <b-button class="btn">+ Note</b-button>
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
      <div class="logout-btn-wrapper"><b-button class="logout-btn">Logout</b-button></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar-wrapper {
  margin-top: 30px;
  padding: 3px 30px;
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

.logout-btn{
    border-color:#bef992;
    color: #bef992;
    z-index: 100;
    border-radius: 10px;
    padding: 2px 15px;
    background: #02252f;
}

.user{
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

.user img{
    position: absolute;
    left: -64px;
    top: -15px;
}
</style>
