const marked = require('marked');
const renderer = new marked.Renderer();
// https://marked.js.org/using_pro#renderer
renderer.list = (body, ordered) => {
  if (ordered) {
    return `<ol>${body}</ol>`;
  }

  if (/type="checkbox">/.test(body)) {
    // console.log(body);
    return `<ul class='checkbox-list'>${body}</ul>`;
  }

  return `<ul>${body}</ul>`;
}
renderer.listitem = (text, task, checked) => {
  if (task) {
    if (checked) {
      return `<li class='checked'>${text}</li>`;
    } else {
      return `<li>${text}</li>`;
    }
  }
  return `<li>${text}</li>`;
}
// const walkTokens = (token) => {
//   if (token.type === 'list_item' && token.task) {
//     console.log(token);
//   }
// };

export default {
  render(text) {
    return marked(text, {
      breaks: true,
      // walkTokens
      renderer
    });
  }
};
