import React, { useEffect, useState } from 'react';
import L, { Icon } from 'leaflet';
import { MapContainer, TileLayer, Polyline, useMap, Marker, Popup } from 'react-leaflet';

function ChangeView({ center, zoom, bounds, selectedBuilding }) {
  const map = useMap();

  useEffect(() => {
    if (selectedBuilding) {
      const buildingPosition = [selectedBuilding.latitude, selectedBuilding.longitude];
      const buildingZoom = 18; // İstediğiniz zoom seviyesini burada belirleyebilirsiniz

      map.setView(buildingPosition, buildingZoom);
    } else if (bounds) {
      map.fitBounds(bounds);
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map, selectedBuilding]);

  return null;
}


function MapComponent({ routeGeometry, userLat, userLng, selectedBuilding }) {
  const center = [39.86559212247091, 32.73417273791947];
  const zoom = 17;

  const routePositions = routeGeometry.map((coord) => [coord[1], coord[0]]);

  const bounds = routePositions.length > 0 ? L.latLngBounds(routePositions) : null;
  const startPosition = routePositions.length > 0 ? routePositions[0] : null;
  const endPosition = routePositions.length > 0 ? routePositions[routePositions.length - 1] : null;


  const boundingBox = [
    [[39.860, 32.728], [39.860, 32.743], [39.886788, 32.743], [39.886788, 32.728], [39.860, 32.728]], // First polygon
  ];

  const startIcon = new Icon({
    iconUrl: 'assets/logos/location.png',
    iconSize: [24, 24],
    iconAnchor: [12.5, 25],
    popupAnchor: [0, 10],
  });

  const endIcon = new Icon({
    iconUrl: 'assets/logos/son.png',
    iconSize: [25, 30],
    iconAnchor: [12.5, 30],
    popupAnchor: [0, -41],
  });

  const currentLocationIcon = new Icon({
    iconUrl: 'assets/logos/full-moon.png',
    iconSize: [15, 15],
    iconAnchor: [12.5, 30],
    popupAnchor: [0, -41],
  });

  const binaIcon = new Icon({
    iconUrl: 'assets/logos/location.png',
    iconSize: [36, 36],
  });

  return (
    <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
      <ChangeView center={center} zoom={zoom} bounds={bounds} selectedBuilding={selectedBuilding} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {routePositions.length > 0 && (
        <Polyline positions={routePositions} color={'red'} dashArray={[10, 5]} weight={3} />
      )}

      {startPosition && (
        <Marker position={startPosition} icon={startIcon}>
          <Popup>
            <span>Başlangıç Noktası</span>
          </Popup>
        </Marker>
      )}

      {endPosition && (
        <Marker position={endPosition} icon={endIcon}>
          <Popup>
            <span>Bitiş Noktası</span>
          </Popup>
        </Marker>
      )}

      {userLat && userLng && (
        <Marker position={[userLat, userLng]} icon={currentLocationIcon}>
          <Popup>Şu an Buradasınız.</Popup>
        </Marker>
      )}

      {selectedBuilding && (
        <Marker position={[selectedBuilding.latitude, selectedBuilding.longitude]} icon={binaIcon}>
          <Popup>
            <span>{selectedBuilding.bina_name}</span>
            <br />
            <p>
              Website: <a href={selectedBuilding.web_site} target="_blank" rel="noopener noreferrer">{selectedBuilding.web_site}</a>
            </p>
          </Popup>
        </Marker>
      )}

     
       {boundingBox.map((polygon, index) => (
        <Polyline key={index} positions={polygon} color={'red'} weight={3} />
      ))}


    </MapContainer>


  );
}

export default MapComponent;