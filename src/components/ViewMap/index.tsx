import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet/dist/leaflet.css'
import React, { FC, useMemo, useRef } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

type locationValueType = { lat: number; lng: number }

interface ViewMapProps {
  /**
   * @value This variable is used to store Latitude and longitude value in an array. Ex: [15,20]
   */
  value?: locationValueType
  /**
   * @onChange This is a call back function, which return selected latitude and longitude.
   */
  onChange?: any

  /**
   * @draggable This is a boolean which is responsible for movement of marker in map. If draggable is true then user can move the marker inside map else it is fixed.
   */
  draggable?: boolean

  /**
   * @zoom Default zoom for the map.
   */
  zoom?: number
}

/**
 * @function ViewMap is a function used to render map in the front end.
 */
export const ViewMap: FC<ViewMapProps> = ({ value = { lat: 0, lng: 0 }, onChange, draggable = false, zoom = 10 }) => {
  const markerRef = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current
        if (marker != null) {
          onChange(marker.getLatLng())
        }
      }
    }),
    []
  )
  return (
    <div>
      <MapContainer
        center={value}
        zoom={zoom}
        style={{ height: '160px', width: '586px' }}
        scrollWheelZoom={false}
        // position={value}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={value} draggable={draggable} eventHandlers={eventHandlers} ref={markerRef}></Marker>
      </MapContainer>
    </div>
  )
}

/**
 * @function fetchLongitudeLatitudeData is used to fetch co-ordinates of given address
 * @param address this is a string.
 * @returns array of objects containing longitudes and latitudes
 */

export const fetchLongitudeLatitudeData = async (address: string) => {
  const provider = new OpenStreetMapProvider()

  // Fetch location data using leaflet-geosearch package
  const response = await provider.search({
    query: address
  })

  return response
}
