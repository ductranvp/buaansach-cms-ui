const filters = {
  uppercase(value) {
    if (value)
      return value.toUpperCase();
    return value;
  },

  lowercase(value) {
    if (value)
      return value.toLowerCase();
    return value;
  },

  priceAppend(value, unit) {
    if (!unit) unit = "₫";
    if (value === undefined || value == null) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
  },

  capitalize(value) {
    if (value) {
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  },

  truncate(value, length) {
    if (value && value.length > length) return value.substr(0, length) + '...';
    return value;
  }
};
export default filters;
