const COLUMN_WIDTH = 287;

export function columnWidthStyles(numberColumns = 0) {
  return { 'min-width': `${COLUMN_WIDTH * (numberColumns)}px` };
}
