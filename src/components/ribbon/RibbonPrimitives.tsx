"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { IconChevronDown, IconGroupLauncher, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify } from "./RibbonIcons";

type FloatingAlign = "left" | "right";

function useRibbonFloatingMenu(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  options?: {
    maxHeight?: number;
    align?: FloatingAlign;
    containerRef?: RefObject<HTMLElement | null>;
  },
) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const maxHeight = options?.maxHeight ?? 320;
  const align = options?.align ?? "left";
  const containerRef = options?.containerRef ?? anchorRef;

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < Math.min(maxHeight, 200) && spaceAbove > spaceBelow;

    const style: CSSProperties = {
      position: "fixed",
      zIndex: 10000,
      maxHeight,
      overflowY: "auto",
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 2 }
        : { top: rect.bottom + 2 }),
    };

    if (align === "right") {
      style.right = window.innerWidth - rect.right;
    } else {
      style.left = rect.left;
      style.minWidth = rect.width;
    }

    setMenuStyle(style);
  }, [anchorRef, maxHeight, align]);

  useEffect(() => {
    if (!open) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, containerRef]);

  return { menuRef, menuStyle };
}

function RibbonFloatingMenu({
  open,
  anchorRef,
  containerRef,
  onClose,
  children,
  className = "",
  role,
  align = "left",
  maxHeight = 320,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  containerRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  role?: string;
  align?: FloatingAlign;
  maxHeight?: number;
}) {
  const { menuRef, menuStyle } = useRibbonFloatingMenu(open, anchorRef, onClose, {
    maxHeight,
    align,
    containerRef,
  });

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      className={`ribbon-menu ribbon-menu-portal ${align === "right" ? "ribbon-menu-right" : ""} ${className}`.trim()}
      role={role}
      style={menuStyle}
    >
      {children}
    </div>,
    document.body,
  );
}

export function RibbonDivider() {
  return <div className="ribbon-divider" aria-hidden />;
}

