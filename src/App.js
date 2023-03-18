import './App.css';
import React, { useEffect, useState } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine,} from 'victory';

function App() {

  const [records, setRecords] = useState([])  
  const [ready, setReady] = useState(false)
  const [highY, setHighY] = useState(1)
  const [lowY, setLowY] = useState(1000)

  console.log("Fetching")
  useEffect((lowY) => {
    console.log("Fetching.")
    fetch("http://localhost:8080/records")
    .then((response) =>
      response.json()
    )
    .then((data) => {
      setRecords(data)
      var lowY = 1000
      var highY = 0

      function updateDomainRange(record) {
        console.log("record.DownloadSpeed > highY "+record.DownloadSpeed + " > "+ highY)
        
        if(record.DownloadSpeed > highY) {
          highY = record.DownloadSpeed
        }

        if(record.DownloadSpeed < lowY) {
          lowY = record.DownloadSpeed
        }
      }
      data.forEach(updateDomainRange)
      console.log("High / Low "+highY+" / "+lowY)
      setHighY(highY * 1.2)
      setLowY(lowY * .8)
      setReady(true)
    })
  }, [])

  console.log("Ready "+ready+" : "+{ready})
  if (!ready) return <div>
    <h1>Loading...</h1></div>

  return (
    <div className="App">
      <h1>t'Internet speed</h1>       
      <VictoryChart height={200} width={410} scale={{x: "time", y: "linear"}}>
          <VictoryLine          
          data = {records}
          x = "TimeStamp" 
          y = "DownloadSpeed"
          domain={{x: [0, 100], y: [lowY, highY], }}/>
          <VictoryAxis style={{
            tickLabels: {fontSize: 8, verticalAnchor:"start", angle:270},
            ticks: {stroke: "grey", size: 5},
          }} 
          label={"Time"} tickCount={3} tickFormat={(t) => {
            var date = new Date(t)
            return date.getDate() + " " + date.getHours()+":"+date.getMinutes()
            }}/>            
          <VictoryAxis dependentAxis label={"Speed Mbs"} />
          
      </VictoryChart>
    </div>
  );
}

export default App;
