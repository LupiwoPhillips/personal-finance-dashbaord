<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Take Control of Your Finances</h1>
      <p>Track expenses, set budgets, and grow your wealth with ease.</p>
      <div class="cta-buttons">
        <router-link to="/signup" class="btn btn-primary">Get Started</router-link>
        <router-link to="/login" class="btn btn-secondary">Login</router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="feature">
        <h3>💸 Track Expenses</h3>
        <p>Stay on top of your spending habits with detailed reports.</p>
      </div>
      <div class="feature">
        <h3>📊 Budget Planning</h3>
        <p>Create budgets, set goals, and achieve financial freedom.</p>
      </div>
      <div class="feature">
        <h3>📈 Investments</h3>
        <p>Monitor your assets and grow your portfolio with insights.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
/* Global Layout */
.home {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  padding: 0;
  margin: 0;
  background: linear-gradient(to bottom right, #f0f4ff, #eafaf1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Hero Section */
.hero {
  padding: 100px 20px;
  background: linear-gradient(135deg, #4CAF50, #2e7d32);
  color: white;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 12px 25px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
}

.btn-primary {
  background: white;
  color: #2e7d32;
  border: 2px solid white;
}

.btn-primary:hover {
  background: #2e7d32;
  color: white;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #2e7d32;
}

/* Features Section */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 60px 20px;
}

.feature {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-8px);
}

.feature h3 {
  margin-bottom: 15px;
  font-size: 1.4rem;
  color: #2e7d32;
}
</style>