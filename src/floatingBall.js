// 添加调试日志
console.log("July AI Extension: Content script loaded");
console.log("July AI Extension: DOM ready state:", document.readyState);

// 创建悬浮球元素
function createFloatingBall() {
  console.log("July AI Extension: Creating floating ball...");

  // 初始化位置变量
  let currentPosition = { x: 0, y: 0, edgeType: null };

  // 验证并设置位置的函数
  function validateAndSetPosition(position) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const ballWidth = 60;
    const ballHeight = 60;
    const margin = 20;

    let left = parseInt(position.left) || 0;
    let top = parseInt(position.top) || 0;

    // 确保不超出窗口边界
    left = Math.max(margin, Math.min(left, windowWidth - ballWidth - margin));
    top = Math.max(margin, Math.min(top, windowHeight - ballHeight - margin));

    container.style.left = left + "px";
    container.style.top = top + "px";
    container.style.right = "auto";
    container.style.bottom = "auto";
  }

  // 加载保存的位置
  function loadSavedPosition() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['ballPosition'], function(result) {
        if (result.ballPosition) {
          validateAndSetPosition(result.ballPosition);
        }
      });
    }
  }

  // 创建容器
  const container = document.createElement("div");
  container.className = "ball-container";
  container.style.cssText = `
    position: fixed;
    width: 60px;
    height: 60px;
    z-index: 2147483647;
    right: 20px;
    bottom: 20px;
  `;

  // 创建悬浮球
  const ball = document.createElement("div");
  ball.id = "ai-assistant-ball";
  ball.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #007AFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 2147483646;
    font-size: 24px;
    color: white;
    transition: transform 0.3s ease, background-color 0.3s ease;
    user-select: none;
    pointer-events: auto;
  `;

  // 添加AI图标
  ball.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 935.744a39.517867 39.517867 0 0 1-14.122667-7.185067c-12.906667-10.295467-18.602667-27.2896-14.741333-43.4688a1295.863467 1295.863467 0 0 0 17.207467-520c-5.6448-33.216 0.418133-66.760533 17.5488-96.443733 17.156267-29.563733 43.498667-51.648 75.656533-60.497067h0.008533l417.591467-114.24c66.0352-19.434667 144.533333 49.792 162.602667 156.258134a1978.666667 1978.666667 0 0 1 27.144533 397.806933c-3.4432 107.592533-71.6928 186.248533-139.758933 176.008533l-64.823467-8.494933c-22.203733-3.042133-36.8768-29.952-33.8944-60.1984 3.008-30.2336 22.664533-53.713067 45.038933-52.343467 21.7472 1.463467 43.485867 2.922667 65.233067 4.3776 24.170667 1.783467 45.969067-26.0096 47.133867-62.007466a1897.941333 1897.941333 0 0 0-26.030934-381.499734c-6.062933-35.618133-31.466667-60.3136-55.168-55.2576l-424.0128 87.466667c-11.4176 2.363733-21.1584 9.570133-27.6096 20.078933-6.4512 10.530133-8.802133 22.993067-6.698666 35.345067a1377.0368 1377.0368 0 0 1 2.346666 449.117867 1341.696 1341.696 0 0 0 118.4512-104.448c8.251733-8.1792 18.862933-12.475733 29.602134-11.758934l293.009066 19.6736c22.340267 1.365333 38.839467 28.650667 35.639467 60.842667-3.1744 32.200533-24.704 55.765333-46.882133 52.7232l-274.5216-35.972267c-62.229333 57.1136-127.6544 106.965333-194.973867 149.384534-9.629867 6.071467-20.8 7.522133-30.976 4.731733z" fill="white"></path>
      <path d="M635.733333 488.533333m-59.733333 0a59.733333 59.733333 0 1 0 119.466667 0 59.733333 59.733333 0 1 0-119.466667 0Z" fill="white"></path>
      <path d="M460.864 507.733333m-50.133333 0a50.133333 50.133333 0 1 0 100.266666 0 50.133333 50.133333 0 1 0-100.266666 0Z" fill="white"></path>
    </svg>
  `;

  // 创建设置按钮
  const settingsButton = document.createElement("div");
  settingsButton.className = "settings-button";
  settingsButton.title = "设置";
  settingsButton.style.cssText = `
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background-color: #007AFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    margin-top: 8px;
    transition: all 0.3s ease;
    z-index: 2147483646;
  `;

  // 添加设置图标
  settingsButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M550.4 924.404h-49.1c-57.7 0-104.6-46.9-104.6-104.6-0.1-7.2-2.1-14.5-5.9-20.9-6.6-11.2-16.3-18.6-27.9-21.7-11.6-3.1-23.7-1.5-34.1 4.6-51.6 28.6-115.3 10.1-143.2-40.4l-24.5-42.2c-0.1-0.1-0.1-0.2-0.2-0.3v-0.1c-28.5-49.8-11.2-113.5 38.5-142 14-8.1 22.8-23.3 22.8-39.5s-8.7-31.4-22.9-39.6c-49.8-28.8-67-92.8-38.3-142.6l26.6-43.8c28.5-49.3 92.5-66.3 142.3-37.7 6.7 4 14.1 6 21.6 6.1h0.1c24.6 0 45.1-20.2 45.4-45.1 0-57.5 46.7-104.2 104-104.2h49.3c61 1.9 106.4 50.3 104.6 107.9 0.1 6.3 2.1 13.6 5.9 20 6.4 10.8 16.2 18.2 27.9 21.2s23.8 1.2 34.2-4.9c50-28.8 114.1-11.7 143 38l24.5 42.5 1.5 3c26.2 49.3 8.8 111.3-39.7 139.6-7.1 4-12.8 9.7-16.7 16.7-6.4 11.1-7.9 23.3-4.7 34.9 3.2 11.6 10.7 21.3 21.2 27.3 25 14.6 42.1 37.1 49.2 64 7.1 26.9 3.2 54.9-10.8 78.9l-26 43.5c-28.7 49.3-92.6 66.5-142.6 37.8-6.6-3.8-14.3-6-22.1-6.2-12 0.1-23.4 4.9-31.8 13.5-8.5 8.6-13.1 20-13 32-0.4 57.7-47.3 104.3-104.5 104.3z m-199.2-207.6c8.9 0 17.9 1.2 26.7 3.5 26.8 7.1 49.3 24.2 63.2 48.2 9.3 15.7 14.2 33.2 14.4 51 0 25.5 20.5 46 45.7 46h49.1c25 0 45.5-20.4 45.7-45.4-0.2-27.4 10.4-53.6 30-73.4 19.5-19.8 45.6-30.8 73.4-31 19.4 0.5 36.6 5.3 51.7 14 21.9 12.5 49.8 5 62.4-16.7l26.1-43.6c5.9-10.1 7.6-22.3 4.5-34-3.1-11.7-10.5-21.4-20.9-27.5-24.6-14-42-36.4-49.3-63.2-7.3-26.8-3.8-54.9 10-79 9.6-16.8 22.9-30.1 38.9-39.2 21.3-12.4 28.8-40.3 16.5-62-0.5-0.8-0.8-1.6-1.2-2.4l-23.2-40.2c-12.5-21.6-40.5-29.2-62.2-16.7-23.6 14-51.6 17.9-78.5 11.1-26.9-6.9-49.5-23.9-63.7-47.8-9.3-15.7-14.2-33.2-14.4-51.1 0.8-26.4-19-47.5-44.2-48.3h-50.8c-24.9 0-45.1 20.3-45.1 45.2-0.8 57.8-47.7 104.1-104.6 104.1h-0.2c-18.1-0.2-35.5-5.1-50.9-14.2-21.5-12.4-49.4-4.8-62 16.9l-26.6 43.7c-12.1 21.1-4.6 49.1 17.1 61.7 32.2 18.6 52.3 53.3 52.3 90.6s-20.1 72-52.3 90.6c-21.7 12.4-29.2 40.1-16.8 61.7 0 0.1 0.1 0.1 0.1 0.2l24.8 42.8c12.5 22.6 40.3 30.6 62.4 18.5 16-9.3 33.8-14.1 51.9-14.1zM525.9 650.204c-73.3 0-133-59.7-133-133s59.7-133 133-133 133 59.7 133 133c0 73.4-59.7 133-133 133z m0-207c-40.8 0-74.1 33.2-74.1 74.1s33.2 74.1 74.1 74.1 74.1-33.2 74.1-74.1-33.3-74.1-74.1-74.1z" fill="#ffffff"></path>
    </svg>
  `;

  // 添加设置按钮点击事件
  settingsButton.addEventListener("click", function (e) {
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: "openOptions" });
  });

  // 添加设置按钮悬停效果
  settingsButton.addEventListener("mouseenter", function () {
    this.style.backgroundColor = "#0056b3";
    this.style.transform = "translateX(-50%) scale(1.1)";
  });

  settingsButton.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "#007AFF";
    this.style.transform = "translateX(-50%) scale(1)";
  });


  // 添加悬停效果
  ball.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1)";
    this.style.backgroundColor = "#0056b3";
  });

  ball.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.backgroundColor = "#007AFF";
  });

  // 窗口大小变化处理
  function handleResize() {
    const rect = container.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = rect.left;
    let top = rect.top;

    // 调整位置
    if (left + rect.width > windowWidth) {
      left = windowWidth - rect.width;
    }
    if (top + rect.height > windowHeight) {
      top = windowHeight - rect.height;
    }

    left = Math.max(0, left);
    top = Math.max(0, top);

    const newPosition = {
      left: `${left}px`,
      top: `${top}px`,
      right: "auto",
      bottom: "auto",
      edge: null
    };

    validateAndSetPosition(newPosition);
  }

  // 添加拖拽功能
  let isDragging = false;
  let initialX = 0;
  let initialY = 0;

  // 边缘吸附功能
  function checkEdgeSnap(x, y) {
    const ballWidth = container.offsetWidth;
    const ballHeight = container.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const edgeThreshold = ballWidth * 0.6;

    let newX = x;
    let newY = y;
    let edgeType = null;

    // 检查左右边缘
    if (x <= edgeThreshold) {
      newX = -ballWidth / 2;
      edgeType = "left";
    } else if (x >= windowWidth - ballWidth - edgeThreshold) {
      newX = windowWidth - ballWidth / 2;
      edgeType = "right";
    }

    // 检查上下边缘
    if (y <= edgeThreshold) {
      newY = -ballHeight / 2;
      edgeType = "top";
    } else if (y >= windowHeight - ballHeight - edgeThreshold) {
      newY = windowHeight - ballHeight / 2;
      edgeType = "bottom";
    }

    return { x: newX, y: newY, edgeType };
  }

  // 更新悬浮球位置
  let updateTimeout = null;
  function updatePosition(x, y) {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
      const snapResult = checkEdgeSnap(x, y);
      currentPosition = snapResult;

      // 直接设置容器位置，不使用动画
      container.style.left = snapResult.x + "px";
      container.style.top = snapResult.y + "px";
      container.style.right = "auto";
      container.style.bottom = "auto";

      // 根据边缘类型添加相应的CSS类，只对球体使用动画
      ball.className = "ai-ball";
      if (snapResult.edgeType) {
        ball.classList.add(`edge-${snapResult.edgeType}`);
      }

      // 保存位置
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ ballPosition: currentPosition });
      }
    }, 16);
  }

  ball.addEventListener("mousedown", function (e) {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    e.preventDefault();
    
    // 标记开始拖拽，防止点击事件
    ball._isDragging = true;
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    e.preventDefault();
    const currentX = e.clientX - initialX;
    const currentY = e.clientY - initialY;

    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;

    const newX = Math.max(0, Math.min(currentX, maxX));
    const newY = Math.max(0, Math.min(currentY, maxY));

    // 拖拽时直接更新位置，不使用防抖
    const snapResult = checkEdgeSnap(newX, newY);
    currentPosition = snapResult;

    // 拖拽时直接设置位置，不使用动画
    container.style.left = snapResult.x + "px";
    container.style.top = snapResult.y + "px";
    container.style.right = "auto";
    container.style.bottom = "auto";

    ball.className = "ai-ball";
    if (snapResult.edgeType) {
      ball.classList.add(`edge-${snapResult.edgeType}`);
    }
    
    // 如果对话框已打开，跟随悬浮球移动
    const dialog = document.getElementById("july-ai-dialog");
    if (dialog && dialog.style.display === "flex" && window.calculateDialogPosition) {
      const dialogPosition = window.calculateDialogPosition(ball);
      dialog.style.left = dialogPosition.left + "px";
      dialog.style.top = dialogPosition.top + "px";
    }
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    // 鼠标释放时检查是否需要边缘吸附
    const rect = container.getBoundingClientRect();
    updatePosition(rect.left, rect.top);
    
    // 延迟清除拖拽标记，防止点击事件
    setTimeout(() => {
      ball._isDragging = false;
    }, 100);
  });

  // 添加CSS样式
  const style = document.createElement("style");
  style.textContent = `
    .ai-ball {
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .ai-ball.edge-left {
      transform: translateX(-50%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .ai-ball.edge-right {
      transform: translateX(50%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .ai-ball.edge-top {
      transform: translateY(-50%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .ai-ball.edge-bottom {
      transform: translateY(50%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* 悬停时恢复正常显示 */
    .ai-ball.edge-left:hover,
    .ai-ball.edge-right:hover,
    .ai-ball.edge-top:hover,
    .ai-ball.edge-bottom:hover {
      transform: translateX(0) translateY(0) !important;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* 容器不使用动画，只对球体使用动画 */
    .ball-container {
      /* 移除容器的过渡动画 */
    }

    /* 设置按钮位置调整 */
    .ball-container:has(#ai-assistant-ball.edge-bottom) .settings-button {
      top: auto;
      bottom: 100%;
      margin-top: 0;
      margin-bottom: 8px;
    }

    .ball-container:has(#ai-assistant-ball.edge-top) .settings-button {
      top: 100%;
      bottom: auto;
      margin-bottom: 0;
      margin-top: 8px;
    }

    .ball-container:has(#ai-assistant-ball.edge-left) .settings-button {
      top: 100%;
      bottom: auto;
      margin-bottom: 0;
      margin-top: 8px;
    }

    .ball-container:has(#ai-assistant-ball.edge-right) .settings-button {
      top: 100%;
      bottom: auto;
      margin-bottom: 0;
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);

  // 将悬浮球添加到页面
  container.appendChild(ball);
  container.appendChild(settingsButton);
  document.body.appendChild(container);

  // 加载保存的位置
  loadSavedPosition();

  // 添加窗口大小变化监听
  window.addEventListener("resize", handleResize);

  console.log("July AI Extension: Floating ball created and injected");
  return container;
}

// 确保DOM加载完成后再注入悬浮球
if (document.readyState === "loading") {
  console.log("July AI Extension: Waiting for DOM to load...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("July AI Extension: DOM loaded, creating floating ball...");
    createFloatingBall();
  });
} else {
  console.log(
    "July AI Extension: DOM already loaded, creating floating ball..."
  );
  createFloatingBall();
}
