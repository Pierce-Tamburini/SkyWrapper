/**
 * Target Visibility
 * Rise, transit, and set times for a list of objects.
 * Useful for figuring out when each target is actually
 * worth looking at and building an order for the night.
 */

var targets = ["M42", "M31", "M13", "M57", "M51",
    "M101", "M81", "M5", "Vega", "Arcturus"
];

var out = [];
out.push("Target Visibility");
out.push("=================");
out.push("Sidereal: " + SkyWrapper.Time.getLocalSiderealTime);
out.push("")

for (var i = 0; i < targets.length; i++) {
  if (!SkyWrapper._find(targets[i], "visibility")) continue;

    // Get coordinates for the timing calculation
    sky6ObjectInformation.Property(54);
    var ra = sky6ObjectInformation.ObjInfoPropOut;

    sky6ObjectInformation.Property(55);
    var dec = sky6ObjectInformation.ObjInfoPropOut;

    var rts  = SkyWrapper.Time.getRiseTransitSet(ra, dec);
    var type = SkyWrapper.Identity.getTypeName();
    var alt  = SkyWrapper.Position.getAltitude();

    if (rts === null) continue;

    out.push(targets[i] + " — " + (type || "unknown"));
    out.push("  Now     : " +
        (alt !== null ? alt.toFixed(1) + "° altitude" : "N/A"));
    out.push("  Rise    : " + rts.riseString);
    out.push("  Transit : " + rts.transitString);
    out.push("  Set     : " + rts.setString);
    out.push("");
}

RunJavaScriptOutput = out.join("\n");

  
     
