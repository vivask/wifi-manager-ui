<template>
  <ui-card class="security-card">
    <template #header>
      {{ 'WiFi Security Setup' }}
    </template>
    <template #default>
      <ui-input v-model="v$.wifi_ssid.$model" label="SSID" :disabled="ssidDisable" :errors="v$.wifi_ssid.$errors" />

      <ui-select
        v-model="v$.wifi_wpa.$model"
        :options="methods"
        optionValue="value"
        optionName="name"
        label="Auth mode"
        :errors="v$.wifi_wpa.$errors"
      />

      <ui-select
        v-if="enterprise"
        v-model="v$.wifi_auth.$model"
        :options="phase1"
        optionValue="value"
        optionName="name"
        label="Authentication"
        placeholder="Select authentication"
        :errors="v$.wifi_auth.$errors"
      />

      <ui-input
        v-if="enterprise"
        v-model="v$.wifi_identity.$model"
        label="Identity"
        :errors="v$.wifi_identity.$errors"
      />

      <ui-cb-input
        v-if="enterprise && !tls"
        v-model="v$.wifi_username.$model"
        v-model:checkedValue="enableUsername"
        label="Username"
        :errors="v$.wifi_username.$errors"
      />

      <ui-password v-if="!tls" v-model="v$.wifi_password.$model" label="Password" :errors="v$.wifi_password.$errors" />

      <ui-cb-file-input
        v-if="enterprise && (peap || ttls)"
        v-model="v$.wifi_ca.$model"
        v-model:checkedValue="caCheck"
        label="CA certificate"
        accept=".crt,.pem"
        :errors="v$.wifi_ca.$errors"
      />

      <ui-select
        v-if="enterprise && ttls"
        v-model="v$.wifi_inner.$model"
        :options="phase2"
        optionValue="value"
        optionName="name"
        label="Inner auth"
        :errors="v$.wifi_inner.$errors"
      />

      <div v-if="enterprise && tls">
        <ui-file-input
          v-model="v$.wifi_ca.$model"
          accept=".crt,.pem"
          label="CA certificate"
          :errors="v$.wifi_ca.$errors"
        />
        <ui-file-input
          v-model="v$.wifi_crt.$model"
          accept=".crt"
          label="User certificate"
          :errors="v$.wifi_crt.$errors"
        />
        <ui-file-input
          v-model="v$.wifi_key.$model"
          accept=".key"
          label="User private key"
          :errors="v$.wifi_key.$errors"
        />
      </div>
    </template>
  </ui-card>
</template>

<script>
import { defineComponent, ref, computed, toRefs, watch } from 'vue';
import UiCard from '../components/UiCard.vue';
import UiInput from '../components/UiInput.vue';
import UiPassword from '../components/UiPassword.vue';
import UiSelect from '../components/UiSelect.vue';
import UiFileInput from '../components/UiFileInput.vue';
import UiCbInput from '../components/UiCbInput.vue';
import UiCbFileInput from '../components/UiCbFileInput.vue';
import { useModelProxy } from '../composables/useModelProxy';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

export default defineComponent({
  name: 'Security',

  components: {
    UiCard,
    UiInput,
    UiPassword,
    UiSelect,
    UiFileInput,
    UiCbInput,
    UiCbFileInput,
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
    const enableUsername = ref(false);
    const caCheck = ref(false);
    const enterprise = computed(() => modelProxy.value.wifi_wpa === 'enterprise');
    const tls = computed(() => modelProxy.value.wifi_auth === 'tls');
    const peap = computed(() => modelProxy.value.wifi_auth === 'peap');
    const ttls = computed(() => modelProxy.value.wifi_auth === 'ttls');
    const ssidDisable = computed(() => !modelProxy.value.wifi_manual);
    const rules = computed(() => {
      const localRules = {
        wifi_ssid: { required },
        wifi_wpa: { required },
      };
      if (!enterprise.value) {
        localRules.wifi_password = { required };
      } else {
        localRules.wifi_auth = { required };
        localRules.wifi_identity = { required };
        if (!tls.value) {
          localRules.wifi_username = {
            required: helpers.withMessage(
              'Value is required',
              () => !enableUsername.value || (enableUsername.value && v$.value.wifi_username.$model.length !== 0),
            ),
          };
        }
        if (!tls.value) {
          localRules.wifi_password = { required };
          localRules.wifi_ca = {
            required: helpers.withMessage(
              'Value is required',
              () => !caCheck.value || (caCheck.value && v$.value.wifi_ca.$model.length !== 0),
            ),
          };
        } else {
          localRules.wifi_ca = {
            required: () => v$.value.wifi_ca.$model.length !== 0,
          };
          localRules.wifi_crt = {
            required: () => v$.value.wifi_crt.$model.length !== 0,
          };
          localRules.wifi_key = {
            required: () => v$.value.wifi_key.$model.length !== 0,
          };
        }
        if (ttls.value) {
          localRules.wifi_inner = { required };
        }
      }
      return localRules;
    });
    const v$ = useVuelidate(rules, modelProxy);
    const methods = [
      { name: 'WAP & WPA2 Personal', value: 'personal' },
      { name: 'WAP & WPA2 Enterprise', value: 'enterprise' },
    ];
    const phase1 = [
      { name: 'TLS', value: 'tls' },
      { name: 'PEAP', value: 'peap' },
      { name: 'TTLS', value: 'ttls' },
    ];
    const phase2 = [
      { name: 'MSCHAPV2', value: 'mschapv2' },
      { name: 'MSCHAP', value: 'mschap' },
      { name: 'PAP', value: 'pap' },
      { name: 'CHAP', value: 'chap' },
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
      ssidDisable,
      methods,
      phase1,
      enableUsername,
      caCheck,
      phase2,
      enterprise,
      tls,
      peap,
      ttls,
      v$,
    };
  },
});
</script>

<style scoped>
.security-card {
  position: relative;
}
</style>
