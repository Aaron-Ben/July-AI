// 创建智能定位的对话框
function createAskDialog() {
  console.log("July AI Extension: Creating ask dialog...");

  // 创建对话框容器
  const dialogContainer = document.createElement("div");
  dialogContainer.id = "july-ai-dialog";
  dialogContainer.style.cssText = `
    position: fixed;
    width: 400px;
    height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 2147483645;
    display: none;
    flex-direction: column;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: 1px solid #e0e0e0;
    resize: both;
    overflow: hidden;
    min-width: 300px;
    min-height: 400px;
    max-width: 80vw;
    max-height: 80vh;
  `;

  // 创建头部
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
    border-radius: 12px 12px 0 0;
    cursor: move;
    user-select: none;
  `;

  const title = document.createElement("div");
  title.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    color: #333;
  `;
  title.textContent = "July AI 助手";

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "✕";
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
  `;

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#e0e0e0";
    closeButton.style.color = "#333";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });

  closeButton.addEventListener("click", () => {
    hideDialog();
  });

  header.appendChild(title);
  header.appendChild(closeButton);

  // 创建消息容器
  const messagesContainer = document.createElement("div");
  messagesContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f8f9fa;
  `;

  // 添加初始欢迎消息
  const welcomeMessage = createMessage("您好！我是July AI，有什么可以帮助您的吗？", "bot");
  messagesContainer.appendChild(welcomeMessage);

  // 创建输入区域
  const inputArea = document.createElement("div");
  inputArea.style.cssText = `
    padding: 16px 20px;
    border-top: 1px solid #e0e0e0;
    background: white;
    border-radius: 0 0 12px 12px;
    display: flex;
    gap: 8px;
  `;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "输入您的问题...";
  input.style.cssText = `
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  `;

  input.addEventListener("focus", () => {
    input.style.borderColor = "#007AFF";
  });

  input.addEventListener("blur", () => {
    input.style.borderColor = "#ddd";
  });

  const sendButton = document.createElement("button");
  sendButton.textContent = "发送";
  sendButton.style.cssText = `
    padding: 10px 16px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
  `;

  sendButton.addEventListener("mouseenter", () => {
    sendButton.style.backgroundColor = "#0056b3";
  });

  sendButton.addEventListener("mouseleave", () => {
    sendButton.style.backgroundColor = "#007AFF";
  });

  // 发送消息功能
  function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // 添加用户消息
    const userMessage = createMessage(message, "user");
    messagesContainer.appendChild(userMessage);
    input.value = "";

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 模拟AI回复
    setTimeout(() => {
      const botMessage = createMessage("这是一条模拟回复。实际使用时，这里会显示AI的回答。", "bot");
      messagesContainer.appendChild(botMessage);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }

  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  inputArea.appendChild(input);
  inputArea.appendChild(sendButton);

  // 创建调整大小的手柄
  const resizeHandle = document.createElement("div");
  resizeHandle.style.cssText = `
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    background: linear-gradient(135deg, transparent 50%, #ccc 50%);
    border-radius: 0 0 12px 0;
    z-index: 2147483646;
  `;

  // 组装对话框
  dialogContainer.appendChild(header);
  dialogContainer.appendChild(messagesContainer);
  dialogContainer.appendChild(inputArea);
  dialogContainer.appendChild(resizeHandle);

  // 添加拖拽移动功能
  let isDragging = false;
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let startLeft = 0;
  let startTop = 0;

  // 头部拖拽移动
  header.addEventListener("mousedown", (e) => {
    if (e.target === closeButton) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(dialogContainer.style.left) || 0;
    startTop = parseInt(dialogContainer.style.top) || 0;
    
    // 记录悬浮球初始位置-- 拖拽对话框时，悬浮球也跟着移动
    const ballContainer = document.querySelector('.ball-container');
    if (ballContainer) {
      const ballRect = ballContainer.getBoundingClientRect();
      dialogContainer._ballStartLeft = ballRect.left;
      dialogContainer._ballStartTop = ballRect.top;
    }
    
    e.preventDefault();
  });

  // 调整大小功能
  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = dialogContainer.offsetWidth;
    startHeight = dialogContainer.offsetHeight;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      
      // 确保不超出窗口边界
      const maxLeft = window.innerWidth - dialogContainer.offsetWidth;
      const maxTop = window.innerHeight - dialogContainer.offsetHeight;
      
      dialogContainer.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
      dialogContainer.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
      
      // 同步移动悬浮球 - 使用相对位移-- 拖拽对话框时，悬浮球也跟着移动
      const ballContainer = document.querySelector('.ball-container');
      if (ballContainer && dialogContainer._ballStartLeft !== undefined) {
        const ballDeltaX = deltaX;
        const ballDeltaY = deltaY;
        
        const newBallLeft = dialogContainer._ballStartLeft + ballDeltaX;
        const newBallTop = dialogContainer._ballStartTop + ballDeltaY;
        
        // 确保悬浮球不超出窗口边界
        const ballMaxLeft = window.innerWidth - ballContainer.offsetWidth;
        const ballMaxTop = window.innerHeight - ballContainer.offsetHeight;
        
        ballContainer.style.left = Math.max(0, Math.min(newBallLeft, ballMaxLeft)) + "px";
        ballContainer.style.top = Math.max(0, Math.min(newBallTop, ballMaxTop)) + "px";
        ballContainer.style.right = "auto";
        ballContainer.style.bottom = "auto";
      }
    }
    
    if (isResizing) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newWidth = Math.max(300, Math.min(startWidth + deltaX, window.innerWidth * 0.8));
      const newHeight = Math.max(400, Math.min(startHeight + deltaY, window.innerHeight * 0.8));
      
      dialogContainer.style.width = newWidth + "px";
      dialogContainer.style.height = newHeight + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      // 调整大小完成后重新定位对话框
      setTimeout(() => {
        repositionDialog();
      }, 10);
    }
    
    if (isDragging) {
      // 保存悬浮球位置 - 拖拽对话框时，悬浮球也跟着移动
      const ballContainer = document.querySelector('.ball-container');
      if (ballContainer) {
        const rect = ballContainer.getBoundingClientRect();
        const currentPosition = {
          x: rect.left,
          y: rect.top,
          edgeType: null
        };
        
        // 保存位置到存储
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.sync.set({ ballPosition: currentPosition });
        }
      }
      

    }
    
    isDragging = false;
    isResizing = false;
  });

  // 添加到页面
  document.body.appendChild(dialogContainer);

  return dialogContainer;
}

