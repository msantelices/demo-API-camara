import { initCamera, switchCamera, capture, toggleViews } from "./camera.js"

(()=> {
    initCamera()

    const switchBtn = document.getElementById('switch')
    switchBtn.addEventListener('click', ()=> switchCamera())

    const captureBtn = document.getElementById('capture')
    captureBtn.addEventListener('click', ()=> capture())

    const goBackBtn = document.getElementById('go-back')
    goBackBtn.addEventListener('click', ()=> toggleViews())

})()