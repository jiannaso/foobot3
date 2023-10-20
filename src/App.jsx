import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./components/Background";
import { OrbitControls } from "@react-three/drei";
import { Cubes } from "./components/Cubes";
// import { importedSocket } from "../socket";

function App() {
  
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameFull, setGameFull] = useState(false); // Track if the game is full


  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const newSocket  = new WebSocket('wss://foobotgame.glitch.me'); // Replace with your server URL

    // Set up event listeners for the WebSocket
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

   /*old
   
   newSocket.onmessage = (event) => {
      // Handle incoming messages from the server
      console.log('Received message from server:', event.data);
    }; */

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Player 1 or Player 2
      if (data.playerNumber === 1 || data.playerNumber === 2) {
        console.log(`You are Player ${data.playerNumber}`);
        


      // Third person 
      } else {
        console.log("There are two players in the game already. Please try again later");
        setGameFull(true); // Set gameFull to true
        newSocket.close();
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Save the socket in the component state
    setSocket(newSocket);

    // Clean up the socket when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return (

    <>
      <Canvas camera={{ fov: 45, position: [-10, 10, 10] }}>
        <color attach="background" args={["#white"]} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.15} />
        <Background />
        <Cubes />
      </Canvas>
   </>
 );
}

export default App;