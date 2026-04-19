<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    signup() {
      // fake signup for now
      localStorage.setItem("user", this.email);
      this.$router.push("/dashboard");
    }
  }
}
</script>

<style scoped>
.signup {
  text-align: center;
}
.signup form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.signup input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.signup button {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.signup button:hover {
  background-color: #276628;
}
.signup p {
  margin-top: 10px;
}
.signup a {
  color: #2e7d32;
  text-decoration: none;
}
.signup a:hover {
  text-decoration: underline;
}

</style>