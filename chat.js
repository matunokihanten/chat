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

// Firebase の設定（※自身のプロジェクトの情報に置き換えてください）
const firebaseConfig = {
  apiKey: "AIzaSyAk_I5nBbccP5CO6aUoKXu19urq_7B9jm0",
  authDomain: "my-chat-room-75025.firebaseapp.com",
  projectId: "my-chat-room-75025",
  storageBucket: "my-chat-room-75025.appspot.com",
  messagingSenderId: "778251776207",
  appId: "1:778251776207:web:86b21d6af5bc40f1ba07ba",
  measurementId: "G-1W7HQ8J1EL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore の "messages" コレクション
const messagesRef = collection(db, "messages");

// 現在のチャットルーム名（初期値："チャットルーム"）
let currentRoomName = "チャットルーム";

// ★ チャットルーム名変更機能 ★
const changeRoomName = () => {
  const roomNameInput = document.getElementById("roomNameInput").value.trim();
  if (roomNameInput) {
    currentRoomName = roomNameInput;
    document.getElementById("roomTitle").textContent = currentRoomName;
    document.getElementById("roomNameInput").value = "";
    alert(`ルーム名が「${currentRoomName}」に変更されました！`);
  } else {
    alert("ルーム名を入力してください！");
  }
};

// ★ メッセージ送信機能 ★
const sendMessage = async (message, name = "名無し") => {
  if (!message.trim()) {
    message = "テスト"; // メッセージ入力が空の場合は「テスト」にする
  }
  if (!name.trim()) {
    name = "名無し"; // 名前が空なら「名無し」
  }
  try {
    await addDoc(messagesRef, {
      name: name,
      text: message,
      room: currentRoomName,
      timestamp: Date.now()
    });
    console.log("メッセージ送信成功");
  } catch (error) {
    console.error("メッセージ送信エラー:", error);
  }
};

// ★ メッセージ全削除機能 ★
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

// ★ リアルタイム更新機能 ★
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // 表示エリアをクリア
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    // 現在のチャットルーム名と一致するメッセージのみ表示
    if (messageData.room === currentRoomName) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `${messageData.name}: ${messageData.text}`;
      chatBox.appendChild(messageElement);
    }
  });
});

// ★ チャットAIアシスタント機能 ★
/*
  ※ 以下は OpenAI の API を利用するサンプルコードです。
  ※ 注意：このコードはクライアント側に API キーを含めるため、実際の運用時はサーバー側で処理するなどセキュリティ対策を講じてください。
*/
async function getAIResponse(userMessage) {
  const API_KEY = "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";  // ※ OpenAI の API キーを設定してください
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `ユーザーのメッセージ: ${userMessage}\nAIの返答:`,
        max_tokens: 150,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const aiReply = data.choices && data.choices.length > 0
      ? data.choices[0].text.trim()
      : "すみません、返答を生成できませんでした。";
    return aiReply;
  } catch (error) {
    console.error("AI応答エラー:", error);
    return "エラーが発生しました。";
  }
}

const handleAIAssistant = async () => {
  const messageValue = document.getElementById("messageInput").value;
  if (!messageValue.trim()) {
    alert("質問のメッセージが空です。");
    return;
  }
  // ユーザーのメッセージを使って AI の応答を取得
  const aiResponse = await getAIResponse(messageValue);
  // 応答をチャットに投稿（送信者名を "AI" とする）
  await sendMessage(aiResponse, "AI");
};

// ★ イベントリスナーの設定 ★
const changeRoomNameButton = document.getElementById("changeRoomNameButton");
const sendButton = document.getElementById("sendButton");
const deleteButton = document.getElementById("deleteButton");
const aiAssistantButton = document.getElementById("aiAssistantButton");

changeRoomNameButton.addEventListener("click", changeRoomName);

sendButton.addEventListener("click", () => {
  const messageValue = document.getElementById("messageInput").value;
  const nameValue = document.getElementById("nameInput").value;
  sendMessage(messageValue, nameValue);
  document.getElementById("messageInput").value = ""; // 入力欄をクリア
});

deleteButton.addEventListener("click", deleteMessages);
aiAssistantButton.addEventListener("click", handleAIAssistant);
