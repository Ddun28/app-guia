import { DashBoard, User } from "@/components/svg";

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
    {
      title: "Perfil",
      icon: User,
      href: "/user-profile",
    },
  ],
  sidebarNav: {
    modern: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        title: "Mi Perfil",
        icon: User,
        href: "/user-profile",
      },
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
      },
      {
        isHeader: true,
        title: "Cuenta",
      },
      {
        title: "Mi Perfil",
        icon: User,
        href: "/user-profile",
      },
    ],
  },
};