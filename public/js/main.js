
/**SERVERS */
const socket=io();
const peer=new Peer(undefined,
  {
    host:'/',
    port:'3001'
  })

  /**DOM VIDEO AND GRID */
const grid=document.getElementById('grid');
const videoBox=document.createElement('video');
videoBox.mute=true;





const capture=async() => {
  /**capturamos nuestro propio video y lo mostramos en el grid en pantalla */
    let stream=await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false
    });

  addVideoStream(videoBox, stream);
  /**Necesitamos escuchar la llamada de otros para poder mostrar su video stream 
   al mismo tiempo respondemos enviando el stream propio*/
  peer.on('call',call=>{
    const videoBox=document.createElement('video');
      call.answer(stream)
      call.on('stream',stream=>{
        addVideoStream(videoBox, stream);
      })
  })
  /**Cuando algun usuario se une a la sala de socket.io cuyo nombre es el id de la reunion
   * el id del usuario es broadcasteado  a los demas de esa reunion
   */
  socket.on('user-connected',userId=>{
    /*cada vez que un nuevo usuario se conecta al room lo llamamos para establecer una 
    conexion peertopeer con el y enviar el stream*/
    callNewUser(userId,stream);
  })
}

capture();
/**cada vez que un nuevo usuario establece conexion enviamos el id al socket que escuchaba
 *  el evento joinroom en el servidor y éste lo usa en la sala para broadcastearlo a los demas*/
peer.on('open', id =>{
  socket.emit('join-room',ROOM_ID,id) 
}) 

function addVideoStream(video,stream){
    video.srcObject=stream;
   
    video.onloadedmetadata = () => {
        video.play();
      };
      grid.append(video);      
};


/**SOCKET AND PEER COMUNICATION */




function callNewUser(userId,stream){
  const call=peer.call(userId,stream)/**  var call = peer.call('another-peers-id', stream);DOCS */
  const inComingVideo=document.createElement('video');
  /**Y vamos a escuchar el evento stream, que es cuando ese usuario al que llamamos nos envia su propio stream */
  /**call.on('stream', function(remoteStream) {
    THIS IS TAKEN FROM PEERJS DOCS
  }); */
  call.on('stream',remoteStream=>{
    addVideoStream(inComingVideo,remoteStream)
  })
  /**cuando el usuario se desconecta removemos el elemento video de pantalla */
  call.on('close',()=>inComingVideo.remove())
}

