import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
    const nav = useNavigate()

    const goBack = () => nav(-1)
  return (
    <div className='container'>
        <br/><br/>
        <h1>Unauthorized</h1>
        <br />
        <p>You do not access to the requested page.</p>
        <button className='btn btn-dark' onClick={goBack}>Go back</button>
    </div>
  )
}
