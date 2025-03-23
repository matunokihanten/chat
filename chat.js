import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  onSnapshot, 
  deleteDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

// Firebase設定（自身のプロジェクトに置き換えてください）
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

// Firestoreコレクション
const messagesRef = collection(db, "messages");
const roomsRef = collection(db, "rooms");

// チャットルームの作成
const createRoom = async (roomName) => {
  if (roomName.trim()) {
    await addDoc(roomsRef, { name: roomName, timestamp: Date.now() });
    const roomSelect = document.getElementById("roomSelect");
    const newOption = document.createElement("option");
    newOption.value = roomName;
    newOption.textContent = roomName;
    roomSelect.appendChild(newOption);
    alert(`ルーム「${roomName}」が作成されました！`);
  }
};

// ファイル送信
const uploadFile = async (file) => {
  try {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    alert(`ファイル「${file.name}」が送信されました！`);
  } catch (error) {
    console.error("ファイル送信エラー:", error);
  }
};

// メッセージ送信
const sendMessage = async (message, name = "名無し", room = "default") => {
  if (!message.trim()) {
    message = "テスト"; // 空メッセージの場合のデフォルト
  }
  if (!name.trim()) {
    name = "名無し"; // 空の名前の場合のデフォルト
  }
  try {
    await addDoc(messagesRef, {
      name: name,
      text: message,
      room: room,
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
const roomSelect = document.getElementById("roomSelect");

onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // 表示領域をクリア
  const selectedRoom = roomSelect.value;
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    if (messageData.room === selectedRoom) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `${messageData.name}: ${messageData.text}`;
      chatBox.appendChild(messageElement);
    }
  });
});

// イベントリスナー
const createRoomButton = document.getElementById("createRoomButton");
const sendButton = document.getElementById("sendButton");
const deleteButton = document.getElementById("deleteButton");
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");

createRoomButton.addEventListener("click", () => {
  const roomNameInput = document.getElementById("roomNameInput").value;
  createRoom(roomNameInput);
  document.getElementById("roomNameInput").value = ""; // 入力フィールドをクリア
});

sendButton.addEventListener("click", () => {
  const messageValue = document.getElementById("messageInput").value;
  const nameValue = document.getElementById("nameInput").value;
  const roomValue = roomSelect.value;
  sendMessage(messageValue, nameValue, roomValue);
  document.getElementById("messageInput").value = ""; // 入力をクリア
});

deleteButton.addEventListener("click", deleteMessages);

uploadButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (file) {
    uploadFile(file);
  } else {
    alert("ファイルを選択してください！");
  }
});