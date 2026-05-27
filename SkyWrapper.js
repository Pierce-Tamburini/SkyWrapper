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

        isInitialized: function () {
           return Application.initialized;

        },
        
    
    // ========================================================
    // MODULE: POSITION
    // ========================================================
    Position: {
        
    },

    // ========================================================
    // MODULE: COORDINATES
    // ========================================================
    Coordinates: {},

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
