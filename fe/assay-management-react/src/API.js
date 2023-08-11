import { API_BASE_URL } from './config';

const postConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const putConfig = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
};

const apiSettings = {
  createPlate: async (description, n_wells) => {
    const endpoint = `${API_BASE_URL}/plate`;
    return await (
      await fetch(endpoint, {
        ...postConfig,
        body: JSON.stringify({ description, n_wells })
      })).json();
  },
  fetchPlates: async (page=1) => {
    const endpoint = `${API_BASE_URL}/plates?page=${page}`;
    return await (await fetch(endpoint)).json();
  },
  fetchPlate: async (plate_id) => {
    const endpoint = `${API_BASE_URL}/plate/${plate_id}`;
    return await (await fetch(endpoint)).json();
  },
  fetchWell: async (plate_id, well_id) => {
    const endpoint = `${API_BASE_URL}/plate/${plate_id}/well/${well_id}`;
    return await (await fetch(endpoint)).json();
  },
  upsertWell: async (plate_id, well_id=1, reagent=null, antibody=null, concentration=null) => {
    const endpoint = `${API_BASE_URL}/plate/${plate_id}/well/${well_id}`;
    return await (
      await fetch(endpoint, {
        ...putConfig,
        body: JSON.stringify({
          reagent,
          antibody,
          concentration
        })
      })).json();
  },
  deletePlate: async (plate_id) => {
    const endpoint = `${API_BASE_URL}/plate/${plate_id}`;
    return await (await fetch(endpoint, { method: 'DELETE' })).json();
  },
};

export default apiSettings;
