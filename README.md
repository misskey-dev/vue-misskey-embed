# vue-misskey-embed

[![][mit-badge]][mit]

Misskey embeds library for Vue 3.

## installation

※Currently not published yet.

```shell
npm install @misskey-dev/vue-misskey-embed
```

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
