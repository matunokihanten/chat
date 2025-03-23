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

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");
let currentRoomName = "チャットルーム";

// メッセージ送信
const sendMessage = async (message, name = "名無し") => {
  if (!message.trim()) {
    message = "テスト";
  }
  if (!name.trim()) {
    name = "名無し";
  }
  try {
    await addDoc(messagesRef, { name: name, text: message, room: currentRoomName, timestamp: Date.now() });
    console.log("メッセージ送信成功");
  } catch (error) {
    console.error("送信エラー:", error);
  }
};

// リアルタイム表示
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    if (messageData.room === currentRoomName) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `${messageData.name}: ${messageData.text}`;
      chatBox.appendChild(messageElement);
    }
  });
});

// 全削除
const deleteMessages = async () => {
  try {
    const snapshot = await getDocs(messagesRef);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "messages", docSnap.id));
    });
    console.log("全メッセージ削除成功");
  } catch (error) {
    console.error("削除エラー:", error);
  }
};

// イベントリスナー設定
document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  const name = document.getElementById("nameInput").value;
  sendMessage(message, name);
  document.getElementById("messageInput").value = "";
});

document.getElementById("deleteButton").addEventListener("click", deleteMessages);

document.getElementById("changeRoomNameButton").addEventListener("click", () => {
  const roomNameInput = document.getElementById("roomNameInput").value.trim();
  if (roomNameInput) {
    currentRoomName = roomNameInput;
    document.getElementById("roomTitle").textContent = currentRoomName;
    document.getElementById("roomNameInput").value = "";
  } else {
    alert("ルーム名を入力してください！");
  }
});
