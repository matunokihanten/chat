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
  apiKey: "YOUR_FIREBASE_API_KEY", // Firebase APIキーを設定
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestoreのコレクション
const messagesRef = collection(db, "messages");

// 現在のチャットルーム名
let currentRoomName = "チャットルーム";

// チャットルーム名変更
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

// メッセージ送信
const sendMessage = async (message, name = "名無し") => {
  if (!message.trim()) {
    message = "テスト"; // 空メッセージ時のデフォルト値
  }
  if (!name.trim()) {
    name = "名無し"; // 名前が空の場合のデフォルト値
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

// メッセージ全削除
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

// リアルタイムメッセージ更新
const chatBox = document.getElementById("chatBox");
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = ""; // 表示をリセット
  snapshot.forEach((doc) => {
    const messageData = doc.data();
    if (messageData.room === currentRoomName) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `${messageData.name}: ${messageData.text}`;
      chatBox.appendChild(messageElement);
    }
  });
});

// AIアシスタントの応答
async function getAIResponse(userMessage) {
  const API_KEY = "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
"; // OpenAI APIキーを設定
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "あなたは親切で知識豊富なアシスタントです。" },
          { role: "user", content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI応答エラー:", error);
    return "エラーが発生しました。もう一度お試しください。";
  }
}

const handleAIAssistant = async () => {
  const messageValue = document.getElementById("messageInput").value;
  if (!messageValue.trim()) {
    alert("質問を入力してください！");
    return;
  }
  const aiResponse = await getAIResponse(messageValue);
  await sendMessage(aiResponse, "AI");
};

// イベントリスナー
document.getElementById("changeRoomNameButton").addEventListener("click", changeRoomName);
document.getElementById("sendButton").addEventListener("click", () => {
  const messageValue = document.getElementById("messageInput").value;
  const nameValue = document.getElementById("nameInput").value;
  sendMessage(messageValue, nameValue);
  document.getElementById("messageInput").value = "";
});
document.getElementById("deleteButton").addEventListener("click", deleteMessages);
document.getElementById("aiAssistantButton").addEventListener("click", handleAIAssistant);