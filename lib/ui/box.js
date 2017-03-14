function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';
import Container from './box/container';

var ContainerManager = function () {
  function ContainerManager() {
    _classCallCheck(this, ContainerManager);
  }

  ContainerManager.prototype.ensure = function ensure(id, shouldAppend) {
    var container = global.document.getElementById(id);

    if (!container && shouldAppend) {
      container = global.document.createElement('div');
      container.id = id;
      container.className = "auth0-lock-container";
      global.document.body.appendChild(container);
    }

    if (!container) {
      throw new Error('Can\'t find element with id ' + id);
    }

    return container;
  };

  return ContainerManager;
}();

var Renderer = function () {
  function Renderer() {
    _classCallCheck(this, Renderer);

    this.containerManager = new ContainerManager();
    this.modals = {};
  }

  Renderer.prototype.render = function render(containerId, props) {
    var isModal = props.isModal;

    var container = this.containerManager.ensure(containerId, isModal);

    if (isModal && !this.modals[containerId]) {
      CSSCore.addClass(global.document.getElementsByTagName("html")[0], "auth0-lock-html");
    }

    var component = ReactDOM.render(React.createElement(Container, props), container);

    if (isModal) {
      this.modals[containerId] = component;
    }

    return component;
  };

  Renderer.prototype.remove = function remove(containerId) {
    var _this = this;

    if (this.modals[containerId]) {
      this.modals[containerId].hide();
      setTimeout(function () {
        return _this.unmount(containerId);
      }, 1000);
    } else {
      this.unmount(containerId);
    }
  };

  Renderer.prototype.unmount = function unmount(containerId) {
    try {
      var container = this.containerManager.ensure(containerId);
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    } catch (e) {
      // do nothing if container doesn't exist
    }

    if (this.modals[containerId]) {
      delete this.modals[containerId];

      CSSCore.removeClass(global.document.getElementsByTagName("html")[0], "auth0-lock-html");
    }
  };

  return Renderer;
}();

var renderer = new Renderer();

export var render = function render() {
  return renderer.render.apply(renderer, arguments);
};
export var remove = function remove() {
  return renderer.remove.apply(renderer, arguments);
};
