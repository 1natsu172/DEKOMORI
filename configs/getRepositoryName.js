// Get reposiroty name for deploying to vendor domain(not custom domain).
const cp = require('child_process')

const getRepositoryName = () => {
  const repositoryURL = process.env.REPOSITORY_URL // running on the netlify's node?
    ? process.env.REPOSITORY_URL // for Netlify
    : cp.execSync('git remote -v', { encoding: 'utf-8' }) // for local
  // ↑ At this point: 'git@github.com:username/repositoryName.git'

  let repoName = null
  repositoryURL.replace(/github.com:(\S+)(\.git)?/, (_, m) => {
    repoName = m.replace(/\.git$/, '')
  })
  // ↑ At this point: 'username/repositoryName'
  repoName = repoName.substr(repoName.lastIndexOf('/') + 1) // pick only repository name.
  // ↑ At this point: 'repositoryName'

  return repoName
}

module.exports = getRepositoryName()
