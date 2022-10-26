var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 100 );
camera.position.z = 3;
camera.position.y = 1;
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.SpotLight( 0xffffff );
light.position.set( 1,10,5 )
scene.add( light );

var geometry = new THREE.BoxGeometry( 2, 0.2, 2);
var material = new THREE.MeshLambertMaterial( { color: 0x007700 } );
var cube = new THREE.Mesh( geometry, material );
cube.position.set(0, -0.1, 0)
scene.add( cube );

var geometry = new THREE.SphereGeometry(0.5, 16, 16);
var material = new THREE.MeshPhongMaterial( { color: 0xCC0000, shininess: 60 } );
var earthmesh = new THREE.Mesh(geometry, material);
earthmesh.position.set(0, 1, 0)
scene.add( earthmesh )

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();
 
