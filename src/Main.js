import React, {useState, useEffect, useRef} from "react"
import * as d3 from 'd3';
import {IntlProvider, FormattedMessage, FormattedNumber, FormattedDate, FormattedPlural} from 'react-intl'
import './bootstrap.min.css';
import Grafico from "./Grafico";


const urlIng = "https://gist.githubusercontent.com/jhonatan89/2089276d3ce0faceff8e55fc3459b818/raw/30ee1a77b3e328108faaaa9aaac6f2ddaa3d3711/pokemons-en.json" //Cambiar
const urlEsp = "https://gist.githubusercontent.com/jhonatan89/e379fadf8ed0f5381a2d8f8f3dea90c3/raw/e2bc20df02828d297f99558551e37959ac97a6f8/pokemon-es.json" //Cambiar



//Cambiar
const headerEn ={
    image:"Image",
    name:"Name",
    description:"Description",
    height:"Height",
    weight:"Weight",
    type:"Type"
}
//Cambiar
const headerEs ={
    image:"Imagen",
    name:"Nombre",
    description:"Descripción",
    height:"Altura",
    weight:"Peso",
    type:"Tipo"
}


function Main(){

    const d3Container = useRef(null);

    const [datos, setData] = useState([])
    const[lang, setLang] = useState('en')
    const[online, setOnline] = useState(false)
    

 

    useEffect(()=>{
        var userLang = navigator.language || navigator.userLanguage; 
        let url = userLang.includes('es') ? urlEsp : urlIng; 

        setLang(userLang)
        console.log(userLang)


        //const svg = d3.select(d3Container.current)
        //let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);



        fetch(url).then(res=>res.json()).then(res=>{
                setData(res)
                
                localStorage.setItem("datos",JSON.stringify(res));
                if(navigator.onLine){
                   setOnline(true) 
                }
                
        }).catch(e => {
            setOnline(false)
            //Como estaba en el tutorial no me detectaba cuando me desconectaba así que lo hice de esta forma
            if(localStorage.getItem("datos") === null) {
                setData([])
                
            } else {
                setOnline(false)
                if(localStorage.getItem("datos") === null){
                    console.log("No lo tienes guardado, sad")
                }else{
                  console.log(localStorage.getItem("datos"))
                  let datos = JSON.parse(localStorage.getItem("datos"))
                  
                  setData(datos);  
                }
                
            }
           })
        

    },[])


    return (
        <IntlProvider locale={lang} messages={lang.includes('es') ? headerEs: headerEn}>
            <div className="container">
            <table className="table">
            <thead className="thead-dark">
                <tr>
                <th scope="col">#</th>
                <th scope="col"><FormattedMessage id="image"/></th>
                <th scope="col"><FormattedMessage id="name"/></th>
                <th scope="col"><FormattedMessage id="description"/></th>
                <th scope="col"><FormattedMessage id="height"/></th>
                <th scope="col"><FormattedMessage id="weight"/></th>
                <th scope="col"><FormattedMessage id="type"/></th>
                </tr>
            </thead>
            <tbody>
            {datos.map((e,i) =>{
                return(
                <tr key={i}>
                <th  scope="row">{i}</th>
                <td><img src={e.ThumbnailImage} alt={e.ThumbnailAltText}></img></td>
                <td>{e.name}</td>
                <td>{e.description}</td>
                <td>{e.height}</td>
                <td>{e.weight}</td>
                <td>{e.type.map((t,i) =>{return<p key={i} className="badge badge-secondary">{t}</p>})}</td>
                
                </tr>)
              
            })}
                
            </tbody>
            </table>

            <Grafico online={online} data={datos}></Grafico>
           
            </div>

        </IntlProvider>
        

    )




}


export default Main     