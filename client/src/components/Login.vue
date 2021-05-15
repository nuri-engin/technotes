<template>
        <!------------- Login Modal ---------------->
    <transition name="modal">
      <div v-if="showLoginModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div v-if="loginStep">
              <div class="modal-header">
                Login
              </div>

              <div class="modal-body">
                <b-form>
                  <b-form-group
                    id="input-group-1"
                    label-for="input-email"
                  >
                    <b-form-input
                      name="Email"
                      id="input-email"
                      @input="(value) => updateEmail(value)"
                      placeholder="Email"
                      required
                    ></b-form-input>

                  </b-form-group>
                  <b-form-group
                    id="input-group-1"
                    label-for="input-password"
                  >
                    <b-form-input
                      name="password"
                      id="input-password"
                      @input="(value) => updatePassword(value)"
                      placeholder="Password"
                      type="password"
                      required
                    ></b-form-input>
                  </b-form-group>
                  <div class="forgot-pass-wrapper">
                    <b-link class="link">I have forgot my password.</b-link>
                  </div>
                </b-form>
              </div>

              <div class="modal-footer">
                <b-button
                  class="modal-default-button login-btn"
                  @click="login()"
                >
                  Login
                </b-button>
                <div class="bottom-wrapper">
                  <b-form-checkbox
                      v-model="status"
                      name="rememberme-checkbox"
                      unchecked-value="not_accepted"
                      class="checkbox-label"
                    >
                     <span class="remember-me"> Remember me.</span>
                    </b-form-checkbox>
                    <b-link class="link" @click="goToRegister()">Not a member? Register</b-link>
                </div>
              </div>
            </div>
            <div v-if="registerStep">
               <div class="modal-header">
                Register
              </div>

              <div class="modal-body">
                <b-form>
                  <b-form-group
                    id="input-group-1"
                    label-for="input-username"
                  >
                    <b-form-input
                      name="username"
                      id="input-username"
                      @input="(value) => updateNewUsername(value)"
                      placeholder="User Name"
                      required
                    ></b-form-input>

                  </b-form-group>
                   <b-form-group
                    id="input-group-1"
                    label-for="input-email"
                  >
                    <b-form-input
                      name="Email"
                      id="input-email"
                      @input="(value) => updateNewUserEmail(value)"
                      placeholder="E-mail"
                      required
                    ></b-form-input>

                  </b-form-group>
                  <b-form-group
                    id="input-group-1"
                    label-for="input-password"
                  >
                    <b-form-input
                      name="password"
                      id="input-password"
                      @input="(value) => updateNewUserPassword(value)"
                      placeholder="Password"
                      type="password"
                      required
                    ></b-form-input>
                  </b-form-group>
                    <b-form-group
                    id="input-group-1"
                    label-for="input-confirm-password"
                  >
                    <b-form-input
                      name="password"
                      id="input-confirm-password"
                      @input="(value) => updateNewUserConfirmPassword(value)"
                      placeholder="Confirm Password"
                      type="password"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-form>
              </div>

              <div class="modal-footer">
                <b-button
                  class="modal-default-button register-btn"
                  @click="Register()"
                >
                  Register
                </b-button>
                <div>
                    <b-link class="link" @click="backToLogin()">
                        <b-icon icon="arrow-left"/>
                        Back to Login</b-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
import service from "@/service";
export default {
    name: 'Login',
    data() {
    return {
      showLoginModal:true,
      email: '',
      password: '',
      newUsername: '',
      newUserEmail: '',
      newUserPassword: '',
      newUserConfirmPassword: '',
      status: false,
      loginStep: true,
      registerStep: false
    }
  },
   mounted() {
    this.showLoginModal = true;
  },
  methods: {
    updateEmail(value) {
      this.email = value
    },
    updatePassword(value) {
      this.password = value
    },
    updateNewUsername(value) {
      this.newUsername = value
    },
    updateNewUserEmail(value) {
      this.newUserEmail = value
    },
    updateNewUserPassword(value) {
      this.newUserPassword = value
    },
    updateNewConfirmPassword(value) {
      this.newUserConfirmPassword = value
    },
    login() {
      service().post('accounts/authenticate', {
        email: this.email,
        password: this.password
      }).then(response => {
        if(response.status === 200) {
          localStorage.setItem('token', response.data.jwtToken)
          this.showLoginModal = !this.showLoginModal
          document.getElementById('app').classList.remove('blur'); 
        }
      })
    },
    goToRegister() {
      this.registerStep = true;
      this.loginStep = false;
    },
    backToLogin() {
      this.registerStep = false;
      this.loginStep = true;
    },
    register() {
      service().post('accounts/register', {
        username: this.newUsername,
        email: this.newUserEmail,
        password: this.newUserPassword,
        confirmPassword: this.newUserConfirmPassword,
      }).then((response) => {
        if(response.status === 200) {
          this.showLoginModal = !this.showLoginModal;
          document.getElementById('app').classList.remove('blur'); 
        }
      })
    }
  }
}
</script>

<style scoped>

.form-control,
.form-control:focus {
  background: transparent;
  border: none;
  border-bottom: 1px solid #8cadab;
  border-radius: 0px;
  margin-bottom: 40px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 420px;
  height: max-content;
  margin: 0px auto;
  padding: 4px 15px;
  background-color: #d5d9d2;
  border-radius: 6%;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
}

.modal-default-button {
  padding: 10px 30px;
  color: #3c6562;
  border: 1px solid #3c6562;
}

.modal-header {
  font-size: 30px;
  margin-top: 0;
  color: #3c6562;
  border: none;
  justify-content: center !important;
}

.link {
    text-decoration: none;
    color: #3c6562;
    font-size: 14px;
    opacity: 0.7
}

.modal-body {
  margin: 20px 0;
  border: none;
}

.modal-footer {
    display: flex;
    flex-direction: column;
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

.login-btn, .register-btn {
    background-color:transparent;
    border-radius: 15px;
    border: 1px solid #02252f;
    color: #02252f;
    font-size: 19px;
    padding: 5px 20px
}

.login-btn:hover, .register-btn:hover{
    background-color: #02252f
}

.remember-me{
    color: #3c6562;
    font-size: 13px;
}

.bottom-wrapper{
    margin-top: 30px
}

.forgot-pass-wrapper{
    text-align: right;
    margin-top: -36px;
    opacity: 0.6;
}
</style>