const { Client } = require("@googlemaps/google-maps-services-js");

const paramsSerializer = (params) => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

const getDistanceFromGoogleAPI = async (locationFrom, locationTo) => {
  try {
    const client = new Client({});
    const locationFromLatLng = [locationFrom.latitude, locationFrom.longitude];
    const locationToLatLng = [locationTo.latitude, locationTo.longitude];

    const request = {
      params: {
        destinations: locationToLatLng,
        origins: locationFromLatLng,
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000,
      paramsSerializer: paramsSerializer
    };

    const response = await client.distancematrix(request);

    if (response.data.status === "OK" && response.data.rows.length > 0) {
      console.log(`Відстань між ${1} і ${2}}`, response.data.rows[0].elements);
      return response.data.rows[0].elements;
    } else {
      console.log("Не вдалося отримати відстань.");
    }
  } catch (error) {
    console.log(error)
    console.error("Помилка при отриманні відстані:", error.message);
  }
};

module.exports = {
  getDistanceFromGoogleAPI
};

