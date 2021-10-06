// https://marked.js.org/using_advanced#options
const marked = require('marked');

const renderer = new marked.Renderer();

// https://marked.js.org/using_pro#renderer
renderer.list = (body, ordered) => {
  if (ordered) {
    return `<ol>${body}</ol>`;
  }

  if (/type="checkbox">/.test(body)) {
    return `<ul class='checkbox-list'>${body}</ul>`;
  }

  return `<ul>${body}</ul>`;
}
renderer.listitem = (text, task, checked) => {
  if (task) {
    const innerText = text.match(/>(.+)/)[1];
    if (checked) {
      return `
        <li style='list-style: none; margin-left: -2em;'>
          <label>
            <input
              checked type='checkbox'
              onchange='(${renderer.clickHandler})("${innerText}", true);'
            >
            ${innerText}
          </label>
        </li>`;
    } else {
      return `
        <li style='list-style: none; margin-left: -2em;'>
          <label>
            <input
              type='checkbox'
              onchange='(${renderer.clickHandler})("${innerText}", false);'
            >
            ${innerText}
          </label>
        </li>`;
    }
  }
  return `<li>${text}</li>`;
}

export default {
  render(text, repositoryFullName, clickHandler) {
    if (clickHandler) {
      renderer.clickHandler = clickHandler;
    }
    renderer.text = (text) => {
      // @aaa => <a href=...>@aaa</a>
      if (/@\w+/.test(text)) {
        text = text.replace(
          /@(\w+)/g,
          `<a href='https://github.com/$1' class='username'>@$1</a>`
        );
      }
      if (repositoryFullName && /#\d+/.test(text)) {
        // #nnn => <a href=...>nnn</a>
        text = text.replace(
          /#(\d+)/g,
          `<a href='https://github.com/${repositoryFullName}/issues/$1'>#$1</a>`
        );
      } else if (/https:\/\/github.com\/[/\w]+\/issues\/\d+/.test(text)) {
        // https://github.com/aaa/bbb/issues/nnn => <a href=...>aaa/bbb#nnn</a>
        text = text.replace(
          /(https:\/\/github.com\/([/\w]+)\/issues\/(\d+))/g,
          '<a href="$1">$2#$3</a>'
        );
      }

      return text;
    }

    return marked(text, {
      breaks: true,
      renderer
    });
  }
};
