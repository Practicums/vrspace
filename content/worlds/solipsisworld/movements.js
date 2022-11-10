var Sol = require('solipsism');
var forwardstep = 0.2
//revise a dummy comment
var rotatestep = 0.02
var ballstep = 0.1
var scene = new THREE.Scene();
var world = new Sol.GameWorld('Client');
world.addBinding(new Sol.ThreeBinding(require('three'), scene))

world.add({
    type: 'spotlight', 
    color: 0xFFFFFF, 
    position: [1,10,5],
});
world.add({
    geometry: { type: 'box', size: [ 2, 0.2, 2 ] }, 
    material: { type: 'lambert', color: 0x007700 }, 
    mass: 0,
    position: [0, -1.1, 0],
});
world.add({
    geometry: { type: 'sphere', radius: 0.5, widthSegments: 16, heightSegments: 16 },
    material: { type: 'phong', color: 0xCC0000, shininess: 60 }, 
    mass: 5,
    position: [0, 0, 0],
});

// Add a camera
var camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 100 ); 
camera.position.z = 3;
camera.position.y = 0;
camera.aspect = window.innerWidth / window.innerHeight; 
camera.updateProjectionMatrix();
scene.add(camera);

// Add a renderer
var renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild(renderer.domElement);
document.body.addEventListener( 'keydown', onKeyDown, false );

var ball = scene.getObjectById(8)
var box = scene.getObjectById(7)
var coordinates_camera = {r: 3, theta: 0, x: camera.position.x, z: camera.position.z};
var coordinates_ball = {r: 3, theta: 0, x: ball.position.x, y: ball.position.y, z: ball.position.z};
var coordinates_box = {r: 3, theta: 0, x: box.position.x, y: box.position.y, z: box.position.z};
var flip_count = 0;
console.log("camera", coordinates_camera)
console.log("ball", coordinates_ball)
console.log("box", coordinates_box)
console.log("Flip count", flip_count)

function UpdateCamera(d_r, d_theta){
    coordinates_camera.r -= d_r;
    coordinates_camera.theta -= Math.PI * d_theta;
    coordinates_camera.x = coordinates_camera.r * Math.sin(coordinates_camera.theta);
    coordinates_camera.z = coordinates_camera.r * Math.cos(coordinates_camera.theta);
    camera.position.x = coordinates_camera.x;
    camera.position.z = coordinates_camera.z;
    camera.lookAt(ball.position);
    console.log("camera", coordinates_camera)
};

function UpdateBall(d_r){
    var d_x = d_r * Math.sin(coordinates_camera.theta);
    var d_z = d_r * Math.cos(coordinates_camera.theta);
    coordinates_ball.x += d_x;
    coordinates_ball.z += d_z;
    ball.position.x = coordinates_ball.x;
    ball.position.z = coordinates_ball.z;
    camera.lookAt(ball.position);
    console.log("ball", coordinates_ball)
};

function FlipObjects(){
    if (coordinates_camera.theta - (2 * (flip_count + 1) * Math.PI) >= 0){
        var coordinates_y = coordinates_ball.y;
        coordinates_ball.y = coordinates_box.y;
        coordinates_box.y = coordinates_y;
        ball.position.y = coordinates_ball.y;
        box.position.y = coordinates_box.y;
        camera.lookAt(ball.position);
        flip_count += 1;
        console.log("ball", coordinates_ball)
        console.log("box", coordinates_box)
        console.log("Flip count", flip_count)
    };
}

function onKeyDown(){
    switch( event.keyCode ) {
        case 87: // forward: w
            UpdateCamera(forwardstep, 0);
            UpdateBall(ballstep);
        break;

        case 83: // back: s
            UpdateCamera(-forwardstep, 0);
        break;

        case 65: // rotate left: a
            UpdateCamera(0, rotatestep);
            FlipObjects();
        break;

        case 68: // rotate right: d
            UpdateCamera(0, -rotatestep);
            FlipObjects();
        break;

        case 32: // back to default: space
            camera.position.z = 3;
            camera.position.x = 0;
            coordinates_camera = {r: 3, theta: 0, x: camera.position.x, z: camera.position.z};
            box.position.x = 0;
            box.position.y = -1.1;
            box.position.z = 0;
            coordinates_box = {r: 3, theta: 0, x: box.position.x, y: box.position.y, z: box.position.z};
            ball.position.x = 0;
            ball.position.y = 0;
            ball.position.z = 0;
            coordinates_ball = {r: 3, theta: 0, x: ball.position.x, y: ball.position.y, z: ball.position.z};
            camera.lookAt(ball.position);
            flip_count = 0;
            console.log("camera", coordinates_camera)
            console.log("ball", coordinates_ball)
            console.log("box", coordinates_box)
        break;
    }
}

scene.traverse( function( object ) {
    console.log(object)
} );

function animate() { 
    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
} 
animate();