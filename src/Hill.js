import { useEffect, useRef } from 'react';
import './App.css';
function Hill(){

    const canvasRef = useRef(null)

    useEffect(() => {
        
        const canvasObj = canvasRef.current;

        const ctx = canvasObj.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 10, 10)
    }, [])
    


    return(
        <div>
            <canvas width="400px" height="400px" className="canvasBg" ref={canvasRef}/>
            
        </div>
    )
}

export default Hill;