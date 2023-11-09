<template>
  <ui-container>
    <steppy
      v-model:step="step"
      :tabs="tabs"
      backText="Go Back"
      nextText="Next"
      doneText="Finish"
      :loading="loading"
      :finalize="handleFormSubmission"
    >
      <template #1>
        <AccessPoints :state="state" @nextPage="nextPage($event)" />
      </template>
      <template #2>
        <Security :state="state" @invalid="setSecurityValid" />
      </template>
      <template #3>
        <IpV4 :state="state" @invalid="setIPv4Valid" />
      </template>
      <template #4>
        <Client :state="state" @invalid="setClientValid" />
      </template>
    </steppy>
  </ui-container>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { createSetup, Connect } from './api/appApi';
import UiContainer from './components/UiContainer.vue';
import Steppy from './components/Vue3Steppy.vue';
import AccessPoints from './forms/AccessPoints.vue';
import Security from './forms/Security.vue';
import IpV4 from './forms/IpV4.vue';
import Client from './forms/Client.vue';

export default defineComponent({
  name: 'App',

  components: {
    UiContainer,
    Steppy,
    AccessPoints,
    Security,
    IpV4,
    Client,
  },

  setup() {
    const loading = ref(false);
    const step = ref(1);
    const securityValid = ref(false);
    const ipv4Valid = ref(false);
    const clientValid = ref(false);
    const tabs = computed(() => {
      return [
        {
          title: 'Access Points',
          iconSuccess: null,
          isValid: true,
        },
        {
          title: 'Security',
          iconSuccess: null,
          isValid: securityValid.value,
        },
        {
          title: 'IPv4 Settings',
          iconSuccess: null,
          isValid: ipv4Valid.value,
        },

        {
          title: 'HTTP Client',
          iconSuccess: null,
          isValid: clientValid.value,
        },
      ];
    });
    const state = ref({
      wifi_ssid: null,
      wifi_wpa: null,
      wifi_manual: true,
      wifi_auth: '',
      wifi_identity: '',
      wifi_username: '',
      wifi_password: '',
      wifi_inner: 'mschapv2',
      wifi_ca: '',
      wifi_crt: '',
      wifi_key: '',
      ipv4_method: 'auto',
      ipv4_address: '',
      ipv4_mask: '',
      ipv4_gate: '',
      ipv4_dns1: '',
      ipv4_dns2: '',
      ipv4_zone: '',
      ipv4_ntp: '',
      server_address: '',
      server_port: null,
      server_api: '',
      esp_json_key: '',
      stm_json_key: '',
      server_auth: '',
      client_username: '',
      client_password: '',
      client_ca: '',
      client_crt: '',
      client_key: '',
    });

    return {
      step,
      tabs,
      state,
      loading,
      securityValid,
      ipv4Valid,
      clientValid,

      async handleFormSubmission() {
        loading.value = true;

        const wifiSetup = {
          wifi_ssid: state.value.wifi_ssid,
          wifi_wpa: state.value.wifi_wpa,
          wifi_identity: state.value.wifi_identity,
          wifi_username: state.value.wifi_username,
          wifi_password: state.value.wifi_password,
          wifi_auth: state.value.wifi_auth,
          wifi_inner: state.value.wifi_inner,
        };

        const ipv4Setup = {
          ipv4_method: state.value.ipv4_method,
          ipv4_address: state.value.ipv4_address,
          ipv4_mask: state.value.ipv4_mask,
          ipv4_gate: state.value.ipv4_gate,
          ipv4_dns1: state.value.ipv4_dns1,
          ipv4_dns2: state.value.ipv4_dns2,
          ipv4_zone: state.value.ipv4_zone.value,
          ipv4_ntp: state.value.ipv4_ntp,
        };

        const httpSetup = {
          server_address: state.value.server_address,
          server_port: parseInt(state.value.server_port),
          server_api: state.value.server_api,
          esp_json_key: state.value.esp_json_key,
          stm_json_key: state.value.stm_json_key,
          server_auth: state.value.server_auth,
          client_username: state.value.client_username,
          client_password: state.value.client_password,
        };

        const setup = {
          'wifi/ca': JSON.stringify({ wifi_ca: state.value.wifi_ca }),
          'wifi/crt': JSON.stringify({ wifi_crt: state.value.wifi_crt }),
          'wifi/key': JSON.stringify({ wifi_key: state.value.wifi_key }),
          'http/ca': JSON.stringify({ client_ca: state.value.client_ca }),
          'http/crt': JSON.stringify({ client_crt: state.value.client_crt }),
          'http/key': JSON.stringify({ client_key: state.value.client_key }),
          wifi: JSON.stringify(wifiSetup),
          ipv4: JSON.stringify(ipv4Setup),
          http: JSON.stringify(httpSetup),
        };

        createSetup(setup).then(({ success, message }) => {
          if (success) {
            Connect().then(({ success, message }) => {
              if (success) {
                useToast().success('Configuration success!', { timeout: 3000 });
                // step.value = 1;
              } else {
                useToast().error(message, { timeout: 5000 });
              }
            });
          } else {
            useToast().error(message, { timeout: 5000 });
          }
          loading.value = false;
        });
      },

      nextPage(event) {
        step.value = step.value + 1;
      },

      setSecurityValid(valid) {
        securityValid.value = valid;
      },

      setIPv4Valid(valid) {
        ipv4Valid.value = valid;
      },

      setClientValid(valid) {
        clientValid.value = valid;
      },
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep(b) {
  display: block;
}

::v-deep(.p-card-body) {
  padding: 2rem;
}

.ico {
  width: 100px;
  display: block;
  height: 20px;
  background: black;
  color: white;
  text-decoration: none;
  padding-left: 20px;
}
.ico:before {
  content: '';
  background: url('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSj3XfIpf-OOJRCcWz4iN2CU3qMKVVbj0p0bRvKNGVo1U9pk_8ZIlyR8pWreA');
  background-size: cover;
  position: absolute;
  width: 20px;
  height: 20px;
  margin-left: -20px;
}
</style>
