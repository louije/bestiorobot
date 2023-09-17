/**
 * @param {string} monster
 * @param {string} phrase
 * @param {string} child
 * @param {string} fragment
 */
function fragmentPath(monster, phrase, child, fragment) {
  const paddedChild = String(child).padStart(3, "0");
  const paddedPhrase = String(phrase).padStart(3, "0");
  const paddedFragment = String(fragment).padStart(3, "0");
  const name = `${monster}_${paddedPhrase}_${paddedChild}_FRAG_${paddedFragment}`;
  return `/mp3/${name}.mp3`;
}

/**
 * @param {string} id
 */
function soundFileFor(id) {
  return `/mp3/${id}.mp3`;
}

export { fragmentPath, soundFileFor };
