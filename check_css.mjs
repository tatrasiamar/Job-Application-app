const html = await fetch("http://localhost:3000/").then((r) => r.text());
const cssMatches = html.match(/href="([^"]+\.css[^"]*)"/g);
console.log("CSS Matches:", cssMatches);

if (cssMatches) {
  for (const m of cssMatches) {
    const url = "http://localhost:3000" + m.split('"')[1];
    const css = await fetch(url).then((r) => r.text());
    console.log("CSS URL:", url, "Length:", css.length, "Preview:", css.slice(0, 150));
  }
}

