if ('fonts' in document) {
  let satoshiVar = new FontFace(
    'Satoshi',
    "url('/assets/fonts/satoshi/Satoshi-Variable.woff2?v=20221008172130') format('woff2'), url(/assets/fonts/satoshi/Satoshi-Variable.woff?v=20221008172130) format('woff')"
  );

  let interVar = new FontFace(
    'Inter',
    "url('/assets/fonts/inter/Inter-roman.var.woff2?v=20221008172130') format('woff2')"
  );

  Promise.all([satoshiVar.load(), interVar.load()]).then((fonts) => {
    fonts.forEach((font) => document.fonts.add(font));
  });
}
