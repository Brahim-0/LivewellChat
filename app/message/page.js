'use client'
import React, { useEffect, useState } from 'react';
import { verifyToken } from '../api/auth';

import {
  MinChatUiProvider,
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader
} from "@minchat/react-chat-ui";

// this how the conversation is stored in the db within the conversations table
// [
//   {
//     "text": "Hello",
//     "user": {
//       "id": "1",
//       "name": "brahim"
//     }
//   },
//   {
//     "text": "Hello",
//     "user": {
//       "id": "2",
//       "name": "joe"
//     }
//   },
//   {
//     "text": "aw",
//     "user": {
//       "id": "e2bb8202-6f83-4a01-8a26-af101b50c8bf",
//       "name": "joe"
//     }
//   },
//   {
//     "text": "this works!",
//     "user": {
//       "id": "e2bb8202-6f83-4a01-8a26-af101b50c8bf",
//       "name": "joe"
//     }
//   }
// ]
// Each object within the array represents a message. Each message has a "text" field, 
// which contains the actual message text, and a "user" object, 
// which contains information about the user who sent the message. 
// The "user" object has two fields: "id", which represents the user's ID, and "name", which represents the user's name.

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");


  useEffect(() => {
    const token = localStorage.getItem('jwt_');
    if (token) {
      const userId = verifyToken(token);
      if (!userId) {
        window.location.href = "/login";
        localStorage.removeItem('jwt_');
      }else{
        setCurrentUserId(userId)
            // get username
            fetch('api/getUsername', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`,

              },
            })
            .then(response => response.json())
            .then(data => {
              setCurrentUsername(data.username)
            })
            .catch(error => {
              console.error('Error:', error);
            });
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('jwt_');
        const response = await fetch("/api/getUsers", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data);
          console.log(data)

        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);


  const handleUserClick = (userId) => {
    // Define the body of the POST request
    const requestBody = {
      userId1: currentUserId,
      userId2: userId,
    };

    const token = localStorage.getItem('jwt_');


    // Send a POST request to api/getConversation
    fetch('api/getConversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`,

      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      setConversationId(data.conversationId)
      const conv = JSON.parse(data.conversation);
      setMessages(conv);
      setConvselected(true)
      console.log(data);
      console.log(data.conversationId)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

const handleSendMessage = (message) => {
  const newMessage = {
      text: message,
      user: {
          id: currentUserId,
          name: currentUsername,
      },
  };

  // Update the state with the new message
  setMessages(prevMessages => [...prevMessages, newMessage]);

  // Send the request after updating the state
  setTimeout(() => {
      const token = localStorage.getItem('jwt_');

      const requestBody = {
          conversationId: conversationId,
          updatedConversation: [...messages, newMessage], 
      };

      fetch('api/sendMessage', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
      })
      .then(response => response.json())
      .then(data => {
         console.log(data);
          setConversationId(data.conversatinId);
          const conv = JSON.parse(data.conversation);
          setMessages(conv);
          console.log(data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }, 0); 
};

const handleLogout = () => {
  localStorage.removeItem('jwt_');
  window.location.href = "/login"; // Redirect to login page
};


  return (
    <>
    {/* Chat List */}
      <div style={{ display: 'flex' }}>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={styles.header}>Livewell Community</h2>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>

        <ul style={styles.list}>
        {users.map((user) => (
        <li key={user.id} style={styles.item} onClick={() => handleUserClick(user.id)}>
          <img
            style={styles.avatar}
            src={`https://api.dicebear.com/8.x/lorelei/svg?mouth=happy01`}
            alt={`${user.name}'s Avatar`} 
          />
          <div>
          <span style={styles.name}>{user.username}</span><br />
          <span style={styles.role}>{user.role}</span>
        </div>
        </li>
      ))}
        </ul>
    </div>

    {/* Messages */}
        <MinChatUiProvider theme="#6ea9d7">
          <MainContainer style={{ height: '100vh' }}>
            <MessageContainer>
              <MessageHeader />
              <MessageList
                currentUserId='dan' //{correntUser}
                messages={messages}
              />
              <MessageInput
                placeholder="Type message here"
                onSendMessage={handleSendMessage}
              />
            </MessageContainer>
          </MainContainer>
        </MinChatUiProvider>
      </div>
    </>
  );
}

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width : '33%',
    maxWidth: '30',
    margin: '0 auto',
  },
  header: {
    fontSize: '1.2em',
    margin: '0 0 10px',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    padding: '5px',
    backgroundColor: '#f2f2f2',
    borderRadius: '3px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
    borderRadius: '50%',
  },
  name: {
    fontSize: '1.2em', 
    fontWeight: 'bold', 
    marginBottom: '0.5em', 
  },
  role: {
    fontSize: '0.9em', 
    color: 'gray', 
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#ff6347',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 'none',
    marginBottom: "10px"
  },
};



