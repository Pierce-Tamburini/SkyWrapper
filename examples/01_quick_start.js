/**
* 01_quick_start.js
* =================
* The simplest SkyWrapper example.
* Querying an object to display its key properties.
*
* Requires SkyWrapper.js pasted above this code in the console.
* 
* Note: "M42" can be changed to any object name avaliable in the sky6StarChart, 
* however some properties may not always apply.
* Degree symbol copyable here ==> "°"
*/

var target = "M42"

// One line returns everything
var data = SkyWrapper.query(target)

// Make sure data returns null if object is not found
if (data === null) {
  RunJavaScriptOutput = "Object not found" + target;
} else {
    RunJavaScriptOutput = [
      "Object   : " + data.name,
      "Type     : " + data.identity.typeName,
      "Altitude : " + data.position.altitude.toFixed(1) + "°", // Degree symbol here to show result is in degrees
      "Azimuth  : " + data.position.azimuth.toFixed(1) + "°", // Degree symbol here to show result is in degrees
      "Magnitude: " + (data.physical.magnitude !== null
              ? data.physical.magnitude.toFixed(2)
                       : "N/A"),
      "Observable: " + (data.observable ? "YES" : "NO"),
      "Queried At : + " data.queried at
  ].join("\n");
}
