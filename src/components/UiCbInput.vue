<template>
  <div class="cb-group" style="margin-top: 10px">
    <div v-if="label && label.length !== 0" class="cb-check wd-label">
      <input :id="id" type="checkbox" v-model="localChecked" v-bind="$attrs" />
      <label :for="id" style="margin-left: 2px">{{ label }}</label>
    </div>
    <div v-else class="cb-check">
      <input type="checkbox" v-model="localChecked" v-bind="$attrs" />
    </div>
    <input
      :value="modelValue"
      :disabled="!localChecked"
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
      default: '120px',
    },
  },

  emits: ['update:modelValue', 'update:checkedValue'],

  setup(props, { emit }) {
    const localChecked = computed({
      get() {
        return props.checkedValue;
      },

      set(value) {
        emit('update:checkedValue', value);
      },
    });

    const isError = computed(() => props.errors.length > 0);

    const id = crypto.randomUUID();

    return {
      localChecked,
      isError,
      margin: props.marginTop,
      width: props.labelWidth,
      id,

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
}

.wd-label {
  width: v-bind(width);
  min-width: v-bind(labelWidth);
}
</style>
