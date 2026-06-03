# Changelog

All notable changes to SkyWrapper are documented here.

## [1.0.0] — 2026-06-03

### Initial Release

**Modules added:**
- `System` — Application version, build, OS detection, path building
- `Position` — Altitude, azimuth, hour angle, air mass, observability
- `Coordinates` — RA/Dec current and J2000, observer location, formatting
- `Identity` — Catalog names, object type, spectral class, Bayer-Flamsteed
- `Physical` — Magnitude, axis dimensions, phase, motion rates
- `Time` — Julian date, sidereal time, rise/transit/set, solar system timing
- `Extras` — Angular separation, atmospheric refraction

**Top-level functions added:**
- `query(objectName)` — Complete single-call object profile

**Internal helpers added:**
- `_query(propCode, context)` — Core property query engine
- `_find(objectName, context)` — Safe object lookup
- `_formatHours(decimalHours)` — Decimal hours to HH:MM:SS
- `_formatJD(jd)` — Julian Date to readable UTC string

**Verified against:**
- TheSky X version 10.5.0 build 14047
- macOS, Windows, Linux
- Object types: stars, planets, deep sky nebulae, galaxies,
  globular clusters, solar system objects including Moon special case

**Known limitations documented:**
- Magnitude unreliable for extended objects (nebulae, galaxies)
- Twilight property codes 171/172 return epoch-zero values in this version
- Motion rate codes 79/80 non-functional in this version
- Moon does not support property codes 12 or 13
- EARTH_DIST_KM return units require verification
- ComputeUniversalTime has 6-hour offset from UTC
