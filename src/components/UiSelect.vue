<template>
  <div class="cb-group mt">
    <div v-if="label && label.length !== 0" class="cb-label wd-label">
      <label>{{ label }}</label>
    </div>
    <select v-model="localModel" class="select__text selected-color" v-bind="$attrs">
      <option v-if="placeholder && placeholder.length" value="" disabled selected hidden>{{ placeholder }}</option>
      <option v-for="item in options" :value="optionValue ? item[optionValue] : item" :key="item[optionValue]">
        {{ item[optionName] }}
      </option>
    </select>
  </div>
  <div class="p-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'UiSelect',

  inheritAttrs: false,

  props: {
    modelValue: [String, Object],

    options: {
      type: Array,
      required: true,
    },

    optionValue: [String, Object],

    optionName: {
      type: String,
      required: true,
    },

    errors: {
      type: Array,
      required: true,
    },

    placeholder: String,

    marginTop: {
      type: String,
      default: '10px',
    },

    label: String,

    labelWidth: {
      type: String,
      default: '140px',
    },
  },

  setup(props, { emit }) {
    const localModel = computed({
      get() {
        return props.modelValue;
      },

      set(value) {
        emit('update:modelValue', value);
      },
    });

    return {
      localModel,
      margin: props.marginTop,
      width: props.labelWidth,
      selectedColor: computed(() => (props.modelValue ? '#4c6bb6' : '#61616180')),
    };
  },
};
</script>

<style scoped>
.mt {
  margin-top: v-bind(margin);
}

.selected-color {
  color: v-bind(selectedColor);
}

.wd-label {
  min-width: v-bind(labelWidth);
}
</style>
