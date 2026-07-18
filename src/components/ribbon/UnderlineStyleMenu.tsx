"use client";

import { RibbonMenuItem, RibbonMenuSeparator } from "./RibbonPrimitives";
import { UnderlinePreview } from "./RibbonIcons";
import { UNDERLINE_COLOR_SWATCHES, WORD_UNDERLINE_STYLES } from "./constants";

export function UnderlineStyleMenu({
  onClose,
  onSelectStyle,
  onSelectColor,
  onRemove,
}: {
  onClose: () => void;
  onSelectStyle: (style: string, thickness: string) => void;
  onSelectColor: (color: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="ribbon-underline-menu">
      <div className="ribbon-underline-previews" role="group" aria-label="Underline styles">
        {WORD_UNDERLINE_STYLES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            title={item.label}
            className="ribbon-underline-preview-btn"
            onClick={() => {
              onSelectStyle(item.style, item.thickness);
              onClose();
            }}
          >
            <UnderlinePreview style={item.style} thickness={item.thickness} />
          </button>
        ))}
      </div>
      <RibbonMenuSeparator />
      <RibbonMenuItem
        label="None"
        onClick={() => {
          onRemove();
          onClose();
        }}
      />
      <RibbonMenuSeparator />
      <RibbonMenuItem label="More Underlines..." onClick={onClose} />
      <div className="ribbon-underline-color-row">
        <span className="ribbon-underline-color-label">
          Underline Color <span aria-hidden>›</span>
        </span>
        <div className="ribbon-underline-color-grid">
          {UNDERLINE_COLOR_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              className="ribbon-color-swatch"
              style={{ backgroundColor: color, border: color === "#ffffff" ? "1px solid #666" : undefined }}
              onClick={() => {
                onSelectColor(color);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
