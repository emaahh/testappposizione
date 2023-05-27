"use client"
import Image from 'next/image'
import React from 'react'
import { useEffect, useState } from 'react'

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://carrotracker-db.pockethost.io');

import { Map, Marker } from "pigeon-maps"


export default function Home() {
  const [location, setLocation] = useState();

  const [posizioneCarro, setPosizioneCarro] = useState();

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

  async function getCarro(){
    try {
      const record = await pb.collection('posizioni_carri').getOne('kfn7vgo4l7e8whs', {})
      .then((x)=>{
        setPosizioneCarro(x)
      })
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    pb.collection('posizioni_carri').subscribe('kfn7vgo4l7e8whs', function (e) {
      setPosizioneCarro(e.record)
    });
    return () => {
      pb.collection('posizioni_carri').unsubscribe('kfn7vgo4l7e8whs'); // don't forget to unsubscribe
    };
  });

  useEffect(() => {
    getCarro()

    const interval = setInterval(() => {
      if('geolocation' in navigator) {
          // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
          console.log("aggiorno")
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => { const { latitude, longitude } = coords; setLocation({ latitude, longitude });},
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
      <h1>Test su ricezzione posizioni in tempo reale</h1>

      {
        location?
        
          <Map height={500} defaultCenter={[location.latitude, location.longitude]} defaultZoom={11}>
            <Marker onClick={() => alert("ti trovi qui")} color={"red"} width={50} anchor={[location.latitude, location.longitude]} />
            <Marker onClick={() => alert("il carro si trova qui")} color={"green"} width={50} anchor={[posizioneCarro.latitudine, posizioneCarro.longitudine]} />
          </Map>

        :null
      }
      

      

      <h4>
        🟩: posizione in tempo reale carro ricevuta dal database
        <br/>  
        🟥: posizione attuale di questo client
      </h4>

      <h6>
        {
          posizioneCarro?
            <>{JSON.stringify(posizioneCarro.latitudine)}, {JSON.stringify(posizioneCarro.longitudine)}, ultimo aggiornamento:{posizioneCarro.updated}</>
          : null
        }
        
        <br/>
        {JSON.stringify(location)}
      </h6>
      
      <p>Made by @_emaahh_</p>
    </main>
  )
}
