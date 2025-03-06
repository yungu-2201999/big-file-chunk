import {createChunk} from './createChunk';
onmessage =async function (e) {
  /**
   * 参数：
   * 文件file
   * 分片大小CHUNK_SIZE
   * 开始位置start
   * 结束位置end
   */

  const {
    file,
    CHUNK_SIZE,
    start,
    end,
    SparkMD5
  } = e.data;
  const proms = [];
  for(let i= start;i< end; i++){
    proms.push(createChunk(file, i, CHUNK_SIZE,SparkMD5));// 在子线程进行hash计算并保存当前线程分块结果
  }
  const chunks = await Promise.all(proms);
  postMessage(chunks);
}
