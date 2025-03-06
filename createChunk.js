import SparkMD5 from "spark-md5";

export function createChunk(file, index, chunkSize) {
  return new Promise(resolve => {
    const start = index * chunkSize; // 每块分片开始位置
    const end = start + chunkSize;// 每块分片结束位置
    const spark = new SparkMD5.ArrayBuffer(); // 创建MD5存储对象
    const fileReader = new FileReader(); // 读取并返回每块分片内容
    const blob = file.slice(start,end); // 获取每块分片二进制内容

    fileReader.onload = (e)=>{
      spark.append(e.target.result);// 追加每块分片内容到MD5存储对象
      resolve({
        start,
        end,
        index,
        hash:spark.end(),
        blob,
      });
    };
    fileReader.readAsArrayBuffer(blob);
  })
}
