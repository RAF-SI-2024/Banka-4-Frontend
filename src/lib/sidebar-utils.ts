import { SidebarGroupType } from '@/types/sidebar';
import { Privilege } from '@/types/privileges';

export function filterSidebarItemsByPrivileges(
  items: SidebarGroupType[],
  userPrivilege: Privilege[]
): SidebarGroupType[] {
  return items
    .map((section) => {
      if (section.items === undefined) {
        return { ...section };
      }
      const filteredItems = section.items?.filter((item) =>
        hasRequiredPrivileges(item.privileges, userPrivilege)
      );

      const hasGroupAccess =
        hasRequiredPrivileges(section.privileges, userPrivilege) ||
        (filteredItems && filteredItems.length > 0);

      if (!hasGroupAccess) {
        return null;
      }

      return filteredItems?.length > 0
        ? { ...section, items: filteredItems }
        : null;
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
