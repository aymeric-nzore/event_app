import axios from "axios";

export const geoCode = async (adress) => {
  const { data } = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: adress,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1,
        language: "fr",
      },
    },
  );
  if (!data.results.length) throw new Error("Adresse introuvable");
  const { lat, lng } = data.results[0].geometry;
  return { lat, lng, formatted: data.results[0].formatted };
};
