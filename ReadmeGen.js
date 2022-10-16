function generateReadme(health, level, commits) {
    return `
<div style="text-align: center;" >

![health](https://geps.dev/progress/${health})

<img src="./assets/${level}.svg" alt="walle image" style="height:150px" />

### **LEVEL ${level}**
</div>
    `
}

module.exports = { generateReadme }
