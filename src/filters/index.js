export function uppercase(value) {
  return value.toUpperCase();
}

export function lowercase(value) {
  if (value)
    return value.toLowerCase();
}

export function priceAppend(value, unit) {
  if (unit) unit = " " + unit;
  else unit = "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
}

export function pricePrepend(value, unit) {
  if (unit) unit = unit + " ";
  else unit = "";
  return unit + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
