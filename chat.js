document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const triggerBotBtn = document.getElementById("trigger-bot-btn");
  const clearChatBtn = document.getElementById("clear-chat-btn");
  const exportChatBtn = document.getElementById("export-chat-btn");
  const toggleThemeBtn = document.getElementById("toggle-theme-btn");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const photoInput = document.getElementById("photo-input");
  const sendPhotoBtn = document.getElementById("send-photo-btn");

  let responseCounter = 1; // ボットのレスポンス識別番号
  let chatLog = []; // チャットの内容を記録する配列

  // ローカルストレージに保存するためのユーティリティ
  function saveChatLog() {
    localStorage.setItem("chatLog", JSON.stringify(chatLog));
  }

  // メッセージを画面に追加する関数
  function addMessage(text, type, timestamp, extra = {}) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);

    // ボットのメッセージは識別番号（responseCounter）を付与
    let displayText = type === "bot" ? `[${responseCounter}] ${text}` : text;
    if (type === "bot") responseCounter++;

    // メッセージ部分とタイムスタンプ部分を分割して作成
    messageDiv.innerHTML = `
      <span class="message-text">${displayText}</span>
      <span class="timestamp">${timestamp.toLocaleString()}</span>
    `;

    // 写真が含まれる場合、画像要素を追加
    if (extra.photoDataUrl) {
      const img = document.createElement("img");
      img.src = extra.photoDataUrl;
      img.alt = text || "送信された写真";
      messageDiv.appendChild(img);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // メッセージを記録・保存する関数
  function logMessage(text, type, timestamp, extra = {}) {
    chatLog.push({ type, text, timestamp: timestamp.toISOString(), extra });
    saveChatLog();
    console.log("チャットログ:", chatLog);
  }

  // ページ読み込み時にローカルストレージからログを復元
  const savedLog = localStorage.getItem("chatLog");
  if (savedLog) {
    try {
      chatLog = JSON.parse(savedLog);
    } catch (e) {
      console.error("チャットログの解析に失敗しました:", e);
      chatLog = [];
    }
    chatLog.forEach(entry => {
      addMessage(entry.text, entry.type, new Date(entry.timestamp), entry.extra || {});
    });
  }

  // ユーザーの入力処理
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && userInput.value.trim() !== "") {
      const messageText = userInput.value.trim();
      const now = new Date();
      addMessage(messageText, "user", now);
      logMessage(messageText, "user", now);
      userInput.value = "";

      // 計算問題の処理
      const answer = calculateAnswer(messageText);
      if (answer !== null) {
        const botNow = new Date();
        const botText = `答え: ${answer}`;
        addMessage(botText, "bot", botNow);
        logMessage(botText, "bot", botNow);
      }
    }
  });

  // 計算問題を解く関数
  function calculateAnswer(text) {
    try {
      // 四則演算の計算式を評価
      const result = eval(text);
      if (typeof result === "number") {
        return result;
      }
    } catch (e) {
      // 無効な計算式の場合は無視
    }
    return null;
  }

  // ボットの応答を手動トリガー
  triggerBotBtn.addEventListener("click", () => {
    // 最新のユーザーメッセージを取得
    const userMessages = chatBox.querySelectorAll(".message.user .message-text");
    if (userMessages.length > 0) {
      const lastUserMessage = userMessages[userMessages.length - 1].textContent;
      const botResponse = getBotResponse(lastUserMessage);
      const now = new Date();
      addMessage(botResponse, "bot", now);
      logMessage(botResponse, "bot", now);
    }
  });

  // チャットクリア機能
  clearChatBtn.addEventListener("click", () => {
    if (confirm("チャットをクリアしてもよろしいですか？")) {
      chatBox.innerHTML = "";
      chatLog = [];
      saveChatLog();
    }
  });

  // チャットログをエクスポート（JSONファイルとしてダウンロード）
  exportChatBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify(chatLog, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chatLog.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // テーマ切替（ライト／ダーク）
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // チャット内検索機能
  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    // 事前にすべてのメッセージのハイライトを解除
    const messages = chatBox.querySelectorAll(".message");
    messages.forEach(message => {
      message.style.backgroundColor = "";
    });
    if (searchTerm !== "") {
      messages.forEach(message => {
        const msgText = message.querySelector(".message-text").textContent.toLowerCase();
        if (msgText.includes(searchTerm)) {
          message.style.backgroundColor = "yellow";
        }
      });
    }
  });

  // 写真送信処理
  sendPhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        const now = new Date();
        // 写真の場合、テキストはファイル名を表示する例としています
        const text = `[写真] ${file.name}`;
        addMessage(text, "user", now, { photoDataUrl: dataUrl });
        logMessage(text, "user", now, { photoDataUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    } else {
      alert("画像ファイルを選択してください。");
    }
    photoInput.value = ""; // 次回同じファイルが選択できるようリセット
  });

  // シンプルなボットの応答ロジック
  function getBotResponse(userMessage) {
    if (userMessage.includes("こんにちは")) {
      return "こんにちは！お元気ですか？";
    } else if (userMessage.includes("ありがとう")) {
      return "どういたしまして！";
    } else {
      return "申し訳ありません、よくわかりません。";
    }
  }
});