<script setup lang="ts">
import { computed } from 'vue';
import { generateEmbedId } from '@/utils/generateEmbedId';

type CommonProps = {
  border?: boolean;
  rounded?: boolean;
  colorScheme?: 'auto' | 'light' | 'dark';
  loading?: 'eager' | 'lazy';
};

const props = withDefaults(
  defineProps<
    | (CommonProps & {
        domain: string;
        noteId: string;
      })
    | (CommonProps & {
        url: string;
      })
  >(),
  {
    border: true,
    rounded: true,
    colorScheme: 'auto',
    loading: 'eager',
  },
);

const embedId = generateEmbedId();

const getInfoFromUrl = () => {
  if (!('url' in props) || !URL.canParse(props.url)) {
    return { domain: '', noteId: '' };
  }
  const urlObj = new URL(props.url);
  return {
    domain: urlObj.hostname,
    noteId: urlObj.pathname.split('/').pop() ?? '',
  };
};

const noteUrl = computed(() => {
  let domain = '';
  let noteId = '';
  if ('url' in props && props.url != null) {
    const { domain: d, noteId: n } = getInfoFromUrl();
    domain = d;
    noteId = n;
  } else if ('domain' in props && 'noteId' in props) {
    domain = props.domain;
    noteId = props.noteId;
  }
  return `https://${domain}/embed/notes/${noteId}?border=${props.border}&rounded=${props.rounded}`;
});

const scriptUrl = computed(() => {
  let domain = '';
  if ('url' in props && props.url != null) {
    domain = getInfoFromUrl().domain;
  } else if ('domain' in props) {
    domain = props.domain;
  }
  return `https://${domain}/embed.js`;
});

const colorScheme = computed(() => {
  return props.colorScheme === 'auto' ? 'light dark' : props.colorScheme;
});
</script>
<template>
  <iframe
    :src="noteUrl"
    :style="`border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: ${colorScheme};`"
    :data-misskey-embed-id="embedId"
    :loading="loading"
  ></iframe>
  <component :is="'script'" :src="scriptUrl" defer></component>
</template>
