# SkyWrapper.js

A professional JavaScript wrapper library for the TheSky X scripting API.

SkyWrapper replaces TheSky X's numeric property code system with clean,
documented, error-handled functions — making the platform's scripting
capability accessible to any JavaScript developer without requiring
knowledge of internal property codes.

**Built against:** TheSky X version 10.5.0 build 14047  
**License:** MIT  
**Author:** Pierce Tamburini  
**Platforms:** Windows, macOS, Linux  

---

## The Problem

Scripting TheSky X today requires code like this:

```javascript
sky6StarChart.Find("M42");
sky6ObjectInformation.Property(59);
var alt = sky6ObjectInformation.ObjInfoPropOut;
```

The number `59` means altitude. There is no way to know that without
reading incomplete documentation. There are 189 such property codes.

## The Solution

```javascript
var data = SkyWrapper.query("M42");
var alt  = data.position.altitude;
```

Cleaner, readable, and error-handled.

---

## Installation

Copy `SkyWrapper.js` into your TheSky X scripts folder and paste its
contents into the scripting console before running any script that
uses it.

All property codes are sourced from Software Bisque's official Doxygen
documentation (`Sk6ObjectInformationProperty` enum) and verified live
against TheSky X version 10.5.0 build 14047.

---

## Quick Start

```javascript
// Query a complete profile for any object
var data = SkyWrapper.query("Jupiter");

// Access any property
data.name                        // "Jupiter"
data.position.altitude           // degrees above horizon
data.position.observable         // true/false
data.coordinates.raString        // "05h35m17s"
data.identity.typeName           // "Jupiter"
data.physical.magnitude          // -1.91
data.physical.phase              // 99.6%
data.timing                      // rise/transit/set
```

---

## Modules

### SkyWrapper.System
Application awareness and environment detection.

| Function | Returns | Description |
|---|---|---|
| `getVersion()` | string | TheSky X version e.g. "10.5.0" |
| `getBuild()` | string | Build number e.g. "14047" |
| `getOperatingSystem()` | string | "Mac", "Windows", or "Linux" |
| `isInitialized()` | boolean | Whether TheSky X is fully loaded |
| `waitForReady()` | boolean | Throws if not initialized |
| `checkVersion(min)` | boolean | Verifies minimum version |
| `getPathSeparator()` | string | "/" or "\" for current OS |
| `buildPath(dir, file)` | string | Cross-platform file path |
| `getEnvironmentReport()` | string | Formatted environment summary |

---

### SkyWrapper.Position
Current sky position relative to the observer.
Requires `sky6StarChart.Find()` before calling.

| Function | Returns | Description |
|---|---|---|
| `getAltitude()` | number\|null | Degrees above horizon |
| `getAzimuth()` | number\|null | Degrees 0-360 |
| `getHourAngle()` | number\|null | Hours, negative=east |
| `getAirMass()` | number\|null | 1.0 at zenith |
| `getAllPosition()` | Object\|null | All four properties |
| `getPositionReport()` | string | Formatted report |
| `isObservable(alt, am)` | boolean\|null | Above threshold check |

---

### SkyWrapper.Coordinates
Equatorial coordinates and observer location.

| Function | Returns | Description |
|---|---|---|
| `getRightAscension()` | number\|null | Current epoch RA, decimal hours |
| `getDeclination()` | number\|null | Current epoch Dec, decimal degrees |
| `getRA2000()` | number\|null | J2000 RA, decimal hours |
| `getDEC2000()` | number\|null | J2000 Dec, decimal degrees |
| `formatRA(decimal)` | string | "05h35m17s" |
| `formatDec(decimal)` | string | "+/-DD:MM:SS" |
| `getAllCoordinates()` | Object\|null | All coordinates and strings |
| `getCoordinatesReport()` | string | Formatted report |
| `getObserverLatitude()` | number | Decimal degrees |
| `getObserverLongitude()` | number | Decimal degrees |
| `getObserverElevation()` | number | Meters |

---

### SkyWrapper.Identity
Object classification and catalog data.

