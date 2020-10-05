import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function hasAnyRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.state.user.authorities || [];
    const permissionRoles = value;

    return roles.some(role => {
      return permissionRoles.includes(role);
    });
  } else {
    // console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
}
