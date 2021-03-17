function match(o: any, pattern: any): any {
  try {
    return Object.keys(pattern).reduce(
      (acc, k) => acc && o[k] === pattern[k],
      true
    );
  } catch (e) {
    return false;
  }
}

export function getIn(obj: any, path: any, defaultValue?: any): any {
  const result = path.reduce(
    (o: any, k: any) => {
      if (o == null) {
        return null;
      }
      if (typeof k === "string" && typeof o === "object") {
        return o[k];
      }
      if (typeof k === "number" && Array.isArray(o)) {
        return o[k];
      }
      if (typeof k === "object" && Array.isArray(o)) {
        return o.filter((el) => match(el, k));
      }
      if (typeof k === "function" && Array.isArray(o)) {
        return o.filter(k);
      }
      return null;
    },
    obj,
    path
  );
  return result || defaultValue;
}
