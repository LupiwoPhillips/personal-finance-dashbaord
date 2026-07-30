<template>
  <div class="stat-card" :class="variant">
    <div class="stat-header">
      <h4>{{ title }}</h4>
    </div>

    <h2>{{ value }}</h2>

    <p class="subtitle">
      Updated just now
    </p>
  </div>
</template>

<script>
export default {
  name: "StatsCard",

  props: {
    title: String,
    value: [String, Number],
    variant: String,
  },
};
</script>

<style scoped>

/* ==========================
   CARD
========================== */

.stat-card{

    position:relative;

    overflow:hidden;

    flex:1;

    min-width:230px;

    padding:26px;

    border-radius:20px;

    color:white;

    border:1px solid rgba(255,255,255,.08);

    box-shadow:0 12px 30px rgba(0,0,0,.25);

    transition:.3s;

}

.stat-card:hover{

    transform:translateY(-6px);

    box-shadow:0 20px 40px rgba(0,0,0,.35);

}

/* Glow */

.stat-card::before{

    content:"";

    position:absolute;

    top:-70px;

    right:-70px;

    width:160px;

    height:160px;

    border-radius:50%;

    background:rgba(255,255,255,.08);

}

/* ==========================
   CONTENT
========================== */

.stat-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

h4{

    font-size:15px;

    font-weight:500;

    opacity:.9;

}

h2{

    font-size:2rem;

    margin-bottom:10px;

    font-weight:700;

}

.subtitle{

    color:rgba(255,255,255,.75);

    font-size:.9rem;

}

/* ==========================
   VARIANTS
========================== */

.green{

    background:linear-gradient(
        135deg,
        #16a34a,
        #22c55e
    );

}

.red{

    background:linear-gradient(
        135deg,
        #dc2626,
        #ef4444
    );

}

.blue{

    background:linear-gradient(
        135deg,
        #2563eb,
        #3b82f6
    );

}

.purple{

    background:linear-gradient(
        135deg,
        #7c3aed,
        #8b5cf6
    );

}

.gold{

    background:linear-gradient(
        135deg,
        #d97706,
        #fbbf24
    );

}

/* ==========================
   MOBILE
========================== */

@media(max-width:768px){

.stat-card{

    min-width:100%;

}

}

@media(max-width:600px){

.stat-card{

    width:100%;

    min-width:0;

}


.stat-card h2{

    font-size:1.6rem;

}

}
</style>