/**
 * Observing List
 * Checks a list of targets and splits them into
 * "worth looking at tonight" vs "below the horizon"
 */

var targets = [
    "M42", "M31", "M13", "M57", "M51",
    "M101", "M5", "M81", "M82", "NGC 891"
];

var good   = [];
var low    = [];

for (var i = 0; i < targets.length; i++) {
    var d = SkyWrapper.query(targets[i]);
    if (d === null) continue;

    var line =
        d.name + " (" + d.identity.typeName + ")" +
        "  Alt: " + d.position.altitude.toFixed(1) + "°" +
        "  Mag: " + (d.physical.magnitude !== null
            ? d.physical.magnitude.toFixed(1)
            : "N/A");

    if (d.observable) {
        good.push(line);
    } else {
        low.push(line);
    }
}

var out = [];
out.push("Observing List — " + SkyWrapper.Time.getCurrentDateString());
out.push("Sidereal: " + SkyWrapper.Time.getLocalSiderealTimeString());
out.push("");

out.push("Good targets tonight (" + good.length + "):");
for (var g = 0; g < good.length; g++) {
    out.push("  " + good[g]);
}

out.push("");
out.push("Below threshold (" + low.length + "):");
for (var l = 0; l < low.length; l++) {
    out.push("  " + low[l]);
}

RunJavaScriptOutput = out.join("\n");
    
    
    
    
  
