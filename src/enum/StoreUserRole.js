const StoreUserRole = {
  valueArray: ['STORE_OWNER', 'STORE_MANAGER', 'STORE_CHEF', 'STORE_CASHIER', 'STORE_WAITER'],
  labelArray: ['Chủ cửa hàng', 'Quản lý', 'Đầu bếp', 'Thu ngân', 'Bồi bàn'],
  value: {
    STORE_OWNER: 'STORE_OWNER',
    STORE_MANAGER: 'STORE_MANAGER',
    STORE_CHEF: 'STORE_CHEF',
    STORE_CASHIER: 'STORE_CASHIER',
    STORE_WAITER: 'STORE_WAITER',
  },
  label: {
    STORE_OWNER: 'Chủ cửa hàng',
    STORE_MANAGER: 'Quản lý',
    STORE_CHEF: 'Đầu bếp',
    STORE_CASHIER: 'Thu ngân',
    STORE_WAITER: 'Bồi bàn',
  },
  optionArray: [
    {value: 'STORE_OWNER', label: 'Chủ cửa hàng'},
    {value: 'STORE_MANAGER', label: 'Quản lý'},
    {value: 'STORE_CHEF', label: 'Đầu bếp'},
    {value: 'STORE_CASHIER', label: 'Thu ngân'},
    {value: 'STORE_WAITER', label: 'Bồi bàn'},
  ],
};
export default StoreUserRole;