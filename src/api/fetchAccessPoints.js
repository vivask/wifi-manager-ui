import { httpClient } from './httpClient';

/**
 * Request wifi access points
 * @returns {Promise<any>}
 */
export async function GetAccessPoints() {
  return await httpClient.get('/wifi/ap');
}
