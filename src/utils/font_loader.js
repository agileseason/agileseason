let webFont;

export default async function loadFonts(families) {
  if (!webFont) {
    const { default: WebFont } = await import('webfontloader');
    webFont = WebFont;
  }

  setTimeout(() => (
    webFont.load({
      google: {
        families: families.constructor === String ?
          [families] :
          families
      }
    })
  ), 6);
}
