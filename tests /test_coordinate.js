/**
 * INTERNAL — Query a property for the currently selected object
 * 
 * This function is the core engine of SkyWrapper. All property
 * queries go through here. Never call sky6ObjectInformation
 * directly in module functions — always use _query().
 * 
 * @param  {number}  propCode  Property code from SkyWrapper._PROP
 * @param  {string}  context   Calling function name for error messages
 * @returns {*|null}           Property value or null on failure
 */
_query: function(propCode, context) {
    try {
        // Verify property applies to this object type
        sky6ObjectInformation.PropertyApplies(propCode);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) {
            return null; // Property doesn't apply — not an error
        }

        // Query the property
        sky6ObjectInformation.Property(propCode);
        return sky6ObjectInformation.ObjInfoPropOut;

    } catch (e) {
        RunJavaScriptOutput = "SkyWrapper._query failed" +
            "\nContext: " + (context || "unknown") +
            "\nProperty code: " + propCode +
            "\nError: " + e.message;
        return null;
    }
},

/**
 * INTERNAL — Find an object and verify it was located
 * 
 * @param  {string}  objectName  Catalog name of the object
 * @param  {string}  context     Calling function name
 * @returns {boolean}            True if found, false if not
 */
_find: function(objectName, context) {
    if (!objectName || typeof objectName !== "string" || 
        objectName.trim() === "") {
        throw new Error(
            "SkyWrapper." + (context || "unknown") + 
            ": objectName must be a non-empty string"
        );
    } 
      // This function takes parameters "objectName" or "context" 
      // and asks whether or not the object name is false, if it isnt 
      // a string, or if its an empty string. If any of these are true (in successive order), the console writes
      // "objectName must be a non-empty string"
  
    try {
        sky6StarChart.Find(objectName);
        return true;
    } catch (e) {
        RunJavaScriptOutput = "SkyWrapper._find failed" +
            "\nContext: " + (context || "unknown") +
            "\nObject: " + objectName +
            "\nError: " + e.message;
        return false;
    }
      // Attempts to access the object6StarChart and accesses the object name. If true, return the result.
      // If there is an error in this code, its gets caught by catch(e) and the console writes 
      // "SkyWrapper._find failed"
      // "Context: Unknown"
      // "Object: ["object name"]
  
},
