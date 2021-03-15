const data: Record<string, string> = {
  FHIR_SERVER: "",
  CLIENT_LOGIN: "",
  CLIENT_SMART: "",
  SCOPE: "",
};

const env = (typeof process && process.env) || {};

Object.keys(data).forEach((varName) => {
  data[varName] = env[`REACT_APP_${varName}`] || data[varName];
});

export default data;
