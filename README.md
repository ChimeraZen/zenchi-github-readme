# ZenChi Apps
  
**Description**:  ZenChi Apps is a growing collection of reuseable React components that have been
                  built with user-accessibilty in mind to provide the best experience across all platforms

**Version**:      [0.1.2](#v012)  
**Author**:       Elijah Liedtke (Chimera.Zen)  
**Email**:        [chimera.zen@gmail.com](mailto:chimera.zen@gmail.com)  
**Link**:         https://github.com/ChimeraZen/zenchiapps

**Copyright**:    Copyright (c) 2018, Elijah Liedtke  
**License**:      http://www.gnu.org/licenses/old-licenses/gpl-2.0.html

## Table of Contents
1. [Instructions](#instructions)
    1. [Installation](#installation)
    2. [Updating](#updating)
    3. [Uninstall](#uninstall)
2. [Components](#components)
    1. [Progress](#progress)
3. [ChangeLog](#changelog)

---

## Instructions
The following has been provided to assist in installing, updating or removing the ZenChi (pronounced: *zen-Kai*) Apps. Questions, comments, suggestions and concerns are welcome and can be sent to [chimera.zen@gmail.com](mailto:chimera.zen@gmail.com).

I hope you enjoy this app!

&nbsp;
### Installation
1. Navigate to your app directory and install the ZenChi Apps package using:
```
npm i zenchiapps
```
2. Once installed, ZenChi components can be imported using this syntax and replacing `component_name` with the required component:
```
import component_name from 'zenchiapps'

Example: import Progress from 'zenchiapps'
```
&nbsp;
### Updating
1. Navigate to your app directory and enter:
```
npm update zenchiapps
```
&nbsp;
### Uninstall
1. Navigate to your app directory and enter:
```
npm uninstall zenchiapps
```

&nbsp;
## Components

### Progress
The ZenChi Progress component uses React v16.6 and the HTML5 canvas element to draw a radial or linear progress bar that uses the requestAnimationFrame API to ensure a consistent display across platforms.

This component can be initialized using `import Progress from 'zenchiapps'`

```
<Progress 
  title="Example" 
  withBorder
  max={100} 
  percentage={80} 
  speed={2} 
  type='radial'
  lineCap='round'
/>
```


### Parameters

Name        |Type     |Default|Syntax                                      |Description
------------|---------|-------|--------------------------------------------|-------------------------------
title       |string   |false  |string \| false                             |Default is false if no title prop is present
type        |string   |radial |'radial \| bar'                             |Type
max         |number   |100    |                                            |Default max is 100
percentage  |number   |75     |                                            |Default percentage is 75
speed       |number   |1.25   |                                            |Rate of progress increase between requested animation frames
withBorder  |boolean  |false  |true \| false                               |**True** if included as component prop, otherwise default is **false**


&nbsp;
## ChangeLog
### v0.1.0
* Initial Commit and NPM package test
