# vue-misskey-embed

[![][mit-badge]][mit]

Misskey embeds library for Vue 3.

## installation

※Currently not published yet.

```shell
npm install @misskey-dev/vue-misskey-embed
```

## ⚠️ Security Warning

This library dynamically loads and executes JavaScript (`embed.js`) from the domain specified in the `url` or `domain` prop.

**Please exercise caution when using this library in applications where users can freely input URLs.**
If a malicious domain is specified, it could lead to arbitrary JavaScript execution (XSS).

Recommended mitigation strategies:

- **Validate input**: Ensure that the input URL is valid and points to a trusted instance before passing it to the component.
- **Debounce input**: When binding to real-time user input, use debounce to prevent unintended requests to incomplete or malicious domains during typing.

## Usage

Use Note embed in your component.

```vue
<script lang="ts" setup>
import { Note } from 'vue-misskey-embed';
</script>
<template>
  <!-- You can use note url -->
  <Note url="https://misskey.example.com/notes/9x8zezlzpd" />

  <!-- You can also use domain and noteId -->
  <Note domain="misskey.example.com" note-id="9x8zezlzpd" />
</template>
```

## License

[MIT](LICENSE)

[mit]: http://opensource.org/licenses/MIT
[mit-badge]: https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
