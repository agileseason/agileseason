// https://kalinichev.net/palette.html
// color: 100, markerColor: a100, border: 400
export const COLORS = [
  { name: 'Red',         color: 'ff8a80', markerColor: 'ff8a80', border: 'ef5350' },
  { name: 'Pink',        color: 'f48fb1', markerColor: 'f48fb1', border: 'f06292' },
  { name: 'Purple',      color: 'ce93d8', markerColor: 'ce93d8', border: 'ba68c8' },
  { name: 'Deep Purple', color: 'b39ddb', markerColor: 'b39ddb', border: '9575cd' },
  { name: 'Indigo',      color: 'c5cae9', markerColor: 'c5cae9', border: '9fa8da' },
  { name: 'Blue',        color: '90caf9', markerColor: '90caf9', border: '64b5f6' },
  { name: 'Light Blue',  color: '81d4fa', markerColor: '81d4fa', border: '4fc3f7' },
  { name: 'Cyan',        color: 'b2ebf2', markerColor: 'b2ebf2', border: '80deea' },
  { name: 'Teal',        color: '80cbc4', markerColor: '80cbc4', border: '26a69a' },
  { name: 'Green',       color: 'a5d6a7', markerColor: 'a5d6a7', border: '66bb6a' },
  { name: 'Light Green', color: 'c5e1a5', markerColor: 'c5e1a5', border: '9ccc65' },
  { name: 'Lime',        color: 'e6ee9c', markerColor: 'e6ee9c', border: 'd4e157' },
  { name: 'Yellow',      color: 'fff59d', markerColor: 'fff59d', border: 'ffeb3b' },
  { name: 'Amber',       color: 'ffe57f', markerColor: 'ffe57f', border: 'ffd54f' },
  { name: 'Orange',      color: 'ffcc80', markerColor: 'ffcc80', border: 'ffa726' },
  { name: 'Deep Orange', color: 'ffab91', markerColor: 'ff8a65', border: 'ff7043' },
  { name: 'Brown',       color: 'bcaaa4', markerColor: 'bcaaa4', border: 'a1887f' },
  { name: 'Gray',        color: 'e0e0e0', markerColor: 'bdbdbd', border: '9e9e9e' },
  { name: 'Blue Gray',   color: 'cfd8dc', markerColor: 'cfd8dc', border: 'b0bec5' },
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
