import {$} from 'zx';

console.log(process.env.SHA)
const modified = await $`git diff --name-only ${process.env.SHA}^1 ${process.env.SHA}`
console.log("🚀 ~ file: findNewPost.mjs:6 ~ modified:", modified)
