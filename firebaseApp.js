import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js'

const firebaseConfig = {
  apiKey: "AIzaSyAz9ZmWsyW3YLo3Cc6Nh26q8jtjPIr5gm4",
  authDomain: "webflow-project-a2141.firebaseapp.com",
  projectId: "webflow-project-a2141",
  storageBucket: "webflow-project-a2141.appspot.com",
  messagingSenderId: "301362868006",
  appId: "1:301362868006:web:264488f602dff1ad38dbe7",
  measurementId: "G-RB5W724TPV",
};

const app = initializeApp(firebaseConfig, "firebase-frontend");
export default app;
