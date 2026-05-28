/**
 * SkyWrapper.js
 * ============================================================
 * A professional wrapper library for TheSky X scripting API
 * 
 * Provides clean, documented, error-handled functions for
 * TheSky X's sky6ObjectInformation property code system,
 * replacing numeric codes with readable named methods.
 * 
 * @version    1.0.0
 * @license    MIT
 * @author     Pierce Tamburini
 * @requires   TheSky X version 10.1.0 or later (build 10000+)
 * @platform   Windows, macOS, Linux
 *   
 * USAGE:
 *   sky6StarChart.Find("M42");
 *   var alt = SkyWrapper.Position.getAltitude();
 * 
 * MODULES:
 *   SkyWrapper.System      — Application awareness
 *   SkyWrapper.Position    — Altitude, azimuth, hour angle
 *   SkyWrapper.Coordinates — RA, Dec, epoch conversions
 *   SkyWrapper.Identity    — Name, type, catalog
 *   SkyWrapper.Physical    — Magnitude, size, distance
 *   SkyWrapper.Time        — Rise, transit, set times
 * 
 * PROPERTY CODE REFERENCE:
 *   All property codes sourced from official Bisque Doxygen
 *   documentation Sk6ObjectInformationProperty enum.
 *   https://www.bisque.com/wp-content/scriptthesky/
 * ============================================================
 */

