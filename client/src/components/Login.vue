<template>
        <!------------- Login Modal ---------------->
    <transition name="modal">
      <div v-if="showLoginModal  || !loggedIn" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div v-if="loginStep" class="modal-inner-container">
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
                    <b-link @click="goToForgotPass()" class="link">I have forgot my password.</b-link>
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
            <div v-if="forgotPassStep" class=modal-inner-container>
               <div class="modal-header">
                Forgot Password
              </div>

              <div class="modal-body">
                <div class="forgot-pass-content">
                  <span>
                    Dont worry! Just enter your email address. and we
                    will send you a link to rest your password.
                  </span>
                </div>
                <b-form>
                  <b-form-group
                    id="input-group-1"
                    label-for="input-email"
                  >
                    <b-form-input
                      name="Email"
                      id="input-email"
                      @input="(value) => updateForgotPassEmail(value)"
                      placeholder="Email"
                      required
                    ></b-form-input>

                  </b-form-group>
                </b-form>
              </div>

              <div class="modal-footer">
                <b-button
                  class="modal-default-button login-btn"
                  @click="sendPassword()"
                >
                  Send
                </b-button>
                <div class="bottom-wrapper">
                    <b-link class="link" @click="backToLogin()">
                          <b-icon icon="arrow-left"/>
                          Back to Login
                    </b-link>
                </div>
              </div>
            </div>
            <div v-if="loginError" class="modal-inner-container msg-modal">
              <div class="error-icon-wrapper">
                <b-icon class="error-icon" icon="exclamation-circle"/>
              </div>
              <div class="error-content">
                <div class="error-title">Oops !<br/></div>
                <div class="error-message">
                  We can not find an account with this e-mail. <br/>
                  Please try again or create a new account.
                </div>
              </div>
              <div class="create-new-acc-btn-wrapper">
                <b-button @click="goToRegister()" class="create-new-acc-btn">Create New Account</b-button>
              </div>
            </div>
            <div v-if="registerSuccess" class="modal-inner-container msg-modal">
               <div class="success-icon-wrapper">
                <b-icon class="success-icon" icon="exclamation-circle"/>
              </div>
              <div class="success-content">
                <div class="success-title">Good Job !<br/></div>
                <div class="success-message">
                  You have been successfully registered.<br/>
                  Please check your e-mail, then press continue.
                </div>
              </div>
              <div class="continue-btn-wrapper">
                <b-button @click="loginRegisteredUser()" class="continue-btn">Continue</b-button>
              </div>
            </div>
            <div v-if="registerStep" class="modal-inner-container">
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
                      @input="(value) => updateNewConfirmPassword(value)"
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
                  @click="register()"
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
import service from "@/service"
import { mapActions, mapGetters } from 'vuex'

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
      forgotPassEmail: '',
      status: false,
      loginStep: true,
      registerStep: false,
      loginError: false,
      registerSuccess:false,
      forgotPassStep: false,
    }
  },
  computed: {
    ...mapGetters(['loggedIn'])
  },
   mounted() {
      if(this.loggedIn || localStorage.getItem('token')){
          this.showLoginModal = false;
    } else {
          this.showLoginModal = true;
    }
  },
  methods: {
    ...mapActions(['loginUser']),
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
    updateForgotPassEmail(value) {
      this.forgotPassEmail = value
    },
    sendPassword() {
      service().post('accounts/forgot-password', {
        email: this.forgotPassEmail
      }).then(res => {
        if(res.status === 200) {
          this.forgotPassStep = false;
          this.loginStep = true;
        }
      })
    },
    login() {
      this.loginUser({email: this.email, password: this.password}).then(res => {
        if(res.status === 200) {
          this.showLoginModal = false
        }
        if(res.response.status === 400){
          this.showLoginModal = true
          this.loginStep= false;
          this.loginError = true;
        }
      });
    },
    goToRegister() {
      this.loginError=false;
      this.registerStep = true;
      this.loginStep = false;
    },
    backToLogin() {
      this.forgotPassStep=false;
      this.registerStep = false;
      this.loginStep = true;
    },
    goToForgotPass() {
      this.loginStep=false;
      this.forgotPassStep=true;
    },
    closeModal() {
      this.showLoginModal = false;
      document.getElementById('app').classList.remove('blur'); 
    },
    register() {
      service().post('accounts/register', {
        userName: this.newUsername,
        email: this.newUserEmail,
        password: this.newUserPassword,
        confirmPassword: this.newUserConfirmPassword,
      }).then((response) => {
        if(response.status === 200) {
          this.registerStep = false;
          this.registerSuccess = true;
        }
      })
    },
    loginRegisteredUser() {
        this.showLoginModal = !this.showLoginModal;
        document.getElementById('app').classList.remove('blur'); 
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
  margin-bottom: 25px;
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
  height: 460px;
  margin: 0px auto;
  padding: 4px 15px;
  background-color: #d5d9d2;
  border-radius: 6%;
  color: black;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  position: relative;
}

.msg-modal {
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
  vertical-align: middle;
}

.modal-inner-container{
  height: 100%;
  display: flex;
  flex-direction: column;
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
    border: 2px solid #02252f;
    color: #02252f;
    font-size: 19px;
    padding: 5px 20px;
}

.login-btn {
    margin-bottom:20px;
}

.login-btn:hover, .register-btn:hover{
    background-color: #02252f
}

.remember-me{
    color: #3c6562;
    font-size: 14px;
    margin-left: 8px;
}

.bottom-wrapper{
    margin-top: 30px
}

.forgot-pass-wrapper{
    text-align: right;
    margin-top: -20px;
    opacity: 0.6;
}

.error-icon, .success-icon{
  font-size: 75px;
  color: #d5d9d2;
  background-color: #CB4E44;
  border-radius: 50%;
}

.success-icon {
  background-color: #6DB478
}

.error-content, .success-content{
  margin-top: -20px;
  text-align: center;
}

.error-title, .success-title{
  font-size:25px;
  text-align:center;
}
.error-message, .success-message{
  margin-top: 20px;
  font-size: 16px;
  font-weight: 200;
}

.create-new-acc-btn, .continue-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  border-bottom-left-radius: 27px;
  border-bottom-right-radius: 27px;
  background-color: #CB4E44;
  border-color: #CB4E44;
  font-size: 19px;
  padding: 20px 0px;
}

.continue-btn{
  background-color: #6DB478;
  border-color: #6DB478;
}

.forgot-pass-content{
  text-align: center;
  font-weight: 200;
  padding: 20px 0px;
  margin-bottom: 30px;
}
</style>