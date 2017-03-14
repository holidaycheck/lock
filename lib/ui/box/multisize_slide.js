function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';

var Slider = function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { children: { current: props.children } };
    return _this;
  }

  Slider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    // TODO: take a prop to identify what are we rendering instead of
    // infering it from children keys so we can accept more than one
    // child (we are already wrapping them).
    if (this.state.children.current.key != nextProps.children.key) {
      this.setState({
        children: {
          current: nextProps.children,
          prev: this.state.children.current
        },
        transitionName: this.props.transitionName
      });
      this.animate = true;
    } else if (!this.timeout) {
      this.setState({ children: { current: nextProps.children }, transitionName: nextProps.transitionName });
    }
  };

  Slider.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this2 = this;

    if (this.animate) {
      (function () {
        _this2.animate = false;

        var transitionName = _this2.state.transitionName;
        var _state$children = _this2.state.children,
            current = _state$children.current,
            prev = _state$children.prev;
        var reverse = _this2.props.reverse;

        var currentComponent = _this2.refs[current.key];
        var prevComponent = _this2.refs[prev.key];

        var transition = function transition(component, className, delay) {
          var node = ReactDOM.findDOMNode(component);
          var activeClassName = className + '-active';

          CSSCore.addClass(node, className);

          setTimeout(function () {
            return CSSCore.addClass(node, activeClassName);
          }, 17);

          if (delay) {
            setTimeout(function () {
              CSSCore.removeClass(node, className);
              CSSCore.removeClass(node, activeClassName);
            }, delay);
          }
        };

        var callback = function callback(slide) {
          currentComponent.componentWillSlideIn(slide);
          var classNamePrefix = reverse ? "reverse-" : "";
          transition(currentComponent, '' + classNamePrefix + transitionName + '-enter', _this2.props.delay);
          transition(prevComponent, '' + classNamePrefix + transitionName + '-leave');

          _this2.timeout = setTimeout(function () {
            var _context;

            _this2.setState({ children: { current: _this2.state.children.current }, transitionName: _this2.props.transitionName });
            currentComponent.componentDidSlideIn((_context = _this2.props).onDidAppear.bind(_context));
            _this2.props.onDidSlide();
            _this2.timeout = null;
          }, _this2.props.delay);
        };

        _this2.props.onWillSlide();
        prevComponent.componentWillSlideOut(callback);
      })();
    }
  };

  Slider.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  };

  Slider.prototype.render = function render() {
    var _state$children2 = this.state.children,
        current = _state$children2.current,
        prev = _state$children2.prev;

    var children = prev ? [current, prev] : [current];
    var childrenToRender = children.map(function (child) {
      return React.cloneElement(React.createElement(Child, {}, child), { ref: child.key, key: child.key });
    });

    return React.createElement(this.props.component, {}, childrenToRender);
  };

  return Slider;
}(React.Component);

export default Slider;


Slider.propTypes = {
  component: React.PropTypes.string,
  delay: React.PropTypes.number.isRequired,
  onDidAppear: React.PropTypes.func.isRequired,
  onDidSlide: React.PropTypes.func.isRequired,
  onWillSlide: React.PropTypes.func.isRequired,
  reverse: React.PropTypes.bool.isRequired,
  transitionName: React.PropTypes.string.isRequired
};

Slider.defaultProps = {
  component: "span",
  onDidAppear: function onDidAppear() {},
  onDidSlide: function onDidSlide() {},
  onWillSlide: function onWillSlide() {},
  reverse: false
};

var Child = function (_React$Component2) {
  _inherits(Child, _React$Component2);

  function Child(props) {
    _classCallCheck(this, Child);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

    _this3.state = { height: "", originalHeight: "", show: true };
    return _this3;
  }

  Child.prototype.componentWillSlideIn = function componentWillSlideIn(slide) {
    var node = ReactDOM.findDOMNode(this);

    this.setState({
      height: slide.height,
      originalHeight: parseInt(window.getComputedStyle(node, null).height, 10),
      show: false
    });
  };

  Child.prototype.componentDidSlideIn = function componentDidSlideIn(cb) {
    var _this4 = this;

    var _state = this.state,
        height = _state.height,
        originalHeight = _state.originalHeight;


    if (height === originalHeight) {
      this.setState({ show: true, height: "" });
      cb();
    } else {
      (function () {
        _this4.cb = cb;
        var frames = 10;
        var count = 0;
        var current = height;
        var last = originalHeight;
        var step = Math.abs(current - last) / frames;
        var dir = current < last ? 1 : -1;
        var dh = step * dir;

        // TODO: rAF
        _this4.t = setInterval(function () {
          if (count < frames - 1) {
            _this4.setState({ height: current, animating: true });
            current += dh;
            count++;
          } else {
            clearInterval(_this4.t);
            delete _this4.t;
            _this4.setState({ height: "", show: true });
            _this4.cb();
          }
        }, 17);
      })();
    }
  };

  Child.prototype.componentWillSlideOut = function componentWillSlideOut(cb) {
    var node = ReactDOM.findDOMNode(this);
    var size = window.getComputedStyle(node, null).height;
    cb({ height: parseInt(size, 10), reverse: this.reverse });
  };

  Child.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.t) {
      clearInterval(this.t);
      cb();
    }
  };

  Child.prototype.render = function render() {
    var children = this.props.children;
    var _state2 = this.state,
        height = _state2.height,
        show = _state2.show;


    return React.createElement(
      'div',
      { style: height ? { height: height + "px" } : {} },
      React.createElement(
        'div',
        { style: { visibility: show ? "inherit" : "hidden" } },
        children
      )
    );
  };

  return Child;
}(React.Component);
