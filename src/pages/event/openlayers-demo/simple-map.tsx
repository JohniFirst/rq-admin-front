import 'ol/ol.css'
import React, { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'

const SimpleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([116.4074, 39.9042]),
        zoom: 10,
      }),
    })

    return () => {
      map.setTarget(undefined)
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default SimpleMap
