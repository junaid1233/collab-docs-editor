"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import {
  BULLET_STYLES,
  FONT_FAMILIES,
  FONT_SIZES,
  HIGHLIGHT_COLORS,
  LINE_SPACINGS,
  NUMBER_STYLES,
  TEXT_COLORS,
} from "@/lib/tiptap/extensions";
import { RIBBON_TABS } from "./constants";
import {
  IconBorders,
  IconBullets,
  IconClearFormat,
  IconCopy,
  IconCut,
  IconDecreaseIndent,
  IconFontColor,
  IconFormatPainter,
  IconGrowFont,
  IconHighlight,
  IconIncreaseIndent,
  IconLineSpacing,
  IconMultilevelList,
  IconNumbering,
  IconPaste,
  IconShading,
  IconShowMarks,
  IconShrinkFont,
  IconSort,
  IconTextEffects,
} from "./RibbonIcons";
import {
  RibbonAlignGroup,
  RibbonButton,
  RibbonDivider,
  RibbonDropdownButton,
  RibbonGroup,
  RibbonLargeButton,
  RibbonMenuItem,
  RibbonMenuSeparator,
  RibbonRow,
  RibbonSelect,
  RibbonSplitButton,
  useRibbonMenu,
} from "./RibbonPrimitives";
import { UnderlineStyleMenu } from "./UnderlineStyleMenu";

function getCurrentFontSize(editor: Editor): string {
  return editor.getAttributes("textStyle").fontSize || "12pt";
}

function getCurrentFontFamily(editor: Editor): string {
  return editor.getAttributes("textStyle").fontFamily || FONT_FAMILIES[0].value;
}

function getFontLabel(value: string) {
  return FONT_FAMILIES.find((f) => f.value === value)?.label ?? "Aptos (Body)";
}

function getActiveAlign(editor: Editor) {
  if (editor.isActive({ textAlign: "center" })) return "center";
  if (editor.isActive({ textAlign: "right" })) return "right";
  if (editor.isActive({ textAlign: "justify" })) return "justify";
  return "left";
}

function ColorPickerMenu({
  colors,
  onPick,
  showNone,
}: {
  colors: readonly string[];
  onPick: (color: string) => void;
  showNone?: boolean;
}) {
  return (
    <>
      {showNone ? (
        <RibbonMenuItem label="None" onClick={() => onPick("transparent")} />
      ) : null}
      <div className="ribbon-color-grid">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            className="ribbon-color-swatch"
            style={{ backgroundColor: color === "transparent" ? "#fff" : color }}
            onClick={() => onPick(color)}
          />
        ))}
      </div>
    </>
  );
}

