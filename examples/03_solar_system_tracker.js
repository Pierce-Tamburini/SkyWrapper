/**
* Solar System Tracker
* Current position of the planets. 
* Shows phase and motion rates when availiable.
*/

var planets = [
  "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune"
  ];
var out = []
out.push("Solar System - " + SkyWrapper.Time.getCurrentDateString();
out.push("");

for (var i = 0; i < planets.length; i++) {
  var d = SkyWrapper.query(planets[i]);
  if (d === null) continue;

  out.push (d.name + (d.observable ? " (up)" : " (down)"));
  out.push(" Alt/Az : " +
           d.position.altitude.toFixed(1) + 
           d.position.azimuth.toFixed(1));
  out.push(" RA/Dec : " +
           d.coordinates.raString + " " + 
           d.coordinates.decString);
  if (d.physical.phase !== null) {
    out.push(" Phase  : " + d.physical.phase.toFixed(1) + "%");
  }

  if (d.physical.magnitude !== null) { 
    out.push(" Magnitude  : " d.physical.magnitude.toFixed(2));
  }

    // Re-find to get motion rates
    // (query() doesn't include these directly)
    sky6StarChart.Find(bodies[i]);
    var raRate = SkyWrapper.Physical.getRARate();
    if (raRate !== null) {
        out.push("  Motion   : " +
            raRate.toFixed(5) + " RA  " +
            SkyWrapper.Physical.getDecRate().toFixed(5) + " Dec  (arcsec/sec)");
    }

    if (d.timing !== null) {
        if (d.timingSource === "solar_system") {
            out.push("  " + d.timing);
        } else {
            out.push("  Rise " + d.timing.riseString +
                     "  Transit " + d.timing.transitString +
                     "  Set " + d.timing.setString);
        }
    }

    out.push("");
}

RunJavaScriptOutput = out.join("\n");
  
