<template>
  <div class="wrapper-steppy">
    <div class="steppy">
      <div class="steppy-progress">
        <div class="steppy-progress-bar" :style="'width:' + steppyProgress"></div>
      </div>

      <div
        class="steppy-item"
        :class="{
          current: props.step === index + 1,
          success: props.step > index + 1,
        }"
        v-for="(item, index) in props.tabs"
        :key="index"
      >
        <div class="steppy-item-counter">
          <img v-if="item.iconSuccess" class="icon-success" :src="item.iconSuccess" alt="Check Mark" />
          <CheckMark v-else class="icon-success" color="#fff" alt="Check Mark" />
          <span class="number">{{ index + 1 }}</span>
        </div>
        <span class="steppy-item-title">{{ item.title }}</span>
      </div>
    </div>

    <div class="steppy-content" v-for="index in props.tabs.length" :key="index">
      <div class="steppy-pane" v-if="props.step === index">
        <slot :name="index"></slot>
      </div>
    </div>

    <div class="controls" v-if="props.step !== 1">
      <button class="btn" @click="decrementStep" v-if="props.step !== 1">
        {{ props.backText }}
      </button>
      <button
        class="btn btn--default-2"
        @click="incrementStep"
        v-if="props.step !== props.tabs.length"
        :disabled="!props.tabs[props.step - 1].isValid"
      >
        {{ props.nextText }}
      </button>
      <button
        class="btn btn--default-2"
        @click="finalize"
        v-else
        :disabled="!props.tabs[props.step - 1].isValid || loading"
      >
        <span v-if="loading" class="loader"></span>
        <span v-else>{{ props.doneText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import CheckMark from './CheckMark.vue';

const emit = defineEmits(['update:step']);

const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
  tabs: {
    type: Array,
    default: reactive([
      {
        title: 'Step 1',
        iconSuccess: null,
        isValid: true,
      },
      {
        title: 'Step 2',
        iconSuccess: null,
        isValid: true,
      },
      {
        title: 'Step 3',
        iconSuccess: null,
        isValid: true,
      },
    ]),
  },
  finalize: {
    type: Function,
    default: function () {
      return {};
    },
  },
  backText: {
    type: String,
    default: 'Back',
  },
  nextText: {
    type: String,
    default: 'Next',
  },
  doneText: {
    type: String,
    default: 'Done',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const incrementStep = () => {
  const step = props.step + 1;
  emit('update:step', step);
};

const decrementStep = () => {
  const step = props.step - 1;
  emit('update:step', step);
};

const steppyProgress = computed(() => {
  return (100 / (props.tabs.length - 1)) * (props.step - 1) + '%';
});
</script>

<style scoped lang="scss">
$transition: all 500ms ease;

body {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}

.tx-default-2 {
  color: #ffa500;
  font-weight: 600;
}

.wrapper-steppy {
  padding: 60px;
}

.steppy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  position: relative;
  z-index: 0;
  margin-bottom: 5px;

  &-progress {
    position: absolute;
    background-color: #c5c5c5;
    height: 2px;
    z-index: -1;
    left: 0;
    right: 0;
    margin: 0 auto;

    &-bar {
      position: absolute;
      left: 0;
      height: 100%;
      width: 0;
      background-color: #ffa500;
      transition: $transition;
    }
  }
}

.steppy-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #c5c5c5;
  transition: $transition;

  &-counter {
    height: 68px;
    width: 68px;
    display: grid;
    place-items: center;
    background-color: #ffa500;
    border-radius: 100%;
    border: 2px solid #c5c5c5;
    position: relative;

    .icon-success {
      position: absolute;
      opacity: 0;
      transform: scale(0);
      width: 24px;
      transition: $transition;
    }

    .number {
      font-size: 22px;
      transition: $transition;
    }
  }

  &-title {
    position: absolute;
    text-align: center;
    font-size: 14px;
    bottom: -43px;
  }
}

.steppy-item.success {
  .steppy-item-counter {
    border-color: #ffa500;
    font-weight: 600;

    .icon-success {
      opacity: 1;
      transform: scale(1);
    }

    .number {
      opacity: 0;
      transform: scale(0);
    }
  }

  .steppy-item-title {
    color: #ffa500;
  }
}

.steppy-item.current {
  .steppy-item-counter {
    border-color: #ffa500;
    background-color: #ffa500;
    color: #fff;
    font-weight: 600;
  }

  .steppy-item-title {
    color: #818181;
  }
}

.steppy-pane {
  color: #333;
  // text-align: center;
  background-color: #fff;
  border-radius: 15px;
  padding: 25px 25px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: 60px 0 20px 0;
}

.controls {
  display: flex;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  line-height: 1.5;
  transition: all 150ms;
  border-radius: 4px;
  width: fit-content;
  font-size: 0.75rem;
  color: #333;
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &--default-2 {
    background-color: #ffa500;
    border-color: #ffa500;
    color: #fff;
    margin-left: auto;
  }
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