// 创建消息元素
function createMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.style.cssText = `
    display: flex;
    gap: 8px;
    align-items: flex-start;
    max-width: 100%;
  `;

  // 头像
  const avatar = document.createElement("div");
  avatar.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
  `;

  if (sender === "user") {
    avatar.style.backgroundColor = "#007AFF";
    avatar.textContent = "我";
  } else {
    avatar.style.backgroundColor = "#34C759";
    avatar.textContent = "AI";
  }

  // 消息内容
  const messageContent = document.createElement("div");
  messageContent.style.cssText = `
    max-width: calc(100% - 40px);
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
  `;

  if (sender === "user") {
    messageContent.style.backgroundColor = "#007AFF";
    messageContent.style.color = "white";
    messageContent.style.marginLeft = "auto";
    messageDiv.style.flexDirection = "row-reverse";
  } else {
    messageContent.style.backgroundColor = "#e0e0e0";
    messageContent.style.color = "#333";
  }

  messageContent.textContent = content;

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(messageContent);

  return messageDiv;
}

// 计算对话框位置 - 全局函数
window.calculateDialogPosition = function(ballElement) {
  const ballRect = ballElement.getBoundingClientRect();
  const dialog = document.getElementById("july-ai-dialog");
  const dialogWidth = dialog ? dialog.offsetWidth : 400;
  const dialogHeight = dialog ? dialog.offsetHeight : 500;
  const margin = 20;

  let left, top;
  let position = "bottom-right"; // 默认位置

  // 获取悬浮球的位置信息
  const ballCenterX = ballRect.left + ballRect.width / 2;
  const ballCenterY = ballRect.top + ballRect.height / 2;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 检查悬浮球是否在边缘
  const isOnLeft = ballRect.left < 100;
  const isOnRight = ballRect.right > windowWidth - 100;
  const isOnTop = ballRect.top < 100;
  const isOnBottom = ballRect.bottom > windowHeight - 100;

  // 根据悬浮球位置决定对话框位置
  if (isOnBottom) {
    // 悬浮球在底部，对话框显示在上方
    top = ballRect.top - dialogHeight - margin;
    if (isOnLeft) {
      left = margin;
      position = "top-left";
    } else if (isOnRight) {
      left = windowWidth - dialogWidth - margin;
      position = "top-right";
    } else {
      left = ballCenterX - dialogWidth / 2;
      position = "top-center";
    }
  } else if (isOnTop) {
    // 悬浮球在顶部，对话框显示在下方
    top = ballRect.bottom + margin;
    if (isOnLeft) {
      left = margin;
      position = "bottom-left";
    } else if (isOnRight) {
      left = windowWidth - dialogWidth - margin;
      position = "bottom-right";
    } else {
      left = ballCenterX - dialogWidth / 2;
      position = "bottom-center";
    }
  } else if (isOnLeft) {
    // 悬浮球在左侧，对话框显示在右侧
    left = ballRect.right + margin;
    if (isOnTop) {
      top = margin;
      position = "right-top";
    } else if (isOnBottom) {
      top = windowHeight - dialogHeight - margin;
      position = "right-bottom";
    } else {
      top = ballCenterY - dialogHeight / 2;
      position = "right-center";
    }
  } else if (isOnRight) {
    // 悬浮球在右侧，对话框显示在左侧
    left = ballRect.left - dialogWidth - margin;
    if (isOnTop) {
      top = margin;
      position = "left-top";
    } else if (isOnBottom) {
      top = windowHeight - dialogHeight - margin;
      position = "left-bottom";
    } else {
      top = ballCenterY - dialogHeight / 2;
      position = "left-center";
    }
  } else {
    // 悬浮球在中间，默认显示在右侧
    left = ballRect.right + margin;
    top = ballCenterY - dialogHeight / 2;
    position = "right-center";
  }

  // 确保对话框不超出窗口边界
  left = Math.max(margin, Math.min(left, windowWidth - dialogWidth - margin));
  top = Math.max(margin, Math.min(top, windowHeight - dialogHeight - margin));

  return { left, top, position };
};

// 显示对话框
function showDialog() {
  const dialog = document.getElementById("july-ai-dialog");
  const ball = document.getElementById("ai-assistant-ball");
  
  if (!dialog || !ball) return;

  const position = window.calculateDialogPosition(ball);
  
  dialog.style.left = position.left + "px";
  dialog.style.top = position.top + "px";
  dialog.style.display = "flex";

  // 添加显示动画
  dialog.style.opacity = "0";
  dialog.style.transform = "scale(0.9)";
  
  setTimeout(() => {
    dialog.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    dialog.style.opacity = "1";
    dialog.style.transform = "scale(1)";
  }, 10);

  // 聚焦到输入框
  const input = dialog.querySelector("input");
  if (input) {
    setTimeout(() => input.focus(), 100);
  }
}

// 重新定位对话框（当大小改变时调用）
function repositionDialog() {
  const dialog = document.getElementById("july-ai-dialog");
  const ball = document.getElementById("ai-assistant-ball");
  
  if (!dialog || !ball || dialog.style.display !== "flex") return;

  const position = window.calculateDialogPosition(ball);
  
  // 确保对话框不超出窗口边界
  const maxLeft = window.innerWidth - dialog.offsetWidth;
  const maxTop = window.innerHeight - dialog.offsetHeight;
  
  dialog.style.left = Math.max(0, Math.min(position.left, maxLeft)) + "px";
  dialog.style.top = Math.max(0, Math.min(position.top, maxTop)) + "px";
}

// 隐藏对话框
function hideDialog() {
  const dialog = document.getElementById("july-ai-dialog");
  if (!dialog) return;

  dialog.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  dialog.style.opacity = "0";
  dialog.style.transform = "scale(0.9)";

  setTimeout(() => {
    dialog.style.display = "none";
  }, 200);
}

// 点击外部关闭对话框
document.addEventListener("click", (e) => {
  const dialog = document.getElementById("july-ai-dialog");
  const ball = document.getElementById("ai-assistant-ball");
  
  if (!dialog || !ball) return;

  if (dialog.style.display === "flex" && 
      !dialog.contains(e.target) && 
      !ball.contains(e.target)) {
    hideDialog();
  }
});

// 创建对话框并绑定悬浮球点击事件
function initializeAskDialog() {
  const dialog = createAskDialog();
  const ball = document.getElementById("ai-assistant-ball");
  
  if (ball) {
    // 点击事件处理，检查是否在拖拽中
    const clickHandler = (e) => {
      // 如果正在拖拽，不处理点击事件
      if (ball._isDragging) {
        return;
      }
      
      e.stopPropagation();
      const currentDialog = document.getElementById("july-ai-dialog");
      if (currentDialog && currentDialog.style.display === "flex") {
        hideDialog();
      } else {
        showDialog();
      }
    };
    
    ball.addEventListener("click", clickHandler);
  }
}

// 导出函数供外部使用
window.JulyAI = window.JulyAI || {};
window.JulyAI.showDialog = showDialog;
window.JulyAI.hideDialog = hideDialog;
window.JulyAI.initializeAskDialog = initializeAskDialog;

// 窗口大小变化时重新定位对话框
window.addEventListener("resize", () => {
  repositionDialog();
});

// 自动初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAskDialog);
} else {
  initializeAskDialog();
}

console.log("July AI Extension: Ask dialog module loaded"); 