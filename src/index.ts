import { defineComponent, h, onMounted, ref, watch } from 'vue'

const scriptLocation
  = 'https://embed.videodelivery.net/embed/r4xu.fla9.latest.js'

export type HTMLStreamElement = HTMLVideoElement

declare global {
  interface Window {
    __stream?: {
      init: () => void
      initElement: (streamElement: HTMLStreamElement) => void
    }
  }
}

export type Events =
  /**
   * Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.
   */
  | 'abort'
  /**
   * Sent when enough data is available that the media can be played, at least for a couple of frames.
   */
  | 'canplay'
  /**
   * Sent when the entire media can be played without interruption, assuming the download rate remains at least at the current level. It will also be fired when playback is toggled between paused and playing. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.
   */
  | 'canplaythrough'
  /**
   * The metadata has loaded or changed, indicating a change in duration of the media. This is sent, for example, when the media has loaded enough that the duration is known.
   */
  | 'durationchange'
  /**
   * Sent when playback completes.
   */
  | 'ended'
  /**
   * Sent when an error occurs. (e.g. the video has not finished encoding yet, or the video fails to load due to an incorrect signed URL)
   */
  | 'error'
  /**
   * The first frame of the media has finished loading.
   */
  | 'loadeddata'
  /**
   * The media’s metadata has finished loading; all attributes now contain as much useful information as they’re going to.
   */
  | 'loadedmetadata'
  /**
   * Sent when loading of the media begins.
   */
  | 'loadstart'
  /**
   * Sent when the playback state is changed to paused (paused property is true).
   */
  | 'pause'
  /**
   * Sent when the playback state is no longer paused, as a result of the play method, or the autoplay attribute.
   */
  | 'play'
  /**
   * Sent when the media has enough data to start playing, after the play event, but also when recovering from being stalled, when looping media restarts, and after seeked, if it was playing before seeking.
   */
  | 'playing'
  /**
   * Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element’s buffered attribute.
   */
  | 'progress'
  /**
   * Sent when the playback speed changes.
   */
  | 'ratechange'
  /**
   * Sent when a seek operation completes.
   */
  | 'seeked'
  /**
   * Sent when a seek operation begins.
   */
  | 'seeking'
  /**
   * Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
   */
  | 'stalled'
  /**
   * Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
   */
  | 'suspend'
  /**
   * The time indicated by the element’s currentTime attribute has changed.
   */
  | 'timeupdate'
  /**
   * Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
   */
  | 'volumechange'
  /**
   * Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
   */
  | 'waiting'
  /**
   * Fires when ad-url attribute is present and the ad begins playback
   */
  | 'stream-adstart'
  /**
   * Fires when ad-url attribute is present and the ad finishes playback
   */
  | 'stream-adend'
  /**
   * Fires when ad-url attribute is present and the ad took too long to load.
   */
  | 'stream-adtimeout'

export const VideoStream = defineComponent({
  name: 'VideoStream',
  props: {
    /**
     * Tells the browser to immediately start downloading the video and play it as soon as it can. Note that mobile browsers generally do not support this attribute, the user must tap the screen to begin video playback. Please consider mobile users or users with Internet usage limits as some users don’t have unlimited Internet access before using this attribute.
     *
     * To disable video autoplay, the autoplay attribute needs to be removed altogether as this attribute. Setting autoplay="false" will not work; the video will autoplay if the attribute is there in the <stream> tag.
     *
     * In addition, some browsers now prevent videos with audio from playing automatically. You may add the mute attribute to allow your videos to autoplay. For more information, [go here](https://webkit.org/blog/6784/new-video-policies-for-ios/).
     *
     * @default false
     */
    autoplay: { type: Boolean, default: false },
    /**
     * Shows the default video controls such as buttons for play/pause, volume controls. You may choose to build buttons and controls that work with the player.
     *
     * @default false
     */
    controls: { type: Boolean, default: false },
    /**
     * Returns the current playback time in seconds. Setting this value seeks the video to a new time.
     *
     * @default 0
     */
    currentTime: { type: [String, Number], default: 0 },
    /**
     * The height of the video’s display area, in CSS pixels.
     */
    height: { type: [String, Number] },
    /**
     * The width of the video’s display area, in CSS pixels.
     */
    width: { type: [String, Number] },
    /**
     * A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced.
     *
     * @default false
     */
    muted: { type: Boolean, default: false },
    /**
     * A Boolean attribute; if included the player will automatically seek back to the start upon reaching the end of the video.
     *
     * @default false
     */
    loop: { type: Boolean, default: false },
    /**
     * This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. You may choose to include this attribute as a boolean attribute without a value, or you may specify the value preload="auto" to preload the beginning of the video. Not including the attribute or using preload="metadata" will just load the metadata needed to start video playback when requested.
     *
     * The <video> element does not force the browser to follow the value of this attribute; it is a mere hint. Even though the preload="none" option is a valid HTML5 attribute, Stream player will always load some metadata to initialize the player. The amount of data loaded in this case is negligable.
     */
    preload: {
      type: [String, Boolean] as unknown as () =>
        | 'auto'
        | 'metadata'
        | 'none'
        | boolean,
    },
    /**
     * Sets volume from 0.0 (silent) to 1.0 (maximum value)
     *
     * @default 1
     */
    volume: { type: [String, Number], default: 1 },
  },
  inheritAttrs: false,
  setup(props) {
    const streamScript = ref<HTMLScriptElement | null>(null)
    const streamRef = ref<HTMLStreamElement | null>(null)

    const updateableProps = ['autoplay', 'controls', 'currentTime', 'muted', 'loop', 'volume', 'preload'] as const

    function updateProp(key: typeof updateableProps[number], value: unknown) {
      if (!streamRef.value) {
        return
      }

      // @ts-expect-error type any is not assignable to type never
      streamRef.value[key] = value as any
    }

    for (const key of updateableProps) {
      watch(() => props[key], val => updateProp(key, val))
    }

    onMounted(() => {
      streamScript.value ||= document.querySelector<HTMLScriptElement>(`script[src="${scriptLocation}"]`)

      if (!streamScript.value) {
        const scriptEl = document.createElement('script')
        scriptEl.setAttribute('data-cfasync', 'false')
        scriptEl.setAttribute('defer', 'true')
        scriptEl.setAttribute('type', 'text/javascript')
        scriptEl.setAttribute('src', scriptLocation)
        document.head.appendChild(scriptEl)

        streamScript.value = scriptEl
      }

      if (window.__stream && streamRef.value) {
        window.__stream.initElement(streamRef.value)
      }
    })

    return { streamRef }
  },
  render() {
    return h(
      'div',
      {
        style: {
          height: this.height ? `${this.height}px` : undefined,
          width: this.width ? `${this.width}px` : undefined,
        },
        class: this.$attrs.class,
      },
      [
        h('stream', {
          ...this.$attrs,
          class: null,
          style: null,
          controls: this.controls ? 'controls' : null,
          autoplay: this.autoplay || null,
          currentTime: this.currentTime,
          muted: this.muted || null,
          loop: this.loop || null,
          volume: this.volume,
          preload:
            typeof this.preload === 'string'
              ? this.preload // if it's a string pass as is
              : this.preload === true // else if it's true, map to auto
                ? 'auto'
                : 'none', // otherwise (undefined | false) maps to none
          // on: this.$listeners,
          ref: (el) => { this.streamRef = el as HTMLVideoElement },
        }),
      ],
    )
  },
})
