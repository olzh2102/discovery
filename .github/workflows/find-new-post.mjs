import {$} from 'zx';

console.log("🚀 ~ file: find-new-post.mjs:4 ~ process.env.SHA:", process.env.SHA)
const {stdout: modifiedFiles} = await $`git diff --name-only --diff-filter=AM HEAD^ HEAD`
const newPostName = modifiedFiles.split('\n').find((file) => file.includes('src/content/post/en'))
console.log("🚀 ~ file: find-new-post.mjs:6 ~ newPostName:", newPostName)

$`echo link=${JSON.stringify(typeof newPostName === 'undefined' ? '' : newPostName)} >> ${process.env.GITHUB_OUTPUT}`;

