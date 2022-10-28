const fs = require("fs");
require("dotenv").config();
const octokit = require("@octokit/core");
const ReadmeGen = require("./ReadmeGen")



const client = new octokit.Octokit({ auth: process.env.GH_ACCESS_TOKEN })

let walleStats;
// let ReadMe_DATA;

fs.readFile("./walle.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err);
        return;
    }
    try {
        walleStats = JSON.parse(jsonString);
    } catch (err) {
        console.log("Error parsing JSON string:", err);
    }
});



const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

let commitsToday = -2;

async function getRecentCommits() {
    try {
        let repos = await client.request('GET /user/repos', { sort: "updated", per_page: "100" });
        // for (const repo of repos.data) {
        //     let res = await client.request('GET /repos/{owner}/{repo}/commits', {
        //         owner: repo.owner.login,
        //         repo: repo.name,
        //         since: yesterday.toISOString()
        //     })
        //     const modifiedRes = res.data.map(commit => commit.author.login).length;
        //     commits += modifiedRes
        // }

        //get array of promises
        const commitPromise = repos.data.map(repo => {
            //get commits from last 24 hours by done by me
            return client.request('GET /repos/{owner}/{repo}/commits', {
                owner: repo.owner.login,
                repo: repo.name,
                since: yesterday.toISOString()
            })
        })
        try {
            // get resolved/rejected promise
            const allCommits = await Promise.all(commitPromise);
            for (const reponse of allCommits) {
                //filter to get commits number
                const commitCount = reponse.data.filter(commit => commit.author.login === "teyim").map(commit => commit.author.login).length
                console.log(commitCount)
                commitsToday += commitCount
            }
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        console.log(error)
    }
    console.log(commitsToday)
    updateStats()
}

function updateStats() {
    if (walleStats.level === 12 && walleStats.health === 100) {
        return
    }
    if (commitsToday === -2) {
        if (walleStats.health !== 0) {
            if (walleStats.health >= 20) {
                walleStats.health = walleStats.health - 25
            }
            walleStats.health = 0
        }
        if (walleStats.level !== 1) {
            walleStats.level = walleStats.level - 1
        }
        walleStats.health = 0

    }
    else{
    const newHealth = commitsToday * 2
    walleStats.health = walleStats.health + newHealth
    while (walleStats.health > 100) {
        walleStats.level = walleStats.level + 1
        walleStats.health = walleStats.health - 100
    }
    }
    console.log(walleStats)
    const jsonString = JSON.stringify(walleStats)
    fs.writeFileSync('./walle.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
    fs.writeFileSync('./README.md', ReadmeGen.generateReadme(walleStats.health, walleStats.level, commitsToday), err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}




getRecentCommits();