export function WordRibbon({ editor }: { editor: Editor }) {
  const [activeTab, setActiveTab] = useState("Home");
  const { toggle, close, isOpen } = useRibbonMenu();
  const [underlineOpen, setUnderlineOpen] = useState(false);
  const [fontColor, setFontColor] = useState("#e81123");

  const currentSize = getCurrentFontSize(editor);
  const currentFont = getCurrentFontFamily(editor);
  const activeAlign = getActiveAlign(editor);

  function changeCase(mode: string) {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    if (!text) return;
    let transformed = text;
    switch (mode) {
      case "uppercase":
        transformed = text.toUpperCase();
        break;
      case "lowercase":
        transformed = text.toLowerCase();
        break;
      case "capitalize":
        transformed = text.replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case "sentence":
        transformed = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
      default:
        break;
    }
    editor.chain().focus().insertContentAt({ from, to }, transformed).run();
    close();
  }

  function adjustFontSize(delta: number) {
    const sizeStr = getCurrentFontSize(editor).replace("pt", "");
    const size = parseInt(sizeStr, 10) || 12;
    const idx = FONT_SIZES.findIndex((s) => parseInt(s, 10) >= size + delta);
    const newSize = FONT_SIZES[Math.max(0, Math.min(FONT_SIZES.length - 1, idx))];
    editor.chain().focus().setFontSize(newSize).run();
  }

  function handlePaste() {
    void navigator.clipboard.readText().then((text) => {
      editor.chain().focus().insertContent(text).run();
    });
    close();
  }

  function applyUnderlineStyle(style: string, thickness: string) {
    editor.chain().focus().setUnderlineStyle({ style, thickness }).run();
  }

  function applyUnderlineColor(color: string) {
    editor.chain().focus().setUnderlineStyle({ style: "solid", thickness: "1px", color }).run();
  }

  return (
    <div className="word-ribbon-shell">
      <nav className="word-ribbon-tabs" aria-label="Document tabs">
        {RIBBON_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`word-ribbon-tab ${activeTab === tab ? "word-ribbon-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
            disabled={tab !== "Home" && tab !== "File"}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="word-ribbon-content">
        <div className="word-ribbon-scroll">
          {/* Clipboard */}
          <RibbonGroup label="Clipboard" className="ribbon-group-clipboard">
            <div className="ribbon-clipboard-layout">
              <RibbonLargeButton
                title="Paste"
                label="Paste"
                icon={<IconPaste size={28} />}
                onClick={handlePaste}
              />
              <div className="ribbon-clipboard-stack">
                <RibbonButton title="Cut" onClick={() => document.execCommand("cut")}>
                  <IconCut />
                </RibbonButton>
                <RibbonButton title="Copy" onClick={() => document.execCommand("copy")}>
                  <IconCopy />
                </RibbonButton>
                <RibbonButton
                  title="Format Painter"
                  onClick={() => editor.chain().focus().unsetAllMarks().run()}
                >
                  <IconFormatPainter />
                </RibbonButton>
              </div>
            </div>
          </RibbonGroup>

          <RibbonDivider />

          {/* Font */}
          <RibbonGroup label="Font" className="ribbon-group-font">
            <RibbonRow>
              <RibbonSelect
                label="Font"
                value={currentFont}
                displayValue={getFontLabel(currentFont)}
                className="ribbon-font-select"
                options={FONT_FAMILIES.map((f) => ({ label: f.label, value: f.value }))}
                onChange={(value) => editor.chain().focus().setFontFamily(value).run()}
              />
              <RibbonSelect
                label="Font size"
                value={currentSize}
                displayValue={currentSize.replace("pt", "")}
                className="ribbon-size-select"
                options={FONT_SIZES.map((s) => ({ label: s.replace("pt", ""), value: s }))}
                onChange={(value) => editor.chain().focus().setFontSize(value).run()}
              />
              <RibbonButton title="Grow Font" onClick={() => adjustFontSize(1)}>
                <IconGrowFont />
              </RibbonButton>
              <RibbonButton title="Shrink Font" onClick={() => adjustFontSize(-1)}>
                <IconShrinkFont />
              </RibbonButton>
              <RibbonDropdownButton
                title="Change Case"
                open={isOpen("case")}
                onToggle={() => toggle("case")}
                menu={
                  <>
                    <RibbonMenuItem label="Sentence case" onClick={() => changeCase("sentence")} />
                    <RibbonMenuItem label="lowercase" onClick={() => changeCase("lowercase")} />
                    <RibbonMenuItem label="UPPERCASE" onClick={() => changeCase("uppercase")} />
                    <RibbonMenuItem
                      label="Capitalize Each Word"
                      onClick={() => changeCase("capitalize")}
                    />
                  </>
                }
              >
                <span className="ribbon-case-label">Aa</span>
              </RibbonDropdownButton>
              <RibbonButton
                title="Clear All Formatting"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              >
                <IconClearFormat />
              </RibbonButton>
            </RibbonRow>
            <RibbonRow>
              <RibbonButton
                title="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <strong className="ribbon-font-btn">B</strong>
              </RibbonButton>
              <RibbonButton
                title="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <em className="ribbon-font-btn">I</em>
              </RibbonButton>
              <div className="ribbon-split-wrap">
                <RibbonSplitButton
                  title="Underline"
                  active={editor.isActive("underline")}
                  dropdownOpen={underlineOpen}
                  onMainClick={() => editor.chain().focus().toggleUnderline().run()}
                  onArrowClick={() => setUnderlineOpen((v) => !v)}
                  onClose={() => setUnderlineOpen(false)}
                  menu={
                    <UnderlineStyleMenu
                      onClose={() => setUnderlineOpen(false)}
                      onSelectStyle={applyUnderlineStyle}
                      onSelectColor={applyUnderlineColor}
                      onRemove={() => editor.chain().focus().unsetUnderlineStyle().run()}
                    />
                  }
                >
                  <span className="ribbon-font-btn underline">U</span>
                </RibbonSplitButton>
              </div>
              <RibbonButton
                title="Strikethrough"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <span className="ribbon-strike">ab</span>
              </RibbonButton>
              <RibbonButton
                title="Subscript"
                active={editor.isActive("subscript")}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
              >
                X<sub>2</sub>
              </RibbonButton>
              <RibbonButton
                title="Superscript"
                active={editor.isActive("superscript")}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
              >
                X<sup>2</sup>
              </RibbonButton>
              <RibbonButton title="Text Effects and Typography" onClick={() => {}} disabled>
                <IconTextEffects />
              </RibbonButton>
              <RibbonDropdownButton
                title="Text Highlight Color"
                open={isOpen("highlight")}
                onToggle={() => toggle("highlight")}
                menu={
                  <ColorPickerMenu
                    colors={HIGHLIGHT_COLORS}
                    showNone
                    onPick={(color) => {
                      if (color === "transparent") {
                        editor.chain().focus().unsetHighlight().run();
                      } else {
                        editor.chain().focus().setHighlight({ color }).run();
                      }
                      close();
                    }}
                  />
                }
              >
                <IconHighlight />
              </RibbonDropdownButton>
              <RibbonDropdownButton
                title="Font Color"
                open={isOpen("fontColor")}
                onToggle={() => toggle("fontColor")}
                menu={
                  <ColorPickerMenu
                    colors={TEXT_COLORS}
                    onPick={(color) => {
                      setFontColor(color);
                      editor.chain().focus().setColor(color).run();
                      close();
                    }}
                  />
                }
              >
                <IconFontColor color={fontColor} />
              </RibbonDropdownButton>
            </RibbonRow>
          </RibbonGroup>

          <RibbonDivider />

          {/* Paragraph */}
          <RibbonGroup label="Paragraph" className="ribbon-group-paragraph">
            <RibbonRow>
              <RibbonDropdownButton
                title="Bullets"
                open={isOpen("bullets")}
                onToggle={() => toggle("bullets")}
                menu={
                  <>
                    {BULLET_STYLES.map((style) => (
                      <RibbonMenuItem
                        key={style.style}
                        label={style.label}
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .toggleBulletList()
                            .updateAttributes("bulletList", { listStyleType: style.style })
                            .run();
                          close();
                        }}
                      />
                    ))}
                  </>
                }
              >
                <IconBullets />
              </RibbonDropdownButton>
              <RibbonDropdownButton
                title="Numbering"
                open={isOpen("numbering")}
                onToggle={() => toggle("numbering")}
                menu={
                  <>
                    {NUMBER_STYLES.map((style) => (
                      <RibbonMenuItem
                        key={style.type}
                        label={style.label}
                        onClick={() => {
                          editor
                            .chain()
                            .focus()
                            .toggleOrderedList()
                            .updateAttributes("orderedList", { listStyleType: style.type })
                            .run();
                          close();
                        }}
                      />
                    ))}
                  </>
                }
              >
                <IconNumbering />
              </RibbonDropdownButton>
              <RibbonButton title="Multilevel List" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <IconMultilevelList />
              </RibbonButton>
              <RibbonButton
                title="Decrease Indent"
                onClick={() => editor.chain().focus().liftListItem("listItem").run()}
              >
                <IconDecreaseIndent />
              </RibbonButton>
              <RibbonButton
                title="Increase Indent"
                onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
              >
                <IconIncreaseIndent />
              </RibbonButton>
              <RibbonButton title="Sort" onClick={() => {}} disabled>
                <IconSort />
              </RibbonButton>
              <RibbonButton title="Show/Hide ¶" onClick={() => {}} disabled>
                <IconShowMarks />
              </RibbonButton>
            </RibbonRow>
            <RibbonRow>
              <RibbonAlignGroup
                activeAlign={activeAlign}
                onAlign={(align) => editor.chain().focus().setTextAlign(align).run()}
              />
              <RibbonDropdownButton
                title="Line and Paragraph Spacing"
                open={isOpen("spacing")}
                onToggle={() => toggle("spacing")}
                menu={
                  <>
                    {LINE_SPACINGS.map((spacing) => (
                      <RibbonMenuItem
                        key={spacing.value}
                        label={spacing.label}
                        onClick={() => {
                          editor.chain().focus().setLineHeight(spacing.value).run();
                          close();
                        }}
                      />
                    ))}
                  </>
                }
              >
                <IconLineSpacing />
              </RibbonDropdownButton>
              <RibbonDropdownButton
                title="Shading"
                open={isOpen("shading")}
                onToggle={() => toggle("shading")}
                menu={
                  <ColorPickerMenu
                    colors={HIGHLIGHT_COLORS}
                    onPick={(color) => {
                      editor.chain().focus().setHighlight({ color }).run();
                      close();
                    }}
                  />
                }
              >
                <IconShading />
              </RibbonDropdownButton>
              <RibbonDropdownButton
                title="Borders"
                open={isOpen("borders")}
                onToggle={() => toggle("borders")}
                menu={
                  <>
                    <RibbonMenuItem
                      label="Bottom Border"
                      onClick={() => {
                        editor.chain().focus().setHorizontalRule().run();
                        close();
                      }}
                    />
                    <RibbonMenuSeparator />
                    <RibbonMenuItem label="No Border" onClick={close} />
                  </>
                }
              >
                <IconBorders />
              </RibbonDropdownButton>
            </RibbonRow>
          </RibbonGroup>
        </div>
      </div>
    </div>
  );
}
