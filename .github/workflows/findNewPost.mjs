import {$} from 'zx';

console.log(process.env.SHA)
const {stdout: modifiedFiles} = await $`git diff --name-only --diff-filter=AM HEAD^ HEAD`
const newPostName = modifiedFiles.split('\n').find((file) => file.includes('src/content/post/en'))

$`echo link=${JSON.stringify(newPostName)} >> ${process.env.GITHUB_OUTPUT}`;

