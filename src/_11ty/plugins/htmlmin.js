import { minify } from 'html-minifier';
const inProduction = process.env.NODE_ENV === 'production';

export const sitePluginHtmlmin = (eleventyConfig) => {
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (inProduction && outputPath.endsWith('.html')) {
      return minify(content, {
        collapseWhitespace: true,
        useShortDoctype: true,
      });
    } else {
      return content;
    }
  });
};
