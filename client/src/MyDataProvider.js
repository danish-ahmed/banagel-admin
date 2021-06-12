import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

import { API_URL } from "./config";
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("x-auth-token", localStorage.getItem("token"));
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider(API_URL, httpClient);

const myDataProvider = {
  ...dataProvider,
  update: (resource, params) => {
    if (resource !== "posts" || !params.data.pictures) {
      // fallback to the default implementation
      return dataProvider.update(resource, params);
    }
    // The posts edition form uses a file upload widget for the pictures field.
    // Freshly dropped pictures are File objects
    // and must be converted to base64 strings
    const newPictures = params.data.pictures.filter((p) => p.rawFile);
    const formerPictures = params.data.pictures.filter((p) => !p.rawFile);

    return Promise.all(newPictures.map(convertFileToBase64))
      .then((base64Pictures) =>
        base64Pictures.map((picture64) => ({
          src: picture64,
          title: `${params.data.title}`,
        }))
      )
      .then((transformedNewPictures) =>
        dataProvider.update(resource, {
          ...params,
          data: {
            ...params.data,
            pictures: [...transformedNewPictures, ...formerPictures],
          },
        })
      );
  },
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file.rawFile);
  });

export default myDataProvider;
