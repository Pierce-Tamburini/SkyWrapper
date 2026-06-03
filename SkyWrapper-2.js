/**
 * SkyWrapper.js
 * ============================================================
 * A professional wrapper library for TheSky X scripting API
 * 
 * Provides documented, error-handled functions for
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
 *   Example:
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
 * SkyWrapper is the main branch, housing all listed modules, 
 * and the required _query(), _find(), _formatHours, _formatJD internal helpers. 
 * SkyWrapper also houses the query() convenience function,
 * which itself is not an internal function.
 * 
 * PROPERTY CODE REFERENCE:
 *   All property codes sourced from official Bisque Doxygen
 *   documentation Sk6ObjectInformationProperty enum.
 *   https://www.bisque.com/wp-content/scriptthesky/
 *
 * Project repository:
 * https://github.com/Pierce-Tamburini/SkyWrapper
 * ============================================================
 */

var SkyWrapper = {

    // ========================================================
    // INTERNAL CONSTANTS
    // Property codes from Sk6ObjectInformationProperty enum
    // Official names preserved for verification
	// _PROP_NAME 1-7 objects are named for clarification
	// Note that not all PROP codes listed are used in SkyWrapper
    // ========================================================
    
    _PROP: {
        // Identity
        NAME1:          0, // Catalog Name
        NAME2:          1, // Primary Name
        NAME3:          2, // SAO catalog identity
        NAME4:          3, // GSC catalog identity
        NAME5:          4, // PPM catalog identity
        NAME6:          5, // HD catalog identity
        NAME7:          6, // BD catalog identity
        //NAME8:          7,
        //NAME9:          8,
        //NAME10:         9,
        //CATALOGID:      10,
        ALL_INFO:       11, 
        CO_NAME:        12, // Common name / Type Name
        STAR_SPECTRAL:  14, // Spectral Type
        STAR_BAYER_FLAMSTEED: 15, // Bayer Flamsteed catalog identity
        

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

        // Motion rates
		// NOTE: Codes 79 and 80 confirmed never applicable
		// in this version and they were removed from library.
        RA_RATE_ASPERSEC:   77,
        DEC_RATE_ASPERSEC:  78,
        //ALT_RATE_ASPERSEC:  79, -- Never applies, do not use
        //AZIM_RATE_ASPERSEC: 80, -- Never applies, do not use

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
            return null;
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
      // Function parameters, "objectName" or "context" 
      // ask whether or not the object name is false, if the imput isnt 
      // a string, or if its an empty string. If any of these are true (in successive order),
	  //the console outputs: "objectName must be a non-empty string"
    
  
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

},

	
/**
 * INTERNAL — Converts decimal hours to HH:MM:SS (hour-hour, minute-minute, second-second) string
 * 
 * Used for formatting rise, transit, and set times returned
 * by sky6Utils.ComputeRiseTransitSetTimes() which gives
 * results as decimal hours in dOut0, dOut1, dOut2.
 * 
 * @param  {number}  decimalHours  Time as decimal hours 
 * @returns {string} Formatted string 
 */	
_formatHours: function(decimalHours) {
    if (decimalHours === null || decimalHours === undefined) {
        return "N/A";
    }

    function pad(n) {
        return n < 10 ? "0" + n : String(n);
    }

    var totalSeconds = Math.round(decimalHours * 3600);
    var hours        = Math.floor(totalSeconds / 3600);
    var minutes      = Math.floor((totalSeconds % 3600) / 60);
    var seconds      = totalSeconds % 60;

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
},

/**
 * INTERNAL — Converts Julian Date to readable date/time string
 * 
 * Uses sky6Utils.ConvertJulianDateToCalender(jd) which
 * returns six separate numeric components:
 *   dOut0 = year
 *   dOut1 = month
 *   dOut2 = day
 *   dOut3 = hour (UTC)
 *   dOut4 = minute
 *   dOut5 = seconds (decimal)
 * 
 * Note: time returned is UTC not local time
 * 
 * @param  {number}  jd  (Julian Date)
 * @returns {string} Formatted string 
 */
	
_formatJD: function(jd) {
    if (jd === null || jd === undefined) return "N/A";

    function pad(n) {
        return n < 10 ? "0" + n : String(n);
    }

    try {
        sky6Utils.ConvertJulianDateToCalender(jd);

        var year   = sky6Utils.dOut0;
        var month  = sky6Utils.dOut1;
        var day    = sky6Utils.dOut2;
        var hour   = sky6Utils.dOut3;
        var minute = sky6Utils.dOut4;
        var second = Math.floor(sky6Utils.dOut5);

        return year + "-" + pad(month)  + "-" + pad(day) +
               " "  + pad(hour)   + ":" + pad(minute) +
               ":"  + pad(second);

    } catch(e) {
        RunJavaScriptOutput = "SkyWrapper._formatJD failed" +
            "\nJD: " + jd +
            "\nError: " + e.message;
        return "N/A";
    }
},

	
    // ========================================================
    // MODULE 1: SYSTEM
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
        * @returns {boolean} truth value if ready
        * @throws error if system is not ready
        */
           waitForReady: function() {
			   if(Application.initialized) {
				   return true;
			   }
       
                throw new Error(
                    "SkyWrapper.System.waitForReady: " +
                    "TheSky X is not yet fully initialized. " +
					"Please wait for the application to finish " +
					"loading before running scripts."
                    
                );
    	},

		
  /**
   * Checks for the minimum required version of TheSky. You must input the
   * build number as the function argument.
   * @param {number} minVersion (minimum required BUILD)
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
     * For bug reports and/or compatibility checking
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
    // MODULE 2: POSITION
    // ========================================================
  Position: {

    /**
     * Returns current altitude above horizon
     * Property: sk6ObjInfoProp_ALT (59)
     * 
     * @returns {number|null} Altitude in decimal degrees (0-90)
     * Negative values indicate below horizon
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
     * 0=North, 90=East, 180=South, 270=West
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
     * Returns complete position snapshot for current object
     * Efficient — queries all position properties in sequence
     * 
     * @returns {string|null} Position object with all properties
     *   {
     *     altitude:     number,  // degrees
     *     azimuth:      number,  // degrees
     *     hourAngle:    number,  // hours
     *     airMass:      number,  // dimensionless
     *   }
	 * NOTE: Do not call the getAllPosition function to return the aforementioned table. Use getPositionReport.
     */
    getAllPosition: function() {
        var alt  = this.getAltitude();
        if (alt === null) return null;

        return {
            altitude:  alt,
            azimuth:   this.getAzimuth(),
            hourAngle: this.getHourAngle(),
            airMass:   this.getAirMass()
        };
    },

	  getPositionReport: function() { 

       var pos = this.getAllPosition();
        
        if (pos === null) 
            return "No positional data available";
       
       
        return [
            "SkyWrapper Position Report",
            "==============================",
            "Altitude          " + pos.altitude,
            "Azimuth: 			" + pos.azimuth,
            "Hour Angle    :    " + pos.hourAngle,
            "Air Mass  		 : " + pos.airMass

        ].join("\n");
    },

	  
    /**
     * Returns whether object is currently observable
     * Combines altitude and air mass thresholds
     * 
     * @param  {number}  minAltitude  Minimum altitude degrees (default 15)
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
    // MODULE 3: COORDINATES
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
     * Returns RA formatted as HH:MM:SS string
     * sky6Utils for conversion
     * 
     * @param  {number}  raDecimal  RA in decimal hours
     * @returns {string} HH:MM:SS string
     */
        formatRA: function(raDecimal) {
			if (raDecimal === null || raDecimal === undefined) return "N/A";

			function pad(n) {
				return n < 10 ? "0" + n : String (n);

			}
            var h = Math.floor(raDecimal);
    
            var mDecimal = (raDecimal - h) * 60;
            var m = Math.floor(mDecimal);
            
            var s = Math.floor((mDecimal - m) * 60);

            return pad(h) + "h" + pad(m) + "m" + pad(s) + "s";

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
     * @returns {string|null} Coordinates object
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
     * Dont call the getAll function when calling the aforementioned table. Use getCoordinatesReport.
     */
    getAllCoordinates: function() {
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

       var coords = this.getAllCoordinates();
        
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

	},

	
    // ========================================================
    // MODULE 4: IDENTITY
    // ========================================================
	
       Identity: {

   /**
 	* Returns object type as plain English string
	* Property code 12 — verified across all object types
 	* Examples: "Star", "Nebula", "Globular Cluster", "Jupiter"
 	* @returns {string|null}
 	*/
	getTypeName: function() {
   	 return SkyWrapper._query(12, "Identity.getTypeName");
	},

		   
    /**
     * Returns all available catalog identifiers for current object, including (and in order):
     * Catalog name (PropCode 0)
     * Primary name (PropCode 1)
     * SAO (Smithsonian Astrophysical Catalog) name (PropCode 2)
     * GSC (Guide Star Catalog) name (PropCode 3)
     * Hd (Henry Draper Catalogue) name (PropCode 5)
     * PPM (Positions and Proper Motions) name (PropCode 4)
     * BD (Bonner Durchmusterung) name (PropCode 6)
     * Common Name / Type Name (PropCode 12)
     * Spectral Type (PropCode 14)
     * Bayer Flamsteed ID (PropCode 15)
	 * @returns {string}
     */
    getAllNames: function() {
        var names = [];
        for (var i = 0; i <= 15; i++) {
			sky6ObjectInformation.PropertyApplies(i);
    
			if (sky6ObjectInformation.ObjInfoPropOut !== 0) {
				sky6ObjectInformation.Property(i);
				names[i] = sky6ObjectInformation.ObjInfoPropOut;
			} else {
				names [i] = "N/A";
       		 }
		}
        return [
			
	"SkyWrapper Object Classification Report",
	"===============================",
	"Catalog Name : " + names[0],
	"Primary Name : " + names [1],
	"SAO Catalog ID : " + names [2],
	"GSC Catalog ID : " + names [3],
	"HD Catalog ID : " + names [5],
	"PPM Catalog ID : " + names [4],
	"BD Catalog ID : " + names[6],
	"Common Name/Type Name : " + names [12],
	"Spectral Type : " + names [14],
	"Bayer Flamsteed : " + names [15]
].join("\n");
	
    },

		   
   /**
	* Returns the spectral type of the named star
	* @returns {string|null} spectral class and type
	*/
    getSpectralType: function () {
        sky6ObjectInformation.PropertyApplies(14);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
        sky6ObjectInformation.Property(14);
        return sky6ObjectInformation.ObjInfoPropOut;
	},	

		   
    /**
     * Returns the primary display name
	 * @returns {string|null} display name
     */
    getPrimaryName: function() {
        sky6ObjectInformation.PropertyApplies(1);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
        sky6ObjectInformation.Property(1);
        return sky6ObjectInformation.ObjInfoPropOut;
    },

		   
    /**
     * Returns the first catalog entry name
	 * @returns {string|null}
     */  
	getCatalogName: function() {
        sky6ObjectInformation.PropertyApplies(0);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
        sky6ObjectInformation.Property(0);
        return sky6ObjectInformation.ObjInfoPropOut;
    }

},


    // ========================================================
    // MODULE 5: PHYSICAL
    // ========================================================
    Physical: {

    /**
     * Returns visual magnitude
     * Property: sk6ObjInfoProp_MAG (65)
	 *
	 * NOTE: For extended (not point like) objects such as galaxies
	 * or nebulae, this property may not return visual magnitude. 
	 * Verified returning unreliable results for M42, but reliable for
	 * objects internal to our Solar System.
	 * Always verify against external sources for extended objects.
	 *
     * @returns {number|null} Magnitude (lower = brighter)
     */
    getMagnitude: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.MAG,
            "Physical.getMagnitude"
        );
    },

		
    /**
     * Returns major axis size
     * Property: sk6ObjInfoProp_MAJ_AXIS_MINS (60)
     * @returns {number|null} Size in arc minutes
     */
    getMajorAxis: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.MAJ_AXIS_MINS,
            "Physical.getMajorAxis"
        );
    },

		
    /**
     * Returns minor axis size
     * Property: sk6ObjInfoProp_MIN_AXIS_MINS (61)
     * @returns {number|null} Size in arc minutes
     */
    getMinorAxis: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.MIN_AXIS_MINS,
            "Physical.getMinorAxis"
        );
    },

		
    /**
     * Returns distance from Earth in kilometers
     * Property: sk6ObjInfoProp_EARTH_DIST_KM (62)
     * @returns {number|null} Distance in km
	 * NOTE: Returned units need verification against SB documentdation.
	 * Enum name suggests KM, but tested scripts suggest AU. Do not rely.
     */
    getEarthDistanceKM: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.EARTH_DIST_KM,
            "Physical.getEarthDistanceKM"
        );
    },

		
    /**
     * Returns position angle
     * Property: sk6ObjInfoProp_PA (64)
     * @returns {number|null} Position angle in degrees
     */
    getPositionAngle: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.PA,
            "Physical.getPositionAngle"
        );
    },

		
    /**
     * Returns phase percentage (planets, Moon)
     * Property: sk6ObjInfoProp_PHASE_PERC (66)
     * @returns {number|null} Phase 0-100%
     */
    getPhasePercent: function() {
        return SkyWrapper._query(
            SkyWrapper._PROP.PHASE_PERC,
            "Physical.getPhasePercent"
        );
    },

		/**
 * Returns RA rate of change in arcseconds per second
 * Property: sk6ObjInfoProp_RA_RATE_ASPERSEC (77)
 *
 * SOLAR SYSTEM OBJECTS ONLY — verified applies: 0 for stars
 * Confirmed working for Jupiter:
 *   value: 0.00835... arcsec/sec
 *
 * Useful for tracking fast-moving solar system targets
 * and for identifying objects with significant proper motion
 *
 * @returns {number|null} Rate in arcsec/sec or null for stars
 */
