async function Location (targetLat, targetLot) {
      // 小米之家坐标
    const XiaomiHome = [116.318843, 40.047738] // lot, lat
    const _targetLat = targetLat || XiaomiHome[1]
    const _targetLot = targetLot || XiaomiHome[0]
    let distance = void 0
    let direction = void 0
    let directionStrangNord = void 0
    if (isSupportGPS()) {
      await getLatAndLot()
        .then((pos) => {
          console.log('pos ==============>', pos);
          const crd = pos.coords;
          console.log('Your current position is:');
          console.log('Latitude : ' + crd.latitude);
          console.log('Longitude: ' + crd.longitude);
          console.log('More or less ' + crd.accuracy + ' meters.');
          distance = distanceInKmBetweenEarthCoordinates(
            crd.latitude,
            crd.longitude,
            _targetLat,
            _targetLot
          )
          direction = bearing(
            crd.latitude,
            crd.longitude,
            _targetLat,
            _targetLot
          )
        })
        .catch(geoError)
      
      return {
        distance: distance,
        direction: direction,
      }
    }
}


  function isSupportGPS() {
    if (navigator.geolocation) {
      return true
    } 
    return false
  }

// 获取经纬度
  function getLatAndLot() {
    return new Promise( (res, rej) => {
      navigator.geolocation.watchPosition( res, rej,
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 })
    })
  }
    
  function geoSuccess(pos) {
    const crd = pos.coords;
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    // this.latitude = crd.latitude
    // this.longitude = crd.longitude
    // this.accuracy = crd.accuracy
    // const distance = distanceInKmBetweenEarthCoordinates(
    //   crd.latitude,
    //   crd.longitude,
    //   targetLat,
    //   targetLot
    // )
    // const direction = bearing(
    //   crd.latitude,
    //   crd.longitude,
    //   targetLat,
    //   targetLot
    // )
  };
    
  function geoError(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
    
  // Converts from radians to degrees.
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
    
    
  function bearing(startLat, startLng, destLat, destLng){
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    const brngDegrees = toDegrees(brng);
    return {
      radius: brng,
      degrees: (brngDegrees + 360) % 360
    };
  }

  // This uses the ‘haversine’ formula to calculate the great-circle distance between two points – that is, the shortest distance over the earth’s surface – giving an ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly over, of course!).

  function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = earthRadiusKm * c; // in metres

    return d
  
    // var dLat = this.toRadians(lat2-lat1);
    // var dLon = this.toRadians(lon2-lon1);
  
    // lat1 = this.toRadians(lat1);
    // lat2 = this.toRadians(lat2);
  
    // var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //         Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    // return earthRadiusKm * c;
  }

export default Location;