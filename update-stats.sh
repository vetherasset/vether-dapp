setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
  git remote add upstream https://${GH_TOKEN}@github.com/vetherasset/vether-dapp.git
  git checkout master
  git pull upstream master
}

upload_stats() {
  git add .
  git commit --message "Update Stats: $TRAVIS_BUILD_NUMBER"
  git push upstream master
}

setup_git
upload_stats
