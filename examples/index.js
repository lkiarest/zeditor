import { create } from '../src/index'
import './index.css'

// require('../vendor/classList')

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)

create(container)
