import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase設定（自身のFirebaseプロジェクトの設定に置き換えてください）
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

// Firestoreの「messages」コレクション参照
const messagesRef = collection(db, "messages");

/**
 * メッセージ送信関数  
 * ・名前欄が空の場合は「名無し」に、  
 * ・メッセージ欄が空の場合は「テスト」のデフォルト値を設定
 */
const sendMessage = async (message, name = "名無し") => {
  if (!message.trim()) {
    message = "テスト"; // メッセージが空の場合のデフォルト
  }
  if (!name.trim()) {
    name = "名無し"; // 名前が空の場合のデフォルト
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

/**
 * すべてのメッセージを削除する関数  
 * ※ セキュリティルールにより本番環境での一括削除は制限するケースもあります
 */
const deleteMessages = async () => {
  try {
    const snapshot = await getDocs(messagesRef);
    snapshot.forEach(async (docSnap) => {
      // 各メッセージドキュメントを削除
      await deleteDoc(doc(db, "messages", docSnap.id));
    });
    console.log("全てのメッセージを削除しました");
  } catch (error) {
    console.error("削除エラー:", error);
  }
};

// リアルタイムでチャットメッセージを表示
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // 表示領域をクリア
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    const messageElement = document.createElement("div");
    messageElement.textContent = `${messageData.name}: ${messageData.text}`;
    chatBox.appendChild(messageElement);
  });
}, (error) => {
  console.error("リアルタイム更新エラー:", error);
});

// イベントリスナーの設定
const sendButton = document.getElementById("sendButton");
const deleteButton = document.getElementById("deleteButton");

sendButton.addEventListener("click", () => {
  const messageValue = document.getElementById("messageInput").value;
  const nameValue = document.getElementById("nameInput").value;
  sendMessage(messageValue, nameValue);
  document.getElementById("messageInput").value = ""; // 入力フィールドをクリア
});

deleteButton.addEventListener("click", deleteMessages);