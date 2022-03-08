const camera = {
    allowed: true, // Indica si se autorizó a acceder a la camara  o no
    active: false, // Indica si la camara esta encendida o no
    devices: null, // Listado de camaras
    activeDevice: 0, // Camara activa
    multiple: false, // Indica si hay mas de una camara
    dataURL: null,
}

const cameraContainer = document.getElementById('camera-container')
const resultContainer = document.getElementById('result-container')
const captureOverlay = document.getElementById('capture-overlay')
const errorContainer = document.getElementById('error-container')
const loader = document.getElementById('loader')


// Obtener video desde la camara
const getStream = async()=> {
    try {
        // Accedemos a la camara utilizando la ID de la camara actualmente activa
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: camera.devices[camera.activeDevice].deviceId },
            audio: false
        })

        // Pasamos el feed de la camara hacia el objeto video y le damos reproducir para que el feed se vea en tiempo real
        const video = document.getElementById('video')
        window.stream = stream
        video.srcObject = stream
        video.play()

        // Si todo esto ocurre, significa que accedimos correctamente a la camara. La variable active puede servir para controlar pantallas de carga. Para este ejemplo, manipulamos el CSS del loader de forma directa
        camera.allowed = true
        camera.active = true

        loader.classList.remove('show')

    } catch(e) {
        // Si no podemos obtener el video, guardamos el estado. Esto podria servir para renderizar condicionalmente. Para este ejemplo manipulamos directamente el CSS
        console.log('Error getting user video', e)
        camera.active = false
        camera.allowed = false

        cameraContainer.classList.remove('show')
        errorContainer.classList.add('show')

        // Nos aseguramos de terminar el estado de carga
        loader.classList.remove('show')
    }
}


// Iniciar camara
export const initCamera = async()=> {
    // Obtenemos la lista de dispositivos multimedia conectados y filtramos los de tipo video
    let devices = await navigator.mediaDevices.enumerateDevices()
    devices = devices.filter(device => device.kind === 'videoinput')

    // Guardamos el listado de camaras
    camera.devices = devices

    if(devices.length >= 2) {
        camera.multiple = true 
        // Si no tienen multiples cámaras se podría ocultar el boton de cambiar camara
    }

    // Obtener el video desde la cámara activa
    getStream()
}

// Detenemos el feed de la camara
export const stopCamera = ()=> {
    window.stream.getTracks().forEach(track => track.stop())
}

// Cambio de camara
export const switchCamera = ()=> {
    // Alternamos la ID de la camara activa
    if(camera.activeDevice === 0) {
        camera.activeDevice = 1
    } else {
        camera.activeDevice = 0
    }

    // Detenemos el feed de video y volvemos a inciar con la nueva ID
    stopCamera()
    getStream()

    // Mientras ocurre este proceso se podria agregar alguna pantalla o imagen de carga usando CSS
}

// Tomar foto desde la camara
export const capture = ()=> {
    // Nos aseguramos que la camara esté activa
    if(!camera.active) return

    // Efecto de captura de camara usando CSS
    captureOverlay.classList.toggle('show')

    // Delay del efecto de captura
    setTimeout(()=> {
        captureOverlay.classList.toggle('show')
        
        // Seleccionamos el video y el canvas donde replicaremos el frame capturado
        const video = document.getElementById('video')
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        
        // Ajustamos el tamaño del canvas para que coincida con el del video
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight

        // Dibujamos el frame capturado en el canvas
        ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight)

        // Guardamos la data de la imagen capturada para uso posterior
        camera.dataURL = canvas.toDataURL()

        // Cambiamos de vista
        toggleViews()
    }, 150)

    
}

// Función para alternar entre las vistas
export const toggleViews = ()=> {
    cameraContainer.classList.toggle('show')
    resultContainer.classList.toggle('show')
}
