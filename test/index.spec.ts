/** @vitest-environment jsdom */

import { describe, beforeEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Wrapper } from '@vue/test-utils'
import { VideoStream } from '../src'

describe('stream-vue', () => {
  let wrapper: Wrapper<Vue>
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
