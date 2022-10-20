function generateReadme(health, level, commits) {
    return `
<div style="text-align: center;" >

![walle image](https://facile-one.vercel.app/api/og?level=${level}&commits=${commits}&health=${health})

</div>
    `
}

module.exports = { generateReadme }
