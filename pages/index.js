import { useEffect, useState } from "react";
import styled from "styled-components";
import Wheel from "../components/wheel";


const PageWrapper = styled.div `
min-height: 100vh;
min-width: 100vw;
background-color: #efefef;
overflow: auto;
margin: 0;
`

export default function Home() {
  const [position, setPosition] = useState([850, 250]);
  const [origin, setOrigin] = useState("Kpop");
  const [nodes, setNodes] = useState(null)
  const [history, setHistory] = useState(null);

  
  useEffect(() => {
    getResults(origin);
    setHistory([{title: origin, position: position}])
  }, [])
  async function getResults(newQuery) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newQuery, history: history ? history.slice(-1)[0].title : ""}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      let results = data.result.split(", ");
      setNodes([...results])
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }
  function updateOrigin(e, i) {
    e.preventDefault();
    setOrigin(nodes[i])
    getResults(nodes[i]);
    setPosition([e.clientX, e.clientY]);
    setHistory(history => [...history, {title: nodes[i], position: [e.clientX, e.clientY]}])

  }

  return (
    <PageWrapper>
        {nodes && 
          <Wheel data={nodes} position={position} origin={origin} onClick={updateOrigin} />
        }
         {
          history &&
          history.map((h) => (
            <HistoryEl data={h.title} position={h.position}/>
          ))
         }
        
    </PageWrapper>
  );
}



function HistoryEl({data, position}) {
  const HistoryWrapper = styled.div `
    position: absolute;
    left: ${position[0]}px;
    top: ${position[1]}px;
    color: grey;
    transform: translate(-50%, -50%);
    user-select: none;
  
  `
  return(
    <HistoryWrapper>
      {data}
    </HistoryWrapper>
  )
}