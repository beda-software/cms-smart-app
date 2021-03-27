const data: Record<string, string> = {
  URL: "",
  LOGIN: "",
  CLIENT: "",
  SCOPE: "",
};

const stripTrailingSlash = (str: string) => {
  return str.endsWith("/") ? str.slice(0, -1) : str;
};

const env = (typeof process && process.env) || {};

Object.keys(data).forEach((varName) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  data[varName] = env[`REACT_APP_${varName}`] || window[`REACT_APP_${varName}`];
});

data.URL = stripTrailingSlash(data.URL);

export default data;
