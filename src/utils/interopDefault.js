/**
 * @template T
 * @param {T | Promise<T>} module
 * @returns {Promise<T extends { default: infer U } ? U : T>}
 */
export const interopDefault = async (module) => {
  const resolved = await module;
  return resolved?.default ?? resolved;
};
