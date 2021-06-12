const NodeGeocoder = require("node-geocoder");
const config = require("config");
const options = {
  provider: config.GEOCODER_PROVIDER,
  httpAdapter: "https",
  //   fetch: customFetchImplementation,
  apiKey: config.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
