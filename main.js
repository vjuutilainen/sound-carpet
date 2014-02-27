window.onload = function(data){

  width = window.innerWidth;
  height = window.innerHeight;

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( width, height );
  renderer.setClearColor( 0x000000 );

  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 50;
  camera.position.x = 0;
  camera.position.y = -60;
  
  controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

      
       scene = new THREE.Scene();

       createTerrain();

       audioContext = new webkitAudioContext || AudioContext;

       playSoundFile();
    
      //getMicrophoneInput();

}




var playSoundFile = function(){

  request = new XMLHttpRequest();
    request.open('GET', 'music.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function() { 

      audioContext.decodeAudioData(request.response, function(buffer) { 
            buf = buffer; 
            var src = audioContext.createBufferSource();  
            src.buffer = buf; 

            analyser = audioContext.createAnalyser()
           
            src.connect(analyser); 
            analyser.connect(audioContext.destination);

           
           src.start(); 

           animateSound();

        });

    };
    request.send();

}

var animateSound = function() {
  
  data = new Uint8Array(analyser.frequencyBinCount); 
  analyser.getByteFrequencyData(data);
  

  function tick(){

    analyser.getByteFrequencyData(data);

    moveTerrain(data);

    terrain.rotation.z += 0.005;

    renderer.render( scene, camera );
    controls.update();

    requestAnimationFrame(tick);

  }
  
  requestAnimationFrame(tick);

}

var createTerrain = function(){

  var geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
  terrain = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
     
      scene.add(terrain);

}


var moveTerrain = function(data){

     var max = getRange(data).max;
     var min = getRange(data).min;


    function getRange(data){

      var max = 0;
      var min = 0;

      for(var i = 0; i < data.length; i++){
              
              max = data[i] > max ? data[i] : max;
              min = data[i] > min ? data[i] : min; 
          
        return {min: min, max: max};
    }
  }

  
  for(var i = 0; i < terrain.geometry.vertices.length; i++ ){
     
      terrain.geometry.vertices[i].z = (Math.pow(data[i],2)-Math.pow(min,2))/Math.pow(max,2)*10;

  }


}


/*


var getMicrophoneInput = function(){

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
   
      navigator.getUserMedia(
        {audio:true},
        handleStream
        
      );

}


var handleStream = function(stream){

  streamSource = audioContext.createMediaStreamSource( stream );

  analyser = audioContext.createAnalyser()

  streamSource.connect(analyser);

  //analyser.connect(audioContext.destination); 

  animateSound();


}

*/



