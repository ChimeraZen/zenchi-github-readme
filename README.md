# ZenChi GitHub Readme
  
**Description**:  The ZenChi GitHub Readme component uses a raw file of GitHub markdown and recreates a facsimile of how GitHub displays markdown

**Version**:      [0.1.1](#v011)  
**Author**:       Elijah Liedtke (Chimera.Zen)  
**Email**:        [chimera.zen@gmail.com](mailto:chimera.zen@gmail.com)  
**Link**:         https://github.com/ChimeraZen/zenchi-github-readme

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
1. Navigate to your app directory and install the ZenChi GitHub Readme package using:
```
npm i zenchi-github-readme
```
2. Once installed, ZenChi components can be imported using this syntax:
```
import <GitHubReadme file={raw-github-file-as-string} /> from 'github-readme'
```
&nbsp;
### Updating
1. Navigate to your app directory and enter:
```
npm update zenchi-github-readme
```
&nbsp;
### Uninstall
1. Navigate to your app directory and enter:
```
npm uninstall zenchi-github-readme
```

&nbsp;
## Components

### Progress
The ZenChi GitHub Readme component uses a raw file of GitHub markdown and recreates a facsimile of how GitHub displays markdown. The file can be an import or fetched from the raw URL provided by GitHub

This component can be initialized using `import GitHubReadme from 'zenchi-github-readme'`

```  
<GitHubReadme file={this.state.md} />
```


### Parameters

Name        |Type     |Default|Syntax                                      |Description
------------|---------|-------|--------------------------------------------|-------------------------------
file        |string   |       |                                            |File can be imported or fetched from raw readme URL on GitHub


&nbsp;
## ChangeLog
### v0.1.1
* Parses raw GitHub Readme file as string and outputs a facsimile of how GitHub displays readme.md files
* Some issues with parsing task lists, etc. and some styling isn't quite right



### v0.1.0
* Initial Commit and NPM package test
