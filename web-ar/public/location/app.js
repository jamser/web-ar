import * as three from './jsm/three.module.js';
import { OrbitControls } from './jsm/OrbitControls.js';
// import { GLTFLoader } from '../../libs/three125/GLTFLoader.js';
import { ARButton } from './ARButton.js';
import { FBXLoader } from './jsm/FBXLoader.js';
import Location from './bearing&Distance.js';
import getDistanceBetweenDevices from './bluetooth.js'


class App {
  constructor() {
    const ratio = window.innerWidth / window.innerHeight;
    const container = document.createElement('div');
    document.body.appendChild(container);

    this.clock = new three.Clock();
    this.scene = new three.Scene();
    this.scene.name = 'panel' 
    this.panel = null
    this.camera = new three.PerspectiveCamera(70, ratio, 0.01, 100);
    this.ambientLight = new three.AmbientLight(0xffffff, 2);
    this.renderer = new three.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.hitTestSourceRequested = false;
    this.workingVec3 = new three.Vector3();
    // console.log('this.workingVec3', this.workingVec3);


    this.scene.add(this.ambientLight);
    this.controls.update();
    container.appendChild(this.renderer.domElement);

    this.setCamera();
    this.setScene();
    this.setRenderer();
    this.setLight();
    this.setController();
    Location().then(res => {
      // console.log('res', res);
      this.distance = res.distance*1000
      this.direction = res.direction
      this.notice = 'Using GPS :'+ Math.ceil(this.distance) + 'm'
    }).then(() => this.loadMusic())
      .then(() => this.loadModel())
      .then(() => this.loadPianoModel())
      .then(() => this.loadAnimation())
      .then(() => {
        // this.collisionDetection();
        // console.log('this.mixer', this.mixer);
        this.initAr();
        this.play();
      });

    window.addEventListener('resize', this.resize.bind(this));
  }

  setCamera() {
    this.camera.position.z = 6;
    this.camera.position.y = 0.5;
  }

  setScene() {
    /* 辅助调试 */
    // this.planeBufferGeometry = new three.PlaneBufferGeometry(10, 10);
    // const plane = new three.Mesh(
    //   this.planeBufferGeometry,
    //   new three.MeshBasicMaterial({ color: 0xffffff, side: three.DoubleSide })
    // );
    // plane.rotation.x = -Math.PI / 2;
    // this.scene.add(plane);
    // const bbox = new three.Box3().setFromObject(plane);
    // const min_x = this.camera.left - bbox.min.x;
    // const max_x = this.camera.right - bbox.max.x;
    // const min_y = this.camera.top - bbox.min.y;
    // const max_y = this.camera.bottom - bbox.max.y;
    // let pos_x = Math.min(max_x, Math.max(min_x, this.camera.position.x));
    // let pos_y = Math.min(max_y, Math.max(min_y, this.camera.position.y));
    // console.log('pos_x', pos_x);
    // console.log('pos_y', pos_y);
    // this.controls.target.x = pos_x;
    // this.controls.target.y = pos_y;
    this.scene.add(new three.GridHelper(10, 10));
  }

  setRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio); // 适配手机的pixel
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    // this.renderer.setClearColor(0xffffff)
  }

  setLight() {
    const light = new three.PointLight(0xffffff, 1);
    light.position.set(200, 200, 200);
    this.scene.add(light);
  }

  setController() {
    this.controls.target.set(0, 3.5, 0);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.maxDistance = 100;
    this.controls.update();
  }

  loadModel() {
    return new Promise((res) => {
      this.reticle = new three.RingGeometry(0.05, 0.07).rotateX(-Math.PI / 2);
      this.mesh = new three.Mesh(
        this.reticle,
        new three.MeshBasicMaterial({ color: 0x00ff00 })
      );
      this.mesh.matrixAutoUpdate = false;
      this.mesh.visible = false;
      // console.log('this.mesh.matrix', this.mesh.matrix);

      this.scene.add(this.mesh);
      const loader = new FBXLoader();
      loader.setPath('./');
      loader.load(
        'ybot.fbx',
        (fbx) => {
          fbx.scale.setScalar(0.003);
          fbx.position.set(0, -0.3, -1);
          fbx.traverse((c) => (c.castShadow = true));
          this.bot = fbx;
          this.bot.name = 'bot'
          this.mixer = new three.AnimationMixer(this.bot);
          res(fbx);
          // 克隆第二个模型
          /* this.bot2 = clone(this.bot);
          this.bot2.scale.setScalar(0.003);
          this.bot2.position.set(0, -0.3, -5);
          this.scene.add(this.bot2); */
          this.scene.add(fbx);
        },
        (xhr) => {
          if ((xhr.loaded / xhr.total) === 1 ) {
            const meter = document.querySelector('.meter')
            meter.style.display = 'none'
          }
          const span = document.querySelector('#span')
          span.width = `${( xhr.loaded / xhr.total * 100 )}%`
          // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        (e) => {
          console.log('an error happen')
        }
      );
    });

    // this.loader = new GLTFLoader();
    // this.loader.load('./scene.gltf', (gltf) => {
    //   gltf.scene.position.set(0, -3, 0);
    //   gltf.scene.scale.set(100, 100, 100);
    //   console.log('gltf', gltf)
    //   this.scene.add(gltf.scene);
    // });
  }

  loadPianoModel() {
    return new Promise((res) => {
      const loader = new FBXLoader();
      loader.setPath('./');
      loader.load('piano3.fbx', (fbx) => {
        fbx.scale.setScalar(0.0004);
        fbx.position.set(0, -0.3, -0.75);
        fbx.rotateY(Math.PI);
        this.piano = fbx;
        this.scene.add(this.piano);
        res(fbx);
      });
    });
  }

  loadMusic() {
    return new Promise(res => {
      const audioListener = new three.AudioListener()
      this.camera.add(audioListener)
      const audio = new three.Audio(audioListener)
      const audioLoader = new three.AudioLoader()
      audioLoader.load('00380620.mp3',(mp3)=>{
        audio.setBuffer(mp3);
        audio.setLoop(true); //是否循环
        audio.setVolume(0.5);
        // audio.play()
      })
      res()
    })
  }

  loadAnimation() {
    const promiseWalk = new Promise((res) => {
      const walk = new FBXLoader();
      walk.setPath('./');
      walk.load('walk4.fbx', (anim) => {
        // console.log('this.mixer', this.mixer);
        this.bot.walk = this.mixer.clipAction(anim.animations[0]);
        this.bot.walk.name = 'walk';
        this.bot.walk.enabled = true;
        res();
        // walk.stop()
      });
    });

    const promiseIdle = new Promise((res) => {
      const idle = new FBXLoader();
      idle.setPath('./');
      idle.load('idle1.fbx', (anim) => {
        this.bot.idle = this.mixer.clipAction(anim.animations[0]);
        this.bot.idle.name = 'idle';
        res();
      });
    });

    const promisePiano = new Promise((res) => {
      const idle = new FBXLoader();
      idle.setPath('./');
      idle.load('piano.fbx', (anim) => {
        this.bot.playPiano = this.mixer.clipAction(anim.animations[0]);
        this.bot.playPiano.name = 'playPiano';
        res();
      });
    });

    return Promise.all([promiseWalk, promiseIdle, promisePiano]);
  }

  initAr() {

    this.action = 'playPiano';

    //  ======================= 绘制目标点 ============================
     // TODO:设备和正北方夹角, 记录当前位置，然后移动一段距离再测两点和北方的夹角
    try {
      const geometry = new three.SphereGeometry( 0.1);
      const material = new three.MeshBasicMaterial( { color: 0x00ff00 } );
      this.destination = new three.Mesh( geometry, material );
      this.destination.position.set(0,0.5,-2)
      const myAxis = new three.Vector3(0, 1, 0);
      const group = new three.Group()
      group.rotateOnAxis(myAxis, this.direction.radius)
      group.add(this.destination)
      this.scene.add( group );
    } catch(e) {
      console.log('error', e)
    }


    new ARButton(this.renderer, {
      sessionInit: {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        // domOverlay: { root: document.body },
      },
    });
    this.renderer.xr.enabled = true;
    this.controller = this.renderer.xr.getController(0);

    this.destination = new three.SphereGeometry()

    const onSelect = () => {
      // console.log('this.controller', this.controller);
      // console.log('position', this.controller.position, 'matrixWorld', this.controller.matrixWorld)

      const raycaster = new three.Raycaster();
      // 设置鼠标位置和参考相机
      raycaster.setFromCamera(this.controller.position, this.camera);
      // 鼠标点击对应的物体（所有鼠标映射到的物体，包括被遮挡的）
      const intersects =  raycaster.intersectObjects(this.scene.children, true);
      const intersect = intersects.filter(intersect => intersect.object.name !== '')[0];
      if(intersect && isClickBot(intersect.object)) {
        (async () => {
          if (navigator.geolocation) {
            const device = await navigator.bluetooth.requestDevice({ filters: [{ name: 'MBeacon' }] });
            // const device = await navigator.bluetooth.requestDevice({ filters: [{ name: 'MI Mouse BT5.0' }] });
            const server = await device.gatt.connect();
            const options = await device.watchAdvertisements()
            const listener = (event) => {
              const rssi = event.rssi;
              console.log('rssi', rssi);
              const rssiM = Math.abs(rssi);
              // 发射端和接收端相隔1米时的信号强度假的
              const Amount = 59;
              // 环境噪声衰减因子
              const n = 2;
              const power = (rssiM- Amount ) / (10 * n);
              const d = Math.pow(10, power)
              this.distance = (d < this.distance + 2 || d > this.distance - 2) ? d : this.distance
              this.notice = 'Indoor BLE :'+ Math.ceil(this.distance) + 'm'
              console.log('finished')
              device.removeEventListener('advertisementreceived', listener)
              device.watchAdvertisements().then( () => {
                console.log('executing')
                device.addEventListener('advertisementreceived', listener);
              })
            }
            device.addEventListener('advertisementreceived', listener);
          } else {
            console.log('unsupport')
          }
        })()
      } else {
         // ======================== 行走位置控制 ==========================
        // console.log('this.workingVec3', this.workingVec3);
        this.workingVec3.setFromMatrixPosition(this.mesh.matrix);
        this.calculatedPath = this.workingVec3;
        // console.log('this.bot', this.bot);
        this.bot.lookAt(this.calculatedPath);
        this.setTargetDirection();
        // this.bot.walk.fadeIn(0.1);
        // this.bot.walk.play();
      }
      // console.log('intersect', intersect);

    };

    const isClickBot = (object) => {
      if(object.name === 'bot') {
        return object;
      } else if(object.parent) {
        return isClickBot(object.parent);
      } else {
        return null;
      }
    }
    this.controller.addEventListener('select', onSelect);
    this.scene.add(this.controller);
  }

  actions() {}

  play() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  requestHitTestSource() {
    const self = this;

    const session = this.renderer.xr.getSession();
    session.requestReferenceSpace('viewer').then(function (referenceSpace) {
      // console.log('referenceSpace', referenceSpace);

      // this.xrRefSpace = referenceSpace;
      // let pose = frame.getViewerPose(this.xrRefSpace);
      // let arView;
      // if (pose) {
      //   arView = pose.views[0];
      // }

      // let viewMatrix = arView.transform.matrix;
      // let projectionMatrix = arView.projectionMatrix;
      // let worldInverseMatrix = arView.transform.inverse.matrix;

      session
        .requestHitTestSource({ space: referenceSpace })
        .then(function (source) {
          self.hitTestSource = source;
        });
    });

    session.addEventListener('end', function () {
      self.hitTestSourceRequested = false;
      self.hitTestSource = null;
      self.referenceSpace = null;
    });

    this.hitTestSourceRequested = true;
  }

  metterPiano() {
    this.scene.add(this.piano);
  }

  getHitTestResults(frame) {
    const hitTestResults = frame.getHitTestResults(this.hitTestSource);

    if (hitTestResults.length) {
      const referenceSpace = this.renderer.xr.getReferenceSpace();
      const hit = hitTestResults[0];
      const pose = hit.getPose(referenceSpace);
      this.mesh.visible = true;
      this.mesh.matrix.fromArray(pose.transform.matrix);

    } else {
      this.mesh.visible = false;
    }
  }

  setTargetDirection() {
    if (this.mesh.visible) {
      const player = this.bot;
      const pt = this.calculatedPath.clone();
      pt.y = player.position.y;
      const quaternion = player.quaternion.clone();
      player.quaternion.copy(quaternion);
      this.action = 'walk';
      // this.bot.walk.play();
      // player.walk.play();
    }
  }

  setBlueTarget() {
    if (this.mesh.visible) {
      const v3 = new three.Vector3().setFromMatrixPosition(this.mesh.matrix)
      const v3_1 = v3.clone().add(new three.Vector3(0,1,0))
      // console.log('v3', v3);
      // console.log('v3_1', v3_1);

      !this.panel && plane(
        this,
        v3_1,
        'hello world',
        (m) => {
          this.panel = m
          console.log('m', m);
          this.scene.add(m)
        }
      );
    }
  }

  collisionDetection() {
    console.log('this.piano', this.piano.position);
    console.log('this.bot', this.bot.position);
    const length = this.piano.position.distanceToSquared(this.bot.position);
    console.log('distance', length);
    return length < 0.1;

    // console.log('this.bot', this.bot);
    // console.log('this.mesh', this.mesh.geometry.vertices);
    // console.log('this.piano', this.piano);
    // var cubeGeometry = new three.BoxGeometry(50, 50, 50, 1, 1, 1);
    // var wireMaterial = new three.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });
    // const MovingCube = new three.Mesh(cubeGeometry, wireMaterial);
    // console.log('MovingCube.geometry.vertices', MovingCube.geometry.vertices);
  }

  showText(text){
	  const canvas = document.getElementById("canvas");
	  const ctx = canvas.getContext("2d");
	  ctx.canvas.width =256;
	  const x =0;
	  const y=32;
	  ctx.fillStyle = "green";
	  ctx.font = "16px arial";
	  // ctx.textAlign = "left";
	  // ctx.textBaseline = "middle";
	  ctx.fillText(text,x,y)
	}

  showSprite(text){
    // console.log('execute')
	  this.showText(text)
	  const canvasTexture = new three.CanvasTexture(
	    document.querySelector("#canvas")
	  )
	  canvasTexture.needsUpdate = true; //注意这句不能少
	  const spritMaterial = new three.SpriteMaterial({
	    map:canvasTexture
	  })
	  this.sprite = new three.Sprite(spritMaterial)
    let position = this.bot.position.clone()
    position = position.add(new three.Vector3(0,0.8,0))
	  this.sprite.position.copy(position);
	  //精灵的默认大小很小估计是[1,1,1]
	  // sprite.scale.set(0.64,0.64,1);
	  this.scene.add(this.sprite)
	
	}



  render(timestamp, frame) {

    const delta = this.clock.getDelta();

    this.update(delta);
    this.scene.remove(this.sprite)
    // console.log('this.notice', this.notice);
    this.showSprite(this.notice)

    if (this.distance < 20 ) {
      const loader = new three.FontLoader();
      const self = this

      loader.load('./font.json', function (font) {
        var geometry = new three.TextGeometry('enable BLE?', {
          font: font,
          size: 60,
          height: 2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 2,
          bevelSegments: 5,
        });

        var material = new three.MeshLambertMaterial({
          color: 0x00ff00,
        });
        const mesh = new three.Mesh(geometry, material);
        const newPosition = self.bot.position.clone()
        newPosition.add(new three.Vector3(0,1,0))
        mesh.position.copy(newPosition);
        mesh.scale.multiplyScalar(0.0015);
        mesh.castShadow = true;
      });
    }

    if (this.distance > 5 ) {
      this.destination.visible = true
    } 
    else {
      this.destination.visible = false
    }

    if (frame) {
      if (this.hitTestSourceRequested === false) this.requestHitTestSource();
      if (this.hitTestSource) this.getHitTestResults(frame);
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update(dt) {
    const speed = 0.5;
    const player = this.bot;
    if (this.mixer) this.mixer.update(dt);
    // console.log('this.action', this.action);
    const anim = this.mixer._actions.filter( el => el.name === this.action)[0]
    const action = this.mixer.clipAction(anim._clip);
    if ( !!this.currentA && this.currentA !== this.action) {
      // this.currentAnimation.stop()
      action && (action.enabled = true)
      action && action.crossFadeFrom(this.currentAnimation, 0.5, true)
      action && action.setEffectiveTimeScale(1.0);
      action && action.setEffectiveWeight(1.0);
      action && action.play();
    } 
    action && action.play();
    this.currentA = this.action
    this.currentAnimation = action
    // console.log('this.currentA', this.currentA);
    // console.log('this.action', this.action);

    if (this.calculatedPath) {
      const targetPosition = this.calculatedPath;
      const distance = targetPosition.clone().sub(player.position);
      // console.log('distance', distance);

      let pathComplete = distance.lengthSq() < 0.01;
      // console.log('pathComplete', pathComplete);

      if (!pathComplete) {
        // if (this.collisionDetection()) {
        //   this.calculatedPath = null;
        //   this.action = 'playPiano';
        // }
        this.bot.idle.stop();
        const prevDistanceSq =
          player.position.distanceToSquared(targetPosition);
        // console.log('prevDistanceSq', prevDistanceSq);
        distance.normalize();
        // Move player to target
        if (this.quaternion) player.quaternion.slerp(this.quaternion, 0.1);
        player.position.add(distance.multiplyScalar(dt * speed));
        //Get distance after moving, if greater then we've overshot and this leg is complete
        const newDistanceSq = player.position.distanceToSquared(targetPosition);
        // prevent overstep
        pathComplete = newDistanceSq > prevDistanceSq;
      } else {
        player.position.copy(targetPosition);
        this.action = 'idle';
      }
    }
  }
}

export default App;
