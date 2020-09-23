import React, { useState } from 'react'
import auth0 from '../lib/auth0'
import axios from 'axios'
import router from 'next/router'
import {useAuth} from '../lib/AuthContext'

const CreateStatus = () => {
    const auth = useAuth()
    const [dados, setDados] = useState({
        status: 'bem',
        coords: {
            lat: null,
            long: null
        }
    })
    if(auth.isAuthReady && !auth.isAuth){
        router.push('/')
    }
    const getMyLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position => {
                console.log(position.coords)
                setDados(old => {
                    return {
                        ...old, 
                        coords: {
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                    }
                    }
                })
            })
        }
    }
    const onStatusChange = evt => {
        const value = evt.target.value
        setDados(old => {
            return {
                ...old,
                status: value
            }
        })
    }
    const save = async() => {
        await axios.post('/api/save-status', dados)
    }
    return (
        <div>
            <h1>Create Status</h1>
            <label className='block'>
                <input onClick={onStatusChange} type='radio' name='status' value='bem'/>
                Estou bem sem sitomas
            </label>

            <label className='block'>
                <input onClick={onStatusChange} type='radio' name='status' value='gripe'/>
                    Estou com sitomas de gripe / resfriado                 
            </label>

            <label className='block'>
                <input onClick={onStatusChange} type='radio' name='status' value='covid'/>
                    Estou com sitomas da covid-19                   
            </label>
            Sua posição atual: {JSON.stringify(dados)}
            <button onClick={getMyLocation}>Pegar minha localização</button>
            <button onClick={save}>Salvar meu status</button>
        </div> 

    )
}
        

export default CreateStatus

export async function getServerSideProps ({ req, res }) {
    const session = await auth0.getSession(req)
    console.log(session)
    if (session) { 
        return {
            props: {
                isAuth: true,
                user: session.user
            }
        }
    }
    return {
        props: {
            isAuth: false,
            user: {}
        }
    }
}

