import { httpClient } from './httpClient';

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
export async function createSetup(wifiData, wifiCa, wifiCrt, wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey) {
  // console.log('WIFI Size:', JSON.stringify(wifiData).length);
  // console.log('WIFI obj:', wifiData);
  // console.log('WIFI CA:', wifiCa);
  // console.log('WIFI CRT:', wifiCrt);
  // console.log('WIFI KEY:', wifiKey);
  // console.log('IPV4 obj:', ipv4Data);
  // console.log('HTTP obj:', httpData);
  // console.log('HTTP CA:', httpCa);
  // console.log('HTTP CRT:', httpCrt);
  // console.log('HTTP KEY:', httpKey);

  try {
    const { success } = await httpClient.post('/setup/wifi', wifiData);
    return {
      success: success,
      message: success
        ? (await wifiCaSetup(wifiCa, wifiCrt, wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey)).message
        : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function wifiCaSetup(wifiCa, wifiCrt, wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/wifi/ca', wifiCa);
    return {
      success: success,
      message: success
        ? (await wifiCrtSetup(wifiCrt, wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey)).message
        : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function wifiCrtSetup(wifiCrt, wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/wifi/crt', wifiCrt);
    return {
      success: success,
      message: success ? (await wifiKeySetup(wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function wifiKeySetup(wifiKey, ipv4Data, httpData, httpCa, httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/wifi/key', wifiKey);
    return {
      success: success,
      message: success ? (await ipv4Setup(ipv4Data, httpData, httpCa, httpCrt, httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function ipv4Setup(ipv4Data, httpData, httpCa, httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/ipv4', ipv4Data);
    return {
      success: success,
      message: success ? (await httpSetup(httpData, httpCa, httpCrt, httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function httpSetup(httpData, httpCa, httpCrt, httpKey) {
  try {
    //console.log(httpData);
    const { success } = await httpClient.post('/setup/http', httpData);
    return {
      success: success,
      message: success ? (await httpCaSetup(httpCa, httpCrt, httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function httpCaSetup(httpCa, httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/http/ca', httpCa);
    return {
      success: success,
      message: success ? (await httpCrtSetup(httpCrt, httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function httpCrtSetup(httpCrt, httpKey) {
  try {
    const { success } = await httpClient.post('/setup/http/crt', httpCrt);
    return {
      success: success,
      message: success ? (await httpKeySetup(httpKey)).message : null,
    };
  } catch {
    return { success: false, message: null };
  }
}

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
async function httpKeySetup(httpKey) {
  try {
    const { success, result } = await httpClient.post('/setup/http/key', httpKey);
    return { success: success, message: result.message };
  } catch {
    return { success: false, message: null };
  }
}

// async function upload(data) {
//   const json = JSON.stringify(data);
//   const size = json.length + 1;
//   const chunks = json.match(/.{1,7000}/g);
//   const count = chunks.length;

//   console.log('Count:', count);

//   const post_chunk = async (id) => {
//     console.log('ID:', id);
//     return await httpClient
//       .post('/setup/wifi', {
//         part_id: id,
//         count: count,
//         size: size,
//         chunk_size: chunks[id].length,
//         data: chunks[id],
//       })
//       .then(({ success, result }) => {
//         return id < count ? post_chunk(id + 1) : { success: success, message: result.message };
//       })
//       .catch((error) => {
//         return { success: false, message: error };
//       });
//   };

//   return await post_chunk(0);
// }
