// https://kalinichev.net/palette.html
// color: 100, markerColor: a100, border: 400
export const COLORS = [
  { name: 'Red', color: 'ffcdd2', markerColor: 'ff8a80', border: 'ef5350' },
  { name: 'Pink', color: 'f8bbd0', markerColor: 'ff80ab', border: 'ec407a' },
  { name: 'Purple', color: 'e1bee7', markerColor: 'ea80fc', border: 'ab47bc' },
  { name: 'Deep purple', color: 'd1c4e9', markerColor: 'b388ff', border: '7e57c2' },
  { name: 'Indigo', color: 'c5cae9', markerColor: '8c9eff', border: '5c6bc0' },
  { name: 'Blue', color: 'bbdefb', markerColor: '82b1ff', border: '42a5f5' },
  { name: 'Light Blue', color: 'b3e5fc', markerColor: '80d8ff', border: '29b6f6' },
  { name: 'Cyan', color: 'b2ebf2', markerColor: '84ffff', border: '26c6da' },
  { name: 'Teal', color: 'b2dfdb', markerColor: 'a7ffeb', border: '26a69a' },
  { name: 'Green', color: 'c8e6c9', markerColor: 'b9f6ca', border: '66bb6a' },
  { name: 'Light Green', color: 'dcedc8', markerColor: 'ccff90', border: '9ccc65' },
  { name: 'Lime', color: 'f0f4c3', markerColor: 'f4ff81', border: 'd4e157' },
  { name: 'Yellow', color: 'fff9c4', markerColor: 'ffff8d', border: 'ffee58' },
  { name: 'Amber', color: 'ffecb3', markerColor: 'ffe57f', border: 'ffca28' },
  { name: 'Orange', color: 'ffe0b2', markerColor: 'ffd180', border: 'ffa726' },
  { name: 'Deep Orange', color: 'ffccbc', markerColor: 'ff9e80', border: 'ff7043' },
  { name: 'Brown', color: 'd7ccc8', markerColor: 'a1887f', border: '8d6e63' },
  { name: 'Gray', color: 'f5f5f5', markerColor: 'bdbdbd', border: '9e9e9e' },
  { name: 'Blue Gray', color: 'cfd8dc', markerColor: '78909c', border: '607d8b' },
  { name: 'White', color: 'ffffff', markerColor: 'ffffff', border: 'e0e0e0' },
];

export const DEFAULT_COLOR = 'ffffff';

export function colorStyles({ markerColor, border }) {
  return `background-color: #${markerColor}; border-color: #${border}`;
}

export function labelColorStyles({ color }) {
  return `background-color: #${color}`;
}
