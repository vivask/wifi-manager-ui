<template>
  <ui-card class="ipv4-card">
    <template #header>
      {{ 'IpV4 Settings' }}
    </template>
    <template #default>
      <ui-select
        v-model="v$.ipv4_method.$model"
        :options="methods"
        optionValue="value"
        optionName="name"
        label="Method"
        :errors="v$.ipv4_method.$errors"
      />

      <div v-if="manual">
        <ui-input v-model="v$.ipv4_address.$model" label="Address" :errors="v$.ipv4_address.$errors" />
        <ui-input v-model="v$.ipv4_mask.$model" label="Netmask" :errors="v$.ipv4_mask.$errors" />
        <ui-input v-model="v$.ipv4_gate.$model" label="Gateway" :errors="v$.ipv4_gate.$errors" />
        <ui-input v-model="v$.ipv4_dns1.$model" label="DNS Server" :errors="v$.ipv4_dns1.$errors" />
        <ui-input v-model="v$.ipv4_dns2.$model" label="DNS Server" :errors="v$.ipv4_dns2.$errors" />
      </div>

      <ui-select
        v-model="v$.ipv4_zone.$model"
        :options="zones"
        optionName="name"
        label="Time zone"
        placeholder="Select time zone"
        :errors="v$.ipv4_zone.$errors"
      />

      <ui-cb-input
        v-model="v$.ipv4_ntp.$model"
        v-model:checkedValue="useNtp"
        label="NTP Server"
        :errors="v$.ipv4_ntp.$errors"
      />
    </template>
  </ui-card>
</template>

<script>
import { defineComponent, ref, computed, toRefs, watch } from 'vue';
import UiCard from '../components/UiCard.vue';
import { useUtils } from '../composables/useUtils';
import { timeZones } from '../options/zones';
import { useModelProxy } from '../composables/useModelProxy';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import UiInput from '../components/UiInput.vue';
import UiSelect from '../components/UiSelect.vue';
import UiCbInput from '../components/UiCbInput.vue';

export default defineComponent({
  name: 'IpV4',

  components: {
    UiCard,
    UiInput,
    UiSelect,
    UiCbInput,
  },

  props: {
    state: {
      type: Object,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { state } = toRefs(props);

    const { modelProxy } = useModelProxy(state, emit);

    const manual = computed(() => modelProxy.value.ipv4_method === 'manual');

    const methods = [
      { name: 'Automatic (DHCP)', value: 'auto' },
      { name: 'Manual', value: 'manual' },
    ];

    const { isIpAddress, isHostName } = useUtils();

    const rules = computed(() => {
      const localRules = {
        ipv4_method: { required },
        ipv4_zone: { required },
        ipv4_ntp: {
          required: helpers.withMessage(
            'Value is required',
            (value) => !useNtp.value || (useNtp.value && isHostName(value)),
          ),
        },
      };
      if (modelProxy.value.ipv4_method === 'manual') {
        localRules.ipv4_address = { required: helpers.withMessage('Invalid value', (value) => isIpAddress(value)) };
        localRules.ipv4_mask = { required: helpers.withMessage('Invalid value', (value) => isIpAddress(value)) };
        localRules.ipv4_gate = { required: helpers.withMessage('Invalid value', (value) => isIpAddress(value)) };
        localRules.ipv4_dns1 = { required: helpers.withMessage('Invalid value', (value) => isIpAddress(value)) };
        localRules.ipv4_dns2 = {
          requiredIf: helpers.withMessage('Invalid value', (value) => !(value && value.length) || isIpAddress(value)),
        };
      }
      return localRules;
    });

    const v$ = useVuelidate(rules, modelProxy);

    const useNtp = ref(true);

    const zones = ref(timeZones);

    watch(
      v$,
      () => {
        emit('invalid', !v$.value.$invalid);
      },
      { deep: true },
    );

    return {
      modelProxy,
      rules,
      v$,
      methods,
      useNtp,
      zones,
      manual,
    };
  },
});
</script>

<style scoped>
.ipv4-card {
  position: relative;
}

.align-pevious {
  height: 45px;
}

.mt-20 {
  margin-top: 10px;
}
</style>
