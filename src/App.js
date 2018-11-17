import React, { Component } from 'react'

import GitHubReadme from './lib/zenchi-github-readme'

import './App.css'

export default class App extends Component {
  componentDidMount() {
    const readMe = 'https://raw.githubusercontent.com/ChimeraZen/zenchi-videoplayer/master/README.md'
    
    fetch(readMe)
      .then(res => res.text())
      .then(md => {
        this.setState({ md })
      })
  }
  
  render() {
    return this.state !== null 
      ? <div className="App">
          <header>
            <h1>ZenChi GitHub Readme</h1>
          </header>
        
          <GitHubReadme file={this.state.md} />
        </div>
      : <div>Loading Component...</div>
  }
}