getRARate: function() {
    return SkyWrapper._query(
        SkyWrapper._PROP.RA_RATE_ASPERSEC,
        "Physical.getRARate"
    );
},

/**
 * Returns Dec rate of change in arcseconds per second
 * Property: sk6ObjInfoProp_DEC_RATE_ASPERSEC (78)
 *
 * SOLAR SYSTEM OBJECTS ONLY — verified applies: 0 for stars
 * Confirmed working for Jupiter:
 *   value: -0.00135... arcsec/sec
 *
 * @returns {number|null} Rate in arcsec/sec or null for stars
 */
getDecRate: function() {
    return SkyWrapper._query(
        SkyWrapper._PROP.DEC_RATE_ASPERSEC,
        "Physical.getDecRate"
    	);
	},

},

	
// ========================================================
// MODULE 6: TIME
//
// CRITICAL ARCHITECTURAL NOTE:
// sky6Utils uses shared output variables (dOut0-dOut5, strOut).
// Every sky6Utils call overwrites these immediately.
// ALWAYS store dOut values in local variables before making
// any subsequent sky6Utils call. Failure to do this will
// silently produce wrong values with no error message.
//
// Correct pattern:
//   sky6Utils.ComputeRiseTransitSetTimes(ra, dec);
//   var rise = sky6Utils.dOut0;    // store immediately
//   var set  = sky6Utils.dOut2;    // store immediately
// ========================================================
	
