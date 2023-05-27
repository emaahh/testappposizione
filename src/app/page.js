"use client"
import Image from 'next/image'
import React from 'react'
import { useEffect, useState } from 'react'


import { Map, Marker } from "pigeon-maps"


export default function Home() {
  const [location, setLocation] = useState();

  function errorHandler(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
    }
 }

  useEffect(() => {
    if('geolocation' in navigator) {
        // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
        var options = {timeout:60000};

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => { const { latitude, longitude } = coords; setLocation({ latitude, longitude });},
          errorHandler,
          options
        )
    }else { 
      alert("Geolocation is not supported by this browser.")
    }
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>La tua posizione</h1>

      {
        location?
        <Map height={300} defaultCenter={[location.latitude, location.longitude]} defaultZoom={11}>
          <Marker width={50} anchor={[location.latitude, location.longitude]} />
        </Map>
        :null
      }
      

      <h3>{JSON.stringify(location)}</h3>
    </main>
  )
}
