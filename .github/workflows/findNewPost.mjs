import {$} from 'zx';

console.log(process.env.SHA)
const modified = await $`git diff --name-only HEAD^ HEAD`
console.log("🚀 ~ file: findNewPost.mjs:6 ~ modified:", modified)
