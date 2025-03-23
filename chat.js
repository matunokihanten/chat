import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAk_I5nBbccP5CO6aUoKXu19urq_7B9jm0",
  authDomain: "my-chat-room-75025.firebaseapp.com",
  projectId: "my-chat-room-75025",
  storageBucket: "my-chat-room-75025.appspot.com",
  messagingSenderId: "778251776207",
  appId: "1:778251776207:web:86b21d6af5bc40f1ba07ba",
  measurementId: "G-1W7HQ8J1EL"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// コレクション参照
const messagesRef = collection(db, "messages");

// 見学者を表示 (仮実装)
const visitorList = document.getElementById("visitorList");
visitorList.textContent = "見学者: ユーザー123, ユーザー456";

// メッセージ送信
const sendMessage = async (message) => {
  if (message.trim() !== "") {
    await addDoc(messagesRef, { text: message, timestamp: Date.now() });
  }
};

// メッセージ削除
const deleteMessage = async () => {
  const snapshot = await onSnapshot(messagesRef, (snapshot) => {
    snapshot.forEach(async (docData) => {
      await deleteDoc(doc(db, "messages", docData.id));
    });
  });
};

// ファイル送信
const uploadFile = async (file) => {
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  alert("ファイルが送信されました！");
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
const deleteButton = document.getElementById("deleteButton");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

sendButton.addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput").value;
  sendMessage(messageInput);
  document.getElementById("messageInput").value = ""; // 入力フィールドをクリア
});

deleteButton.addEventListener("click", deleteMessage);

uploadButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (file) {
    uploadFile(file);
  } else {
    alert("ファイルを選択してください！");
  }
});