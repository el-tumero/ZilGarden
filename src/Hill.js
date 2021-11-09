import { useEffect, useRef, useState } from 'react';
import './App.css';
//importing clouds :0
import Clouds from './assets/clouds/index.js'

function Hill(props){

    const screen = {
        width: 1000,
        height: 500
    }

    const [ctx, setCtx] = useState();
    const [images, setImages] = useState([]);
    const [x, setX] = useState();
    const [y, setY] = useState();
    const [canvas, setCanvas] = useState();
    const [positions, setPosition] = useState([]);
    const [pos, setPos] = useState([600, 450, 750, 300, 150, 900, 0])
    const [currentFlower, setCurrentFlower] = useState()
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
        
        setCanvas(canvasObj);
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
            // const pos = [600, 450, 750, 300, 150, 900, 0]
           //console.log(images)

            images.forEach((element, index) => {
                element.onload = () => {
                    ctx.drawImage(element, pos[index], 350)
                    setPosition(oldData => [...oldData, element.currentSrc])
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

        let cloudImgs = []

        for (let i = 0; i < Object.entries(Clouds).length; i++) {
            cloudImgs[i] = new Image();
            cloudImgs[i].src = Clouds['cloud' + i]
            cloudImgs[i].onload = () => {
                ctx.drawImage(cloudImgs[i], 40 + i*200, 35, 128, 128)
            }
        }
    }

    function _onMouseMove(e) {
        let rect = canvas.getBoundingClientRect();
        let _x = e.clientX - rect.left
        let _y = e.clientY - rect.top 
        setX(_x)
        setY(_y)
        
        pos.forEach((cord, index) => {
            if(_x > cord && _x < cord + 64 && _y > 340 && _y < 420){
                if(positions[index]){
                const result = props.data.find(x => x.image_cid == positions[index].slice(21))
                if(result) setCurrentFlower(result.id)
                }
            }            
        })
    }

    function _onMouseDown(e){
        pos.forEach((cord, index) => {
            if(x > cord && x < cord + 64 && y > 340 && y < 420){
                if(positions[index]){
                const result = props.data.find(x => x.image_cid == positions[index].slice(21))
                if(result) window.open(result.uri)
                }
            }
        });
        
    }
    
    

    return(
        <div>  
            <canvas onMouseDown={_onMouseDown} onMouseMove={_onMouseMove} width='1000px' height='500px' className="canvasBg" ref={canvasRef}/>
            
                <h3 className="tokenId">Token ID: {currentFlower}</h3>
                <p className="tokenIdInfo">Click on flower to check its metadata ;)</p>
            

        </div>
    )
}

export default Hill;