var SkyWrapper = {

    // ========================================================
    // INTERNAL CONSTANTS
    // Property codes from Sk6ObjectInformationProperty enum
    // Official names preserved for verification
    // ========================================================
    
    _PROP: {
        // Identity
        NAME1:          0,
        NAME2:          1,
        NAME3:          2,
        NAME4:          3,
        NAME5:          4,
        NAME6:          5,
        NAME7:          6,
        NAME8:          7,
        NAME9:          8,
        NAME10:         9,
        CATALOGID:      10,
        ALL_INFO:       11,
        CO_NAME:        12,

        // Object type
        OBJECTTYPE:     41,

        // Current position
        RA_NOW:         54,
        DEC_NOW:        55,
        RA_2000:        56,
        DEC_2000:       57,
        AZM:            58,
        ALT:            59,

        // Physical properties
        MAJ_AXIS_MINS:  60,
        MIN_AXIS_MINS:  61,
        EARTH_DIST_KM:  62,
        PA:             64,
        MAG:            65,
        PHASE_PERC:     66,

        // Time
        RISE_TIME:      67,
        TRANSIT_TIME:   68,
        SET_TIME:       69,

        // Motion
        HA_HOURS:       70,
        AIR_MASS:       71,

        // Star motion rates
        RA_RATE_ASPERSEC:   77,
        DEC_RATE_ASPERSEC:  78,
        ALT_RATE_ASPERSEC:  79,
        AZIM_RATE_ASPERSEC: 80,

        // Twilight times
        TWIL_CIVIL_START:   167,
        TWIL_CIVIL_END:     168,
        TWIL_NAUT_START:    169,
        TWIL_NAUT_END:      170,
        TWIL_ASTRON_START:  171,
        TWIL_ASTRON_END:    172,
        SIDEREAL:           173,

        // Moon specific
        MOON_PHASE_ANGLE:   138,
        MOON_DIST_KM:       126,
        MOON_TRUE_EQ_RA:    127,
        MOON_TRUE_EQ_DEC:   128,

        // Sun specific
        SUN_DIST_AU:        63,
        SUN_POS_ANGLE:      140,
        DECL_SUN:           143,

        // Frame and scale
        FRAME_SIZE_MINS:    179,
        SCALE_ASPIX:        182,
        HEIGHT:             183,
        WIDTH:              184
    },
    // =======================================================    
    // INTERNAL HELPERS
    //========================================================

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

    // ========================================================
    // MODULE: SYSTEM
    // ========================================================
    System: {
        /**
        * Returns TheSky version string
        * @returns {string}  
        */
        getVersion: function() {
            return Application.version;
        },
        /** 
        * Returns TheSky build string
        * @returns {string} 
        */
        
        getBuild: function () {
            return Application.build;
        },

        /**
        * Returns the users operating system: Mac, Linux, Windows, or Unknown
        * @returns {string} 
        */
        getOperatingSystem: function () {
             var osMap = {
                0:  "Unknown" ,
                1: "Windows" ,
                2: "Mac",
                3: "Linux"

            };

        return osMap[Application.operatingSystem];

        },

        /**
        * Returns a truth value assigned to the initialized function; tells you if the system is initialized
        * @returns {boolean}
        */
        
        isInitialized: function () {
           return Application.initialized;

        },

        /**
        * Function that waits for initialization to finish before installing new files
        * @param {number} number of seconds in timeout
        * @returns {boolean} truth value if ready
        * @throws error if timeout limit is exceeded
        */

           waitForReady: function(timeoutSeconds) {
        var timeout = timeoutSeconds || 30;
        var elapsed = 0;

        while (!Application.initialized) {
            sky6Utils.Sleep(1000);
            elapsed++;
            if (elapsed >= timeout) {
                throw new Error(
                    "SkyWrapper.System.waitForReady: " +
                    "TheSky did not initialize within " +
                    timeout + " seconds"
                );
            }
        }
        return true;
    },
                
        /**
        * Checks for the minimum required version of TheSky
        * @returns {string} if minimum version is not obtained
        * @returns {boolean} if version is up to date
        */

    checkVersion: function(minVersion) {
        var current = Application.version;
        if (current < minVersion) {
            RunJavaScriptOutput =
                "SkyWrapper requires TheSky " + minVersion +
                " or later.\nInstalled: " + current +
                " (build " + Application.build + ")";
            return false;
        }
        return true;
    },

    /**
     * Returns path separator for current operating system
     * @returns {string} "\" on Windows, "/" on Mac and Linux
     */
    getPathSeparator: function() {
        return Application.operatingSystem === 1 ? "\\" : "/";
    },

    /**
     * Builds a cross-platform file path
     * @param  {string}  directory  Base directory path
     * @param  {string}  filename   File name
     * @returns {string} Complete file path
     */
    buildPath: function(directory, filename) {
        var sep = this.getPathSeparator();
        var dir = directory;
        // Remove trailing separator if present
        if (dir.charAt(dir.length - 1) === sep) {
            dir = dir.slice(0, -1);
        }
        return dir + sep + filename;
    },

    /**
     * Returns a complete environment report
     * Useful for bug reports and compatibility checking
     * @returns {string} Formatted environment summary
     */
    getEnvironmentReport: function() {
        return [
            "SkyWrapper Environment Report",
            "==============================",
            "TheSky Version : " + Application.version,
            "Build          : " + Application.build,
            "OS             : " + this.getOperatingSystem(),
            "Initialized    : " + Application.initialized,
            "SkyWrapper     : 1.0.0"
        ].join("\n");
    }

},
        
    
    // ========================================================
    // MODULE: POSITION
    // ========================================================
  Position: {

    /**
     * Returns current altitude above horizon
     * Property: sk6ObjInfoProp_ALT (59)
     * 
     * @returns {number|null} Altitude in decimal degrees (0-90)
     *                        Negative values indicate below horizon
     */
    getAltitude: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.ALT,
            "Position.getAltitude"
        );
    },

    /**
     * Returns current azimuth
     * Property: sk6ObjInfoProp_AZM (58)
     * 
     * @returns {number|null} Azimuth in decimal degrees (0-360)
     *                        0=North, 90=East, 180=South, 270=West
     */
    getAzimuth: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.AZM,
            "Position.getAzimuth"
        );
    },

    /**
     * Returns current hour angle
     * Property: sk6ObjInfoProp_HA_HOURS (70)
     * 
     * @returns {number|null} Hour angle in decimal hours
     *                        Negative = east of meridian
     *                        Positive = west of meridian
     */
    getHourAngle: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.HA_HOURS,
            "Position.getHourAngle"
        );
    },

    /**
     * Returns current air mass value
     * Property: sk6ObjInfoProp_AIR_MASS (71)
     * 
     * Air mass = 1.0 at zenith, increases toward horizon
     * Values above 3.0 indicate poor observing conditions
     * 
     * @returns {number|null} Air mass (dimensionless)
     */
    getAirMass: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.AIR_MASS,
            "Position.getAirMass"
        );
    },

    /**
     * Returns altitude rate of change
     * Property: sk6ObjInfoProp_ALT_RATE_ASPERSEC (79)
     * 
     * @returns {number|null} Rate in arcseconds per second
     *                        Positive = rising, Negative = setting
     */
    getAltitudeRate: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.ALT_RATE_ASPERSEC,
            "Position.getAltitudeRate"
        );
    },

    /**
     * Returns azimuth rate of change
     * Property: sk6ObjInfoProp_AZIM_RATE_ASPERSEC (80)
     * 
     * @returns {number|null} Rate in arcseconds per second
     */
    getAzimuthRate: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.AZIM_RATE_ASPERSEC,
            "Position.getAzimuthRate"
        );
    },

    /**
     * Returns complete position snapshot for current object
     * Efficient — queries all position properties in sequence
     * 
     * @returns {Object|null} Position object with all properties
     *   {
     *     altitude:     number,  // degrees
     *     azimuth:      number,  // degrees
     *     hourAngle:    number,  // hours
     *     airMass:      number,  // dimensionless
     *     altRate:      number,  // arcsec/sec
     *     azRate:       number   // arcsec/sec
     *   }
     */
    getAll: function() {
        var alt  = this.getAltitude();
        if (alt === null) return null;

        return {
            altitude:  alt,
            azimuth:   this.getAzimuth(),
            hourAngle: this.getHourAngle(),
            airMass:   this.getAirMass(),
            altRate:   this.getAltitudeRate(),
            azRate:    this.getAzimuthRate()
        };
    },

    /**
     * Returns whether object is currently observable
     * Combines altitude and air mass thresholds
     * 
     * @param  {number}  minAltitude  Minimum altitude degrees (default 20)
     * @param  {number}  maxAirMass   Maximum air mass (default 2.5)
     * @returns {boolean|null}
     */
    isObservable: function(minAltitude, maxAirMass) {
        var minAlt = minAltitude || 15;
        var maxAM  = maxAirMass  || 2.5;
        var alt    = this.getAltitude();
        var am     = this.getAirMass();

        if (alt === null || am === null) return null;
        return (alt >= minAlt && am <= maxAM);
                    }
          },

    // ========================================================
    // MODULE: COORDINATES
    // ========================================================
    Coordinates: {
     /**
     * Returns right ascension from the location of the user
     * Property: sk6ObjInfoProp_RA_NOW (54)
     * 
     * @returns {number|null} in decimal hours (0-24)
     */
        getRightAscension: function () {
            return SkyWrapper._query(
                SkyWrapper._PROP.RA_NOW,
                "Coordinates.getRightAscension"
                );

        },
      /**
      * Returns declination from the location of the user
      * Property: sk6ObjInfoProp_DEC_NOW (55)
      *
      * @returns {number|null} DEC in decimal degrees (-90 to +90)
      */
    
        getDeclination: function () {
            return SkyWrapper._query(
                SkyWrapper._PROP.DEC_NOW,
                "Coordinates.getDeclination"
                );

        },
      /**
      * Returns J2000 epoch right ascension
      * Property: sk6ObjInfoProp_RA_2000 (56)
      *
      * @returns {number|null} RA in decimal hours (0-24)
      */
    
        getRA2000: function () {
            return SkyWrapper._query(
                SkyWrapper._PROP.RA_2000,
                "Coordinates.getRA2000"
                );

        },
      /**
      * Returns J2000 epoch declination
      * Property: sk6ObjInfoProp_DEC_2000 (57)
      *
      * @returns {number|null} DEC in decimal degrees (-90 to +90)
      */
        getDEC2000: function () {
            return SkyWrapper._query(
                SkyWrapper._PROP.DEC_2000,
                "Coordinates.getDEC2000"
            );

        },
        
     /**
     * Returns local sidereal time
     * Property: sk6ObjInfoProp_SIDEREAL (173)
     * 
     * @returns {number|null} LST in decimal hours
     */
    getSiderealTime: function() {
        sky6StarChart.Find("Sun"); // LST requires any valid object, however the Sun is always findeable
        return SkyWrapper._query(
            SkyWrapper._PROP.SIDEREAL,
            "Coordinates.getSiderealTime"
            );
        
        },

     /**
     * Returns RA formatted as HH:MM:SS (hour-hour, minute-minute, second-second) string
     * sky6Utils for conversion
     * 
     * @param  {number}  raDecimal  RA in decimal hours
     * @returns {string} HH:MM:SS string
     */
    /**
    formatRA: function(raDecimal) {
        if (raDecimal === null || raDecimal === undefined) return "N/A";
        return sky6Utils.HMSFromDec(raDecimal);
            },
    */
        formatRA: function(raDecimal) {
            var h = Math.floor(raDecimal);
            
            var mDecimal = (raDecimal - h) * 60;
            var m = Math.floor(mDecimal);
            
            var s = ((mDecimal - m) * 60).toFixed(2);

            return h + ":" + m + ":" + s;

        },

    /**
     * Returns Dec formatted as +DD:MM:SS (degree, minute-minute, second-second) string
     * sky6Utils for conversion
     * 
     * @param  {number}  decDecimal  Dec in decimal degrees
     * @returns {string} +DD:MM:SS string
     */
    formatDec: function(decDecimal) {
        if (decDecimal === null || decDecimal === undefined) return "N/A";
        function pad(n) {
            return n < 10 ? "0" + n : n;
        }
         sky6Utils.ConvertAngleToDMS(decDecimal);

        var sign = decDecimal < 0 ? "-" : "+";
        
        return (
            sign + 
            pad(sky6Utils.dOut0) + ":" + pad(sky6Utils.dOut1) + ":" + pad(Math.round(sky6Utils.dOut2))
            );
         },


     /**
     * Returns complete coordinate set for current object
     * 
     * @returns {Object|null} Coordinates object
     *   {
     *     raNow:    number,   // decimal hours
     *     decNow:   number,   // decimal degrees
     *     ra2000:   number,   // decimal hours
     *     dec2000:  number,   // decimal degrees
     *     raString: string,   // formatted HH:MM:SS
     *     decString: string   // formatted DD:MM:SS
     *     ra2000String: string   //formatted HH:MM:SS
     *     dec2000String: string   // formatted DD:MM:SS
     *   }
     * // Dont call the getAll function when calling the aforementioned table. Use getCoordinatesReport.
     */

    getAll: function() {
        var ra  = this.getRightAscension();
        if (ra === null) return null;
        
        var dec = this.getDeclination();

        return {
            raNow:     ra,
            decNow:    dec,
            ra2000:    this.getRA2000(),
            dec2000:   this.getDEC2000(),
            raString:  this.formatRA(ra),
            decString: this.formatDec(dec),
            ra2000String: this.formatRA(this.getRA2000()),
            dec2000String: this.formatDec(this.getDEC2000())
        };
    },  

getCoordinatesReport: function() { 

       var coords = this.getAll();
        
        if (coords === null) 
            return "No coordinates available";
       
       
        return [
            "SkyWrapper Coordinates Report",
            "==============================",
            "RA now (raw):          " + coords.raNow,
            "Declination now (raw): " + coords.decNow,
            "RA 2000 (raw)    :    " + coords.ra2000,
            "Declination 2000 (raw)   : " + coords.dec2000,
            "RA string     : " + coords.raString,
            "Declination string : " + coords.decString,
            "RA 2000 string : " + coords.ra2000String,
            "Dec 2000 string : " + coords.dec2000String
        ].join("\n");
    }

    

    },

    /**
     * Returns observer latitude from document properties
     * Uses sky6StarChart DocumentProperty system
     * Property: sk6DocProp_Latitude (0)
     * 
     * @returns {number} Observer latitude in decimal degrees
     */
    getObserverLatitude: function() {
        sky6StarChart.DocumentProperty(0);
        return sky6StarChart.DocPropOut;
    },

    /**
     * Returns observer longitude from document properties
     * Property: sk6DocProp_Longitude (1)
     * 
     * @returns {number} Observer longitude in decimal degrees
     */
    getObserverLongitude: function() {
        sky6StarChart.DocumentProperty(1);
        return sky6StarChart.DocPropOut;
    
    },

    /**
     * Returns observer elevation in meters
     * Property: sk6DocProp_ElevationInMeters (3)
     * 
     * @returns {number} Elevation in meters
     */
    getObserverElevation: function() {
        sky6StarChart.DocumentProperty(3);
        return sky6StarChart.DocPropOut;
   
    },

    // ========================================================
    // MODULE: IDENTITY
    // ========================================================
    Identity: {},

    // ========================================================
    // MODULE: PHYSICAL
    // ========================================================
    Physical: {},

    // ========================================================
    // MODULE: TIME
    // ========================================================
    Time: {}

};
