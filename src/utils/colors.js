// https://kalinichev.net/palette.html
// color: 100, markerColor: a100, border: 400
export const COLORS = [
  { name: 'Red', color: 'ff8a80', markerColor: 'ff8a80', border: 'ef5350' },
  { name: 'Pink', color: 'ff80ab', markerColor: 'ff80ab', border: 'ec407a' },
  { name: 'Purple', color: 'ea80fc', markerColor: 'ea80fc', border: 'ab47bc' },
  { name: 'Deep Purple', color: 'b388ff', markerColor: 'b388ff', border: '7e57c2' },
  { name: 'Indigo', color: '8c9eff', markerColor: '8c9eff', border: '5c6bc0' },
  { name: 'Blue', color: '82b1ff', markerColor: '82b1ff', border: '42a5f5' },
  { name: 'Light Blue', color: '80d8ff', markerColor: '80d8ff', border: '29b6f6' },
  { name: 'Cyan', color: '84ffff', markerColor: '84ffff', border: '26c6da' },
  { name: 'Teal', color: 'a7ffeb', markerColor: 'a7ffeb', border: '26a69a' },
  { name: 'Green', color: 'b9f6ca', markerColor: 'b9f6ca', border: '66bb6a' },
  { name: 'Light Green', color: 'ccff90', markerColor: 'ccff90', border: '9ccc65' },
  { name: 'Lime', color: 'f4ff81', markerColor: 'f4ff81', border: 'd4e157' },
  { name: 'Yellow', color: 'ffff8d', markerColor: 'ffff8d', border: 'ffee58' },
  { name: 'Amber', color: 'ffe57f', markerColor: 'ffe57f', border: 'ffca28' },
  { name: 'Orange', color: 'ffd180', markerColor: 'ffd180', border: 'ffa726' },
  { name: 'Deep Orange', color: 'ff9e80', markerColor: 'ff9e80', border: 'ff7043' },
  { name: 'Brown', color: 'bcaaa4', markerColor: 'a1887f', border: '8d6e63' },
  { name: 'Gray', color: 'e0e0e0', markerColor: 'bdbdbd', border: '9e9e9e' },
  { name: 'Blue Gray', color: 'b0bec5', markerColor: '78909c', border: '607d8b' },
];

export const DEFAULT_COLOR = 'ffffff';

export function colorStyles({ markerColor, border }) {
  return `background-color: #${markerColor}; border-color: #${border};`;
}

export function labelColorStyles({ color }) {
  return `background-color: #${color};`;
}

export function issueColorStyles(color) {
  if (color == null || color === DEFAULT_COLOR) {
    return `1px solid #E8EAF6;`;
  }

  return `background-color: #${color}; 1px solid #${color};`;
}
