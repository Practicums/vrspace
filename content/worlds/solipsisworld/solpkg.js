var Sol = require('solipsism');


var scene;
var camera;
var playerDirection = 0;//angles 0 - 2pi
var dVector;
var angularSpeed = 0.01;
var playerSpeed = 0.075;
var playerBackwardsSpeed = playerSpeed * 0.4;

function init(){
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
        position: [0, -0.1, 0],
    });
    
    world.add({
        geometry: { type: 'sphere', radius: 0.5, widthSegments: 16, heightSegments: 16 },
        material: { type: 'phong',  color: 0xCC0000, shininess: 60 },
        mass: 5,
        position: [0, 1, 0],
    });

    var camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 100 );
    camera.position.z = 3;
    camera.position.y = 1;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    scene.add(camera);
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.addEventListener( 'keydown', onKeyDown, false );
    //document.addEventListener( 'keyup', onKeyUp, false );

    dVector = new THREE.Vector3( 0, 0, 0 ) ;
    camera.lookAt( dVector );

    animate();

}

// Add a camera
//var camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 100 );
//camera.position.z = 3;
//camera.position.y = 1;
//camera.aspect = window.innerWidth / window.innerHeight;
//camera.updateProjectionMatrix();
//scene.add(camera);



// Add a renderer
//var renderer = new THREE.WebGLRenderer( { antialias: true } );
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild(renderer.domElement);

//dVector = new THREE.Vector3( 0, 0, 0 ) ;
//camera.lookAt( dVector );


function onKeyUp(event){
    playerIsMovingForward = 0;
    playerIsMovingBackwards = 0;
    playerIsRotatingLeft = 0;
    playerIsRotatingRight = 0;
    playerGoesUp = 0;
    playerGoesDown = 0;
}

function onKeyDown(event){
    var W = 87;
    var S = 83;
    var A = 65;
    var D = 68;
    var minus = 189;
    var plus = 187;

    var k = event.keyCode;
    console.log(k);
    if(k == A){ // rotate left
        playerDirection -= angularSpeed;
        setPlayerDirection();
    }
    if(k == D){ // rotate right
        playerDirection += angularSpeed;
        setPlayerDirection();
    }
    if(k == W){ // go forward
        moveForward(playerSpeed);
    }
    if(k == S){ // go back 
        moveForward(-playerBackwardsSpeed);
    }

}

function moveForward(speed){
    var delta_x = speed * Math.cos(playerDirection);
    var delta_z = speed * Math.sin(playerDirection);
    var new_x = camera.position.x + delta_x;
    var new_z = camera.position.z + delta_z;
    camera.position.x = new_x;
    camera.position.z = new_z;

    var new_dx = dVector.x + delta_x;
    var new_dz = dVector.z + delta_z;
    dVector.x = new_dx;
    dVector.z = new_dz;
    camera.lookAt( dVector );    

}

function setPlayerDirection(){
    //direction changed.
    var delta_x = playerSpeed * Math.cos(playerDirection);
    var delta_z = playerSpeed * Math.sin(playerDirection);

    var new_dx = camera.position.x + delta_x;
    var new_dz = camera.position.z + delta_z;
    dVector.x = new_dx;
    dVector.z = new_dz;
    console.log(dVector);
    camera.lookAt( dVector ); 
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
//animate();


