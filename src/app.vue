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
      'Roboto:300,400,500'
    ]);
  }
};
</script>

<style>
body {
  background-color: #e8eaf6;
  color: #212121;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding: 0;
}

input, textarea {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

a {
  text-decoration: none;
}

.markdown-body {
  font-size: 14px;
  line-height: 18px;
}

.markdown-body h1,
.markdown-body h2 {
  padding-bottom: .3em;
  border-bottom: 1px solid #e8eaf6;
}

.markdown-body blockquote {
  border-left: .25em solid #9fa8da;
  color: #757575;
  margin: 0;
  padding: 0 1em;
}

.markdown-body a {
  color: #2196f3;
}

.markdown-body a.username {
  color: #212121;
  font-weight: 500;
}

.markdown-body a.username:hover {
  text-decoration: underline
}

.markdown-body p {
  margin: 0 0 16px 0;
}

.markdown-body img {
  max-width: 100%;
}

.markdown-body ul,
.markdown-body ol {
  margin: 0 0 16px 0;
  padding-left: 2em;
}

.markdown-body ul.checkbox-list {
  list-style: none;
  padding-left: 0;
}

.markdown-body ul.checkbox-list > li > ul {
  padding-left: 2em;
}

.markdown-body>:last-child {
  margin-bottom: 0 !important
}

.markdown-body ol ol,
.markdown-body ol ul,
.markdown-body ul ol,
.markdown-body ul ul {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
