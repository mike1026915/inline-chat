'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client';
import moment from 'moment';

import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import styles from './page.module.css'

interface Props {
  searchParams: {
    name: string;
    id: string;
  }
}

interface ReceivedMessage {
  message: string;
  name: string;
  id: string;
  create_at: string;
}

export default function ChatRoom(props: Props) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || '';
  const id = searchParams.get('id') || '';
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const socket = useRef<Socket>();

  const initWebSocket = (socket: Socket, id: string, name: string) => {
    socket.on('connectionSuccess', (data) => {
      setReceivedMessages((receivedMessages) => receivedMessages.concat(data))
    })

    socket.on('connectionFail', (data) => {
      console.log('Fail', data);
    })

    socket.on('serverMessageBroadcasst', (data) => {
      setReceivedMessages((receivedMessages) => receivedMessages.concat(data))
    })
  }

  useEffect(() => {
    socket.current = io('http://ec2-43-207-90-96.ap-northeast-1.compute.amazonaws.com:5000',
      {
        transports: ['websocket'],
      }
    );

    socket.current?.emit('login', {
      id,
      name,
    });

    initWebSocket(socket.current, id, name)

    return () => {
      socket.current?.emit('exit', {
        id,
        name,
      });
      socket.current?.close();
    };
  }, [])

  const handleTextChange = useCallback((e: any) => {
    const value = e.target.value;
    setMessage(value);
  }, [setMessage])

  const sendMessage = (message: string) => {
    socket.current?.emit('clientSendMessage', {
      id,
      name,
      message,
      create_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  const handleKeyDown = useCallback((e: any) => {
    if(e.keyCode === 13 && !e.shiftKey){
      e.preventDefault();

      sendMessage(message);
      setMessage('')
    }
  }, [sendMessage, message, setMessage])

  const handleSendIconClick = useCallback((e: any) => {
      sendMessage(message);
      setMessage('')
  }, [sendMessage, message, setMessage])

  return (
    <main className={styles.main}>
      <div className={styles.message_area}>
        {
          receivedMessages.map((receivedMessage: ReceivedMessage, index: number) => {
            if (receivedMessage.name && receivedMessage.name === name) {
              return (
                <div key={`message_${index}`} className={styles.tag_own}>
                  <div>
                    {receivedMessage.message}
                  </div>
                </div>
              )
            } else if (receivedMessage.name && receivedMessage.name !== name) {
              return (
                <div key={`message_${index}`} className={styles.tag_other}>
                  <div>
                    {`${receivedMessage.name}: ${receivedMessage.message}`}
                  </div>
                </div>
              )
            } else {
              return ( // message without name is system message
                <div key={`message_${index}`} className={styles.tag_system}>
                  <div>
                    {receivedMessage.message}
                  </div>
                </div>
              )
            }
          })
        }
      </div>
      <div className={styles.input_field}>
        <TextField
          id="message"
          label="Message"
          variant="standard"
          color="primary"
          focused
          autoFocus
          multiline
          fullWidth
          value={message}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <SendIcon
          style={{marginTop: '25px', marginLeft: '15px', cursor: 'pointer'}}
          onClick={handleSendIconClick}
        />
      </div>
    </main>
  );
}
