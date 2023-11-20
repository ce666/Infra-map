
let azimuthLayerGroup = L.layerGroup([]);

function main(){
    
        drawAllGroups(Infra_status);
        console.log('azimuthLayerGroup1 - ', azimuthLayerGroup)
// -----------------------------------------
        
    //     let sAzimuth = 0;
    //     let centerPoint = [0.0];
    // // I01A
        // centerPoint = [56.3839,43.0507];
        // sAzimuth = 161.5;    //25.26;
        // drawAzimuth(map,centerPoint,sAzimuth);

    // // I02A
    //     centerPoint = [56.4519,43.0520];
    //     sAzimuth = 183.5    //136.24;
    //     drawAzimuth(map,centerPoint,sAzimuth);

    // // I03A
    //     centerPoint = [56.3848,43.1428];
    //     sAzimuth = 183.5    //-32.85;
    //     // drawAzimuth(map,centerPoint,sAzimuth);

    // Выстрел а1
        // centerPoint = [56.4726,43.09];
        // sAzimuth = 175
        // drawAzimuth(map,centerPoint,sAzimuth);

        // -----------------------------------------
        // Отрисовка эпицентра - координаты ввиде массива, радиус в метрах 
        // FI=56.43 LD=43.09
        let epicenterLocation = [56.45663353, 43.05890412];
        let epicenterRadius = 0
        epicenterZone(map,epicenterLocation,epicenterRadius);
        // epicenterLocation = [56.263, 43.1236];
        // epicenterRadius = 827;
        // epicenterZone(map,epicenterLocation,epicenterRadius);
        
    };
    
