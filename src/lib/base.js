// example path 
//  ./base/GOUR/GOUR_008/GOUR_008_ELEVES_FRAGMENTS/GOUR_008_001/GOUR_008_001_FRAG_001.aif

function fragmentPath(monster, phrase, child, fragment) {
  const paddedChild = String(child).padStart(3, "0");
  const paddedPhrase = String(phrase).padStart(3, "0");
  const paddedFragment = String(fragment).padStart(3, "0");
  const name = `${monster}_${paddedPhrase}_${paddedChild}_FRAG_${paddedFragment}`;
  return `/base/mp3/${name}.mp3`;
}

function fragmentLegacyPath(monster, phrase, child, fragment, ext = "") {
  const paddedChild = String(child).padStart(3, "0");
  const paddedPhrase = String(phrase).padStart(3, "0");
  const paddedFragment = String(fragment).padStart(3, "0");
  
  const monsterPhrase = `${monster}_${paddedPhrase}`;
  const monsterPhraseChild = `${monsterPhrase}_${paddedChild}`;
  const monsterPhraseChildFragment = `${monsterPhraseChild}_FRAG_${paddedFragment}`;
  
  const extension = (ext === "") ? ext : `.${ext}`;
  
  return `/base/${monster}/${monsterPhrase}/${monsterPhrase}_ELEVES_FRAGMENTS/${monsterPhraseChild}/${monsterPhraseChildFragment}${extension}`;
}

function fragmentPaths(monster, phrase, child, numFragments, ext = "") {
  return Array.from(Array(numFragments)).map( (_, idx) => {
    return fragmentPath(monster, phrase, child, idx + 1, ext);
  });
}

export { fragmentPath, fragmentPaths };
