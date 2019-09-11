import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import LoginPage from '../pages/login';

process.env.NODE_ENV = 'test'

describe('LoginPage', () => {
  it('Handles submit event on failure scenario', () => {
    // Fires the "Sign In" button in the LoginForm, which triggers a
    // "Sign In Failed" and "Sign In Attempted" event.

    const wrapper = mount(<LoginPage />)
    wrapper.find('button').simulate('click')
  });
});