Time: {

    /**
     * Returns current Julian Date
     * Uses sky6Utils.ComputeJulianDate() — no parameters
     * Result stored in sky6Utils.dOut0
     *
     * @returns {number} Current Julian Date e.g. 2461193.342
     */
    getCurrentJD: function() {
        sky6Utils.ComputeJulianDate();
        return sky6Utils.dOut0;
    },

	
    /**
     * Returns current date and time as formatted UTC string
     * Uses _formatJD which calls ConvertJulianDateToCalender
     *
     * @returns {string} e.g. "2026-06-01 14:13:14"
     */
    getCurrentDateString: function() {
        sky6Utils.ComputeJulianDate();
        var jd = sky6Utils.dOut0; // store before any other call
        return SkyWrapper._formatJD(jd);
    },

	
    /**
     * Returns local sidereal time as decimal hours
     * Uses sky6Utils.ComputeLocalSiderealTime()
     * Result in sky6Utils.dOut0
     *
     * LST tells you which RA is currently on the meridian.
     * Objects with RA close to LST are optimally placed.
     *
     * @returns {number} LST in decimal hours e.g. 23.862
     */
    getLocalSiderealTime: function() {
        sky6Utils.ComputeLocalSiderealTime();
        return sky6Utils.dOut0;
    },

	
    /**
     * Returns local sidereal time as formatted string
     * @returns {string} e.g. "23:51:44"
     */
    getLocalSiderealTimeString: function() {
        sky6Utils.ComputeLocalSiderealTime();
        var lst = sky6Utils.dOut0; // store immediately
        return SkyWrapper._formatHours(lst);
    },

	
    /**
     * Returns universal time as decimal hours
     * Uses sky6Utils.ComputeUniversalTime()
     * Result in sky6Utils.dOut0
     *
     * @returns {number} UT in decimal hours e.g. 14.221
     */
    getUniversalTime: function() {
        sky6Utils.ComputeUniversalTime(); //ComputeUniversalTime() has a 6 hour discrepency from UTC
        return sky6Utils.dOut0;
    },

	
    /**
     * Returns universal time as formatted string
     * @returns {string} e.g. "14:13:14"
     */
    getUniversalTimeString: function() {
        sky6Utils.ComputeUniversalTime();
        var ut = sky6Utils.dOut0; // store immediately
        return SkyWrapper._formatHours(ut);
    },

	
    /**
     * Returns rise, transit, and set times for any RA/Dec
     * Uses sky6Utils.ComputeRiseTransitSetTimes(ra, dec)
     *
     * Results stored immediately to prevent dOut conflicts.
     * Returns times as both decimal hours and formatted strings.
     *
     * @param  {number}  ra   Right Ascension in decimal hours
     * @param  {number}  dec  Declination in decimal degrees
     * @returns {Object|null}
     * {
     *   riseHours:     number,  decimal hours e.g. 8.181
     *   transitHours:  number,  decimal hours e.g. 13.914
     *   setHours:      number,  decimal hours e.g. 19.647
     *   riseString:    string,  e.g. "08:10:53"
     *   transitString: string,  e.g. "13:54:54"
     *   setString:     string   e.g. "19:38:55"
     * }
     */
    getRiseTransitSet: function(ra, dec) {
        if (ra === null || ra === undefined) return null;
        if (dec === null || dec === undefined) return null;

        try {
            sky6Utils.ComputeRiseTransitSetTimes(ra, dec);

            // Store ALL values immediately before any other call
            var rise    = sky6Utils.dOut0;
            var transit = sky6Utils.dOut1;
            var set     = sky6Utils.dOut2;

            // _formatHours is pure math — no sky6Utils calls
            // so dOut values remain safe to use here
            return {
                riseHours:     rise,
                transitHours:  transit,
                setHours:      set,
                riseString:    SkyWrapper._formatHours(rise),
                transitString: SkyWrapper._formatHours(transit),
                setString:     SkyWrapper._formatHours(set)
            };

        } catch(e) {
            RunJavaScriptOutput = "Time.getRiseTransitSet failed" +
                "\nRA: "  + ra  +
                "\nDec: " + dec +
                "\nError: " + e.message;
            return null;
        }
    },

	
    /**
     * Returns rise/transit/set for solar system objects
     * Property code 13 — verified planets ONLY
     * Does not apply to stars or deep sky objects
     *
     * Returns pre-formatted multi-line string from TheSky:
     * "Rise: 8:56 AM DST on 5/28/26
     *  Transit: 4:16 PM DST on 5/28/26
     *  Set: 11:36 PM DST on 5/28/26"
     *
     * For stars and deep sky objects use getRiseTransitSet()
     *
     * @returns {string|null} Formatted string or null if not a planet
     */
    getSolarSystemTimes: function() {
        sky6ObjectInformation.PropertyApplies(13);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
        sky6ObjectInformation.Property(13);
        return sky6ObjectInformation.ObjInfoPropOut;
    },

	
    /**
     * Returns astronomical twilight times for tonight
     * Finds the Sun first as twilight is solar-dependent
     * Property codes 171 and 172 via _query
     *
     * Astronomical twilight end = true darkness begins
     * Astronomical twilight start = morning twilight begins
     *
     * @returns {Object|null}
     * {
     *   darkStartJD:    number,  Julian date darkness begins
     *   darkEndJD:      number,  Julian date morning twilight begins
     *   darkStartString: string, e.g. "21:43:00"
     *   darkEndString:   string, e.g. "04:22:00"
     *   darkHours:       number, total hours of darkness
     * }
     */
    getTwilightTimes: function() {
        try {
            sky6StarChart.Find("Sun");

            // Query dark start — astronomical twilight end tonight
            sky6ObjectInformation.PropertyApplies(171);
            if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
            sky6ObjectInformation.Property(171);
            var darkStartJD = sky6ObjectInformation.ObjInfoPropOut;

            // Query dark end — astronomical twilight start tomorrow
            sky6ObjectInformation.PropertyApplies(172);
            if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
            sky6ObjectInformation.Property(172);
            var darkEndJD = sky6ObjectInformation.ObjInfoPropOut;

			if (darkStartJD < 2400000 || darkEndJD < 2400000) {
				return null;
			}

            // Calculate hours — JD difference in days x 24
            var darkHours = (darkEndJD - darkStartJD) * 24;

            // Format both times — store JD values first
            // _formatJD calls ConvertJulianDateToCalender
            // so each must complete before the next starts
            var darkStartString = SkyWrapper._formatJD(darkStartJD);
            var darkEndString   = SkyWrapper._formatJD(darkEndJD);

            return {
                darkStartJD:     darkStartJD,
                darkEndJD:       darkEndJD,
                darkStartString: darkStartString,
                darkEndString:   darkEndString,
                darkHours:       Math.abs(darkHours)
            };

        } catch(e) {
            RunJavaScriptOutput = "Time.getTwilightTimes failed" +
                "\nError: " + e.message;
            return null;
        }
    },

	
    /**
     * Returns a formatted time report for current session
     * Combines current time, sidereal time, and twilight info
     *
     * @returns {string} Formatted report
     */
    getTimeReport: function() {

        // Store each value before making next sky6Utils call
        sky6Utils.ComputeJulianDate();
        var jd = sky6Utils.dOut0;

        sky6Utils.ComputeUniversalTime();
        var ut = sky6Utils.dOut0;

        sky6Utils.ComputeLocalSiderealTime();
        var lst = sky6Utils.dOut0;

        var twilight = this.getTwilightTimes();

        var lines = [
            "SkyWrapper Time Report",
            "======================",
            "Current JD  : " + jd,
            "UTC         : " + SkyWrapper._formatJD(jd),
            "Universal   : " + SkyWrapper._formatHours(ut),
            "Sidereal    : " + SkyWrapper._formatHours(lst)
        ];

        if (twilight !== null) {
            lines.push("Dark Start  : " + twilight.darkStartString);
            lines.push("Dark End    : " + twilight.darkEndString);
            lines.push("Dark Hours  : " + twilight.darkHours.toFixed(1) + " hrs");
        } else {
            lines.push("Twilight    : unavailable");
        }

        return lines.join("\n");
    }

},

	
// ========================================================
// MODULe 7: EXTRAS
// ========================================================
	
