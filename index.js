'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mmrp.js');

L.mmrp = require('./src/directions');
L.mmrp.format = require('./src/format');
L.mmrp.layer = require('./src/layer');
L.mmrp.inputControl = require('./src/input_control');
L.mmrp.errorsControl = require('./src/errors_control');
L.mmrp.routesControl = require('./src/routes_control');
L.mmrp.instructionsControl = require('./src/instructions_control');
L.mmrp.tracksControl = require('./src/tracks_control.js');
