// adapted from https://krazydad.com/tutorials/makecolors.php
function byte2Hex(n) {
  const nybHexString = "0123456789ABCDEF";
  const l1 = (n >> 4) & 0x0f;
  const l2 = n & 0x0f;
  return String(
    nybHexString.substring(l1, l1 + 1) + nybHexString.substring(l2, l2 + 1)
  );
}

function rgb2Color(r, g, b) {
  return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

export function getColor(i) {
  const center = 128;
  const width = 127;
  const phase1 = 0;
  const phase2 = 2;
  const phase3 = 4;
  const freq = 1;

  var red = Math.sin(freq * i + phase1) * width + center;
  var green = Math.sin(freq * i + phase2) * width + center;
  var blue = Math.sin(freq * i + phase3) * width + center;

  return rgb2Color(red, green, blue);
}
