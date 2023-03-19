import './App.css';
import React, { useEffect, useState } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine,} from 'victory';

function GetDomainRange(records) {
  var lowY = 1000
  var highY  = 1

  function updateDomainRange(record) {

    if(record.DownloadSpeed > highY) {
      highY = record.DownloadSpeed
    }

    if(record.DownloadSpeed < lowY) {
      lowY = record.DownloadSpeed
    }
  }

  records.forEach(updateDomainRange)
  return [ lowY, highY ]
}

function App() {

  const [records, setRecords] = useState([])  

  useEffect(() => {
    fetch("http://localhost:8080/records")
    .then((response) =>
      response.json()
    )
    .then((data) => {
      setRecords(data)
    })
  }, [])

  if (records === undefined || records === null || records.length === 0) return <div>
    <h1>Waiting for some results...</h1></div>

  return (
    <div className="App">
      <h1>t'Internet speed</h1>
      <VictoryChart height={200} width={410} scale={{x: "time", y: "linear"}}>
          <VictoryLine          
          data = {records}
          x = "TimeStamp" 
          y = "DownloadSpeed"
          domain={{x: [0, 100], y: GetDomainRange(records)}}/>
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
