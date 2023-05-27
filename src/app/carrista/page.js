"use client"
import Image from 'next/image'
import React from 'react'
import { useEffect, useState } from 'react'

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://carrotracker-db.pockethost.io');

import { Map, Marker } from "pigeon-maps"


export default function Home() {
  const [location, setLocation] = useState();
  const [ultimoUpdate, setUltimoUpdate] = useState();


  function errorHandler(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("Non hai dato il permerso alla localizzazzione.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Informazioni di localizzazzione non disponibile.")
        break;
      case error.TIMEOUT:
        alert("La richiesta di posizione è scaduta.")
        break;
      case error.UNKNOWN_ERROR:
        alert("Si è presentato un errore sconosciuto, riprova.")
        break;
    }
  }

  async function setCarro({ latitude, longitude }){
    try {
        const data = {
            "nome_carro": "Ardizzone",
            "latitudine": latitude,
            "longitudine": longitude
        };
        await pb.collection('posizioni_carri').update('kfn7vgo4l7e8whs', data);
        await pb.collection('posizioni_carri').getOne('kfn7vgo4l7e8whs', {})
        .then((a) => {
            setUltimoUpdate(a.updated)
        })
    } catch (error) {
      alert(error)
    }
  }


  useEffect(() => {

    const interval = setInterval(() => {
      if('geolocation' in navigator) {
          // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
          console.log("aggiorno")
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => { const { latitude, longitude } = coords; setLocation({ latitude, longitude }); setCarro({ latitude, longitude });},
            errorHandler
          )
          
      }else { 
        alert("Il tuo browser non supporta la geolocalizzazzione.")
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <h1>Test su trasmissione posizioni in tempo reale</h1>

      {
        location?
        
          <Map height={500} defaultCenter={[location.latitude, location.longitude]} defaultZoom={11}>
            <Marker onClick={() => alert("ti trovi qui")} color={"red"} width={50} anchor={[location.latitude, location.longitude]} />

          </Map>

        :null
      }
      

      

      <h4>
            🟥: posizione attuale di questo client
      </h4>

      <h6>
        {JSON.stringify(location)}
        <br/>
        ultimo update posizione carro: {ultimoUpdate}
      </h6>
      
      <p>Made by <a href='https://www.instagram.com/_emaahh_/' target='_blank'>@_emaahh_</a></p>
    </main>
  )
}
