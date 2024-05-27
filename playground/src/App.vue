<script setup lang="ts">
// https://github.com/cloudflare/stream-react/blob/master/example/src/index.tsx

import { VideoStream } from 'stream-vue'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const videostream = ref<InstanceType<typeof VideoStream> | null>(null)
function setTime() {
  if (videostream.value?.streamRef) {
    videostream.value.streamRef.currentTime = 30
  }
}
function play() {
  videostream.value?.streamRef?.play()
}

const configuration = useLocalStorage('stream-state', {
  autoplay: [true, { type: 'checkbox' }],
  muted: [true, { type: 'checkbox' }],
  loop: [true, { type: 'checkbox' }],
  controls: [true, { type: 'checkbox' }],
  responsive: [true, { type: 'checkbox' }],
  volume: [1, { type: 'range', min: 0, max: 1, step: 0.01 }],
  playbackRate: [1, { type: 'range', min: 0.25, max: 2, step: 0.25 }],
} as const)
</script>

<template>
  <div>
    <VideoStream
      ref="videostream"
      src="4bcf13d23290043d9efb344b56200ebd"
      :muted="configuration.muted[0]"
      :loop="configuration.loop[0]"
      :controls="configuration.controls[0]"
      :responsive="configuration.responsive[0]"
      :autoplay="configuration.autoplay[0]"
      :volume="configuration.volume[0]"
      :playback-rate="configuration.playbackRate[0]"
    />
    <div>
      <label v-for="item, key in configuration" :key="key" :style="{ display: 'inline-block', border: '1px solid', padding: '4px 8px' }">
        {{ key }}
        <input v-model="item[0]" v-bind="item[1]">
      </label>
    </div>
    <button @click="setTime">
      seek to 30s
    </button>
    <button @click="play">
      play
    </button>
  </div>
</template>
