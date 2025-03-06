import { cutFile } from './cutFile.js'

const inputFile = document.querySelector('input[type="file"]');

inputFile.onchange = async (e) => {
  const file = e.target.files[0];
  console.time('chunkFile');// 统计耗时
  const chunks = await cutFile(file);
  console.timeEnd('chunkFile');// 结束统计耗时
  console.log(chunks);
}
