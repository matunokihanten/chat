// Firebase SDKのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyAk_I5nBbccP5CO6aUoKXu19urq_7B9jm0",
  authDomain: "my-chat-room-75025.firebaseapp.com",
  projectId: "my-chat-room-75025",
  storageBucket: "my-chat-room-75025.appspot.com",
  messagingSenderId: "778251776207",
  appId: "1:778251776207:web:86b21d6af5bc40f1ba07ba",
  measurementId: "G-1W7HQ8J1EL"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestoreのコレクション参照
const messagesRef = collection(db, "messages");

// メッセージを送信
const sendMessage = async (message) => {
  if (message.trim() !== "") {
    await addDoc(messagesRef, { text: message, timestamp: Date.now() });
  }
};

// チャットメッセージをリアルタイムで表示
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // チャットボックスをクリア
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    const messageElement = document.createElement("div");
    messageElement.textContent = messageData.text;
    chatBox.appendChild(messageElement);
  });
});

// イベントリスナーを追加
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  sendMessage(message);
  messageInput.value = ""; // 入力フィールドをクリア
});