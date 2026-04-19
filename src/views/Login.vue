<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p>
      Don’t have an account?
      <router-link to="/signup">Sign Up</router-link>
    </p>
  </div>
  <div>
    <h3>Welcome to the future, where you already are</h3>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      // Fake login for now
      if (this.email && this.password) {
        localStorage.setItem("user", this.email);

        // ✅ Make sure navigation works
        this.$router.push("/dashboard");
      } else {
        alert("Please enter valid credentials");
      }
    }
  }
};
</script>

<style scoped>
.login {
  text-align: center;
}
.login form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.login input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.login button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.login button:hover {
  background-color: #276628;
}
.login p {
  margin-top: 10px;
}
.login a {
  color: #2e7d32;
  text-decoration: none;
}
.login a:hover {
  text-decoration: underline;
}
h3 {
  text-align: center;
  margin-top: 20px;
  color: #2e7d32;
}
h3:hover {
  color: #276628;
}
h3:active {
  color: #1b4d20;
}


</style>