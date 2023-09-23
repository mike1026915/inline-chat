'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

import styles from './page.module.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleClick = useCallback((e: any) => {
    e.preventDefault()
    router.push(`/chatRoom?id=${uuidv4()}&name=${name}`);
  }, [name])

  const handleTextChange = useCallback((e: any) => {
    const value = e.target.value;
    setName(value);
  }, [setName])

  const handleKeyDown = useCallback((e: any) => {
    if(e.keyCode === 13 && !e.shiftKey){
      e.preventDefault();

      router.push(`/chatRoom?id=${uuidv4()}&name=${name}`);
    }
  }, [name])


  return (
    <main className={styles.main}>
      <h1> Welcome to Mike's Chat Room </h1>
      <h3> Please enter your name </h3>
      <TextField id="name" label="Name" variant="standard" color="primary" focused value={name} onChange={handleTextChange} onKeyDown={handleKeyDown} />
      <Button variant="contained" onClick={handleClick}>Enter</Button>
    </main>
  )
}
