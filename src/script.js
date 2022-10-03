import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './vanilla_tilt'
import { AdditiveBlending } from 'three'

document.body.className = 'hidden';

const textureLoader = new THREE.TextureLoader()
const shape = textureLoader.load('/images/particleShape/1.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

var removeLoading = function () {
    console.log("canvas loaded")
    document.fonts.ready.then(function () {
        console.log("font loaded")
        document.body.className = 'visible';
    });
};

let loadManager = THREE.DefaultLoadingManager;

loadManager.onLoad = function () {
    removeLoading();
}

const count = 3000
const size = 0.0011
const radius = 1.1
const branches = 1
const spin = -5
const randomnessPower = 1
const insideColor = '#FFFFFF'
const outsideColor = '#72a7f5'

let defaultSpeed = true;
let geometry = null
let material = null
let points = null


function generateStars() {

    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorInside = new THREE.Color(insideColor)
    const colorOutside = new THREE.Color(outsideColor)

    for (let i = 0; i < count; i++) {

        //Position
        const x = Math.random() * radius
        const branchAngle = (i % branches) / branches * 2 * Math.PI
        const spinAngle = x * spin

        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i * 3] = Math.sin(branchAngle + spinAngle) * x + randomX
        positions[i * 3 + 1] = randomY
        positions[i * 3 + 2] = Math.cos(branchAngle + spinAngle) * x + randomZ

        //Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, x / radius)

        colors[i * 3 + 0] = mixedColor.r
        colors[i * 3 + 1] = mixedColor.g
        colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        color: 'white',
        size: size,
        depthWrite: false,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        vertexColors: true,
        transparent: true,
        alphaMap: shape
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateStars()

let scrollY = window.scrollY

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight * 3.5 + 130
}

//  issues on resize on brave android
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight * 3.5 + 130

    // Update camera
    camera.aspect = sizes.width / (sizes.height)
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0.5
camera.position.y = 0.5
camera.position.z = 0.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = false;
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () => {
    //Update the camera
    if (defaultSpeed) {
        points.rotation.x += 0.0007
    } else if (scrollY.toFixed(15) == 0 || scrollY > 1 || scroll < -1) {
        points.rotation.x += 0.002;
        scrollY = 0;
        // console.log("Reset")
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const scrollTick = () => {
    points.rotation.x += scrollY * 20
    controls.update()
    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(scrollTick)
}
scrollY = 0;
scrollTick()

let max = 0.00010;
let more = 0.0000020;
let oldValue = 0;
window.addEventListener('scroll', function (e) {
    let up = true
    let newValue = window.pageYOffset;
    if (oldValue - newValue < 0) {
        up = true
    } else if (oldValue - newValue > 0) {
        up = false
    }
    oldValue = newValue;
    if (up) {
        // console.log("Up");
        if (scrollY < max && up) {
            scrollY += more;
        }
    }
    else {
        // console.log("Down");
        if (scrollY > -max && !up) {
            scrollY -= more;
        }
    }
    // console.log(scrollY.toPrecision(5))
    defaultSpeed = false
});

// let sliderContainer = document.querySelector('.scrolls');
// let innerSlider = document.querySelector('.scrolling-column');

// let pressed = false;
// let startX;
// let x;

// sliderContainer.addEventListener("mousedown", (e) => {
//     pressed = true;
//     startX = e.offsetX - innerSlider.offsetLeft;
//     sliderContainer.style.cursor = "grabbing";
//     console.log("IDC")
// });

// sliderContainer.addEventListener("mouseenter", () => {
//     sliderContainer.style.cursor = "grab";
//     console.log("IDC")

// });

// sliderContainer.addEventListener("mouseup", () => {
//     sliderContainer.style.cursor = "grab";
//     console.log("IDC")
//     pressed = false;
// });
// sliderContainer.addEventListener("mousemove", (e) => {
//     if (!pressed) return;
//     e.preventDefault();

//     x = e.offsetX;

//     innerSlider.style.left = `${x - startX}px`;
//     checkBoundary()
// });

// const checkBoundary = () => {
//     console.log("IDFC")

//     let outer = sliderContainer.getBoundingClientRect();
//     let inner = innerSlider.getBoundingClientRect();
//     if (parseInt(innerSlider.style.left) > 0) {
//         console.log("SHIT");
//         innerSlider.style.left = "0px";
//     }

//     if (inner.right < outer.right) {
//         console.log("scatter")
//         innerSlider.style.left = `-${inner.width - outer.width}px`;
//     }
// };
