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
      'Roboto:300,400,500',
      'Roboto Mono:300',
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

.markdown-body pre {
  background-color: #e8eaf6;
  border-radius: 6px;
  overflow-x: auto;
  padding: 8px 12px;
}

.markdown-body code {
  background-color: #e8eaf6;
  border-radius: 4px;
  padding: 1px 4px;
}

.markdown-body pre code {
  padding: 0;
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body table th {
  background-color: #e8eaf6;
  color: #283593;
  font-weight: 500;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #c5cae9;
}

.markdown-body table tr:nth-child(2n) {
  background-color: rgba(232, 234, 246, 0.5);
}

.markdown-body a {
  color: #2196f3;
}
.markdown-body a:hover {
  text-decoration: underline
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

.markdown-body li.task-item {
  list-style: none;
  margin-left: -2em;
  cursor: pointer;
}

.markdown-body li.task-item label {
  cursor: pointer;
  display: flex;
  margin-bottom: 2px;
}

.markdown-body li.task-item label:hover {
  background-color: #F5F5F5;
  border-radius: 2px;
}

.markdown-body li.task-item label > input {
  margin-right: 6px;
}
.markdown-body li.task-item label > code {
  margin: 0 4px;
  padding: 0 4px;
}

.markdown-body li.task-item > ul {
  margin-left: 16px;
  width: 100%;
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

.note h1, h2, h3, h4, h5 {
  margin-top: 6px;
}
</style>
