import { DashBoard, User } from "@/components/svg";
import { Utensils, Calculator, Camera } from "lucide-react";

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
      title: "Escáner de Frutas",
      icon: Camera,
      href: "/FruitScanner",
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
        title: "Escáner de Frutas",
      icon: Camera,
      href: "/FruitScanner",
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
      title: "Escáner de Frutas",
      icon: Camera,
      href: "/FruitScanner",
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