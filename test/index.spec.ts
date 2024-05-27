/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { VideoStream } from '../src'

describe('stream-vue', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = mount(VideoStream, {
      propsData: {
        src: '2938470a98fd7',
        height: 200,
        width: 500,
        controls: true,
      },
      attrs: {
        class: 'myclass',
        style: 'display: flex;',
      },
    })
  })
  it('renders HTML', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
