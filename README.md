# hubot-usgs

A hubot script that returns data from the USGS Sensor API

See [`src/usgs.js`](src/usgs.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-usgs --save`

Then add **hubot-usgs** to your `external-scripts.json`:

```json
[
  "hubot-usgs"
]
```

## Sample Interaction

```
User> Hubot: usgs alias barker 08072500 
Hubot> aliased 08072500 to barker 
User> Hubot: usgs data barker 
Hubot>
Barker Res nr Addicks, TX 
2017-08-28T23:15:00.000-05:00 - Precipitation, total, in, -999999in 
2017-08-30T16:45:00.000-05:00 - Reservoir storage, acre-ft, 169200ac-ft 
2017-08-30T16:45:00.000-05:00 - Lake or reservoir water surface elevation above NAVD 1988, ft, 101.44ft 
Source: https://waterdata.usgs.gov/tx/nwis/uv/?site_no=08072500 
Location: https://www.google.com/maps/place/29.76995129,-95.6471682 
```

## NPM Module

https://www.npmjs.com/package/hubot-usgs
