"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconChevronDown, IconGroupLauncher, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify } from "./RibbonIcons";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, onClose]);

  return (
    <div ref={ref} className="ribbon-split">
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
      {dropdownOpen && menu ? <div className="ribbon-menu">{menu}</div> : null}
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel =
    displayValue ??
    options.find((opt) => opt.value === value)?.label ??
    value;

  return (
    <div ref={ref} className={`ribbon-select-wrap ${className}`}>
      <button
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
      {open ? (
        <ul className="ribbon-select-menu" role="listbox" aria-label={label}>
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
      ) : null}
    </div>
  );
}

export function RibbonMenuPanel({
  open,
  onClose,
  children,
  className = "",
  align = "left",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`ribbon-menu ribbon-menu-panel ${align === "right" ? "ribbon-menu-right" : ""} ${className}`}
      role="menu"
    >
      {children}
    </div>
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  return (
    <div ref={ref} className={`ribbon-dropdown ${className}`}>
      <button
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
      {open ? <div className="ribbon-menu">{menu}</div> : null}
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
