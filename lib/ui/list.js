function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { BackButton } from './box/button';
import TextInput from './input/text_input';
import { isSmallScreen } from '../utils/media_utils';
import * as su from '../utils/string_utils';

var cycle = function cycle(xs, x) {
  return xs.skipWhile(function (y) {
    return y !== x;
  }).get(1, xs.get(0));
};

var FiltrableList = function (_React$Component) {
  _inherits(FiltrableList, _React$Component);

  function FiltrableList(props) {
    _classCallCheck(this, FiltrableList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { filteredItems: props.items, highlighted: props.defaultItem };
    return _this;
  }

  FiltrableList.prototype.filter = function filter(str) {
    var filteredItems = this.props.items.filter(function (x) {
      return su.matches(str, x.get("label"));
    });

    var highlighted = filteredItems.size === 1 && filteredItems.get(0) || filteredItems.includes(this.state.highlighted) && this.state.highlighted || null;

    return {
      filteredItems: filteredItems,
      highlighted: highlighted
    };
  };

  FiltrableList.prototype.select = function select(x) {
    this.props.onSelect(x);
  };

  FiltrableList.prototype.handleChange = function handleChange(e) {
    this.setState(this.filter(e.target.value));
  };

  FiltrableList.prototype.handleKeyDown = function handleKeyDown(e) {
    var _state = this.state,
        filteredItems = _state.filteredItems,
        highlighted = _state.highlighted;


    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.setState({ highlighted: cycle(filteredItems, highlighted) });
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setState({ highlighted: cycle(filteredItems.reverse(), highlighted) });
        break;
      case "Enter":
        e.preventDefault();
        highlighted && this.select(highlighted);
        break;
      case "Escape":
        e.preventDefault();
        this.props.onCancel();
      default:
      // no-op
    }
  };

  FiltrableList.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        icon = _props.icon,
        iconUrl = _props.iconUrl,
        onCancel = _props.onCancel;

    return React.createElement(
      'div',
      { className: 'auth0-lock-select-country' },
      React.createElement(
        'div',
        { className: 'auth0-lock-search' },
        React.createElement(BackButton, { onClick: onCancel }),
        React.createElement(TextInput, {
          name: 'search',
          icon: icon,
          iconUrl: iconUrl,
          isValid: true,
          onChange: this.handleChange.bind(this),
          onKeyDown: this.handleKeyDown.bind(this)
        })
      ),
      React.createElement(List, {
        highlighted: this.state.highlighted,
        items: this.state.filteredItems,
        onClick: this.select.bind(this),
        onMouseMove: function onMouseMove(x) {
          return _this2.setState({ highlighted: x });
        }
      })
    );
  };

  return FiltrableList;
}(React.Component);

export default FiltrableList;

var List = function (_React$Component2) {
  _inherits(List, _React$Component2);

  function List() {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  List.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this4 = this;

    // Ensure that highlighted item is entirely visible

    // NOTE: I've spent very little time on this. It works, but it
    // surely can be more clearly.

    var highlighted = this.refs.highlighted;


    if (highlighted) {
      var scrollableNode = ReactDOM.findDOMNode(this);
      var highlightedNode = ReactDOM.findDOMNode(highlighted);
      var relativeOffsetTop = highlightedNode.offsetTop - scrollableNode.scrollTop;
      var scrollTopDelta = 0;
      if (relativeOffsetTop + highlightedNode.offsetHeight > scrollableNode.clientHeight) {
        scrollTopDelta = relativeOffsetTop + highlightedNode.offsetHeight - scrollableNode.clientHeight;
      } else if (relativeOffsetTop < 0) {
        scrollTopDelta = relativeOffsetTop;
      }

      if (scrollTopDelta) {
        this.preventHighlight = true;
        scrollableNode.scrollTop += scrollTopDelta;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          return _this4.preventHighlight = false;
        }, 100);
      }
    }
  };

  List.prototype.mouseMoveHandler = function mouseMoveHandler(x) {
    // TODO: This is an ugly hack to avoid highlighting the element under the
    // mouse when an arrow key trigger a scroll of the list (which in turn
    // triggers a mousemove event).
    !this.preventHighlight && this.props.onMouseMove(x);
  };

  List.prototype.mouseLeaveHandler = function mouseLeaveHandler() {
    // TODO: clear highlighted?
  };

  List.prototype.render = function render() {
    var _this5 = this;

    var items = this.props.items.map(function (x) {
      var highlighted = x === _this5.props.highlighted;

      var props = {
        highlighted: highlighted,
        key: x.get("label"),
        label: x.get("label"),
        onClick: function onClick() {
          return _this5.props.onClick(x);
        },
        onMouseMove: function onMouseMove() {
          return _this5.mouseMoveHandler(x);
        }
      };

      if (highlighted) props.ref = "highlighted";

      return React.createElement(Item, props);
    });

    return React.createElement(
      'div',
      {
        className: 'auth0-lock-list-code',
        onMouseLeave: this.mouseLeaveHandler.bind(this)
      },
      React.createElement(
        'ul',
        null,
        items
      )
    );
  };

  return List;
}(React.Component);

var Item = function (_React$Component3) {
  _inherits(Item, _React$Component3);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  Item.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return this.props.highlighted != nextProps.highlighted;
  };

  Item.prototype.render = function render() {
    var _props2 = this.props,
        highlighted = _props2.highlighted,
        label = _props2.label,
        onClick = _props2.onClick,
        onMouseMove = _props2.onMouseMove;

    var className = highlighted ? "auth0-lock-list-code-highlighted" : "";

    return React.createElement(
      'li',
      { className: className, onClick: onClick, onMouseMove: onMouseMove },
      label
    );
  };

  return Item;
}(React.Component);

Item.propTypes = {
  highlighted: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired
};
