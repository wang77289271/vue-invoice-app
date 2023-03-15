import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBAKCdV4XUErMavQY5zgDs-enWeyHDKHys',
  authDomain: 'invoice-app-yt-8ca97.firebaseapp.com',
  projectId: 'invoice-app-yt-8ca97',
  storageBucket: 'invoice-app-yt-8ca97.appspot.com',
  messagingSenderId: '947942316511',
  appId: '1:947942316511:web:64c07194cb3384910fcc6a',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export default getFirestore(firebaseApp)
