import React from "react";
import MessagesView from "../components/MessagesView";
import StudentMessagesView from "../components/StudentMessagesView";

export default function MessagesPage() {
  const userRole = localStorage.getItem("role");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1> */}
      {userRole === "student" ? (
        <StudentMessagesView />
      ) : (
        <MessagesView />
      )}
    </div>
  );
}