<template>
  <div class="auth-page">

    <div class="auth-left">
      <h1>FinanceOS</h1>

      <h2>Your money.<br>Your future.</h2>

      <p>
        Track spending, manage budgets, monitor investments,
        and receive AI-powered financial insights.
      </p>
    </div>

    <div class="auth-card">

      <h2>Welcome Back</h2>
      <p class="subtitle">Sign in to continue.</p>

      <form @submit.prevent="login">

        <div class="input-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button class="login-btn">
          Login
        </button>

      </form>

      <p class="bottom-text">
        Don't have an account?

        <router-link to="/signup">
          Create one
        </router-link>

      </p>

    </div>

  </div>
</template>

<script>
import { login } from "../services/authService";

export default {

  name: "Login",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async login() {
      try {

        await login(this.email, this.password);

        this.$router.push("/dashboard");

      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style scoped>

.auth-page{

    min-height:100vh;

    display:grid;

    grid-template-columns:1fr 480px;

    background:#0f1117;

    color:white;
}

.auth-left{

    display:flex;

    flex-direction:column;

    justify-content:center;

    padding:80px;
}

.auth-left h1{

    color:#4ADE80;

    font-size:20px;

    margin-bottom:40px;
}

.auth-left h2{

    font-size:56px;

    line-height:1.1;

    margin-bottom:20px;
}

.auth-left p{

    color:#94A3B8;

    font-size:18px;

    max-width:500px;

    line-height:1.8;
}

.auth-card{

    background:#181C24;

    display:flex;

    flex-direction:column;

    justify-content:center;

    padding:60px;

    box-shadow:-10px 0 40px rgba(0,0,0,.25);
}

.auth-card h2{

    font-size:32px;

    margin-bottom:10px;
}

.subtitle{

    color:#94A3B8;

    margin-bottom:40px;
}

.input-group{

    display:flex;

    flex-direction:column;

    margin-bottom:20px;
}

label{

    margin-bottom:8px;

    color:#CBD5E1;
}

input{

    background:#0F172A;

    border:1px solid #334155;

    color:white;

    padding:15px;

    border-radius:12px;

    font-size:15px;

    transition:.25s;
}

input:focus{

    outline:none;

    border-color:#4ADE80;

    box-shadow:0 0 0 4px rgba(74,222,128,.15);
}

.login-btn{

    width:100%;

    margin-top:15px;

    padding:15px;

    border:none;

    border-radius:12px;

    background:#4ADE80;

    color:#07110B;

    font-weight:700;

    cursor:pointer;

    transition:.25s;
}

.login-btn:hover{

    background:#22C55E;

    transform:translateY(-2px);
}

.bottom-text{

    margin-top:30px;

    text-align:center;

    color:#94A3B8;
}

.bottom-text a{

    color:#4ADE80;

    text-decoration:none;

    font-weight:600;
}

</style>