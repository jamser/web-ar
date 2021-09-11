async function getDistanceBetweenDevices(distance) {
  if (navigator.geolocation) {
    // const device = await navigator.bluetooth.requestDevice({ filters: [{ name: 'MBeacon' }] });
    const device = await navigator.bluetooth.requestDevice({ filters: [{ name: 'MBeacon' }] });
    const server = await device.gatt.connect();
    const options = await device.watchAdvertisements()
    const listener = (event) => {
      console.log('distance', distance);
      const rssi = event.rssi;
      console.log('rssi', rssi);
      const rssiM = Math.abs(rssi);
      // 发射端和接收端相隔1米时的信号强度假的
      const Amount = 59;
      // 环境噪声衰减因子
      const n = 2;
      const power = (rssiM- Amount ) / (10 * n);
      const d = Math.pow(10, power)
      distance = (d < 20 && d > 5) ? d : distance
      // console.log('distance', distance);
      console.log('d', d);
      console.log('finished')
      device.removeEventListener('advertisementreceived', listener)
      device.watchAdvertisements().then( () => {
        console.log('executing')
        device.addEventListener('advertisementreceived', listener);
      })
    }
    device.addEventListener('advertisementreceived', listener);
    // device.addEventListener('advertisementreceived', (event) => {
    //   const rssi = event.rssi;
    //   console.log('rssi', rssi);
    //   const rssiM = Math.abs(rssi);
    //   // 发射端和接收端相隔1米时的信号强度假的
    //   const Amount = 59;
    //   // 环境噪声衰减因子
    //   const n = 2;
    //   const power = (rssiM- Amount ) / (10 * n);
    //   const d = Math.pow(10, power)
    //   distance = (d < 20 && d > 5) ? d : distance
    //   // console.log('distance', distance);
    //   console.log('d', d);
    // });
  } else {
    console.log('unsupport')
  }
}

export default getDistanceBetweenDevices
// function interpretIBeacon(event) {
//   const rssi = event.rssi;
//   const rssiM = Math.abs(rssi);
//   // 发射端和接收端相隔1米时的信号强度假的
//   const Amount = 59;
//   // 环境噪声衰减因子
//   const n = 2;
//   const power = (rssiM- Amount ) / (10 * n);
//   const distance = Math.pow(10, power)
//   return distance
// }