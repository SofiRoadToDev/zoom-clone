const { Socket } = require('dgram');
const express=require('express');
const app=express();
const cors=require('cors');
const server=require('http').Server(app);// creamos el servidor que usa socket.io
const io=require('socket.io')(server)
const {v4:uuidV4}=require('uuid')

app.set('view engine','ejs');
app.use(cors());
app.use(express.static('public'))

/**El room uuid seria el id de la reunion, y la url con este sirve para dar acceso a los participantes */

app.get('/',(req,res)=>{
//El cliente accede a la raiz, se genera el uuid de la sala y es redireccionado al otro endpoint con el uuid como parametro
/*aqui llama a la funcion que genera el uuid,
 esto nos da urls dinamicas por cada sala. */
 res.redirect(`${uuidV4()}`)
})


app.get('/:roomUuid',(req,res)=>{
    //muestra la plantilla y le manda el uuid de la sala roomUuid
    res.render('room',{roomUuid:req.params.roomUuid})
})

io.on('connection',socket=>{
    //Escucha el evento join-room
    socket.on('join-room',(roomId,userId)=>{
        console.log(`sala de reunión:  ${roomId} se unió el usuario:  ${userId}`)
        //usa el id de la reunion como nombre de room en socket.io, abre un canal nombrado dentro del namespace, el / en este caso
       socket.join(roomId)
       //hace un broadcast solo a los participantes de ese room
       socket.to(roomId).emit('user-connected', userId)
    })

    socket.on('disconnect',()=>{
        socket.to(roomId).emit('user-disconnected',userId=>{
            
        })
    })
})






server.listen(3000,()=>console.log('server up'));

