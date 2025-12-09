<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
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
        /**
         * userId (not username like aidx, aid or other ids)
         */
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
const resolvedInfo = ref<{ domain: string; userId: string }>({ domain: '', userId: '' });

const getInfoFromUrl = async () => {
  if (!('url' in props) || !URL.canParse(props.url)) {
    return { domain: '', userId: '' };
  }
  const urlObj = new URL(props.url);
  const username = (urlObj.pathname.split('/').pop() ?? '@').slice(1);
  const res = await fetch('https://' + urlObj.hostname + '/api/users/show', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username }),
  });
  const userInfo = await res.json();
  if (userInfo?.id == null) {
    return { domain: '', userId: '' };
  }
  return {
    domain: urlObj.hostname,
    userId: userInfo.id,
  };
};

watchEffect(async () => {
  if ('url' in props && props.url != null) {
    resolvedInfo.value = await getInfoFromUrl();
  } else if ('domain' in props && 'userId' in props) {
    resolvedInfo.value = { domain: props.domain, userId: props.userId };
  }
});

const tinelineUrl = computed(() => {
  const { domain, userId } = resolvedInfo.value;
  if (!domain || !userId) return undefined;
  return `https://${domain}/embed/user-timeline/${userId}?header=${props.header}&autoload=${props.autoload}&maxHeight=${props.maxHeight}&border=${props.border}&rounded=${props.rounded}`;
});

const scriptUrl = computed(() => {
  const { domain } = resolvedInfo.value;
  if (!domain) return undefined;
  return `https://${domain}/embed.js`;
});

const colorScheme = computed(() => {
  return props.colorScheme === 'auto' ? 'light dark' : props.colorScheme;
});
</script>
<template>
  <iframe
    v-if="tinelineUrl"
    :src="tinelineUrl"
    :style="`border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: ${colorScheme};`"
    :data-misskey-embed-id="embedId"
    :loading="loading"
  ></iframe>
  <component :is="'script'" v-if="scriptUrl" :src="scriptUrl" defer></component>
</template>
