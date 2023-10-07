import { httpClient } from './httpClient';

/**
 * Post esp32 settings
 * @param data
 * @return true if esp32 configuration success
 */
export async function createSetup(setup) {
  for (const [key, value] of Object.entries(setup)) {
    const url = '/setup/' + `${key}`;
    const { success, result } = await httpClient.post(url, value);
    if (!success) {
      return { success: success, message: result.message };
    }
  }
  return { success: true, message: null };
}

/**
 * Post esp32 connect after settings
 * @param data
 * @return true if command send success
 */
export async function Connect() {
  try {
    const { success, result } = await httpClient.get('/connect');
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
