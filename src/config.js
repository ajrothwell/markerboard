// this is the base-config for resource-finder
// the point of this file is that it will move outside the project
// (so that settings we put in it can be used by other projects)
// and be pulled in with an axios call or something
// (we might not need to use axios with new vue async tools)
// if that is not needed, we can move this info to main.js

// data-sources
import immigrant from './data-sources/immigrant';

export default {
  dataSources: {
    immigrant,
  },
  router: {
    enabled: true,
    firstRouteParameter: [
      {
        address(state) {
          return state.geocode.data;
        },
      },
      {
        keywords(state) {
          return state.selectedKeywords;
        },
      },
    ],
    secondRouteParameter: {
      selectedResources(state) {
        return state.selectedResources;
      },
    },
  },
  app: {
    title: 'Immigrant resource finder',
    tagLine: 'Find resources for immigrants in the City',
  },
  geocoder: {
    url(input) {
      const inputEncoded = encodeURIComponent(input);
      return `//api.phila.gov/ais/v1/search/${inputEncoded}`;
    },
    params: {
      gatekeeperKey: process.env.VUE_APP_GATEKEEPER_KEY,
      include_units: true,
    },
  },
  cyclomedia: {
    enabled: true,
    measurementAllowed: false,
    popoutAble: true,
    recordingsUrl: 'https://atlas.cyclomedia.com/Recordings/wfs',
    username: process.env.VUE_APP_CYCLOMEDIA_USERNAME,
    password: process.env.VUE_APP_CYCLOMEDIA_PASSWORD,
    apiKey: process.env.VUE_APP_CYCLOMEDIA_API_KEY,
  },
  map: {
    center: [ -75.163471, 39.953338 ],
    zoom: 12,
    geocodeZoom: 15,
    basemaps: {
      pwd: {
        url: '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
        tiledLayers: [
          'cityBasemapLabels',
        ],
        type: 'featuremap',
        attribution: 'Parcels: Philadelphia Water',
      },
    },
    tiledLayers: {
      cityBasemapLabels: {
        url: '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer',
        zIndex: '3',
      },
    },
  },
};
