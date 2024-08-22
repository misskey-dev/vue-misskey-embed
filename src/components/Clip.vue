<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
        clipId: string;
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
const frame = ref<HTMLIFrameElement | null>(null);

const emit = defineEmits<{
  message: any;
}>();

const getInfoFromUrl = () => {
  if (!('url' in props) || !URL.canParse(props.url)) {
    return { domain: '', clipId: '' };
  }
  const urlObj = new URL(props.url);
  return {
    domain: urlObj.hostname,
    clipId: urlObj.pathname.split('/').pop() ?? '',
  };
};

const clipUrl = computed(() => {
  let domain = '';
  let clipId = '';
  if ('url' in props && props.url != null) {
    const { domain: d, clipId: c } = getInfoFromUrl();
    domain = d;
    clipId = c;
  } else if ('domain' in props && 'clipId' in props) {
    domain = props.domain;
    clipId = props.clipId;
  }
  return `https://${domain}/embed/clips/${clipId}?header=${props.header}&autoload=${props.autoload}&maxHeight=${props.maxHeight}&border=${props.border}&rounded=${props.rounded}`;
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

onMounted(() => {
  if (frame.value != null) {
    frame.value.addEventListener('message', (e) => {
      emit('message', e);
    });
  }
});
</script>
<template>
  <iframe
    :src="clipUrl"
    :style="`border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: ${colorScheme};`"
    :data-misskey-embed-id="embedId"
    :loading="loading"
  ></iframe>
  <component :is="'script'" :src="scriptUrl" defer></component>
</template>
