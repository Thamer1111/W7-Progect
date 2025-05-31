import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function ChatPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("https://6823a18e65ba0580339768c2.mockapi.io/Users");
      setUsers(res.data.filter((u) => u.id !== currentUser.id));
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const res = await axios.get("https://6823a18e65ba0580339768c2.mockapi.io/Chat");
      const filtered = res.data.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === selectedUser.id) ||
          (m.senderId === selectedUser.id && m.receiverId === currentUser.id)
      );
      setMessages(filtered);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [selectedUser, currentUser]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    const newMsg = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: input.trim()
    };
    await axios.post("https://6823a18e65ba0580339768c2.mockapi.io/Chat", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-gray-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Users</h2>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-2 cursor-pointer rounded mb-2 ${
              selectedUser?.id === user.id ? "bg-green-700" : "bg-gray-700"
            }`}
          >
            {user.username}
          </div>
        ))}
      </div>

      <div className="w-full md:w-3/4 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h3 className="text-xl mb-4 border-b pb-2">
              Chat with {selectedUser.username}
            </h3>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-xs p-2 rounded ${
                    msg.senderId === currentUser.id
                      ? "bg-green-600 self-end"
                      : "bg-gray-700 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 rounded bg-gray-800 text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            Select a user to chat with
          </div>
        )}
      </div>
    </div>
  );
}
