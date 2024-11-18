/* Renders a JSX element to its HTML string representation */
export function renderToHtml(element) {
  if ([null, undefined, false].includes(element)) return ""; // Empty
  if (typeof element === "string") return escapeForHtml(element); // Text
  if (typeof element === "number") return escapeForHtml(element); // Number
  if (Array.isArray(element)) return element.map(renderToHtml).join(""); // List

  if (typeof element !== "object") throw Error("Element must be an object");
  const { type, props } = element;
  if (typeof type === "function") return renderToHtml(type(props)); // Component

  const { children, ...attrs } = props; // HTML tag
  const attrsStr = attrsToStr(attrs);

  if (VOID_TAGS.includes(type)) { // Self-closing e.g. <br>
    if (children) throw Error("Void tag cannot have children");
    return `<${type}${attrsStr}>`;
  }

  const childrenStr = renderToHtml(children);
  return `<${type}${attrsStr}>${childrenStr}</${type}>`;
}

/* Convert &, <, >, ", ' to escaped HTML codes to prevent XSS attacks */
function escapeForHtml(unsafeText) {
  const CODES = { "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" };
  return unsafeText.replace(/[&<>"']/g, (c) => `&${CODES[c]};`);
}

/* Convert an object of HTML attributes to a string */
function attrsToStr(attrs) {
  const illegal = /[ "'>\/= \u0000-\u001F\uFDD0-\uFDEF\uFFFF\uFFFE]/;
  const result = Object.entries(attrs)
    .map(([key, value]) => {
      if (illegal.test(key)) {
        throw Error(`Illegal attribute name: ${key}`);
      }
      if (value === true) return ` ${key}`; // Boolean (true)
      if ([null, undefined, false].includes(value)) return null; // Skipped
      return ` ${key}="${value.toString().replace(/"/g, "&quot;")}"`;
    })
    .filter(Boolean)
    .join("");
  return result;
}

/* Self-closing HTML tags that can't have children */
const VOID_TAGS = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];
