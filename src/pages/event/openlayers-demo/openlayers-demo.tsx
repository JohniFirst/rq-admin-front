import 'ol/ol.css'
import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import {
  defaults as defaultControls,
  ScaleLine,
  OverviewMap,
  MousePosition,
  FullScreen,
  ZoomSlider,
  ZoomToExtent,
} from 'ol/control'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import Draw from 'ol/interaction/Draw'
import Overlay from 'ol/Overlay'
import styled from 'styled-components'
import { Card, Select as AntSelect, Space, Button, Row, Col, Tag, Switch } from 'antd'
import { LocateIcon } from 'lucide-react'

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 350px);
  min-height: 500px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Popup = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 12px;
  bottom: 12px;
  left: -50px;
  min-width: 200px;
  border-left: 4px solid #1890ff;
  z-index: 1000;

  h4 {
    margin: 0 0 8px 0;
    color: #1890ff;
    font-size: 14px;
  }

  p {
    margin: 4px 0;
    font-size: 12px;
    color: #666;
  }
`

const ControlPanel = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 280px;
`

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  z-index: 1000;

  h4 {
    margin: 0 0 8px 0;
    font-size: 13px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin: 6px 0;

    .color-box {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
`

const InfoBox = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  max-width: 250px;
  z-index: 1000;

  h4 {
    margin: 0 0 8px 0;
    color: #1890ff;
  }

  p {
    margin: 4px 0;
    color: #666;
  }
`

interface GeoFeature {
  type: string
  properties: {
    name?: string
    type: string
    population?: number
    description?: string
  }
  geometry: {
    type: string
    coordinates: [number, number] | [number, number][] | [number, number][][]
  }
}

interface GeoJSON {
  type: string
  features: GeoFeature[]
}

const SourceData: Record<string, { name: string; url: string; description: string }> = {
  gaode: {
    name: '高德地图',
    url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&scl=1',
    description: '高德矢量地图（推荐）',
  },
  gaode_satellite: {
    name: '高德卫星',
    url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&scl=1',
    description: '高德卫星影像',
  },
  gaode_traffic: {
    name: '高德交通',
    url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?z={z}&x={x}&y={y}&lang=zh_cn&size=1&scale=1&scl=1&style=8',
    description: '实时交通路况',
  },
  carto: {
    name: 'CartoDB',
    url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    description: '国际通用地图',
  },
}

const SampleGeoJSON: GeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '北京',
        type: 'city',
        population: 21540000,
        description: '中国首都',
      },
      geometry: {
        type: 'Point',
        coordinates: [116.4074, 39.9042],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '天津',
        type: 'city',
        population: 13866009,
        description: '重要港口城市',
      },
      geometry: {
        type: 'Point',
        coordinates: [117.2008, 39.1353],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '石家庄',
        type: 'city',
        population: 11235000,
        description: '河北省省会',
      },
      geometry: {
        type: 'Point',
        coordinates: [114.5149, 38.0428],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '济南',
        type: 'city',
        population: 9200000,
        description: '山东省省会',
      },
      geometry: {
        type: 'Point',
        coordinates: [116.9972, 36.6563],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '京沪高速',
        type: 'road',
        description: '连接北京和上海',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [116.4074, 39.9042],
          [117.2008, 39.1353],
          [118.7965, 32.0603],
          [121.4737, 31.2304],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '渤海区域',
        type: 'area',
        description: '环渤海经济圈',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.5, 38.5],
            [119.5, 38.5],
            [119.5, 40.5],
            [117.5, 40.5],
            [117.5, 38.5],
          ],
        ],
      },
    },
  ],
}

