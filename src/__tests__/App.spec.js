import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import App from '../App.vue';

describe('App', () => {
  it('contains a router-view tag', () => {
    const wrapper = mount(App);
    expect(wrapper.find('router-view').exists()).toBe(true);
  })
})
