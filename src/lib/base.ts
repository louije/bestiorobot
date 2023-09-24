
function fragmentPath(monster: string, phrase: string, child: string, fragment: string): string {
  const paddedChild = String(child).padStart(3, "0");
  const paddedPhrase = String(phrase).padStart(3, "0");
  const paddedFragment = String(fragment).padStart(3, "0");
  const name = `${monster}_${paddedPhrase}_${paddedChild}_FRAG_${paddedFragment}`;
  return `/mp3/${name}.mp3`;
}

function soundFileFor(id: string): string {
  return `/mp3/${id}.mp3`;
}

export { fragmentPath, soundFileFor };
