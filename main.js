import Map from "ol/Map";
import View from "ol/View";
import { Group as LayerGroup, Tile as TileLayer } from "ol/layer";
import { OSM, TileWMS } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";

import "ol/ol.css";
import "./style.css";

//https://www.geoportalpraha.cz/cs/sluzby/prohlizeci-sluzby
//https://gs-pub.praha.eu/arcgis/services/ort/ortofotomapa_archiv/MapServer/WmsServer?service=WMS&version=1.3.0&request=GetCapabilities
//https://gs-pub.praha.eu/arcgis/services/arch/mapove_podklady_archiv/MapServer/WmsServer?service=WMS&version=1.3.0&request=GetCapabilities

// Ortofotomapa 1945, černobílá, snímky ze snímkových archivů Spojenců z druhé světové války.
const ortofoto = new LayerGroup({
  layers: [
    new TileLayer({
      source: new TileWMS({
        crossOrigin: "anonymous",
        serverType: "mapserver",
        attributions: "Ortofotomapa 1945, © IPR Praha",
        url: "https://gs-pub.praha.eu/arcgis/services/ort/ortofotomapa_archiv/MapServer/WmsServer",
        params: {
          FORMAT: "image/png",
          LAYERS: "169",
        },
      }),
    }),
  ],
});

// Plán Prahy 1944
const plan = new LayerGroup({
  visible: false,
  layers: [
    new TileLayer({
      source: new TileWMS({
        crossOrigin: "anonymous",
        serverType: "mapserver",
        attributions: "Plán Prahy 1944, © IPR Praha",
        url: "https://gs-pub.praha.eu/arcgis/services/arch/mapove_podklady_archiv/MapServer/WmsServer",
        params: {
          FORMAT: "image/png",
          LAYERS: "1",
        },
      }),
    }),
  ],
});

const layers = {
  ortofoto,
  plan,
};

var map = new Map({
  target: "map",
  controls: defaultControls(),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    ortofoto,
    plan,
  ],
  view: new View({
    center: fromLonLat([14.45, 50.05]),
    zoom: 12,
  }),
});

//přepínač map
const mapSelector = document.getElementById("mapSelector");
mapSelector.addEventListener("change", (event) => {
  const selected = event.target.value;
  Object.keys(layers).forEach((layer) => layers[layer].setVisible(false));
  layers[selected].setVisible(true);
});
