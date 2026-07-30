<template>
  <div class="auth-page">

    <div class="auth-left">
      <h1>FinanceOS</h1>

      <h2>Start building your financial future.</h2>

      <p>
        Create an account to track spending, build budgets,
        grow investments and receive AI-powered financial insights.
      </p>
    </div>

    <div class="auth-card">

      <h2>Create Account</h2>
      <p class="subtitle">Join FinanceOS today.</p>

      <form @submit.prevent="signup">

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
            placeholder="Create a password"
            required
          />
        </div>

        <button type="submit">
          Create Account
        </button>

      </form>

      <p class="bottom-text">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>

    </div>

  </div>
</template>


<script>
import { signup } from "../services/authService";
import { db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default {
  name: "Signup",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async signup() {
      try {
        const userCredential = await signup(this.email, this.password);

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,

          fullName: "",

          currency: "ZAR",

          country: "South Africa",

          monthlySalary: 0,

          payday: 25,

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),
        });

        console.log("✅ Profile Created");

        this.$router.push("/profile-setup");

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
  }
};
</script>

<style scoped>

.auth-page{
    min-height:100vh;
    display:grid;
    grid-template-columns:1fr 480px;
    background:#0F1117;
    color:#F8FAFC;
    font-family:Inter,sans-serif;
}

.auth-left{
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:80px;
}

.auth-left h1{
    color:#4ADE80;
    font-size:22px;
    font-weight:700;
    margin-bottom:40px;
}

.auth-left h2{
    font-size:54px;
    line-height:1.1;
    margin-bottom:20px;
}

.auth-left p{
    color:#94A3B8;
    font-size:18px;
    line-height:1.8;
    max-width:500px;
}

.auth-card{
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:60px;
    background:#181C24;
    box-shadow:-10px 0 40px rgba(0,0,0,.35);
}

.auth-card h2{
    font-size:32px;
    margin-bottom:10px;
}

.subtitle{
    color:#94A3B8;
    margin-bottom:40px;
}

form{
    display:flex;
    flex-direction:column;
}

.input-group{
    display:flex;
    flex-direction:column;
    margin-bottom:20px;
}

label{
    color:#CBD5E1;
    margin-bottom:8px;
    font-size:14px;
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

input::placeholder{
    color:#64748B;
}

input:focus{
    outline:none;
    border-color:#4ADE80;
    box-shadow:0 0 0 4px rgba(74,222,128,.15);
}

button{
    margin-top:10px;
    padding:15px;
    background:#4ADE80;
    color:#07110B;
    border:none;
    border-radius:12px;
    font-weight:700;
    font-size:15px;
    cursor:pointer;
    transition:.25s;
}

button:hover{
    background:#22C55E;
    transform:translateY(-2px);
}

.bottom-text{
    text-align:center;
    margin-top:30px;
    color:#94A3B8;
}

.bottom-text a{
    color:#4ADE80;
    text-decoration:none;
    font-weight:600;
}

.bottom-text a:hover{
    text-decoration:underline;
}

@media (max-width:900px){

.auth-page{
    grid-template-columns:1fr;
}

.auth-left{
    display:none;
}

.auth-card{
    min-height:100vh;
    justify-content:center;
}

}

</style>