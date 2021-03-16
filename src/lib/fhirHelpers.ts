const round = (num: any, digits: number) => {
  return Number.parseFloat(num).toFixed(digits);
};

export const obsValue = (entry: any) => {
  if (entry == null) {
    return "";
  }
  if (entry.valueQuantity) {
    return `${round(entry.valueQuantity.value, 2)} ${entry.valueQuantity.code}`;
  }
  if (entry.valueCodeableConcept) {
    return entry.valueCodeableConcept.coding[0].display;
  }
  if (entry.valueString) {
    return entry.valueString;
  }

  if (entry.code.coding[0].display === "Blood Pressure") {
    if (!entry.component[0].valueQuantity) {
      return "";
    }

    const v1 = Number.parseFloat(entry.component[0].valueQuantity.value);
    const v2 = Number.parseFloat(entry.component[1].valueQuantity.value);

    const s1 = v1.toFixed(0);
    const s2 = v2.toFixed(0);

    if (v1 > v2) {
      return `${s1} / ${s2} mmHg`;
    }
    return `${s2} / ${s1} mmHg`;
  }

  return "";
};

export const getReadableNameFromUser = (name: any, withComma = false) => {
  if (name?.formatted) {
    return name.formatted;
  }
  return withComma
    ? `${name?.givenFamily}, ${name?.givenName}`
    : ` ${name?.givenName} ${name?.givenFamily}`;
};
