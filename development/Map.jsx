// To use this component you'll need to have the following CSS import in the <head>
// <link
//   href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
//   rel="stylesheet"
// />
// And you'll need an image file called 'map-pin-solid.png' containing the image used for the map pin

import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

function Map() {
  const [map, setMap] = useState(null);

//   eventually this should come from the database
  const locations = [
    {
        Name: "Lincoln Public Library",
        Address: "4996 Beam St, Beamsville, ON L0R 1B0",
        Coords: {
            lat: 43.166740,
            lng: -79.482960
        }
    },
    {
        Name: "Lincoln Public Pool",
        Address: "4996 Beam St, Beamsville, ON L0R 1B0",
        Coords: {
            lat: 43.196740,
            lng: -79.102960
        }
    },
    {
        Name: "Lincoln Public School",
        Address: "4996 Beam St, Beamsville, ON L0R 1B0",
        Coords: {
            lat: 43.166740,
            lng: -79.272960
        }
    }
  ];

  useEffect(() => {
    // public access token for mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoicmtlYXRpbmciLCJhIjoiY2txd21qZWR4MHB4ZzJvbW5ib24zYXBiaCJ9.IcJRjlM7P_1t6ovPCO-93Q';

    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/rkeating/cln1xcqkq06az01p7508d0psh',
        center: [-79.292822, 43.151070],
        zoom: 11
      });

      setMap(mapInstance);

      mapInstance.on('load', () => {
        // Load the custom icon images
        mapInstance.loadImage('/map-pin-solid.png', (error, image) => {
          if (error) throw error;
          mapInstance.addImage('location-marker', image);
        });

        // When a click event occurs on a feature in the events layer, open a popup at the location of the feature
        const handlePinClick = (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice(); // returns [lng, lat]
          const description = e.features[0].properties.description;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(mapInstance);
        };

        // Change the cursor to a pointer when the mouse is over the map
        const handleMouseEnter = () => {
          mapInstance.getCanvas().style.cursor = 'pointer';
        };

        // Change it back to the default cursor when it leaves
        const handleMouseLeave = () => {
          mapInstance.getCanvas().style.cursor = '';
        };

        // Add a new layer with ID 'layer1' for the locations
        // new layers can be added and removed to show/hide all businesses, events, etc.
        const addLocationPinsLayer = () => {
          mapInstance.addLayer({
            id: 'layer1',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: locations.map((location) => ({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [location.Coords.lng, location.Coords.lat]
                  },
                  properties: {
                    description: `
                      <h3>${location.Name}</h3>
                      <p>${location.Address}</p>
                      <a class="smallbutton" href="">Learn More</a>
                    `
                  }
                }))
              }
            },
            layout: {
              'icon-image': 'location-marker',
              'icon-allow-overlap': true,
              'icon-size': 0.04
            }
          });

          // Add event listeners
          mapInstance.on('click', 'layer1', handlePinClick);
          mapInstance.on('mouseenter', 'layer1', handleMouseEnter);
          mapInstance.on('mouseleave', 'layer1', handleMouseLeave);
        
        };

        // Add a layer for the locations
        addLocationPinsLayer();
        
      });
    };

    if (!mapboxgl.supported()) {
      console.log('Mapbox GL is not supported in this browser.');
    } else {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <>
      <div id="map-container" style={{ width: '100%', height: '700px' }}></div>
    </>
  );
}

export default Map;