const OpenLayersDemo: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const vectorSourceRef = useRef<VectorSource<Feature> | null>(null)
  const [selectedSource, setSelectedSource] = useState<string>('gaode')
  const [showVectorLayer, setShowVectorLayer] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [drawMode, setDrawMode] = useState<string>('none')
  const [coordinates, setCoordinates] = useState<{ lon: number; lat: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const handleLocate = () => {
    if (!navigator.geolocation) {
      console.error('浏览器不支持地理定位')
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      position => {
        const lon = position.coords.longitude
        const lat = position.coords.latitude
        const center = fromLonLat([lon, lat])

        if (mapInstanceRef.current) {
          mapInstanceRef.current.getView().animate({
            center,
            zoom: 15,
            duration: 1000,
          })

          const locationFeature = vectorSourceRef.current
            ?.getFeatures()
            .find(f => f.get('type') === 'location')
          if (locationFeature) {
            locationFeature.setGeometry(new Point(center))
          }
        }

        setIsLocating(false)
      },
      error => {
        setIsLocating(false)
        console.error('定位失败:', error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }

  useEffect(() => {
    if (!mapRef.current) {
      console.error('Map container ref is null')
      return
    }

    console.log('Initializing OpenLayers map...')

    const vectorSource = new VectorSource({ features: [] })
    vectorSourceRef.current = vectorSource

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: feature => {
        const type = feature.get('type')
        const name = feature.get('name')

        if (type === 'city') {
          return new Style({
            image: new CircleStyle({
              radius: 12,
              fill: new Fill({ color: '#ff4d4f' }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
            text: showLabels
              ? new Text({
                  text: name,
                  offsetY: -18,
                  font: 'bold 12px sans-serif',
                  fill: new Fill({ color: '#333' }),
                  stroke: new Stroke({ color: '#fff', width: 3 }),
                })
              : undefined,
          })
        } else if (type === 'road') {
          return new Style({
            stroke: new Stroke({
              color: '#1890ff',
              width: 4,
            }),
          })
        } else if (type === 'area') {
          return new Style({
            fill: new Fill({ color: 'rgba(24, 144, 255, 0.3)' }),
            stroke: new Stroke({ color: '#1890ff', width: 2 }),
          })
        } else if (type === 'draw') {
          return new Style({
            fill: new Fill({ color: 'rgba(82, 196, 26, 0.3)' }),
            stroke: new Stroke({ color: '#52c41a', width: 2 }),
            image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#52c41a' }) }),
          })
        } else if (type === 'location') {
          return new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({ color: 'rgba(24, 144, 255, 0.3)' }),
              stroke: new Stroke({ color: '#1890ff', width: 3 }),
            }),
          })
        }
        return new Style()
      },
      visible: showVectorLayer,
    })

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new XYZ({ url: SourceData.gaode.url }) }), vectorLayer],
      view: new View({
        center: fromLonLat([116.4074, 39.9042]),
        zoom: 8,
      }),
      controls: defaultControls().extend([
        new ScaleLine({ units: 'metric' }),
        new OverviewMap({ collapsed: false }),
        new MousePosition(),
        new FullScreen(),
        new ZoomSlider(),
        new ZoomToExtent({ extent: fromLonLat([113, 36, 120, 42]) }),
      ]),
    })

    mapInstanceRef.current = map

    const popup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-left',
      offset: [0, -10],
      autoPan: true,
    })
    map.addOverlay(popup)

    map.on('click', evt => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f)

      if (feature) {
        const coords = (feature.getGeometry() as Point).getCoordinates()
        const lonLat = toLonLat(coords)
        const name = feature.get('name')
        const description = feature.get('description')
        const type = feature.get('type')

        popup.setPosition(coords)
        if (popupRef.current) {
          popupRef.current.innerHTML = `
            <h4>${name || '标注'}</h4>
            <p>类型: ${type === 'city' ? '城市' : type === 'road' ? '道路' : type === 'area' ? '区域' : type === 'location' ? '当前位置' : '其他'}</p>
            <p>${description || ''}</p>
            <p>坐标: ${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}</p>
          `
        }
      } else {
        popup.setPosition(undefined)
      }

      const lonLat = toLonLat(evt.coordinate)
      setCoordinates({ lon: lonLat[0], lat: lonLat[1] })
    })

    const locationFeature = new Feature()
    locationFeature.set('name', '当前位置')
    locationFeature.set('type', 'location')
    // @ts-ignore
    vectorSource.addFeature(locationFeature)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lon = position.coords.longitude
          const lat = position.coords.latitude
          const center = fromLonLat([lon, lat])

          map.getView().animate({
            center,
            zoom: 15,
            duration: 1000,
          })

          const feature = vectorSourceRef.current
            ?.getFeatures()
            .find(f => f.get('type') === 'location')
          if (feature) {
            feature.setGeometry(new Point(center))
          }
        },
        error => {
          console.log('自动定位失败:', error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    }

    return () => {
      map.setTarget(undefined)
    }
  }, [])

  useEffect(() => {
    if (!vectorSourceRef.current) return

    const source = vectorSourceRef.current

    const features: Feature[] = []
    SampleGeoJSON.features.forEach((geoFeature: GeoFeature) => {
      let geometry = null
      if (geoFeature.geometry.type === 'Point') {
        geometry = new Point(fromLonLat(geoFeature.geometry.coordinates as [number, number]))
      } else if (geoFeature.geometry.type === 'LineString') {
        const coords = (geoFeature.geometry.coordinates as [number, number][]).map(coord =>
          fromLonLat(coord),
        )
        geometry = new LineString(coords)
      } else if (geoFeature.geometry.type === 'Polygon') {
        const coords = (geoFeature.geometry.coordinates as [number, number][][]).map(ring =>
          ring.map(coord => fromLonLat(coord)),
        )
        geometry = new Polygon(coords)
      }

      if (geometry) {
        const feature = new Feature({ geometry, ...geoFeature.properties })
        features.push(feature)
      }
    })

    source.addFeatures(features)
  }, [])

  useEffect(() => {
    const layers = mapInstanceRef.current?.getAllLayers()
    if (layers && layers.length > 1) {
      layers[1].setVisible(showVectorLayer)
    }
  }, [showVectorLayer])

  useEffect(() => {
    if (!mapInstanceRef.current || drawMode === 'none') return

    const drawInteraction = new Draw({
      source: vectorSourceRef.current!,
      type: drawMode as 'Point' | 'LineString' | 'Polygon' | 'Circle',
    })

    drawInteraction.on('drawend', evt => {
      evt.feature.set('type', 'draw')
      evt.feature.set('name', '用户绘制')
      setDrawMode('none')
    })

    mapInstanceRef.current.addInteraction(drawInteraction)

    return () => {
      mapInstanceRef.current?.removeInteraction(drawInteraction)
    }
  }, [drawMode])

  useEffect(() => {
    const layers = mapInstanceRef.current?.getAllLayers()
    if (!layers || layers.length === 0) return

    const sourceConfig = SourceData[selectedSource as keyof typeof SourceData]
    if (sourceConfig) {
      const url = sourceConfig.url.replace('{1-4}', String(Math.floor(Math.random() * 4) + 1))
      const xyzSource = new XYZ({ url })
      ;(layers[0] as TileLayer).setSource(xyzSource)
    }
  }, [selectedSource])

  return (
    <div className="p-[24px]">
      <h2 className="mb-[24px]">OpenLayers 特色功能演示</h2>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="交互式地图" extra={<Tag color="blue">多种地图源 · 矢量数据 · 交互功能</Tag>}>
            <MapContainer>
              <MapWrapper ref={mapRef} />

              <Popup ref={popupRef} />

              <InfoBox>
                <h4>当前坐标</h4>
                {coordinates ? (
                  <>
                    <p>经度: {coordinates.lon.toFixed(6)}</p>
                    <p>纬度: {coordinates.lat.toFixed(6)}</p>
                  </>
                ) : (
                  <p style={{ color: '#999' }}>点击地图获取坐标</p>
                )}
              </InfoBox>

              <ControlPanel>
                <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#333' }}>控制面板</h4>
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<LocateIcon />}
                    onClick={handleLocate}
                    loading={isLocating}
                  >
                    {isLocating ? '定位中...' : '定位'}
                  </Button>
                  <AntSelect
                    value={selectedSource}
                    onChange={setSelectedSource}
                    style={{ width: '100%' }}
                    options={[
                      { label: '高德地图（推荐）', value: 'gaode' },
                      { label: '高德卫星影像', value: 'gaode_satellite' },
                      { label: '高德交通路况', value: 'gaode_traffic' },
                      { label: 'CartoDB国际地图', value: 'carto' },
                    ]}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>矢量图层:</span>
                    <Switch checked={showVectorLayer} onChange={setShowVectorLayer} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>标注显示:</span>
                    <Switch checked={showLabels} onChange={setShowLabels} />
                  </div>
                </Space>
              </ControlPanel>

              <Legend>
                <h4>图例</h4>
                <div className="legend-item">
                  <div className="color-box" style={{ background: '#ff4d4f' }} />
                  <span>城市标注</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ background: '#1890ff', height: '4px' }} />
                  <span>高速公路</span>
                </div>
                <div className="legend-item">
                  <div
                    className="color-box"
                    style={{ background: 'rgba(24, 144, 255, 0.3)', border: '1px solid #1890ff' }}
                  />
                  <span>区域范围</span>
                </div>
                <div className="legend-item">
                  <div className="color-box" style={{ background: '#52c41a' }} />
                  <span>用户绘制</span>
                </div>
                <div className="legend-item">
                  <div
                    className="color-box"
                    style={{
                      background: 'rgba(24, 144, 255, 0.3)',
                      border: '2px solid #1890ff',
                      borderRadius: '50%',
                    }}
                  />
                  <span>当前位置</span>
                </div>
              </Legend>
            </MapContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="绘制工具" size="small">
            <Space.Compact>
              <Button
                onClick={() => setDrawMode('Point')}
                type={drawMode === 'Point' ? 'primary' : 'default'}
              >
                绘制点
              </Button>
              <Button
                onClick={() => setDrawMode('LineString')}
                type={drawMode === 'LineString' ? 'primary' : 'default'}
              >
                绘制线
              </Button>
              <Button
                onClick={() => setDrawMode('Polygon')}
                type={drawMode === 'Polygon' ? 'primary' : 'default'}
              >
                绘制面
              </Button>
              <Button onClick={() => setDrawMode('none')} danger>
                清除绘制模式
              </Button>
            </Space.Compact>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card title="多种地图源" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>高德矢量地图（国内首选）</li>
              <li>高德卫星影像</li>
              <li>高德实时交通</li>
              <li>CartoDB国际地图</li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="矢量数据可视化" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>支持GeoJSON数据加载</li>
              <li>点、线、面等多种几何类型</li>
              <li>丰富的样式定制</li>
              <li>动态标注和提示</li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="交互功能" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>地图缩放、平移、旋转</li>
              <li>点击查看详情弹窗</li>
              <li>鼠标坐标实时显示</li>
              <li>交互式绘制编辑</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card title="专业地图控件" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>比例尺（底部）</li>
              <li>鹰眼图（右上角）</li>
              <li>全屏按钮</li>
              <li>缩放滑块</li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="投影转换" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>支持WGS84 (EPSG:4326)</li>
              <li>支持Web Mercator (EPSG:3857)</li>
              <li>自动坐标转换</li>
              <li>支持鼠标位置显示</li>
            </ul>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="高性能渲染" size="small">
            <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
              <li>Canvas/WEBGL渲染</li>
              <li>海量数据流畅加载</li>
              <li>懒加载瓦片</li>
              <li>自适应分辨率</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Card title="示例数据" style={{ marginTop: '16px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Tag color="red">●</Tag> <strong>北京</strong> - 人口 2154万
          </Col>
          <Col span={8}>
            <Tag color="red">●</Tag> <strong>天津</strong> - 人口 1387万
          </Col>
          <Col span={8}>
            <Tag color="red">●</Tag> <strong>石家庄</strong> - 人口 1124万
          </Col>
          <Col span={8}>
            <Tag color="blue">━</Tag> <strong>京沪高速</strong> - 连接北京和上海
          </Col>
          <Col span={8}>
            <Tag color="cyan">■</Tag> <strong>渤海区域</strong> - 环渤海经济圈
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default OpenLayersDemo
