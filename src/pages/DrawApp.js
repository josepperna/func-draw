import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ChromePicker } from 'react-color'
import $ from 'jquery'
import Draw from '../components/Draw.js'

import './DrawPage.scss'
import './DrawApp.scss'

function postToDB(user, functions){
  var data = {
      "TableName": "mainBackendTable",
      "Item": {
          "drawingID": {
              "S": user + functions
          },
          "user": {
              "S": user
          },
          "functions": {
              "S": functions  
                  
          }
      }
  }
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://pjgf4yqxo7.execute-api.eu-west-3.amazonaws.com/default/hackBackend",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",   
      },
      "processData": false,
      "data": JSON.stringify(data)
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
}


class DrawApp extends Component {
    
    state = {
        displayColorPicker: false,
        color:"#00000",
        size:1,
        text:'',
        name:'', 
        actions:[

        ]
      };
      constructor(props){
        super(props);
        this.drawEle = React.createRef();
        this.state.name = this.props.location.state.name;
        console.log(this.state.name);
        
      }
      handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
    
      handleClose = () => {
        this.setState({ displayColorPicker: false })
      };
      handleChange = (color) =>{
        this.setState({ color: color.hex })
      }
      handleDraw=()=>{
        this.state.actions.push(
          this.state.text+','+this.state.color+','+this.state.size
        )
        this.drawEle.current.drawFunc(
          this.state.text,
          this.state.color,
          this.state.size
          
          
          );
        console.log(this.state.actions);
      }
      changeFunction=(e)=>{
        this.setState({text:e.target.value})
      }
      updateNumber=(e)=>{
        this.setState({size:e.target.value})
      }
      submitImg=(e)=>{
        e.preventDefault();
        postToDB(this.state.name, this.state.actions.join(';'))
        alert('Great Success!')
      }
      

      
      
      
      render() {
        const popover = {
          position: 'absolute',
          zIndex: '2',
        }
        const cover = {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }

        return (
          <div className='container'> 
            <div className='draw-form'>
                <p>
                <label>
                    Function:
                </label>
                <input type="text" value={this.state.text} onChange={this.changeFunction} />
                
                </p>
                

            <div className='flex-row'>
                <input type="submit" value="Draw" onClick={ this.handleDraw } />
                <div className='input-box'>
                    <input type="number" value={this.state.size} onChange={this.updateNumber}/>

                    <button  onClick={ this.handleClick } style={{backgroundColor:this.state.color}}></button>
                        { this.state.displayColorPicker ? <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClose }/>
                        <ChromePicker color={ this.state.color } onChange={ this.handleChange } />
                        </div> : null }

                </div> 
            </div>

            </div>
            <div className='draw-container'>
              <Draw ref={this.drawEle} canvas='cnv-2'></Draw>
            </div>

            <div>

              <form onSubmit={this.submitImg}>
                <input type='submit' value='Share'>

                </input>
              </form>

            </div>


   
          </div>
        )
      }
}

export default DrawApp;