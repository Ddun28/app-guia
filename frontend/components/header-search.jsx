import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@iconify/react";

const HeaderSearch = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="xl" className="p-0 " hiddenCloseIcon>
        <DialogHeader className="hidden">
          <DialogTitle className="hidden"></DialogTitle>
        </DialogHeader>
        <Command>
          <div className="flex items-center border-b border-border">
            <CommandInput
              placeholder="Buscar en la aplicación..."
              className="h-14"
              inputWrapper="px-3.5 flex-1 border-none"
            />
            <div className="flex-none flex items-center justify-center gap-1 pr-4">
              <span className="text-sm text-default-500 font-normal select-none">
                [esc]
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent text-xs hover:text-default-800 px-1"
                onClick={() => setOpen(false)}
              >
                {" "}
                <X className="w-5 h-5 text-default-500" />
              </Button>
            </div>
          </div>
          <CommandList className="py-5 px-7 max-h-[500px]">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Sección: Navegación Principal */}
              <CommandGroup
                heading="Navegación Principal"
                className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5
                [&_[cmdk-group-heading]]:uppercase    [&_[cmdk-group-heading]]:tracking-widest
                "
              >
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/dashboard"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:chart-bar" />
                    <span>Dashboard</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/nutrition-guide"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:book-open" />
                    <span>Guía de Nutrición</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/portion-calculator"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:calculator" />
                    <span>Calculadora de Porciones</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0">
                  <Link
                    href="/user-profile"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:user" />
                    <span>Mi Perfil</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
    
              {/* Sección: Búsquedas Populares 
              <CommandGroup
                heading="Búsquedas Populares"
                className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5
                [&_[cmdk-group-heading]]:uppercase    [&_[cmdk-group-heading]]:tracking-widest
                "
              >
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/calendar-page"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:calendar-days" />
                    <span>Calendario</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/dashboard"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:chart-bar" />
                    <span>Analíticas</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/ecommerce"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:shopping-bag" />
                    <span>eCommerce</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0">
                  <Link
                    href="/project"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:building-library" />
                    <span>Página de Proyecto</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
                */}
              {/* Sección: Aplicaciones y Páginas 
              <CommandGroup
                heading="Aplicaciones y Páginas"
                className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5
                [&_[cmdk-group-heading]]:uppercase    [&_[cmdk-group-heading]]:tracking-widest
                "
              >
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/chat"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:chat-bubble-bottom-center" />
                    <span>Chat</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/email"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:envelope" />
                    <span>Email</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/dashboard"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:user" />
                    <span>Iniciar Sesión</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0">
                  <Link
                    href="/calendar-page"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:chart-bar" />
                    <span>Appex Chart</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
                */}
              {/* Sección: Elementos de UI 
              <CommandGroup
                heading="Elementos de UI"
                className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5
                [&_[cmdk-group-heading]]:uppercase    [&_[cmdk-group-heading]]:tracking-widest"
              >
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/accordion"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:bars-3" />
                    <span>Acordeón</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-1">
                  <Link
                    href="/checkbox"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:check" />
                    <span>Checkboxes</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-1">
                  <Link
                    href="/alert"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:megaphone" />
                    <span>Alertas</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-1">
                  <Link
                    href="/pagination"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:document-text" />
                    <span>Paginación</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
                */}
              {/* Sección: Formularios y Tablas 
              <CommandGroup
                heading="Formularios y Tablas"
                className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-default-400 [&_[cmdk-group-heading]]:mb-2.5
                [&_[cmdk-group-heading]]:uppercase    [&_[cmdk-group-heading]]:tracking-widest"
              >
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/simple-table"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Tabla Simple</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/tailwindui-table"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Tabla Tailwind UI</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0 mb-2.5">
                  <Link
                    href="/data-table"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:table-cells" />
                    <span>Tabla Tanstack</span>
                  </Link>
                </CommandItem>
                <CommandItem className="aria-selected:bg-transparent p-0">
                  <Link
                    href="/calendar-page"
                    className="flex gap-1 items-center px-2 text-default-500 hover:text-primary "
                  >
                    <Icon icon="heroicons:clipboard-document-list" />
                    <span>Formularios</span>
                  </Link>
                </CommandItem>
              </CommandGroup>
              */}
            </div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderSearch;