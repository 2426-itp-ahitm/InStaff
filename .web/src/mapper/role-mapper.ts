import { loadAllRoles } from './../components/role-list/role-list-service';

class RoleMapper {
   async loadRoles() {
      const roles = await loadAllRoles();
      return roles.reduce((acc, role) => {
         acc[role.id] = role.roleName;
         return acc;
      }, {} as Record<number, string>);
   }

   async mapRoleIdsToNames(roleIds: number[]) {
      const rolesMap = await this.loadRoles();
      return roleIds.map(roleId => rolesMap[roleId]);
   }
}

export default RoleMapper