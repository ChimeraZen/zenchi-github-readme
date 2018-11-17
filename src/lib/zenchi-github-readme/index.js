import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

export default class GitHubReadme extends Component {
  state = {
    md: '',
    closingElements: []
  }

  readmeRef = React.createRef()


  componentDidMount() {
    this.lineRef = ''
    this.openElements = []
    this.newLines = []
    this.processReadme(this.props.file)
  }
  

  // Begin processing the GitHub Readme file
  processReadme = (file) => {
    const lines = file.split(/\r\n|\r|\n/)
    
    lines.forEach((line, i) => {
      const prevLine = lines[i - 1],
            nextLine = lines[i + 1] !== undefined ? lines[i + 1] : false
      
      let newLine = line
      
      // If next line is a space/nbsp; Close all open elements except code quotes from last to first and start next line
      if(this.checkForSpaceBreak(newLine)) { newLine = this.processSpaceBreak(newLine, nextLine) }
      
      // If true, line is a quoting - 1
      if(/(```|`)/.test(newLine)) { newLine = this.processQuoting(newLine) }
      
      // If true, line has < * >
      if(/<(.*?)\/>/.test(newLine)) {
        newLine = newLine.replace('<', '&lt;').replace('>', '&gt;')
      }
      
      // If true, line has a link
      if(/\[(.*?)\]\((.*?)\)/.test(newLine)) { newLine = this.processLinks(newLine) }

      
      // If true, line is a heading - 3
      if(/^#+\s{1}/.test(newLine)) { newLine = this.processHeadings(newLine) }

      // If true, line has non-markdown link
      if(/(http:\/\/|https:\/\/)/.test(newLine)) {
        const link = newLine.match(/(http:\/\/|https:\/\/)(.*?)+(\s|\"|\'|)/)[0],
              otherLines = newLine.split(link)
        newLine = otherLines[0] + '<a href="' + link + '">' + link + '</a>' + otherLines[1]
      }
      
      // If true, line is an <hr /> element - 4
      if(/^---$/.test(newLine)) { newLine = '<hr />' }

      
      // If true, line is a table element
      if(/(([a-zA-Z])(.*?)\||(-+\|-+))/.test(newLine)) { newLine = this.processTables(newLine, nextLine) }
      
      
      // If true, line has styling
      if(/(\*|_|~~)/.test(newLine)) { newLine = this.processStyling(newLine) }
      
      
      // If true, line is a list item (NOT CHECKING FOR TASK LIST!!!!)
      if(/^(\s+|)(((([a-z]|[A-Z]|[0-9])\.\s{1}))|([-*]\s{1}))/.test(newLine)) { newLine = this.processListItem(newLine, prevLine, nextLine) }

      
      // If true, line ends with a <br /> element - this might be better suited inside the else (paragraph) section after all other styling has been done
      if(/\s{2}$/.test(newLine)) { newLine = newLine.replace(/\s{2}$/, '<br />') }
      
      this.lineRef = this.lineRef + newLine
    })
    
    this.readmeRef.current.innerHTML = this.lineRef
  }
  
  handleScrollTo = (e) => {
    console.log(e)
  }
  
  // Get List type
  getListType = (line) => {
    const ol1 = /^(\s+|)([0-9][.]\s{1})/,
          ola = /^(\s+|)([a-z][A-Z][.]\s{1})/,
          ulh = /^(\s+|)([-]\s{1})/,
          ula = /^(\s+|)([*]\s{1})/
    
    if(ol1.test(line)) {
      return 'number'
    } else if(ola.test(line)) {
      return 'alphabet'
    } else if(ulh.test(line)) {
      return 'hyphen'
    } else if(ula.test(line)) {
      return 'asterisk'
    } else {
      return false
    }
  }
  
  
  // Is it a space/nbsp
  checkForSpaceBreak = (line) => {
    return (line === '' || line === '&nbsp;' || /^\s+$/.test(line)) ? true : false
  }
  
  checkForLineBreak = (line) => {
    // Include check for Table
    return (/^---/.test(line) || /^#+\s{1}/.test(line)) ? true : false
  }
  
  
  
  /**** Processes ****/
  
  // Process space/nbsp
  processSpaceBreak = (line, nextLine=false) => {
    let newLine = line,
        i = this.openElements.length
      
    if(i > 0) {
      while(i - 1 >= 0) {
        switch(this.openElements[i - 1]) {
          case '<ol>':
            newLine = '</li></ol>'
          break;

          case '<ul>':
            newLine = '</li></ul>'
          break;
            
          case '<p>':
            newLine = '</p>'
            if(!this.checkForLineBreak(nextLine) && !this.checkForSpaceBreak(nextLine)) {
              newLine = '<p>'
            }
          break;
            
          default:
          break;
        }
        
        this.openElements.splice(i - 1, 1)
        i--
      }
      
    } else {
      if(!this.checkForLineBreak(nextLine) && !this.checkForSpaceBreak(nextLine)) {
        newLine = '<p>'
        this.openElements.push('<p>')
      }
    }
    
    return newLine
  }
  
  // Process tables
  processTables = (line, nextLine) => {
    let newLine = '',
        rows = []
    
    if(this.openElements.indexOf('<table>') === -1) {
      newLine = '<table>'
      this.openElements.push('<table>')
    }
    
    // If true, current line is table head row
    if(/-+\|-+/.test(nextLine)) {
      rows = line.split('|')
      newLine += '<thead><tr>'
      rows.forEach(row => {
        newLine += '<th>' + row.trim() + '</th>'
      })
      newLine += '</tr></thead><tbody>'
    } else if(this.checkForSpaceBreak(nextLine) || this.checkForLineBreak(nextLine)) {
      rows = line.split('|')
      newLine += '<tr>'
      rows.forEach(row => {
        newLine += '<td>' + row.trim() + '</td>'
      })
      newLine += '</tr></tbody></table>'
    } else if(!/-+\|-+/.test(line)) {
      rows = line.split('|')
      newLine += '<tr>'
      rows.forEach(row => {
        newLine += '<td>' + row.trim() + '</td>'
      })
      newLine += '</tr>'
    }
    
    return newLine
  }
  
  // Process links
  processListItem = (line, prevLine, nextLine) => {
    const prevLineType = this.getListType(prevLine),
          lineType = this.getListType(line),
          nextLineType = this.getListType(nextLine),

          prevSpaceCount = prevLineType ? prevLine.match(/^[\s]*/g) : 0,
          lineSpaceCount = line.match(/^[\s]*/g),
          prevIndent = prevSpaceCount ? prevSpaceCount[0].length : 0,
          lineIndent = lineSpaceCount ? lineSpaceCount[0].length : 0
    
    let newLine = line
    
    // If there are no open Lists in openElements
    if(this.openElements.indexOf('<ol>') === -1 && this.openElements.indexOf('<ul>') === -1) {

      // Create new List and add to list and openElements
      switch(lineType) {
        case 'number':
        case 'alphabet':
          newLine = '<ol><li>' + line.substring(line.match(/[.]\s{1}/).index + 1)
          this.openElements.push('<ol>')
        break;

        case 'hyphen':
        case 'asterisk':
          newLine = '<ul><li>' + line.substring(line.match(/[-*]\s{1}/).index + 1)
          this.openElements.push('<ul>')
        break;

        default:
        break;
      }

    // If there IS an open Lists in openElements
    } else if(this.openElements.indexOf('<ol>') > -1 || this.openElements.indexOf('<ul>') > -1) {

      // Previous line is a List Item
      if(prevLineType) {

        // If line is in same list as previous 
        if(prevIndent === lineIndent) {

          // Close previous line and add current line
          switch(lineType) {
            case 'number':
            case 'alphabet':
              newLine = '</li><li>' + line.substring(line.match(/[.]\s{1}/).index + 1)
            break;

            case 'hyphen':
            case 'asterisk':
              newLine = '</li><li>' + line.substring(line.match(/[-*]\s{1}/).index + 1)
            break;

            default:
            break;
          }

        // Line is in higher-order List
        } else if(prevIndent > lineIndent) {

          // Close previous line and previous list before removing List from openElements
          switch(lineType) {
            case 'number':
            case 'alphabet':
              newLine = '</li></ol><li>' + line.substring(line.match(/[.]\s{1}/).index + 1)
              this.openElements.splice(this.openElements.lastIndexOf('<ol>'), 1)
            break;

            case 'hyphen':
            case 'asterisk':
              newLine = '</li></ul><li>' + line.substring(line.match(/[-*]\s{1}/).index + 1)
              this.openElements.splice(this.openElements.lastIndexOf('<ul>'), 1)
            break;

            default:
            break;
          }

        // Line is a new List
        } else {
          // Create new List and add to list and openElements
          switch(lineType) {
            case 'number':
            case 'alphabet':
              newLine = '<ol><li>' + line.substring(line.match(/[.]\s{1}/).index + 1)
              this.openElements.push('<ol>')
            break;

            case 'hyphen':
            case 'asterisk':
              newLine = '<ul><li>' + line.substring(line.match(/[-*]\s{1}/).index + 1)
              this.openElements.push('<ul>')
            break;

            default:
            break;
          }
        }

      // Previous line is NOT a List Item
      } else {

        // Close previous List Item and add current line
        switch(lineType) {
          case 'number':
          case 'alphabet':
            newLine = '</li><li>' + line.substring(line.match(/[.]\s{1}/).index + 1)
          break;

          case 'hyphen':
          case 'asterisk':
            newLine = '</li><li>' + line.substring(line.match(/[-*]\s{1}/).index + 1)
          break;

          default:
          break;
        }
      }
    }

    return newLine
  }
  
  
  // Process links
  processLinks = (line) => {
    const link = line.split(/\[(.*?)\]\((.*?)\)/)
    return link[0] + '<a href="' + link[2] + '">' + link[1] + '</a>' + link[3]
  }
  
  
  // Find any quoting and replace
  processQuoting = (line) => {
    let newLine = line,
        quoting = ''
    
    const codeQuote = /`+/,
          textQuote = /^>/
  
    if(codeQuote.test(newLine)) {
      if(this.openElements.indexOf('```') === -1 && this.openElements.indexOf('`') === -1) {
        if(/```/.test(newLine)) {
          quoting = line.split(/```/)
          if(quoting.length > 2) {
            newLine = quoting[0] + '<pre><code>' + quoting[1] + '</code></pre>' + quoting[2]
          } else {
            newLine = quoting[0] + '<pre><code>' + quoting[1]
            this.openElements.push('```')
          }
        } else {
          quoting = line.split(/`/)
          if(quoting.length > 2) {
            newLine = quoting[0] + '<code>' + quoting[1] + '</code>' + quoting[2]
          } else {
            newLine = quoting[0] + '<code>' + quoting[1]
            this.openElements.push('`')
          }
        }
      } else {
        if(/```/.test(newLine)) {
          quoting = line.split(/```/)
          newLine = quoting[0] + '</code></pre>' + quoting[1]
          this.openElements.splice(this.openElements.lastIndexOf('```'), 1)
        } else {
          quoting = line.split(/`/)
          newLine = quoting[0] + '</code>' + quoting[1]
          this.openElements.splice(this.openElements.lastIndexOf('`'), 1)
        }
      }
    } else if(textQuote.test(newLine)) {
      newLine = '<blockquote>' + newLine.replace(/>/, '') + '</blockquote>'
    }
    
    return newLine
  }
  
  
  // Find text styles
  processStyling = (line) => {
    let newLine = line
    
    const bold = /(\*{2}|_{2})(.*?)(\*{2}|_{2})/,
          italic = /(\*|_)(.*?)(\*|_)/,
          strikethrough = /~~(.*?)~~/
    
    if(newLine.match(bold)) {
      newLine = newLine.split(/(\*{2}|_{2})/)[0] + '<strong>' + newLine.split(/(\*{2}|_{2})/)[2] + '</strong>' + newLine.split(/(\*{2}|_{2})/)[4]
    }
    
    if(newLine.match(italic)) {
      newLine = newLine.split(/(\*|_)/)[0] + '<em>' + newLine.split(/(\*|_)/)[2] + '</em>' + newLine.split(/(\*|_)/)[4]
    }
    
    if(newLine.match(strikethrough)) {
      newLine = newLine.split(/~~/)[0] + '<del>' + newLine.split(/~~/)[2] + '</del>' + newLine.split(/~~/)[4]
    }
    
    return newLine
  }
  
  
  // Find any header markdown and replace with a React header component
  processHeadings = (line) => {
    let newLine = line.substring(line.match(/#\s{1}/).index + 1)
    
    switch(line.split(/\s{1}/)[0].length) {
      case 1:
        newLine = '<h1 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h1>'
      break;
        
      case 2:
        newLine = '<h2 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h2>'
      break;
        
      case 3:
        newLine = '<h3 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h3>'
      break;
        
      case 4:
        newLine = '<h4 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h4>'
      break;
        
      case 5:
        newLine = '<h5 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h5>'
      break;
        
      case 6:
        newLine = '<h6 id="' + newLine.toLowerCase().replace(' ', '-') + '">' + newLine + '</h6>'
      break;
        
      default:
      break;
    }
    
    return newLine
  }
  
  
  render() {
    return <div className="github-readme" ref={this.readmeRef}></div>
  }
}

GitHubReadme.propTypes = {
  file: PropTypes.string
}
