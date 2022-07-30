const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    // HACK:  handle potential race condition on close
    if (peers[userId]) {
        peers[userId].close()
        console.log("socket.on('user-disconnected'): end call for user id", userId);
    }
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    peers[userId] = call

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        // // HACK: handle potential race condition on close
        // if (peers[userId]) {
        //     peers[userId].close()
        //     console.log("call.on('close'): end call for user id", userId);
        // }

        video.remove()
    })

    console.log("add call to peers object for user id: ", userId);    
}
