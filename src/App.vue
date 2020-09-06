<template>
  <div id='app'>
    <router-view/>
  </div>
</template>

<script>
import loadFonts from '@/utils/font_loader';

export default {
  name: 'App',
  created() {
    loadFonts([
      'Roboto:400,500,600'
    ]);
  }
};
</script>

<style>
#app {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
body {
  padding: 0;
  margin: 0;
  background-color: #E8EAF6;
}
</style>
