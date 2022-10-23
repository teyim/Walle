function generateReadme(health, level, commits) {
    commits=commits>0?commits:0;
    return `
<div style="text-align: center;" >

![walle image](https://facile-one.vercel.app/api/og?level=${level}&commits=${commits}&health=${health})

</div>
    `
}

module.exports = { generateReadme }
