import { minify } from 'html-minifier';
const inProduction = process.env.NODE_ENV === 'production';

export const sitePluginHtmlmin = (eleventyConfig) => {
  eleventyConfig.addTransform('htmlmin', function (content) {
    return inProduction && this.page.outputPath.endsWith('.html')
      ? minify(content, {
        collapseWhitespace: true,
        useShortDoctype: true,
      })
      : content;
  });
};
