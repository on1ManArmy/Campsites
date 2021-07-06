mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
map.dragRotate.enable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.enableRotation();
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h3> ${campground.title} </h3> <p> ${campground.location} <p/>`
);

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
