<script setup lang="ts">
import { computed } from 'vue';
import { generateEmbedId } from '@/utils/generateEmbedId';

type CommonProps = {
  header?: boolean;
  autoload?: boolean;
  maxHeight?: number;
  rounded?: boolean;
  border?: boolean;
  colorScheme?: 'auto' | 'light' | 'dark';
  loading?: 'eager' | 'lazy';
};

const props = withDefaults(
  defineProps<
    | (CommonProps & {
        domain: string;
        userId: string;
      })
    | (CommonProps & {
        url: string;
      })
  >(),
  {
    header: true,
    autoload: false,
    maxHeight: 700,
    border: true,
    rounded: true,
    colorScheme: 'auto',
    loading: 'eager',
  },
);

const embedId = generateEmbedId();

const getInfoFromUrl = () => {
  if (!('url' in props) || !URL.canParse(props.url)) {
    return { domain: '', userId: '' };
  }
  const urlObj = new URL(props.url);
  return {
    domain: urlObj.hostname,
    userId: (urlObj.pathname.split('/').pop() ?? '@').slice(1),
  };
};

const tinelineUrl = computed(() => {
  let domain = '';
  let userId = '';
  if ('url' in props && props.url != null) {
    const { domain: d, userId: u } = getInfoFromUrl();
    domain = d;
    userId = u;
  } else if ('domain' in props && 'userId' in props) {
    domain = props.domain;
    userId = props.userId;
  }
  return `https://${domain}/embed/user-timeline/${userId}?header=${props.header}&autoload=${props.autoload}&maxHeight=${props.maxHeight}&border=${props.border}&rounded=${props.rounded}`;
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
    :src="tinelineUrl"
    :style="`border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: ${colorScheme};`"
    :data-misskey-embed-id="embedId"
    :loading="loading"
  ></iframe>
  <component :is="'script'" :src="scriptUrl" defer></component>
</template>
