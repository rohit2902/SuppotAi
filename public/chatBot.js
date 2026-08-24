

(function () {
  const api_url = "https://suppot-ai-pied.vercel.app/api/chat";
  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("owner is not found");
    return;
  }

  const button = document.createElement("div");
  button.innerHTML = "🗨️";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
    zIndex: "999999",
  });
  document.body.appendChild(button);
  
    const box = document.createElement("div");

Object.assign(box.style, {
  position: "fixed",
  bottom: "90px",
  right: "24px",
  width: "320px",
  height: "420px",
  background: "#fff",
  borderRadius: "14px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  display: "none",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: "999999",
  fontFamily: "Inter, system-ui, sans-serif",
});
 
box.innerHTML = `
  <!-- Header -->
  <div style="
    background:#000;
    color:#fff;
    padding:12px 14px;
    font-size:14px;
    font-weight:600;
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-shrink:0;
  ">
    <span>Customer Support</span>

    <span
      id="chat-close"
      style="
        cursor:pointer;
        font-size:20px;
        line-height:1;
        opacity:0.8;
        transition:opacity 0.2s;
      "
      title="Close"
    >
      ×
    </span>
  </div>


  <!-- Messages -->
  <div
    id="chat-messages"
    style="
      flex:1;
      padding:12px;
      overflow-y:auto;
      background:#f9fafb;
      display:flex;
      flex-direction:column;
      gap:8px;
      font-size:13px;
    "
  >

    <!-- Welcome Message -->
    <div style="
      align-self:flex-start;
      max-width:80%;
      background:#fff;
      color:#111827;
      padding:9px 11px;
      border-radius:12px 12px 12px 4px;
      border:1px solid #e5e7eb;
      line-height:1.4;
      box-shadow:0 1px 2px rgba(0,0,0,0.04);
    ">
      Hello! 👋 How can I help you today?
    </div>

  </div>


  <!-- Input Area -->
  <div style="
    display:flex;
    gap:8px;
    padding:10px;
    background:#fff;
    border-top:1px solid #e5e7eb;
    flex-shrink:0;
  ">

    <input
      id="chat-input"
      type="text"
      placeholder="Type a message..."
      autocomplete="off"
      style="
        flex:1;
        min-width:0;
        height:40px;
        padding:0 12px;
        border:1px solid #d1d5db;
        border-radius:10px;
        outline:none;
        background:#fff;
        color:#111827;
        font-size:13px;
        box-sizing:border-box;
      "
    />

    <button
      id="chat-send"
      type="button"
      style="
        height:40px;
        padding:0 15px;
        border:none;
        border-radius:10px;
        background:#000;
        color:#fff;
        font-size:13px;
        font-weight:500;
        cursor:pointer;
        transition:all 0.2s ease;
      "
    >
      Send
    </button>

  </div>
`;

document.body.appendChild(box)

  button.onclick=()=>{
    box.style.display =  box.style.display === "none"? "flex":"none"
  }


const closeButton = box.querySelector("#chat-close");

closeButton.addEventListener("click", () => {
  box.style.display = "none";
});

const input = box.querySelector("#chat-input");
const sendButton = box.querySelector("#chat-send");
const messages = box.querySelector("#chat-messages");



function addUserMessage(message) {
  const messageElement = document.createElement("div");

  messageElement.style.cssText = `
    align-self:flex-end;
    max-width:80%;
    background:#000;
    color:#fff;
    padding:9px 12px;
    border-radius:14px 14px 4px 14px;
    line-height:1.4;
    word-break:break-word;
  `;

  messageElement.textContent = message;

  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

function addAIMessage(message) {
  const messageElement = document.createElement("div");

  messageElement.style.cssText = `
    align-self:flex-start;
    max-width:80%;
    background:#fff;
    color:#111827;
    padding:9px 12px;
    border-radius:14px 14px 14px 4px;
    border:1px solid #e5e7eb;
    line-height:1.4;
    word-break:break-word;
    box-shadow:0 1px 2px rgba(0,0,0,0.05);
  `;

  messageElement.textContent = message;

  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}


async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  // User message
  addUserMessage(message);

  input.value = "";

  // Typing indicator
  const typing = document.createElement("div");

  typing.innerHTML = "Typing...";

  Object.assign(typing.style, {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
    alignSelf: "flex-start",
  });

  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch("https://suppot-ai-pied.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId, 
        message:message,
      }),
    });

    const data = await response.json();
    console.log(data)

    // Typing remove
    typing.remove();

    if (!response.ok) {
      throw new Error(
        data.message || "Something went wrong"
      );
    }

    // AI response
    addAIMessage(data.response);

  } catch (error) {
    console.error(error);

    // Typing remove
    typing.remove();

    addAIMessage(
      "Sorry, something went wrong. Please try again."
    );
  }
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});



})();
