import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './style.css'

class Boundary extends React.Component{
  state={e:null}
  static getDerivedStateFromError(e){return{e}}
  render(){return this.state.e?<pre style={{padding:20,color:'red',whiteSpace:'pre-wrap'}}>{String(this.state.e.stack||this.state.e)}</pre>:this.props.children}
}
createRoot(document.getElementById('root')).render(<Boundary><App/></Boundary>)