| Function | Returns | Description |
|---|---|---|
| `getTypeName()` | string\|null | "Star", "Nebula", "Galaxy" etc. |
| `getAllNames()` | string | Formatted catalog report |
| `getPrimaryName()` | string\|null | Most readable name |
| `getCatalogName()` | string\|null | First catalog entry |
| `getSpectralType()` | string\|null | Stars only e.g. "A0m..." |

---

### SkyWrapper.Physical
Intrinsic object properties.

| Function | Returns | Description |
|---|---|---|
| `getMagnitude()` | number\|null | Visual magnitude. See note. |
| `getMajorAxis()` | number\|null | Arc minutes |
| `getMinorAxis()` | number\|null | Arc minutes |
| `getEarthDistanceKM()` | number\|null | Distance, units TBC |
| `getPositionAngle()` | number\|null | Degrees |
| `getPhasePercent()` | number\|null | 0-100%, solar system only |
| `getRARate()` | number\|null | Arcsec/sec, solar system only |
| `getDecRate()` | number\|null | Arcsec/sec, solar system only |

> **Note:** `getMagnitude()` may return unreliable values for extended
> objects such as nebulae and galaxies. The `magnitudeReliable` flag
> in `query()` identifies affected objects automatically.

---

### SkyWrapper.Time
Time, timing, and session planning.

| Function | Returns | Description |
|---|---|---|
| `getCurrentJD()` | number | Current Julian Date |
| `getCurrentDateString()` | string | UTC "YYYY-MM-DD HH:MM:SS" |
| `getLocalSiderealTime()` | number | Decimal hours |
| `getLocalSiderealTimeString()` | string | "HH:MM:SS" |
| `getUniversalTime()` | number | Decimal hours |
| `getUniversalTimeString()` | string | "HH:MM:SS" |
| `getRiseTransitSet(ra, dec)` | Object\|null | Rise/transit/set times |
| `getSolarSystemTimes()` | string\|null | Planets and Sun only |
| `getTwilightTimes()` | Object\|null | Astronomical dark window |
| `getTimeReport()` | string | Formatted session summary |

---

### SkyWrapper.Extras
Supplementary calculations.

| Function | Returns | Description |
|---|---|---|
| `getAllInfo()` | string\|null | TheSky pre-formatted summary |
| `getAngularSeparation(a, b)` | number\|null | Degrees between two objects |
| `getRefraction(alt)` | number | Arcseconds at given altitude |

---

### SkyWrapper.query(objectName)

Primary function (most useful). Finds the object and returns a 
relevant profile in one call.

```javascript
var data = SkyWrapper.query("M42");
// Returns null if object not found

// data.name            — object name
// data.queriedAt        — UTC timestamp
// data.position         — altitude, azimuth, hourAngle, airMass
// data.coordinates      — RA/Dec in multiple formats
// data.identity         — names, type, spectral class
// data.physical         — magnitude, size, phase, rates
// data.timing           — rise, transit, set
// data.timingSource     — "solar_system" or "computed"
// data.observable       — boolean
```

---

## Architectural Notes

### The dOut Variable Conflict

`sky6Utils` uses shared output variables `dOut0` through `dOut5`.
Every `sky6Utils` call overwrites these immediately. SkyWrapper stores
all `dOut` values in local variables before making any subsequent call.
This is documented in the Time module header and applied consistently
throughout the library.

### Property Code Verification

All property codes were verified live against TheSky X 10.5.0 build
14047. Several codes present in the official enum were found to be
non-functional and are excluded:

- Codes 79/80 (ALT/AZM rate) — `PropertyApplies` returns 0 for all objects
- Codes 171/172 (twilight) — returns epoch-zero JD values
- The Moon does not support codes 12 or 13

Each exclusion is documented in `_PROP` with an explanation.

---

## Known Limitations

| Item | Status |
|---|---|
| Magnitude for nebulae/galaxies | Flagged via `magnitudeReliable` |
| Twilight times | Returns null gracefully |
| ALT/AZM rate codes | Commented out, will not apply |
| Moon property codes 12/13 | Handled via fallback in `query()` |
| EARTH_DIST_KM units | Requires verification |
| ComputeUniversalTime offset | 6-hour discrepancy noted in code |

---

## License

MIT License — see LICENSE file for full text.

Copyright (c) 2026 Pierce Tamburini
