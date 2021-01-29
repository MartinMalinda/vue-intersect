import { defineComponent, onUnmounted, nextTick } from "vue";

var warn = function warn(msg) {
  // if (!Vue.config.silent) {
  console.warn(msg);
  // }
};

export default defineComponent({
  name: 'intersect',
  abstract: true,
  props: {
    threshold: {
      type: Array,
      required: false,
      default: function _default() {
        return [0, 0.2];
      }
    },
    root: {
      type: typeof HTMLElement !== 'undefined' ? HTMLElement : Object,
      required: false,
      default: function _default() {
        return null;
      }
    },
    rootMargin: {
      type: String,
      required: false,
      default: function _default() {
        return '0px 0px 0px 0px';
      }
    },
    once: Boolean
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;

    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) {
        emit('leave', [entries[0]]);
      } else {
        emit('enter', [entries[0]]);
        if (props.once) {
          observer.disconnect();
          return;
        }
      }

      emit('change', [entries[0]]);
    }, {
      threshold: props.threshold,
      root: props.root,
      rootMargin: props.rootMargin
    });

    onUnmounted(function () {
      observer.disconnect();
    });

    var didSetupObserver = false;
    return function () {
      var defaultSlot = slots.default && slots.default();

      if (!didSetupObserver) {
        nextTick(function () {
          didSetupObserver = true;
          if (defaultSlot && defaultSlot.length > 1) {
            warn('[VueIntersect] You may only wrap one element in a <intersect> component.');
          } else if (!defaultSlot || defaultSlot.length < 1) {
            warn('[VueIntersect] You must have one child inside a <intersect> component.');
            return;
          }

          observer.observe(defaultSlot[0].el);
        });
      }

      return defaultSlot;
    };
  }
});