<template>
  <VuePassword
    :value="modelValue"
    type="password"
    :disableStrength="true"
    @input="updateInput"
    :class="{ 'p-invalid': isError }"
    v-bind="$attrs"
  />
  <div class="p-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
import { computed } from 'vue';
import VuePassword from './VuePassword.vue';

export default {
  name: 'UiInput',

  inheritAttrs: false,

  components: { VuePassword },

  props: {
    modelValue: String,

    errors: {
      type: Array,
      required: true,
    },
  },

  setup(props, { emit }) {
    const isError = computed(() => props.errors.length > 0);
    return {
      isError,

      updateInput(event) {
        emit('update:modelValue', event.target.value);
      },
    };
  },
};
</script>

<style scoped></style>
