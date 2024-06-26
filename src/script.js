import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { cos, sin } from 'three/examples/jsm/nodes/Nodes.js'
import ThreeGlobe from 'three-globe'
import countries from '../static/files/custom.geo.json'
import lines from '../static/files/lines.json'
import maps from '../static/files/maps.json'


let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
/**
 * Base
*/
// Debug
const gui = new dat.GUI()

//textures
const textureLoader=new THREE.TextureLoader();
const earthTexture=textureLoader.load('./textures/earthmap1k.jpg');
console.log(earthTexture);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

initGlobe();

/**
 * Test mesh
*/

// Geometry
// const geometry = new THREE.SphereGeometry(1,32,32);

// const material=new THREE.MeshBasicMaterial({
//     map:earthTexture
// })

// Material
// const material = new THREE.ShaderMaterial({
    //     vertexShader: testVertexShader,
//     fragmentShader: testFragmentShader,
//     side: THREE.DoubleSide,

//     uniforms:{
//         uTime:{ value : 0},
//         uResolution:{value : new THREE.Vector4()}
//     }
// })

// Mesh



/**
 * Sizes
*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    windowHalfX=window.innerWidth/1.5;
    windowHalfY=window.innerHeight/1.5;

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener("mousemove",(event1)=>{
    mouseX=event1.clientX-windowHalfX;
    mouseY=event1.clientY-windowHalfY;
    // console.log(mouseX)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera()
camera.aspect=sizes.width/sizes.height;
camera.updateProjectionMatrix()

camera.position.set(1000,0, 400)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dynamicDampingFactor = 0.01
controls.enablePan = false;
controls.minDistance = 200;
controls.maxDistance = 500;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1;
// console.log(controls)
// controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.minPolarAngle=Math.PI/3.5;
controls.maxPolarAngle=Math.PI-Math.PI/3;


//Lights
var ambientLight=new THREE.AmbientLight('#bbbbbb',0.3)
scene.add(ambientLight)
scene.background = new THREE.Color('#040d21');

var dLight=new THREE.DirectionalLight('#ffffff',0.8)
dLight.position.set(-800, 2000, 400);
camera.add(dLight);


var dLight1 = new THREE.DirectionalLight('#7982f6',1)
dLight1.position.set(-200, 500, 200);
camera.add(dLight1);

var dLight2 = new THREE.DirectionalLight('#8566cc',0.5)
dLight2.position.set(-200, 500, 200);
camera.add(dLight2);

scene.fog=new THREE.Fog('#535ef3',400,2000)


function initGlobe(){

Globe=new ThreeGlobe({
    waitForGlobeReady:true,
    animateIn:true
})
.hexPolygonsData(countries.features)
// .heatmapPoints(countries.features)

.hexPolygonResolution(3)
.hexPolygonMargin(0.7)
.hexPolygonUseDots(true)
.hexPolygonColor(()=>'#73dac6')
.showAtmosphere(true)
.atmosphereColor('#7aa2f7')
.atmosphereAltitude(0.25)



// console.log(lines)

setTimeout(() =>{
    console.log(lines.pulls)
    Globe
        .arcsData(lines.pulls)
        .arcColor((e)=>e.color)
        .arcAltitude((e)=>{
            return e.arcAlt;
        })
        .arcStroke((e)=>{
            return e.status ? 0.5 : 0.3;
        })
        .arcDashLength(0.9)
        .arcDashGap(4)
        .arcDashAnimateTime(1000)
        .arcsTransitionDuration(1000)
        .arcDashInitialGap((e)=>e.order * 1)
        .showGraticules(true)
        
        

    .labelsData(maps.Coordinates)
    .labelDotRadius(1.0)
    .labelAltitude(0.05)
    .labelColor(()=>'#e7ff51')
    .labelText("city")
    .labelSize((e)=>e.size*3.0)

    .pointsData(maps.Coordinates)
    .pointColor((e) => e.color)
    .pointsMerge(true)
    .pointsTransitionDuration(1000)
    // .pointAltitude(0.07)
    .pointRadius(0.1);

},1000)

// .hexPolygonColor()



// Globe.rotateY(-Math.PI * (5 / 9));
// Globe.rotateZ(-Math.P1 / 6);

const globeMaterial=Globe.globeMaterial();
globeMaterial.color = new THREE.Color('#3a228a')
globeMaterial.emissive = new THREE.Color('#220038');
globeMaterial.emissiveIntensity =0.1;
globeMaterial.shininess = 0.7;
console.log(Globe)
scene.add(Globe)
Globe.rotation.y += Math.PI/2;
console.log(Globe.rotation.y)

}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock();

/**
 * Animate
 */
let currentTime=0;
const tick = () =>
{
    const elapsedTime=clock.getElapsedTime();
    const deltaTime=clock.getDelta()
    // console.log(elapsedTime)

    // material.uniforms.uTime.value=elapsedTime;

    camera.position.x += Math.abs(mouseX)<=windowHalfX/2 ? (mouseX/2 - camera.position.x)*0.005 :0;
    camera.position.y += (-mouseY/2-camera.position.y)*0.005;
    // console.log(Math.abs(mouseX)<=windowHalfX/2 ? (mouseX/2 - camera.position.x)*0.005 :0)
    Globe.pointAltitude(Math.abs(Math.sin(elapsedTime)*0.1))
    // Update controls 
    camera.lookAt(scene.position);
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()