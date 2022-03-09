import { getImageList, getFileURL } from '../firebase/main.js'

(async()=> {
    const images = await getImageList()

    const table = document.getElementById('table-content')
    const previewImg = document.getElementById('preview-img')

    images.forEach((image, index)=> {

        let template = `
        <tr>
            <td>${image.data.name}</td>
            <td>${image.data.metadata.size / 1000000} MB</td>
            <td>
                <button id="preview-${index}">Ver</button>
            </td>
        </tr>
        `

        let tr = document.createElement('tr')
        tr.innerHTML = template

        table.appendChild(tr)

        const downloadBtn = document.getElementById(`preview-${index}`)
        downloadBtn.addEventListener('click', async()=> {
            previewImg.src = await getFileURL(image.data.name)
        })

    })

})()