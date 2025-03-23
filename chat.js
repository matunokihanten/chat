import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc,
  getDocs 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Firestoreコレクション
const messagesRef = collection(db, "messages");

// メッセージ送信
const sendMessage = async (message, name = "名無し") => {
  if (!message.trim()) {
    message = "テスト"; // 空メッセージの場合のデフォルト値
  }
  if (!name.trim()) {
    name = "名無し"; // 空の名前の場合のデフォルト値
  }
  try {
    await addDoc(messagesRef, {
      name: name,
      text: message,
      timestamp: Date.now()
    });
    console.log("メッセージ送信成功");
  } catch (error) {
    console.error("メッセージ送信エラー:", error);
  }
};

// メッセージ削除
const deleteMessages = async () => {
  try {
    const snapshot = await getDocs(messagesRef);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "messages", docSnap.id));
    });
    console.log("全メッセージ削除成功");
  } catch (error) {
    console.error("メッセージ削除エラー:", error);
  }
};

// チャットのリアルタイム更新
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // チャット表示をクリア
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    const messageElement = document.createElement("div");
    messageElement.textContent = `${messageData.name}: ${messageData.text}`;
    chatBox.appendChild(messageElement);
  });
});

// イベントリスナー
const sendButton = document.getElementById("sendButton");
const deleteButton = document.getElementById("deleteButton");

sendButton.addEventListener("click", () => {
  const messageValue = document.getElementById("messageInput").value;
  const nameValue = document.getElementById("nameInput").value;
  sendMessage(messageValue, nameValue);
  document.getElementById("messageInput").value = ""; // 入力をクリア
});

deleteButton.addEventListener("click", deleteMessages);