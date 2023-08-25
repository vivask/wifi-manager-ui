<template>
  <div class="cb-group mt">
    <div v-if="label && label.length !== 0" class="cb-label wd-label">
      <label>{{ label }}</label>
    </div>
    <input
      :value="modelValue"
      class="input__text"
      @input="updateInput"
      :class="{ 'p-invalid': isError }"
      v-bind="$attrs"
    />
  </div>
  <div class="p-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'UiInput',

  inheritAttrs: false,

  props: {
    modelValue: String,

    errors: {
      type: Array,
      required: true,
    },

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
    const isError = computed(() => props.errors.length > 0);
    return {
      margin: props.marginTop,
      width: props.labelWidth,
      isError,

      updateInput(event) {
        emit('update:modelValue', event.target.value);
      },
    };
  },
};
</script>

<style scoped>
.mt {
  margin-top: v-bind(margin);
  box-sizing: border-box;
}

.wd-label {
  min-width: v-bind(labelWidth);
}
</style>
