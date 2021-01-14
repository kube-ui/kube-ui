import './App.css'

import App from './App'
import React from 'react'
import { render } from 'react-dom'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

render(<App />, document.getElementById('root'))
