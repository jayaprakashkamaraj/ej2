/**
 * Multi-layer map sample
 */
import { Maps, Marker, ILoadEventArgs, MapsTheme, MapsTooltip, DataLabel, ZoomSettings, Zoom, MapAjax, NavigationLine, Bubble } from '../src/index';
import{ India } from './MapData/India';
import { range } from './MapData/Populationdata';
Maps.Inject(Marker, MapsTooltip, DataLabel,Zoom, NavigationLine, Bubble);
//tslint:disable:max-func-body-length
    let maps: Maps = new Maps({
        zoomSettings: {
            enable: true,
            pinchZooming: true
        },
        titleSettings: {
            text: 'Samsung Semiconductor office locations in USA',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeData: new MapAjax('http://npmci.syncfusion.com/development/demos/src/maps/MapData/WorldMap.json'),
                shapeDataPath:'',
                shapePropertyPath:'',
                shapeSettings: {
                    fill: '#E5E5E5',
                    border: {
                        color: 'black',
                        width: 0.1
                    }
                },
                dataLabelSettings: {
                    visible: false,
                    labelPath: 'name',
                    smartLabelMode: 'Hide'
                }
            },
            {
                shapeData: India,
                dataSource: range,
                shapeDataPath:'name',
                shapePropertyPath:'NAME_1',
                type: 'SubLayer',
                shapeSettings: {
                    fill: 'rgba(141, 206, 255, 0.6)',
                    border: {
                        color: '#1a9cff',
                        width: 0.25
                    },
                    colorValuePath: 'name',
                    colorMapping: [
                        {
                            value: 'Tamil Nadu', color: 'red'
                        },
                        {
                            value: 'Delhi', color: 'blue'
                        },
                        {
                            value: 'Karnataka', color: 'green'
                        },
                        {
                            value: 'Andhra Pradesh', color: 'yellow'
                        },
                        {
                            value: 'Rajasthan', color: 'gray'
                        }
                    ]
                },
            
            },
           
        ]
    });
    maps.appendTo('#container');