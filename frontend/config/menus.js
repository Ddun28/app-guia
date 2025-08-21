import { DashBoard, User } from "@/components/svg";
import { Utensils, Calculator } from "lucide-react";

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/dashboard",
    },
    {
      title: "Guía de Nutrición",
      icon: Utensils,
      href: "/nutrition-guide",
    },
    {
      title: "Calculadora de Porciones",
      icon: Calculator,
      href: "/portion-calculator",
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
        title: "Guía de Nutrición",
        icon: Utensils,
        href: "/nutrition-guide",
      },
      {
        title: "Calculadora de Porciones",
        icon: Calculator,
        href: "/portion-calculator",
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
        title: "Herramientas",
      },
      {
        title: "Guía de Nutrición",
        icon: Utensils,
        href: "/nutrition-guide",
      },
      {
        title: "Calculadora de Porciones",
        icon: Calculator,
        href: "/portion-calculator",
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