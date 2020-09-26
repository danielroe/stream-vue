<h1 align="center">🟢 stream-vue</h1>
<p align="center">Vue component for Cloudflare Stream</p>

<p align="center">
<a href="https://npmjs.com/package/stream-vue">
    <img alt="" src="https://img.shields.io/npm/v/stream-vue/latest.svg?style=flat-square">
</a>
<a href="https://bundlephobia.com/result?p=stream-vue">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/stream-vue?style=flat-square">
</a>
<a href="https://npmjs.com/package/stream-vue">
    <img alt="" src="https://img.shields.io/npm/dt/stream-vue.svg?style=flat-square">
</a>
<a href="https://lgtm.com/projects/g/danielroe/stream-vue">
    <img alt="" src="https://img.shields.io/lgtm/alerts/github/danielroe/stream-vue?style=flat-square">
</a>
<a href="https://lgtm.com/projects/g/danielroe/stream-vue">
    <img alt="" src="https://img.shields.io/lgtm/grade/javascript/github/danielroe/stream-vue?style=flat-square">
</a>
<a href="https://david-dm.org/danielroe/stream-vue">
    <img alt="" src="https://img.shields.io/david/danielroe/stream-vue.svg?style=flat-square">
</a>
</p>

> Vue component for [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/).

**Note that this is not an official component.**

## Features

- Vetur autocomplete for props and events

## Quick Start

First install `stream-vue`:

```bash
yarn add stream-vue

# or npm

npm install stream-vue --save
```

## Usage

```vue
<template>
  <VideoStream controls src="YOUR_VIDEO_ID_OR_SIGNED_URL">
</template>

<script>
import VideoStream from "stream-vue"

export default {
  components: { VideoStream }
}
</script>
```

See [@cloudflare/stream-react](https://github.com/@cloudflare/stream-react) for more props and events.

## Inspirations

This is just a Vue fork of [@cloudflare/stream-react](https://github.com/@cloudflare/stream-react).

## Contributors

This has been developed to suit my needs but additional use cases and contributions are very welcome.

## License

[MIT License](./LICENSE) - Copyright &copy; Daniel Roe
