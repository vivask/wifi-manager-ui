<template>
  <ui-card class="access-points-card">
    <template #header>
      {{ 'Available Access Points' }}
    </template>
    <template #default>
      <div>MANUAL CONNECT</div>
      <button class="button-manual-ssid" @click="nextPage(null)">ADD (HIDDEN) SSID</button>
      <div>OR CHOOSE A NETWORK...</div>
      <div v-if="ssids.length === 0">
        <small class="p-error">Not available access points found</small>
      </div>
      <ul v-else class="ssid-list">
        <li v-for="ssid in ssids" :key="ssid.ssid" class="ssid-list__item" v-on:click="nextPage(ssid)">
          <span>{{ ssid.ssid }}</span>
          <div class="ssid-list__icons">
            <div :class="authToIcon(ssid.auth)">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>
            <div :class="rssiToIcon(ssid.rssi)">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
        </li>
      </ul>
    </template>
  </ui-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import UiCard from '../components/UiCard.vue';
import { GetAccessPoints } from '../api/fetchAccessPoints';

export default defineComponent({
  name: 'AccessPoints',

  components: { UiCard },

  props: {
    state: {
      type: Object,
      required: true,
    },
  },

  setup(props, { emit }) {
    const ssids = ref([]);
    const answer = ref(true);

    const nextPage = (ssid) => {
      props.state.wifi_ssid = ssid ? ssid.ssid : '';
      const type = ssid ? ssid.auth : -1;
      props.state.wifi_wpa = type === 5 ? 'enterprise' : 'personal';
      props.state.wifi_manual = ssid ? false : true;
      emit('next-page');
    };

    const accessPoinst = (answer) => {
      answer.value = false;
      GetAccessPoints()
        .then((result) => {
          ssids.value = result;
        })
        .finally(() => {
          answer.value = true;
        });
    };

    onMounted(() => {
      accessPoinst(answer);
      setInterval(() => {
        if (answer.value) {
          accessPoinst(answer);
        }
      }, 3800);
    });

    return {
      ssids,
      nextPage,

      rssiToIcon(rssi) {
        if (rssi >= -60) {
          return 'w0';
        } else if (rssi >= -67) {
          return 'w1';
        } else if (rssi >= -75) {
          return 'w2';
        } else {
          return 'w3';
        }
      },

      authToIcon(auth) {
        return auth === 0 ? '' : auth === 5 ? 'pwr' : 'pwg';
      },
    };
  },
});
</script>

