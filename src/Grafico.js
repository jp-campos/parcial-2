import React, {useState, useEffect, useRef} from "react"
import * as d3 from 'd3';
import './bootstrap.min.css';



const width = 700;
const height = 500;
const margin = { top:10, left:50, bottom: 40, right: 10};
const iwidth = width - margin.left - margin.right;
const iheight = height - margin.top -margin.bottom;


function Grafico(props){

    const d3Container = useRef(null);

    function maximo(data){
        let max = 0
        data.forEach(el=>{
            if (el.height > max){
                max = el.height 
            }
            
        })
        return max
    }

    function draw(data, g){

        let max = maximo(data)
      
        const y = d3.scaleLinear() 
        .domain([0, max])
        .range([iheight, 0]);
        
        const x = d3.scaleBand()
        .domain(data.map(d => d.name) ) 
        .range([0, iwidth])
        .padding(0.1); 
        
        const bars = g.selectAll("rect").data(data);
        
        bars.enter().append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("height", d => iheight - y(d.height))
        .attr("width", x.bandwidth())  
        
        g.append("g")
        .classed("x--axis", true)
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0, ${iheight})`);  
        
        g.append("g")
        .classed("y--axis", true)
        .call(d3.axisLeft(y));
    }

    useEffect(()=>{
        
        const svg = d3.select(d3Container.current)
        if(svg){
            let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
            draw(props.data,g)
        }

    },[props.online])


if(!props.online){
    return (
        <h2 className="text-center text-danger">offline :(</h2>
    )
}else{
    return( <svg height={height} width={width} className="d3-component" ref={d3Container}></svg>)

}



}


export default Grafico