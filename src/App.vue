<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view/>
  <div class="footerdiv text-secondary position-absolute start-0 w-100 p-3">
    <span style="font-size: 13px">
    Designed & Developed by Maks@DevTeam <br/> 2022 © MAKS.</span>
  </div>
</template>

<script>
import "./components/scss/app.scss"

export default {
    name: 'App',
    props: {
    }
}
</script>

