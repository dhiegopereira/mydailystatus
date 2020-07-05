import React, { useEffect } from 'react'
import auth0 from '../lib/auth0'
import router from 'next/router'
import { db }  from '../lib/db'
import { distance } from '../lib/geo'
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const App = (props) => {
    useEffect(() => {
        if(!props.isAuth){
            router.push('/')
        } else if (props.forceCreate) {
            router.push('/create-status')
        }
    })
    if(!props.isAuth || props.forceCreate){
        return null
    }
    return (
        <div>
            <h1>Status próximos a você:</h1>
            <table>
                {props.checkins.map(checkin => {
                    return (
                        <tr>
                            <td>{checkin.id === props.user.sub && 'Seu status'}</td>
                            <td>{checkin.status}</td>
                            <td>{JSON.stringify(checkin.coords)}</td>
                            <td>{checkin.distance}</td>
                        </tr>
                    )
                })}
            </table> 
            {props.checkins.map(checkin => {
                return (
                    <div style={{ height: '500px', width: '500px' }}>
                        <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyC7h-rXw0OKkcuaeGh8Q-hD64DjgJV4PWY' }}
                        defaultCenter={checkin.center}
                        defaultZoom={checkin.zoom}
                        >
                        <AnyReactComponent
                            lat={checkin.coords.lat}
                            lng={checkin.coords.long}
                            text={checkin.status}
                        />
                        </GoogleMapReact>
                    </div>
                )
            })}           
        </div>
    )
}

export default App

export async function getServerSideProps ({ req, res }) {
    const session = await auth0.getSession(req)
    const today = new Date()
    const currentDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()        
    if (session) {
        const todaysCheckin = await db
            .collection('markers')
            .doc(currentDate)
            .collection('checks')
            .doc(session.user.sub)
            .get()
        
        const todayData = todaysCheckin.data()
        let forceCreate = true
        if(todayData){
            const checkins = await db
            .collection('markers')
            .doc(currentDate)
            .collection('checks')
            .near({
                center: todayData.coordinates,
                radius: 1000
            })
            .get()
            const checkinsList = []
            checkins.docs.forEach(doc => {
                checkinsList.push({
                    id: doc.id,
                    status: doc.data().status,
                    coords: {
                        lat: doc.data().coordinates.latitude,
                        long: doc.data().coordinates.longitude
                    },
                    distance: distance(
                        -2.900360, //todayData.coordinates.latitude, 
                        -40.842949, //todayData.coordinates.longitude, 
                        doc.data().coordinates.latitude, 
                        doc.data().coordinates.longitude
                    ).toFixed(2),
                    center: {
                        lat: 59.95,
                        lng: 30.33
                    },
                    zoom: 11
                })
            })
            return {
                props: {
                    isAuth: true,
                    user: session.user,
                    forceCreate: false,
                    checkins: checkinsList
                }
            }
        }  
        return {
            props: {
                isAuth: true,
                user: session.user,
                forceCreate
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


//01:19:40