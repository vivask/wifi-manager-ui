<template>
  <div class="cb-group mt">
    <div class="cb-label wd-label">
      <label>{{ label }}</label>
    </div>
    <input type="file" class="input__file" @change="handleChange" :class="{ 'p-invalid': isError }" v-bind="$attrs" />
  </div>
  <div class="p-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'UiFileInput',

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

    label: {
      type: String,
      required: true,
    },

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

      async handleChange(event) {
        const file = event.target.files[0];
        const cert = file ? await file.text() : '';
        emit('update:modelValue', cert);
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
