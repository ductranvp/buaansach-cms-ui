export function uppercase(value) {
  return value.toUpperCase();
}

export function lowercase(value) {
  if (value)
    return value.toLowerCase();
}

export function price(value, unit) {
  if (unit) unit = " " + unit;
  else unit = "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
}