export function RibbonGroup({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ribbon-group ${className}`} aria-label={label}>
      <div className="ribbon-group-body">{children}</div>
      <div className="ribbon-group-footer">
        <span className="ribbon-group-label">{label}</span>
        <button type="button" className="ribbon-group-launcher" aria-label={`${label} options`}>
          <IconGroupLauncher />
        </button>
      </div>
    </section>
  );
}

export function RibbonRow({ children }: { children: ReactNode }) {
  return <div className="ribbon-row">{children}</div>;
}

export function RibbonButton({
  title,
  active,
  onClick,
  children,
  className = "",
  disabled,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`ribbon-btn ${active ? "ribbon-btn-active" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export function RibbonSplitButton({
  title,
  active,
  onMainClick,
  onArrowClick,
  dropdownOpen,
  onClose,
  children,
  menu,
}: {
  title: string;
  active?: boolean;
  onMainClick: () => void;
  onArrowClick: () => void;
  dropdownOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
  menu?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="ribbon-split">
      <button
        type="button"
        title={title}
        aria-label={title}
        aria-pressed={active}
        onClick={onMainClick}
        className={`ribbon-split-main ${active ? "ribbon-btn-active" : ""}`}
      >
        {children}
      </button>
      <button
        type="button"
        title={`${title} options`}
        aria-label={`${title} options`}
        aria-expanded={dropdownOpen}
        onClick={onArrowClick}
        className={`ribbon-split-arrow ${dropdownOpen ? "ribbon-btn-active" : ""}`}
      >
        <IconChevronDown size={7} />
      </button>
      <RibbonFloatingMenu
        open={Boolean(dropdownOpen && menu)}
        anchorRef={wrapRef}
        onClose={() => onClose?.()}
      >
        {menu}
      </RibbonFloatingMenu>
    </div>
  );
}

export function RibbonSelect({
  label,
  value,
  displayValue,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  displayValue?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { menuStyle, menuRef } = useRibbonFloatingMenu(open, triggerRef, () => setOpen(false), {
    maxHeight: 240,
    containerRef: wrapRef,
  });

  const selectedLabel =
    displayValue ??
    options.find((opt) => opt.value === value)?.label ??
    value;

  const menu = open ? (
    <ul
      ref={menuRef as RefObject<HTMLUListElement | null>}
      className="ribbon-select-menu ribbon-select-menu-portal"
      role="listbox"
      aria-label={label}
      style={menuStyle}
    >
      {options.map((opt) => (
        <li key={opt.value} role="none">
          <button
            type="button"
            role="option"
            aria-selected={opt.value === value}
            className={`ribbon-select-option ${opt.value === value ? "ribbon-select-option-active" : ""}`}
            style={{ fontFamily: opt.value }}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div ref={wrapRef} className={`ribbon-select-wrap ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`ribbon-select-trigger ${open ? "ribbon-select-trigger-open" : ""}`}
      >
        <span className="ribbon-select-display">{selectedLabel}</span>
        <IconChevronDown size={7} className="ribbon-select-chevron" />
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

export function RibbonMenuPanel({
  open,
  onClose,
  anchorRef,
  children,
  className = "",
  align = "left",
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <RibbonFloatingMenu
      open={open}
      anchorRef={anchorRef}
      onClose={onClose}
      className={`ribbon-menu-panel ${className}`.trim()}
      role="menu"
      align={align}
    >
      {children}
    </RibbonFloatingMenu>
  );
}

export function RibbonMenuItem({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`ribbon-menu-item ${active ? "ribbon-menu-item-active" : ""}`}
    >
      {children ?? label}
    </button>
  );
}

export function RibbonMenuSeparator() {
  return <div className="ribbon-menu-separator" role="separator" />;
}

export function RibbonDropdownButton({
  title,
  open,
  onToggle,
  children,
  menu,
  className = "",
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  menu: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div ref={wrapRef} className={`ribbon-dropdown ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        title={title}
        aria-label={title}
        aria-expanded={open}
        onClick={onToggle}
        className={`ribbon-dropdown-trigger ${open ? "ribbon-btn-active" : ""}`}
      >
        {children}
        <IconChevronDown size={7} />
      </button>
      <RibbonFloatingMenu
        open={open}
        anchorRef={triggerRef}
        containerRef={wrapRef}
        onClose={onToggle}
        role="menu"
      >
        {menu}
      </RibbonFloatingMenu>
    </div>
  );
}

export function RibbonLargeButton({
  title,
  onClick,
  icon,
  label,
}: {
  title: string;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className="ribbon-large-btn">
      {icon}
      <span className="ribbon-large-btn-label">{label}</span>
    </button>
  );
}

export function RibbonAlignGroup({
  activeAlign,
  onAlign,
}: {
  activeAlign: string;
  onAlign: (align: "left" | "center" | "right" | "justify") => void;
}) {
  const buttons = [
    { align: "left" as const, title: "Align Left", Icon: IconAlignLeft },
    { align: "center" as const, title: "Center", Icon: IconAlignCenter },
    { align: "right" as const, title: "Align Right", Icon: IconAlignRight },
    { align: "justify" as const, title: "Justify", Icon: IconAlignJustify },
  ];

  return (
    <div className="ribbon-align-group" role="group" aria-label="Alignment">
      {buttons.map(({ align, title, Icon }) => (
        <button
          key={align}
          type="button"
          title={title}
          aria-label={title}
          aria-pressed={activeAlign === align}
          onClick={() => onAlign(align)}
          className={`ribbon-align-btn ${activeAlign === align ? "ribbon-btn-active" : ""}`}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
}

export function useRibbonMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggle = (id: string) => setOpenMenu((current) => (current === id ? null : id));
  const close = () => setOpenMenu(null);
  const isOpen = (id: string) => openMenu === id;
  return { openMenu, toggle, close, isOpen };
}
