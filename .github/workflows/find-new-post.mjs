import {$} from 'zx';

const EN_CONTENT_PATH = 'src/content/post/en'
const BASE_POST_URL = 'https://www.botqa.xyz/en/posts'

const { stdout: addedFiles } =
  await $`git diff --name-only --diff-filter=AM ${process.env.SHA}^1 ${process.env.SHA}`

console.log('🚀 ~ file: find-new-post.mjs:4 ~ addedFiles:', addedFiles)
console.log('🚀 ~ file: find-new-post.mjs:4 ~ process.env.SHA:', process.env.SHA)

function getNewPostLink() {
  const newPostPath = addedFiles.split('\n').find((file) => file.includes(EN_CONTENT_PATH))
  console.log("🚀 ~ file: find-new-post.mjs:6 ~ newPostPath:", newPostPath)
  
  if (!newPostPath) return
  
  const lastSlashIndex = newPostPath.lastIndexOf('/')
  const lastDotIndex = newPostPath.lastIndexOf('.')
  const newPostName = newPostPath.slice(lastSlashIndex + 1, lastDotIndex)
  const newPostLink = BASE_POST_URL + '/' + newPostName

  return newPostLink
}

const newPostLink = getNewPostLink()

$`echo link=${JSON.stringify(typeof newPostLink === 'undefined' ? '' : newPostLink)} >> ${process.env.GITHUB_OUTPUT}`;