Extras: {

    /**
     * Returns all available info for current object
     * Property: sk6ObjInfoProp_ALL_INFO (11)
     *
     * Returns a pre-formatted summary string from TheSky.
     * Content varies by object type.
     * Verified working for Jupiter (returns rise/transit/set).
     * May return null for objects where property doesn't apply.
     *
     * @returns {string|null} Formatted info string or null
     */
    getAllInfo: function() {
        sky6ObjectInformation.PropertyApplies(11);
        if (sky6ObjectInformation.ObjInfoPropOut === 0) return null;
        sky6ObjectInformation.Property(11);
        return sky6ObjectInformation.ObjInfoPropOut;
    },

	
    /**
     * Returns angular separation between two named objects
     * Uses sky6Utils.ComputeAngularSeparation(ra1,dec1,ra2,dec2)
     * Result in sky6Utils.dOut0 in decimal degrees
     *
     * Useful for moon avoidance in the planning tools
     *
     * @param  {string}  object1  First object name e.g. "M42"
     * @param  {string}  object2  Second object name e.g. "Moon"
     * @returns {number|null} Separation in decimal degrees
     */
    getAngularSeparation: function(object1, object2) {
        try {
            // Get coordinates of first object
            sky6StarChart.Find(object1);
            sky6ObjectInformation.Property(54); // RA_NOW
            var ra1 = sky6ObjectInformation.ObjInfoPropOut;
            sky6ObjectInformation.Property(55); // DEC_NOW
            var dec1 = sky6ObjectInformation.ObjInfoPropOut;

            // Get coordinates of second object
            sky6StarChart.Find(object2);
            sky6ObjectInformation.Property(54);
            var ra2 = sky6ObjectInformation.ObjInfoPropOut;
            sky6ObjectInformation.Property(55);
            var dec2 = sky6ObjectInformation.ObjInfoPropOut;

            // Compute separation — result in dOut0
            sky6Utils.ComputeAngularSeparation(ra1, dec1, ra2, dec2);
            return sky6Utils.dOut0;

        } catch(e) {
            RunJavaScriptOutput = "Extras.getAngularSeparation failed" +
                "\nObject 1: " + object1 +
                "\nObject 2: " + object2 +
                "\nError: " + e.message;
            return null;
        }
    },

    /**
     * Returns atmospheric refraction correction for given altitude
     * Uses sky6Utils.ComputeRefraction(altitude)
     * Result in sky6Utils.dOut0 in arcseconds
     *
     * @param  {number}  altitudeDegrees  Altitude in decimal degrees
     * @returns {number} Refraction in arcseconds
     */
    getRefraction: function(altitudeDegrees) {
        sky6Utils.ComputeRefraction(altitudeDegrees);
        return sky6Utils.dOut0;
    		}

		}, 

    // ========================================================
    // TOP LEVEL — CONVENIENCE QUERY
	// Note: This is NOT the internal helper _query()
    // ========================================================
