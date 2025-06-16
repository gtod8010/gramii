"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "@/hooks/useUser";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  adminOnly?: boolean;
};

const baseNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "대시보드",
    path: "/dashboard",
  },
  {
    icon: <ListIcon />,
    name: "주문하기",
    path: "/order",
  },
  {
    icon: <TableIcon />,
    name: "주문내역",
    path: "/order-history",
  },
  {
    icon: <PageIcon />,
    name: "서비스목록",
    path: "/services",
  },
  {
    icon: <PieChartIcon />,
    name: "충전하기",
    path: "/recharge",
  },
  {
    icon: <PlugInIcon />,
    name: "서비스 관리",
    path: "/manage-services",
    adminOnly: true,
  },
  {
    icon: <UserCircleIcon />,
    name: "회원 관리",
    path: "/manage-users",
    adminOnly: true,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const navItems = React.useMemo(() => {
    if (isLoading) return [];
    if (user && user.role === 'admin') {
      return baseNavItems;
    }
    return baseNavItems.filter(item => !item.adminOnly);
  }, [user, isLoading]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (
    itemsToRender: NavItem[],
    menuType: "main"
  ) => (
    <ul className="flex flex-col gap-4">
      {itemsToRender.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.index === index && openSubmenu?.type === menuType
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.index === index && openSubmenu?.type === menuType
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.index === index && openSubmenu?.type === menuType
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index && openSubmenu?.type === menuType
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`sticky top-0 self-start flex h-screen flex-col overflow-y-hidden bg-gray-900 text-gray-100 duration-300 ease-linear dark:bg-gray-800 lg:translate-x-0 ${
        isExpanded || isHovered ? "w-72" : "w-20"
      } ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 ${
          !isExpanded && !isHovered && !isMobileOpen && "lg:px-3.5"
        } `}
      >
        <Link href="/dashboard" className="flex items-center">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <div className="relative h-12 w-28">
              <Image
                src="/images/gramii_logo.png"
                alt="GRAMII Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          ) : (
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo Icon"
              className="h-8 w-8"
            />
          )}
        </Link>
        {(isExpanded || isHovered || isMobileOpen) && (
          <button
            onClick={toggleMobileSidebar} 
            className="block lg:hidden"
          >
            <HorizontaLDots />
          </button>
        )}
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear flex-grow">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6 flex-grow">
          <div>
            <h3
              className={`mb-4 ml-4 text-sm font-semibold text-gray-400 ${
                (!isExpanded && !isHovered && !isMobileOpen) && "hidden"
              }`}
            >
              메뉴
            </h3>
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
