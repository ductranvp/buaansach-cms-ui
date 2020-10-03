const filters = {
  uppercase(value) {
    return value.toUpperCase();
  },

  lowercase(value) {
    if (value)
      return value.toLowerCase();
  },

  priceAppend(value, unit) {
    if (unit) unit = " " + unit;
    else unit = "₫";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
  },

  capitalize(value) {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  },

  truncate(value, length) {
    if (value.length > length) return value.substr(0, length) + '...';
    return value;
  }
};
export default filters;
