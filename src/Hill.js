import { useEffect, useRef, useState } from 'react';
import './App.css';
import cloud from './assets/cloud.png'
function Hill(props){

    const screen = {
        width: 1000,
        height: 500
    }

    const [ctx, setCtx] = useState();
    const [images, setImages] = useState([]);
    const canvasRef = useRef(null)

    useEffect(() => {
        const _images = [];
        props.data.forEach(element => {
            var image = new Image(64, 64);
            image.src = element.image;
            _images.push(image)
        });

        const canvasObj = canvasRef.current;
        const _ctx = canvasObj.getContext('2d');
        setCtx(_ctx);
        setImages(_images);
    }, [])
    
    useEffect(() => {
        if(typeof ctx !== 'undefined'){
            //ctx config
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.fillStyle = 'green';
            drawHill();

        }
    }, [ctx])

    useEffect(() => {
        if(typeof images !== 'undefined' && images.length > 0){

            images.slice(-5);
            const pos = [600, 450, 750, 300, 150, 900, 0]

            images.forEach((element, index) => {
                element.onload = () => {
                    ctx.drawImage(element, pos[index], 340)
                }
            })

        }
    }, [images])

    function drawHill(){
        for (let i = 0; i < 1000; i = i + 10) {
            ctx.fillStyle = '#357307';
            ctx.fillRect(i, (Math.sin(i / 10) * 2) + 400, 10, 5)
            ctx.fillStyle = '#64CD0E';
            ctx.fillRect(i, (Math.sin(i / 10) * 2) + 403, 10, 2)
    
            ctx.fillStyle = '#499A08';
            ctx.fillRect(i, (Math.sin(i / 10) * 2) + 405, 10, 5)
            ctx.fillRect(i, (Math.sin(i / 10) * 2) + 409, 10, 10)
    
        }
        ctx.fillRect(0, 410, 1000, 100)

        const cloudImg = new Image();
        cloudImg.src = cloud;
        cloudImg.onload = drawClouds;

        function drawClouds(){
            ctx.drawImage(cloudImg, 40, 30, 128, 128)
            ctx.drawImage(cloudImg, 240, 30, 128, 128)
            ctx.drawImage(cloudImg, 440, 30, 128, 128)
            ctx.drawImage(cloudImg, 640, 30, 128, 128)
            ctx.drawImage(cloudImg, 840, 30, 128, 128)
        }
    }
    

    return(
        <div>
            <canvas width='1000px' height='500px' className="canvasBg" ref={canvasRef}/>
            
        </div>
    )
}

export default Hill;