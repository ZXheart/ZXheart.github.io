export default function jsonp(url: string, params: object) {
  // 1.拼接url
  const paramsStr = Object.keys(params).map(key => (`${key}=${params[key]}`)).join('&')
  const callbackName = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
  const jsonpUrl = `${url}?callback=${callbackName}${paramsStr ? `&${paramsStr}` : ''}`

  // 2.创建Promise对象
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = jsonpUrl;

    // 3. 创建全局函数
    (window as any)[callbackName] = function (data: any) {
      resolve(data)
      // 4.删除脚本标签和全局函数
      script.remove()
      delete (window as any)[callbackName]
    }

    document.body.appendChild(script)
  })
}
