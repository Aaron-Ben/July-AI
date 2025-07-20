import React, { useState } from "react";
import ReactDOM from "react-dom/client";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

const App: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "您好！我是July AI，有什么可以帮助您的吗？",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // 模拟AI回复
    setTimeout(() => {
      const botReply: Message = {
        id: Date.now().toString(),
        content: "这是一条模拟回复。实际使用时，这里会显示AI的回答。",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div
          style={logoContainerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span style={logoTextStyle}>AI</span>
          {isHovered && <span style={hoverTextStyle}>July AI</span>}
        </div>
        <button
          style={getSettingsButtonStyle(isSettingsHovered)}
          onMouseEnter={() => setIsSettingsHovered(true)}
          onMouseLeave={() => setIsSettingsHovered(false)}
        >
          ⚙️
        </button>
      </div>

      <div style={dialogContainerStyle}>
        <div style={messagesContainerStyle}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={
                message.sender === "user" ? userMessageStyle : botMessageStyle
              }
            >
              {message.content}
            </div>
          ))}
        </div>

        <div style={inputAreaStyle}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="输入您的问题..."
            style={inputStyle}
          />
          <button
            onClick={handleSendMessage}
            style={getSendButtonStyle(isSendHovered)}
            onMouseEnter={() => setIsSendHovered(true)}
            onMouseLeave={() => setIsSendHovered(false)}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

// 样式定义
const containerStyle: React.CSSProperties = {
  width: "320px",
  height: "100vh",
  margin: 0,
  padding: "16px",
  boxSizing: "border-box",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  position: "relative",
};

const logoContainerStyle: React.CSSProperties = {
  position: "relative",
  cursor: "pointer",
};

const logoTextStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333333",
};

const hoverTextStyle: React.CSSProperties = {
  opacity: 1,
  transition: "opacity 0.3s ease",
  position: "absolute",
  left: 0,
  top: "-28px",
  backgroundColor: "#333333",
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  whiteSpace: "nowrap",
};

const settingsButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  transition: "color 0.2s ease",
};

const getSettingsButtonStyle = (isHovered: boolean): React.CSSProperties => ({
  ...settingsButtonStyle,
  color: isHovered ? "#000000" : "#666666",
});

const dialogContainerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "20px",
};

const messagesContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "12px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const messageBaseStyle: React.CSSProperties = {
  maxWidth: "80%",
  padding: "8px 12px",
  borderRadius: "16px",
  fontSize: "14px",
};

const botMessageStyle: React.CSSProperties = {
  ...messageBaseStyle,
  alignSelf: "flex-start",
  backgroundColor: "#e0e0e0",
  color: "#333333",
};

const userMessageStyle: React.CSSProperties = {
  ...messageBaseStyle,
  alignSelf: "flex-end",
  backgroundColor: "#0078d7",
  color: "white",
};

const inputAreaStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  border: "1px solid #dddddd",
  borderRadius: "20px",
  fontSize: "14px",
  outline: "none",
};

const sendButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "backgroundColor 0.2s ease",
};

const getSendButtonStyle = (isHovered: boolean): React.CSSProperties => ({
  ...sendButtonStyle,
  backgroundColor: isHovered ? "#005a9e" : "#0078d7",
});

// 渲染应用
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
