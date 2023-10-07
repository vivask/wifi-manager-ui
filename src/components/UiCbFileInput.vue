<template>
  <div class="cb-group" style="margin-top: 10px">
    <div v-if="label && label.length !== 0" class="cb-check wd-label">
      <input :id="id" type="checkbox" v-model="localChecked" v-bind="$attrs" @change="handleToggle" />
      <label :for="id" style="margin-left: 2px">{{ label }}</label>
    </div>
    <div v-else class="cb-check">
      <input type="checkbox" v-model="localChecked" v-bind="$attrs" />
    </div>
    <input
      ref="file"
      type="file"
      :disabled="!localChecked"
      class="input__file"
      @change="handleChange"
      :class="{ 'p-invalid': isError }"
      v-bind="$attrs"
    />
  </div>
  <div class="p-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  name: 'UiCbInput',

  inheritAttrs: false,

  props: {
    modelValue: String,

    checkedValue: Boolean,

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

  emits: ['update:modelValue', 'update:checkedValue'],

  setup(props, { emit }) {
    const file = ref(null);
    const localChecked = computed({
      get() {
        return props.checkedValue;
      },

      set(value) {
        emit('update:checkedValue', value);
      },
    });

    const isError = computed(() => props.errors.length > 0);

    const id = 'id' + Math.random().toString(16).slice(2);

    return {
      file,
      localChecked,
      isError,
      margin: props.marginTop,
      width: props.labelWidth,
      id,

      updateInput(event) {
        emit('update:modelValue', event.target.value);
      },

      async handleChange(event) {
        const file = event.target.files[0];
        const cert = file ? await file.text() : '';
        emit('update:modelValue', cert);
      },

      handleToggle(event) {
        if (localChecked.value === false) {
          file.value.value = null;
          emit('update:modelValue', null);
        }
      },
    };
  },
};
</script>

<style scoped>
.mt {
  margin-top: v-bind(margin);
}

.wd-label {
  width: v-bind(width);
}
</style>
