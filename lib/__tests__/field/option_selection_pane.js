import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/list', function () {
  return mockComponent('list');
});

var getComponent = function getComponent() {
  return require('field/option_selection_pane').default;
};

describe('OptionSelectionPane', function () {
  var defaultProps = {
    iconUrl: 'iconUrl',
    icon: 'icon',
    items: 'items',
    name: 'option_selection_pane',
    model: {
      get: function get() {
        return 'id';
      }
    }
  };

  beforeEach(function () {
    jest.resetModules();

    jest.mock('field/actions', function () {
      return {
        cancelOptionSelection: jest.fn(),
        selectOption: jest.fn()
      };
    });
  });
  it('renders correctly', function () {
    var OptionSelectionPane = getComponent();
    expectComponent(React.createElement(OptionSelectionPane, defaultProps)).toMatchSnapshot();
  });
  it('calls `selectOption` when selected', function () {
    var OptionSelectionPane = getComponent();

    var wrapper = mount(React.createElement(OptionSelectionPane, defaultProps));
    var props = extractPropsFromWrapper(wrapper);

    props.onSelect('selected');

    var mock = require('field/actions').selectOption.mock;

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `cancelOptionSelection` when cancelled', function () {
    var OptionSelectionPane = getComponent();

    var wrapper = mount(React.createElement(OptionSelectionPane, defaultProps));
    var props = extractPropsFromWrapper(wrapper);

    props.onCancel();

    var mock = require('field/actions').cancelOptionSelection.mock;

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
