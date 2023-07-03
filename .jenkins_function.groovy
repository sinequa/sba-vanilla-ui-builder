// Useful Jenkins functions

// get the branch name and the version number from the right jenkins variable 
def findBranchNumber() {
    def tmpBranch=""
    def theBranch=""
    // PR : 
    //   BRANCH_NAME: PR-8208
    //   CHANGE_TARGET: release/11.7.0
    // BRANCH
    //   BRANCH_NAME: develop
    //   BRANCH_NAME: release/11.7.0
    // return: release%2F11.7.0

    echo "Triggering job for branch ${env.BRANCH_NAME}"
    if (env.BRANCH_NAME.contains("PR-")) {
        tmpBranch = env.CHANGE_TARGET
    } else {
        tmpBranch = env.BRANCH_NAME
    }
    echo "tmpBranch: ${tmpBranch}"

    theBranch = tmpBranch.replace("/", "%2F")
    echo "Branch returned: ${theBranch}"
    return theBranch
}

// function to check if we are in PR or another branch
def buildOrMerge() {
    def typeAction = ""
    if (env.BRANCH_NAME.contains("PR-")) {
        typeAction = "build"
    } else {
        typeAction = "merge"
    }
    return typeAction
}

// function to append lines to the end of a file
def appendFile(afile, what) {
    def content = ''
    def txt = ''
    try {
        if (fileExists(afile)) {
            content = readFile afile
            what.each {
                txt += it + "\n"
            }
            content += txt
            writeFile file: afile, text: content
        }
    } catch (err) {
        currentBuild.result = 'FAILURE'
        throw err
    }
}

return this
