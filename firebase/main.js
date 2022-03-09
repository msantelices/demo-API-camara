import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { firebaseConfig } from "./config.js";
import { 
    getStorage, 
    ref, 
    uploadString, 
    getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js';
import { 
    getFirestore, 
    collection, 
    addDoc,
    getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js"

const app = initializeApp(firebaseConfig)

const storage = getStorage(app)
const db = getFirestore()


// Guardar nombre de imagen en Firestore
const saveImageRef = async(data)=> {
    try {
        const docRef = await addDoc(collection(db, 'images'), data)

        console.log('Document written with ID: ', docRef.id)
    } catch(e) {
        console.log('Error adding document: ', e)
    }
}


// Listar imagenes guardades en Firestore
export const getImageList = async()=> {
    try {
        const querySnapshot = await getDocs(collection(db, 'images'))

        let results = []
        querySnapshot.forEach((doc)=> {
            results.push({ id: doc.id, data: doc.data() })
        })

        return results
    } catch(e) {
        console.log('Error getting documents: ', e)
    }
}

// Subir archivo a Storage desde Data URL
export const uploadFile = async(data, name)=> {
    try {
        // Primero: Creamos una referencia a la imagen -> el nombre que tendra en firebase
        const reference =  ref(storage, name)    
        const snapshot = await uploadString(reference, data, 'data_url')
        // snapshot -> resultado de la operacion
        console.log(snapshot)

        saveImageRef({ 
            name, 
            metadata: {
                contentType: snapshot.metadata.contentType,
                size: snapshot.metadata.size,
                created: snapshot.metadata.timeCreated
            }
        })
    } catch(e) {
        console.log('Error uploading File: ', e)
    }
}

// Obtener URL de la imagen desde Storage
export const getFileURL = async(name)=> {
    try {
        const reference = ref(storage, name)
        const url = await getDownloadURL(reference)

        return url
    } catch(e) {
        console.log('Error getting File URL: ', e)
    }
}


