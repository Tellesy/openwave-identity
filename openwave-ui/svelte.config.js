import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: '../src/main/resources/static',
      assets: '../src/main/resources/static',
      fallback: 'index.html',
      precompress: false,
      strict: false
    }),
    alias: {
      '$lib': './src/lib'
    }
  }
};

export default config;
