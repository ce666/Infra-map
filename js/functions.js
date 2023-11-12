let arrayLatLon = [];


function initMap(mcParam = [55.11429, 36.56969]){
    // --------------------------------------------------------
    // let mapCenter = [55.11429, 36.56969];
    // if (mcParam != undefined){mapCenter = mcParam};
    // console.log('mapCanter: ',mapCenter);   
    //Определяем карту, координаты центра и начальный масштаб
    let mapLayer = L.map('map').setView(mcParam, 11);
    return mapLayer;
}

function drawMap(map){
    // --------------------------------------------------------
    let mapProvider1 = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    // let mapProvider1 = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let mapProvider2 = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=ba3556f7645b4ee296a9640f5abc12ce';
    let mapProvider3 = 'http://maps.opengeo.org/geowebcache/service/wms'
    
    let layerOSM = L.tileLayer(mapProvider1,{}).addTo(map);
    let layerTNF = L.tileLayer(mapProvider2,{}).addTo(map);
    let baseMap = {
        OSM: layerOSM,
        TNF: layerTNF,
    };
    L.control.layers(baseMap, {}).addTo(map);
    L.control.ruler().addTo(map);
    // console.log(map);
    return map;
}

function resizeMap(arrayLatLon){
    let test;
    console.log('arrayLatLon - ',arrayLatLon);
    // markersLatLon = [[56.201, 43.201],[56.481,42.999]]
    // console.log('Click')
        // markerCoordinates.forEach(function(coord){
        //     L.marker(coord).addTo(map);
        // })
    if (arrayLatLon != undefined)
        test = map.fitBounds(arrayLatLon);
    // console.log('test - ',test)
}

function mapCenterCalc(Infra_status){
    // --------------------------------------------------------
    let groupLat;
    let groupLon;
    let infraGroup;
    let groupCenter;
    let groupSumLat = 0;
    let groupSumLon = 0;
    let counter = 0;
    for(gKey in Infra_status){
        infraGroup = Infra_status[gKey];
        groupCenter = groupCenterCalc(infraGroup);
        groupLat = Number(groupCenter[0]);
        groupLon = Number(groupCenter[1]);
        groupSumLat += groupLat;
        groupSumLon += groupLon;
        counter ++;
    };
    // Cчитаем центр карты
    groupSumLat = (groupSumLat/counter).toFixed(4);
    groupSumLon = (groupSumLon/counter).toFixed(4);
    let mapCenter = [groupSumLat,groupSumLon];
    console.log('mapCenterCalc: ',mapCenter);
    return mapCenter;
}

function groupCenterCalc(Infra_status){
    // --------------------------------------------------------
    // Вычисление центра группы, возвращвает массив c координатой [lat,lon]
    let sensSumLat = 0;
    let sensSumLon = 0;
    let sensorLat;
    let sensorLon;
    let counter = 0;
    for(sKey in Infra_status){
        sensorLat = Infra_status[sKey].lat;
        sensorLon = Infra_status[sKey].lon;
        sensSumLat += sensorLat;
        sensSumLon += sensorLon;
        // console.log('sensSumLat - ',sensSumLat);
        counter ++;
    };
    // Cчитаем центр группы сенсоров
    sensSumLat = (sensSumLat/counter).toFixed(6);
    sensSumLon = (sensSumLon/counter).toFixed(6);
    let groupCenter = [sensSumLat,sensSumLon];
    // console.log('Map center: ',mapCenter);
    return groupCenter;
}

function drawAllGroups(Infra_status){
    // --------------------------------------------------------
    // Отрисовка всех датчиков по группам
    // Отрисовка центров гупп и масшшабирование карты по всем группам
    // Возвращает массив с координатами центров гупп
    let infraGroup; 
    let groupCenterLatLon =[];
    let groupState = false;
    for(gKey in Infra_status){
        infraGroup = Infra_status[gKey];
        // console.log('ifraGroup: ',infraGroup);
        groupState = drawSensorGroup(infraGroup);
        // console.log('groupState - ',groupState)
        groupCenterLatLon.push(drawCenterGroup(infraGroup,groupState));
    }
    // console.log('groupCenterLatLon - ',groupCenterLatLon);
    map.fitBounds(groupCenterLatLon);
    // resizeMap(groupCenterLatLon);
}

