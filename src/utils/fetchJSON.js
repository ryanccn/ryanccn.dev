const { cyan, red, magenta } = require('kleur/colors');

class FetchError extends Error {
  /**
   * Construct an instance of `FetchError`
   * @param {string} message the message to put in the error
   */
  constructor(message) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Fetch a JSON document from a URL and throw an error if response is not ok (i.e. 2xx status code)
 *
 * @param {string | URL} url the URL to fetch
 * @param {RequestInit} [opts] options to pass to `fetch`
 */
const fetchJSON = async (url, opts) => {
  const res = await fetch(url, opts);

  if (!res.ok) {
    throw new FetchError(
      `Fetching ${cyan(res.url)} returned ${red(res.status)} ${red(
        res.statusText,
      )}` +
        '\n' +
        'Response text: ' +
        magenta(await res.text()),
    );
  }

  return res.json();
};

module.exports = { fetchJSON };
