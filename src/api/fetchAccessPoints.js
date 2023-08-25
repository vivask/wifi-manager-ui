import { httpClient } from './httpClient';

/**
 * Request wifi access points
 * @returns {Promise<any>}
 */
export async function GetAccessPoints() {
  const empty = [];
  try {
    const { success, result } = await httpClient.get('/wifi/ap');
    return success ? result : empty;
  } catch {
    return empty;
  }
}