<style scoped>
.access-points-card {
  position: relative;
}
.w0 {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgogPGcgY2xhc3M9ImxheWVyIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggZD0ibTEsOWwyLDJjNC45NywtNC45NyAxMy4wMywtNC45NyAxOCwwbDIsLTJjLTYuMDcsLTYuMDcgLTE1LjkyLC02LjA3IC0yMiwweiIgZmlsbD0iIzE5NzZkMiIgaWQ9InN2Z18xIiBzdHlsZT0iLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiAjMTQ1ZWE4OyIvPgogIDxwYXRoIGQ9Im01LDEzbDIsMmMyLjc2LC0yLjc2IDcuMjQsLTIuNzYgMTAsMGwyLC0yYy0zLjg2LC0zLjg2IC0xMC4xMywtMy44NiAtMTQsMHoiIGZpbGw9IiMxOTc2ZDIiIGlkPSJzdmdfMiIgc3R5bGU9Ii0tZGFya3JlYWRlci1pbmxpbmUtZmlsbDogIzE0NWVhODsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDAsIDApIi8+CiAgPHBhdGggZD0ibTksMTdsMywzbDMsLTNjLTEuNjUsLTEuNjYgLTQuMzQsLTEuNjYgLTYsMHoiIGZpbGw9IiMxOTc2ZDIiIGlkPSJzdmdfMyIgc3R5bGU9Ii0tZGFya3JlYWRlci1pbmxpbmUtZmlsbDogIzE0NWVhODsiLz4KIDwvZz4KPC9zdmc+')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.w1 {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgogPGcgY2xhc3M9ImxheWVyIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggZD0ibTEsOWwyLDJjNC45NywtNC45NyAxMy4wMywtNC45NyAxOCwwbDIsLTJjLTYuMDcsLTYuMDcgLTE1LjkyLC02LjA3IC0yMiwweiIgZmlsbD0iZ3JheSIgaWQ9InN2Z18xIiBzdHlsZT0iLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiAjOTg4ZjgxOyIvPgogIDxwYXRoIGQ9Im01LDEzbDIsMmMyLjc2LC0yLjc2IDcuMjQsLTIuNzYgMTAsMGwyLC0yYy0zLjg2LC0zLjg2IC0xMC4xMywtMy44NiAtMTQsMHoiIGZpbGw9IiMxOTc2ZDIiIGlkPSJzdmdfMiIgc3R5bGU9Ii0tZGFya3JlYWRlci1pbmxpbmUtZmlsbDogIzE0NWVhODsiLz4KICA8cGF0aCBkPSJtOSwxN2wzLDNsMywtM2MtMS42NSwtMS42NiAtNC4zNCwtMS42NiAtNiwweiIgZmlsbD0iIzE5NzZkMiIgaWQ9InN2Z18zIiBzdHlsZT0iLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiAjMTQ1ZWE4OyIvPgogPC9nPgo8L3N2Zz4=')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.w2 {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgogPGcgY2xhc3M9ImxheWVyIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggZD0ibTEsOWwyLDJjNC45NywtNC45NyAxMy4wMywtNC45NyAxOCwwbDIsLTJjLTYuMDcsLTYuMDcgLTE1LjkyLC02LjA3IC0yMiwweiIgZmlsbD0iZ3JheSIgaWQ9InN2Z18xIiBzdHlsZT0iLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiAjOTg4ZjgxOyIvPgogIDxwYXRoIGQ9Im01LDEzbDIsMmMyLjc2LC0yLjc2IDcuMjQsLTIuNzYgMTAsMGwyLC0yYy0zLjg2LC0zLjg2IC0xMC4xMywtMy44NiAtMTQsMHoiIGZpbGw9ImdyYXkiIGlkPSJzdmdfMiIgc3R5bGU9Ii0tZGFya3JlYWRlci1pbmxpbmUtZmlsbDogIzk4OGY4MTsiLz4KICA8cGF0aCBkPSJtOSwxN2wzLDNsMywtM2MtMS42NSwtMS42NiAtNC4zNCwtMS42NiAtNiwweiIgZmlsbD0iIzE5NzZkMiIgaWQ9InN2Z18zIiBzdHlsZT0iLS1kYXJrcmVhZGVyLWlubGluZS1maWxsOiAjMTQ1ZWE4OyIvPgogPC9nPgo8L3N2Zz4=')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.w3 {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0xLDlMMywxMUM3Ljk3LDYuMDMgMTYuMDMsNi4wMyAyMSwxMUwyMyw5QzE2LjkzLDIuOTMgNy4wOCwyLjkzIDEsOVoiIHN0eWxlPSJmaWxsOiBncmF5OyIvPgo8cGF0aCBkPSJNNSwxM0w3LDE1QzkuNzYsMTIuMjQgMTQuMjQsMTIuMjQgMTcsMTVMMTksMTNDMTUuMTQsOS4xNCA4Ljg3LDkuMTQgNSwxM1oiIHN0eWxlPSJmaWxsOiBncmF5OyIvPgo8cGF0aCBkPSJNOSwxN0wxMiwyMEwxNSwxN0MxMy4zNSwxNS4zNCAxMC42NiwxNS4zNCA5LDE3WiIgc3R5bGU9ImZpbGw6IGdyYXk7Ii8+Cjwvc3ZnPgo=')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.pwr {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CiA8ZyBjbGFzcz0ibGF5ZXIiPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cGF0aCBkPSJtMTgsOGwtMSwwbDAsLTJjMCwtMi43NiAtMi4yNCwtNSAtNSwtNXMtNSwyLjI0IC01LDVsMCwybC0xLDBjLTEuMSwwIC0yLDAuOSAtMiwybDAsMTBjMCwxLjEgMC45LDIgMiwybDEyLDBjMS4xLDAgMiwtMC45IDIsLTJsMCwtMTBjMCwtMS4xIC0wLjksLTIgLTIsLTJ6bS02LDljLTEuMSwwIC0yLC0wLjkgLTIsLTJzMC45LC0yIDIsLTJzMiwwLjkgMiwycy0wLjksMiAtMiwyem0zLjEsLTlsLTYuMiwwbDAsLTJjMCwtMS43MSAxLjM5LC0zLjEgMy4xLC0zLjFjMS43MSwwIDMuMSwxLjM5IDMuMSwzLjFsMCwyeiIgZmlsbD0iI2ZmMDAwMCIgaWQ9InN2Z18xIi8+CiA8L2c+Cgo8L3N2Zz4=')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.pwg {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgogPGcgY2xhc3M9ImxheWVyIj4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggZD0ibTE4LDhsLTEsMGwwLC0yYzAsLTIuNzYgLTIuMjQsLTUgLTUsLTVzLTUsMi4yNCAtNSw1bDAsMmwtMSwwYy0xLjEsMCAtMiwwLjkgLTIsMmwwLDEwYzAsMS4xIDAuOSwyIDIsMmwxMiwwYzEuMSwwIDIsLTAuOSAyLC0ybDAsLTEwYzAsLTEuMSAtMC45LC0yIC0yLC0yem0tNiw5Yy0xLjEsMCAtMiwtMC45IC0yLC0yczAuOSwtMiAyLC0yczIsMC45IDIsMnMtMC45LDIgLTIsMnptMy4xLC05bC02LjIsMGwwLC0yYzAsLTEuNzEgMS4zOSwtMy4xIDMuMSwtMy4xYzEuNzEsMCAzLjEsMS4zOSAzLjEsMy4xbDAsMnoiIGZpbGw9IiMzZjdmMDAiIGlkPSJzdmdfMSIgc3R5bGU9Ii0tZGFya3JlYWRlci1pbmxpbmUtZmlsbDogIzMyNjYwMDsiLz4KIDwvZz4KPC9zdmc+')
    no-repeat right top;
  height: 24px;
  margin-left: 5px;
}
.button-manual-ssid {
  display: inline-block;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #4c6bb6;
  text-align: left;
  /* border-radius: 10px; */
  border: 4px;
  transition: 0.2s all;
  outline: none;
  box-shadow: 0 2px 16px rgba(97, 97, 97, 0.24);
  background-color: #fff;
  cursor: pointer;
  text-decoration: none;
  width: 100%;
}
.button-manual-ssid:hover {
  box-shadow: inset 0px 0px 2px 2px rgba(97, 97, 97, 0.5);
}
.ssid-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 5px;
  box-shadow: inset 0px 0px 2px 2px rgba(97, 97, 97, 0.5);
}

.ssid-list__item {
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  text-decoration: none;
  cursor: pointer;
}
.ssid-list__item:hover {
  background-color: rgba(97, 97, 97, 0.5);
}
.ssid-list__icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
}
</style>
