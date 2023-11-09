<template>
  <ui-card class="http-client-card">
    <template #header>
      {{ 'HTTP Client Settings' }}
    </template>
    <template #default>
      <ui-input v-model="v$.server_address.$model" label="Server Address" :errors="v$.server_address.$errors" />

      <ui-input v-model="v$.server_port.$model" label="Server Port" :errors="v$.server_port.$errors" />

      <ui-input
        v-model="v$.server_api.$model"
        label="Server API"
        placeholder="/api/v1/esp32"
        :errors="v$.server_api.$errors"
      />

      <ui-cb-input
        v-model="v$.esp_json_key.$model"
        v-model:checkedValue="useEspOTA"
        label="ESP json key"
        placeholder="fw_esp32"
        :errors="v$.esp_json_key.$errors"
      />

      <ui-cb-input
        v-model="v$.stm_json_key.$model"
        v-model:checkedValue="useStmOTA"
        label="STM json key"
        placeholder="fw_stm32"
        :errors="v$.stm_json_key.$errors"
      />

      <ui-select
        v-model="v$.server_auth.$model"
        :options="methods"
        optionValue="value"
        optionName="name"
        label="Method"
        placeholder="Select authentication method"
        :errors="v$.server_auth.$errors"
      />
      <div v-if="ssl">
        <ui-file-input
          v-model="v$.client_ca.$model"
          accept=".crt,.pem"
          label="CA certificate"
          :errors="v$.client_ca.$errors"
        />
        <ui-file-input
          v-model="v$.client_crt.$model"
          accept=".crt"
          label="User certificate"
          :errors="v$.client_crt.$errors"
        />
        <ui-file-input
          v-model="v$.client_key.$model"
          accept=".key"
          label="User private key"
          :errors="v$.client_key.$errors"
        />
      </div>

      <div v-if="basic">
        <ui-input v-model="v$.client_username.$model" placeholder="Username" :errors="v$.client_username.$errors" />
        <ui-password v-model="v$.client_password.$model" placeholder="Password" :errors="v$.client_password.$errors" />
      </div>
    </template>
  </ui-card>
</template>

<script>
import { defineComponent, ref, computed, toRefs, watch } from 'vue';
import { useUtils } from '../composables/useUtils';
import UiCard from '../components/UiCard.vue';
import { useModelProxy } from '../composables/useModelProxy';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers, numeric } from '@vuelidate/validators';
import UiInput from '../components/UiInput.vue';
import UiPassword from '../components/UiPassword.vue';
import UiSelect from '../components/UiSelect.vue';
import UiFileInput from '../components/UiFileInput.vue';
import UiCbInput from '../components/UiCbInput.vue';

export default defineComponent({
  name: 'Client',

  components: {
    UiCard,
    UiInput,
    UiPassword,
    UiSelect,
    UiFileInput,
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

    const { isHostName } = useUtils();

    const basic = computed(() => modelProxy.value.server_auth === 'basic');

    const ssl = computed(() => modelProxy.value.server_auth === 'ssl');

    const useEspOTA = ref(true);

    const useStmOTA = ref(true);

    const rules = computed(() => {
      const localRules = {
        server_address: { required: helpers.withMessage('Invalid value', (value) => isHostName(value)) },
        server_port: { required, numeric: numeric },
        server_api: { required },
        server_auth: { required },
        esp_json_key: {
          required: helpers.withMessage(
            'Value is required',
            () => !useEspOTA.value || (useEspOTA.value && v$.value.esp_json_key.$model.length),
          ),
        },
        stm_json_key: {
          required: helpers.withMessage(
            'Value is required',
            () => !useStmOTA.value || (useStmOTA.value && v$.value.stm_json_key.$model.length),
          ),
        },
      };

      if (basic.value) {
        localRules.client_username = { required };
        localRules.client_password = { required };
      }

      if (ssl.value) {
        localRules.client_ca = { required: () => v$.value.client_ca.$model.length !== 0 };
        localRules.client_crt = { required: () => v$.value.client_crt.$model.length !== 0 };
        localRules.client_key = { required: () => v$.value.client_key.$model.length !== 0 };
      }

      return localRules;
    });

    const v$ = useVuelidate(rules, modelProxy);

    const methods = [
      { name: 'No auth', value: 'no' },
      { name: 'Basic', value: 'basic' },
      { name: 'SSL', value: 'ssl' },
    ];

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
      basic,
      ssl,
      useEspOTA,
      useStmOTA,
    };
  },
});
</script>

<style scoped>
.ipv4-card {
  position: relative;
}
</style>
