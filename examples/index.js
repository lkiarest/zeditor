import { create } from '../src/index'
import './index.css'

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)

create(container)