/**
 * Queries all available properties for a named celestial object.
 * Primary high-level interface for SkyWrapper.
 *
 * Finds the object once via sky6StarChart.Find() then queries
 * every module in sequence. No second Find() call is made during
 * the query — the selected object remains constant throughout.
 * Functions that call Find() internally (e.g. getTwilightTimes)
 * are deliberately excluded for this reason. Call them separately
 * after query() if needed.
 *
 * Handles any moon as a special case — property codes 12 and 13
 * verified non-applicable for moons. typeName falls back to
 * objectName. timingSource correctly labeled "solar_system"
 * via the knownSolarSystem list even though the computed
 * pathway is used.
 *
 * @param  {string}  objectName  Catalog name of the target object.
 *                               Must be a non-empty string matching
 *                               a TheSky X catalog entry exactly.
 *                               Examples: "M42", "Jupiter", "NGC 891"
 *
 * @returns {Object|null} Complete object profile, or null if the
 *                        object was not found in the catalog.
 *
     */
    query: function(objectName) {

        if (!SkyWrapper._find(objectName, "query")) return null;

        var ra  = SkyWrapper.Coordinates.getRightAscension();
        var dec = SkyWrapper.Coordinates.getDeclination();
		var knownSolarSystem = [
		"Sun", "Mercury", "Venus", "Moon",
        "Mars", "Jupiter", "Saturn",
        "Uranus", "Neptune", "Pluto"
    ];
		var isSolarSystem = false; 
		for (var k = 0; k < knownSolarSystem.length; k++){
			if (objectName === knownSolarSystem[k]) {
				isSolarSystem = true;
				break;
			}
		}
        var timing       = SkyWrapper.Time.getSolarSystemTimes();
        var timingSource = "solar_system";

        if (timing === null) {
            if (ra !== null && dec !== null) {
                timing       = SkyWrapper.Time.getRiseTransitSet(ra, dec);
                timingSource = isSolarSystem ? "solar_system" : "computed";
            }
        }
// typeName fallback for objects that return null for code 12
        var typeName  = SkyWrapper._query(12, "query.typeName") || objectName;
        var queriedAt = SkyWrapper.Time.getCurrentDateString();

        return {
            name:      objectName,
            queriedAt: queriedAt,
            position:  SkyWrapper.Position.getAllPosition(),
            coordinates: {
                raNow:     ra,
                decNow:    dec,
                ra2000:    SkyWrapper.Coordinates.getRA2000(),
                dec2000:   SkyWrapper.Coordinates.getDEC2000(),
                raString:  SkyWrapper.Coordinates.formatRA(ra),
                decString: SkyWrapper.Coordinates.formatDec(dec)
            },
            identity: {
                primaryName:   SkyWrapper.Identity.getPrimaryName(),
                catalogName:   SkyWrapper.Identity.getCatalogName(),
                typeName:      typeName,
                spectralClass: SkyWrapper.Identity.getSpectralType()
            },
            physical: {
                magnitude: SkyWrapper.Physical.getMagnitude(),
				magnitudeReliable: (function () {
					var t = SkyWrapper._query(12, "query.magnitudeCheck");
					if (t === null) return true;
					var unreliable = ["Nebula", "Bright Nebula", "Dark Nebula", "Planetary Nebula", "Galaxy"];

					for (var i = 0; i < unreliable.length; i++){
						if (t === unreliable[i]) return false;
					}
					return true;
				})(),
                majorAxis: SkyWrapper.Physical.getMajorAxis(),
                minorAxis: SkyWrapper.Physical.getMinorAxis(),
                phase:     SkyWrapper.Physical.getPhasePercent()
            },
			
            timing:       timing,
            timingSource: timingSource,
            observable:   SkyWrapper.Position.isObservable()
        };
    }
	
}	
