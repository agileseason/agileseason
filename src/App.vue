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
      'Roboto:300,400,500,600'
    ]);
  }
};
</script>

<style>
body {
  background-color: #E8EAF6;
  color: #212121;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding: 0;
}
</style>
