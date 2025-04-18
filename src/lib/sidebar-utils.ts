import { SidebarGroupType } from '@/types/sidebar';
import { Privilege } from '@/types/privileges';

export function filterSidebarItemsByPrivileges(
  items: SidebarGroupType[],
  userPrivilege: Privilege[]
): SidebarGroupType[] {
  return items
    .map((section) => {
      const filteredItems = section.items?.filter((item) =>
        hasRequiredPrivileges(item.privileges, userPrivilege)
      );

      const hasGroupAccess =
        hasRequiredPrivileges(section.privileges, userPrivilege) ||
        (filteredItems && filteredItems.length > 0);

      if (!hasGroupAccess) {
        return null;
      }

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

const hasRequiredPrivileges = (
  requiredPrivileges: Privilege[],
  userPrivileges: Privilege[]
) => {
  return (
    requiredPrivileges.length === 0 ||
    requiredPrivileges.some((priv) => userPrivileges.includes(priv))
  );
};
