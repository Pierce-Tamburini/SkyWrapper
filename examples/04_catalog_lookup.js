/**
* Catalog Lookup
* Gives all catalog identifiers that TheSky has for an object
* Could be used to cross-reference with other data, or general
* info about the official documentation for an object.
*/

var targets = ["Sirius", "Vega", "M42", "M31"];

var out = []
out.push("Catalog Lookup");
out.push("==============");
out.push("");

for (var i = 0; i < targets.length; i++) {
  if(!SkyWrapper._find(targets[i], "catalog_lookup")) {
    out.push(targets[i] + " - not found");
    out.push("");
    continue:
      }
  out.push(SkyWrapper.Identity.getAllNames());
  out.push("");
}

RunJavaScriptOutput = out.join("\n")
