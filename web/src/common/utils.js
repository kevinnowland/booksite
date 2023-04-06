const stateAbbrevs = new Map([
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arizona", "AZ"],
  ["Arkansa", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["D.C.", "DC"],
  ["DC", "DC"],
  ["District of Columbia", "DC"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Puerto Rico", "PR"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "UT"],
  ["Virgin Islands", "VI"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
]);

// TODO: return an error probably
export function getStateAbbrev(s) {
  const abbrev = stateAbbrevs.get(s);
  if (abbrev === undefined) {
    return "";
  } else {
    return abbrev;
  }
}

export function getCityStateAbbrev(city, state) {
  const stateAbbrev = getStateAbbrev(state);
  if (state === "") {
    return city;
  } else {
    return city + ", " + stateAbbrev;
  }
}

function splitWords(str) {
  return str.split(/(\s+)/);
}

export function capitalizeWords(str) {
  const words = splitWords(str);
  const capitals = words.map(
    (word) => word[0].toUpperCase() + word.substring(1)
  );
  return capitals.join("");
}

export function formatGenre(genre) {
  const lower = genre.toLowerCase().replace("_", " ");
  return capitalizeWords(lower);
}

function compareCounts(a, b) {
  const diff = b[1] - a[1];
  if (diff !== 0) {
    return diff;
  } else {
    return b[0].localeCompare(a[0]);
  }
}

export function parseGenreCounts(genreCounts) {
  var counts = new Map();

  for (let g of genreCounts.genres) {
    let genreKey = formatGenre(g.genre);
    counts.set(
      genreKey,
      g.subgenres
        .map((sg) => [formatGenre(sg.subgenre), sg.count])
        .sort(compareCounts)
    );
  }

  return counts;
}

export function parseLanguageCounts(languageCounts) {
  var counts = new Map();

  for (let la of languageCounts.languages) {
    let langKey = capitalizeWords(la.language);
    counts.set(
      langKey,
      la.originalLanguages
        .map((ol) => [capitalizeWords(ol.originalLanguage), ol.count])
        .sort(compareCounts)
    );
  }

  console.log(counts);
  return counts;
}

// data looks like a map[string][[string, int]]
export function aggregateCounts(data) {
  var counts = [];
  for (let [k, v] of data) {
    let count = v.reduce((acc, l) => acc + l[1], 0);
    counts.push([k, count]);
  }
  return counts.sort(compareCounts);
}
