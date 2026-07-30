<template>
  <div class="profile-setup">
    <h1>Welcome 👋</h1>
    <p>Let's personalize your FinanceOS experience.</p>

    <form @submit.prevent="saveProfile">

      <input
        v-model="fullName"
        type="text"
        placeholder="Full Name"
        required
      />

      <input
        v-model.number="monthlySalary"
        type="number"
        placeholder="Monthly Salary"
      />

      <input
        v-model.number="payday"
        type="number"
        min="1"
        max="31"
        placeholder="Payday"
      />

      <select v-model="currency">
        <option value="ZAR">South African Rand (ZAR)</option>
      </select>

      <select v-model="country">
        <option value="South Africa">South Africa</option>
      </select>

      <button type="submit">
        Continue
      </button>

    </form>
  </div>
</template>

<script>
import { auth, db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      fullName: "",
      monthlySalary: 0,
      payday: 25,
      currency: "ZAR",
      country: "South Africa",
    };
  },

  methods: {
    async saveProfile() {
      try {
        const user = auth.currentUser;

        await updateDoc(doc(db, "users", user.uid), {
          fullName: this.fullName,
          monthlySalary: this.monthlySalary,
          payday: this.payday,
          currency: this.currency,
          country: this.country,
        });

        this.$router.push("/dashboard");

      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>