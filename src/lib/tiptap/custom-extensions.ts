import { Extension } from "@tiptap/core";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
    };
    underlineStyle: {
      setUnderlineStyle: (options: {
        style: string;
        thickness?: string;
        color?: string;
      }) => ReturnType;
      unsetUnderlineStyle: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create({
  name: "lineHeight",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ editor, commands }) => {
          if (editor.isActive("heading")) {
            return commands.updateAttributes("heading", { lineHeight });
          }
          return commands.updateAttributes("paragraph", { lineHeight });
        },
    };
  },
});

export const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: "disc",
        parseHTML: (element) => element.style.listStyleType || "disc",
        renderHTML: (attributes) => {
          if (!attributes.listStyleType) return {};
          return { style: `list-style-type: ${attributes.listStyleType}` };
        },
      },
    };
  },
});

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: "decimal",
        parseHTML: (element) => element.style.listStyleType || "decimal",
        renderHTML: (attributes) => {
          if (!attributes.listStyleType) return {};
          return { style: `list-style-type: ${attributes.listStyleType}` };
        },
      },
    };
  },
});

export const UnderlineStyle = Extension.create({
  name: "underlineStyle",

  addOptions() {
    return { types: ["textStyle"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          underlineCss: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-underline-css") || null,
            renderHTML: (attributes) => {
              if (!attributes.underlineCss) return {};
              return {
                "data-underline-css": attributes.underlineCss,
                style: attributes.underlineCss,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setUnderlineStyle:
        (options: { style: string; thickness?: string; color?: string }) =>
        ({ chain }) => {
          const thickness = options.thickness ?? "1px";
          const style = options.style;
          const color = options.color;
          let css = `text-decoration-line: underline; text-decoration-style: ${style}; text-decoration-thickness: ${thickness}`;
          if (color) css += `; text-decoration-color: ${color}`;
          return chain().setMark("textStyle", { underlineCss: css }).setMark("underline").run();
        },
      unsetUnderlineStyle:
        () =>
        ({ chain }) =>
          chain()
            .unsetMark("underline")
            .setMark("textStyle", { underlineCss: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});
