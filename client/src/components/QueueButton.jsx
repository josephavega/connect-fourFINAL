import React, { useState, useEffect } from "react";
import queueSocket from "../sockets/queueSocket";
import { v4 as uuidv4 } from "uuid";
import "../styles/lobby.css";

let sessionID = localStorage.getItem("sessionID");
if (!sessionID) {
  sessionID = uuidv4();
  localStorage.setItem("sessionID", sessionID);
}

let socket = null;

const QueueButton = () => {
  const [inQueue, setInQueue] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/queue/isInQueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Is In Queue?:", data);
        setInQueue(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [sessionID]);

  const toggleQueueStatus = () => {
    const sessionID = localStorage.getItem("sessionID");
    const username = localStorage.getItem("username");

    if (inQueue) {
      // Leave the queue using API request
      fetch("http://localhost:3000/queue/leaveQueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Leave Queue Response:", data);
          setInQueue(false);
          queueSocket.emit("getQueue");
        })
        .catch((error) => {
          console.error("Error leaving queue:", error);
          alert("Failed to leave the queue.");
        });
    } else {
      // Join the queue using API request
      fetch("http://localhost:3000/queue/joinQueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID, username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Join Queue Response:", data);
          setInQueue(true);
          queueSocket.emit("getQueue");
        })
        .catch((error) => {
          console.error("Error joining queue:", error);
          alert("Failed to join the queue.");
        });
    }
  };

  return (
    <>
      <button className="queue-button" onClick={toggleQueueStatus}>
        {inQueue ? <img src="./src/assets/Menu/Buttons/Button_Leave.png" alt="Leave" /> : <img src="./src/assets/Menu/Buttons/Button_Join.png" alt="Join"></img>}
      </button>
      {/* Other UI components */}
    </>
  );
};

export default QueueButton;
