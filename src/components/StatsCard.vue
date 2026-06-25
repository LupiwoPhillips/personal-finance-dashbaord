<template>
  <div class="stat-card" :class="variant">
    <h4>{{ title }}</h4>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: ["title", "value", "variant"],
};
</script>

<style scoped>
.stat-card {
  padding: 24px;
  border-radius: 18px;
  color: white;
  min-width: 200px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.green {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.red {
  background: linear-gradient(135deg, #f85032, #e73827);
}

.blue {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}
</style>