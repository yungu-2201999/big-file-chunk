const CHUNK_SIZE = 1024 * 1024 * 5; // 1MB
const THREAD_COUNT = navigator?.hardwareConcurrency || 4; // 定义线程数

export async function cutFile(file) {
return new Promise(resolve => {
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE); // 获取分片总数
  const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT); // 拿到每个线程分片数
  const result = [];
  let finishedCount = 0; // 完成的分片数

  for (let i = 0; i < threadChunkCount; i++) {
    // 创建线程，并分配任务
    const worker = new Worker("./worker.js", {
      type: "module",
    })
    const start = i * threadChunkCount;// 计算开始位置
    const end = Math.min((i + 1) * threadChunkCount, chunkCount); // 计算结束位置
    // 需要穿过去的参数有：文件file、分片大小CHUNK_SIZE、开始位置start，结束位置end
    worker.postMessage({
       file,
       CHUNK_SIZE,
       start,
       end,
    }); // 向线程发送任务

    worker.onmessage = e => {
        for(let i = start;i< end;i++){
          result[i] = e.data[i-start]; // 存放分片
        }
        worker.terminate(); // 关闭线程
        finishedCount++; // 完成的分片数+1
        if(finishedCount === threadChunkCount){//  全部完成后
          console.log("chunkCount", chunkCount);
          resolve(result); // 返回分片数组
        }
    }
}})

  
  /* 以下代码能够完成分片任务，但是由于大量计算任务都分配给了主线程，会导致浏览器卡顿 */
  // for (let i = 0; i < chunkCount; i++) {// 循环分片
  //  const chunk = await createChunk(file, i, CHUNK_SIZE); // 创建分片
  //  result.push(chunk); // 存放分片
  // }
  // console.log("chunkCount", chunkCount);
  // return result;
}