function drawSensorGroup(infraGroup){
    // --------------------------------------------------------
    // Отрисовка одной группы датчиков. 
    // Возвращает состояние группы true, если все датчики корректно работают. 
    let iconGreen = L.icon({iconUrl: 'img/IconGreen1.svg',iconSize: [21,21],});
    let iconRed = L.icon({iconUrl: 'img/IconRed1.svg',iconSize: [21,21],})
    let iconGray = L.icon({iconUrl: 'img/IconGray1.svg',iconSize: [21,21],});
    let sensorLat ;
    let sensorLon ;
    let sensorName ;
    let sensorStat ;
    let sensorIcon ;
    for(sKey in infraGroup){
        // console.log(sKey);
        sensorLat = infraGroup[sKey].lat;
        sensorLon = infraGroup[sKey].lon;
        sensorName = infraGroup[sKey].name;
        sensorStat = infraGroup[sKey].stat;
        sensorIcon = (sensorStat == ('ok'||'good')) ? iconGreen :
        (sensorStat == 'warn') ? iconRed : iconGray;

        // console.log(infraGroup);
        // console.log(sKey,sensorLat,sensorLon);
        L.marker([sensorLat,sensorLon],{
                icon: sensorIcon,
                opacity: 0.8,            
        }).addTo(map).bindPopup(sensorName+'<br>'+sensorStat+'<br>'+sensorLat+'<br>'+sensorLon);                    
    };
    // Пока возвращаем только true 
    return true;
}

function drawCenterGroup(infraGroup,status){
    // --------------------------------------------------------
    // Получает объект группы датчиков и отрисовывает центр
    let groupCenter = groupCenterCalc(infraGroup);
    // console.log('groupCenter - '+ groupCenter);
    L.circleMarker(groupCenter,{
        radius: 4,
        color: 'green',
    }).addTo(map).bindPopup('Lat: '+groupCenter[0]+'<br>'+'Lon: '+groupCenter[1]);
    if (status != true){
        // circle не подходит из за масштабирования
        L.circle(groupCenter,{
            radius: 700,
            color: 'red',
            opacity: 0.5
        }).addTo(map);
    } 
    return groupCenter
}

function drawAzimuth(map,cPoint,sAzimuth){
    // --------------------------------------------------------
    // Отрисовка Азимута
    // console.log('Azimuth Point: ',cPoint);
    const azmOffset = 0.0000000001;
    const azmRadius = 1000000;
    let layerAzimuth = L.semiCircle(cPoint,{
            radius: azmRadius,
            startAngle: sAzimuth - azmOffset,
            stopAngle: sAzimuth,
            // dashArray: '5, 5', 
            // dashOffset: '0',
            color: 'red',
            weight: 1,
            fill : false,
        })
        // .addTo(map);  - не добавляем,  все отрисовывает map.addLayer
        azimuthLayerGroup.addLayer(layerAzimuth);
        map.addLayer(azimuthLayerGroup)
        // console.log('drawAzimuth - ',layerAzimuth)
        return 1
}

function drawAzimuthJSON(){
    let azimuthLat, azimuthLon, azimuthDeg, azimuthTime
    let cPoint = [0,0]
    for(sKey in Infra_Azimuth){
        console.log(sKey)
        azimuthLat = Infra_Azimuth[sKey].lat;
        azimuthLon = Infra_Azimuth[sKey].lon;
        azimuthDeg = Infra_Azimuth[sKey].deg;
        azimuthTime = Infra_Azimuth[sKey].stat;
        // azimuthName = Infra_Azimuth[sKey].name;
        cPoint = [azimuthLat,azimuthLon]
        drawAzimuth(map,cPoint,azimuthDeg)

    }

}

function clearAllAzimuth(){
    azimuthLayerGroup.clearLayers();
    console.log('clearAllAzimuth - ',azimuthLayerGroup)
};

function epicenterZone(map,cPoint,cRadius){
    // --------------------------------------------------------
    // 27.10.23 10:17
    // Отрисовка Эпицентра
    // let cRadius = 800;
    // console.log('Epicenter: ',cPoint)
    L.circle(cPoint,{
        radius: cRadius,
        color: 'red',
        stroke: false,
        opacity: 0.4,
    }).addTo(map);
    L.circleMarker(cPoint,{
        radius: 5,
        color: 'red',
        weight: 3,
        fill : true,
        // stroke: false,
        opacity: 0.9,
    }).addTo(map).bindPopup('Epicenter'+'<br>'+cPoint[0]+'<br>'+cPoint[1]);

}

// function sensorState(infrName,sDate,sLon,sLat,sName,sStat){

// }