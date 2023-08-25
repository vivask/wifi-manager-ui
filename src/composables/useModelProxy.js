import { computed } from 'vue';

export function useModelProxy(modelValue, emit) {
  const modelProxy = computed({
    get() {
      return modelValue.value;
    },

    set(value) {
      emit('update:modelValue', value);
    },
  });
  return { modelProxy };
}
