# node的练习和笔记
## 基础知识

-  require引入一个包：

   ```javascript
   var foo1 = require('./foo');
   var foo2 = require('./foo.js');
   var foo3 = require('/home/user/foo');
   var foo4 = require('/home/user/foo.js');
   ```

- 引入一个Json

  ```javascript
  var data = require('./data.json');
  ```


- exports

  ```javascript
  exports.hello = function () 
  {
    console.log('hello world');
  }
  ```

  以上代码中，模块默认导出对象被替换为一个函数。

  多次require并不会多次初始化。

  ```javascript
  var i = 0;
  function count()
  {
    return ++i;
  }
  exports.count = count;
  ```

   在main.js中引用

  ```javascript
  var counter1 = require('./counter')
  var counter2 = require('./counter')

  console.log(counter1.count());
  console.log(counter2.count());
  console.log(counter2.count());

  //结果
  //1
  //2
  //3
  说明调用的是其实是同一个文件的同一个函数，并且没有重新初始化
  ```

### 小节：

- NodeJs是一个Js脚本解析器，任何操作系统下安装NodeJs本质上是把Node执行程序复制到一个目录，然后保证这个目录在系统PATH环境变量下，以便终端可以使用node命令。
- NodeJs使用CMD模块系统，主模块作为程序入口，所有模块在执行过程中只**初始化一次**

### 模块路径

#### 寻找规则

1. 内置模块
2. node_modules目录
3. NODE_PATH环境变量

#### 包

我们已经知道了JS模块的基本单位是单个JS文件，但复杂些的模块往往由多个子模块组成。为了便于管理和使用，我们可以把由多个子模块组成的大模块称做`包`，并把所有子模块放在同一个目录里。

在组成一个包的所有子模块中，需要有一个入口模块，入口模块的导出对象被作为包的导出对象。

例：一个名为cat的包的入口函数main.js

```javascript
var head = require('./head');
var body = require('./body');

exports.create = function (name)
{
  return
  {
    name:name,
    head:head.create(),
    body:body.create()
  }
}
```

在其他模块使用包的时候，需要加载包的入口模块。接上例，使用：

```javascript
require('/cat/main')
```

就可以引入这个模块，但是入口模块名称出现在路径里看上去不是个好主。因此需要做一些额外的工作。

将main.js改名为index.js：

```javascript
require('/cat')
```

index.js是默认的入口函数，因此引用cat包就更加直观。

也可以在cat目录下加入package.json：

```javascript
{
  "name": "cat",
  "main": "./lib/main.js"
}
```

一个标准的工程目录

```javascript
- /home/user/workspace/node-echo/   # 工程目录
    - bin/                          # 存放命令行相关代码
        node-echo
    + doc/                          # 存放文档
    - lib/                          # 存放API相关代码
        echo.js
    - node_modules/                 # 存放三方包
        + argv/
    + tests/                        # 存放测试用例
    package.json                    # 元数据文件
    README.md                       # 说明文件
```

## 文件操作

复制文件：

```javascript
var fs = require('fs');

function copy(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));
```

`process`是一个全局变量，可通过`process.argv`获得命令行参数。由于`argv[0]`固定等于NodeJS执行程序的绝对路径，`argv[1]`固定等于主模块的绝对路径，因此第一个命令行参数从`argv[2]`这个位置开始。

上述代码只能复制较小的文件，如果文件很大，则不能将所有的内容读取到内存中。因此需要使用流：

```javascript
//更改copy函数

function copy(src, dst)
{
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}
```



## API走马观花

### Buffer（数据块）

[官方文档]: http://nodejs.org/api/buffer.html

js中只有String类型，因此node提供一个Buffer的全局构造函数来提供对二进制对象的操作。

```javascript
var bin = new Buffer([0x68, 0x65, 0x6c, 0x6f]);

bin[0]; // => 0x68;
```

Buffer与字符串的转化

```javascript
var str = bin.toString('utf-8'); //=>"hello"
var bin = new Buffer(str, 'utf-8');
```

`Buffer`与字符串有一个重要区别。字符串是只读的，并且对字符串的任何修改得到的都是一个新字符串，原字符串保持不变。至于`Buffer`，更像是可以做指针操作的C语言数组。例如，可以用`[index]`方式直接修改某个位置的字节。

而`.slice`方法也不是返回一个新的`Buffer`，而更像是返回了指向原`Buffer`中间的某个位置的指针，如下所示。

```javascript
[ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]
    ^           ^
    |           |
   bin     bin.slice(2)
```

也因此，如果想要拷贝一份`Buffer`，得首先创建一个新的`Buffer`，并通过`.copy`方法把原`Buffer`中的数据复制过去。这个类似于申请一块新的内存，并把已有内存中的数据复制过去。

### Stream（数据流）

[官方文档]: http://nodejs.org/api/stream.html

当内存中无法一次装下需要处理的数据的时候，就需要用到数据流。

以上文的大文件拷贝为例，我们可以为数据源创建一个只读数据流：

```javascript
var rs = fs.createReadStream(pathname);

rs.on('data', function(chunk){
  doSomething(chunk);
});

rs.on('end',function(){
  clearUp();
});
```

`Stream`基于事件机制工作，所有`Stream`的实例都继承于NodeJS提供的[EventEmitter](http://nodejs.org/api/events.html)。

data 事件会在每一个小数据块到达时触发，并且dosomething函数是异步执行的。

有了数据流，还需要有一个流入的地方，因此可以再创建一个写入数据流，更改上面的代码：

```javascript
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', function(chunk){
  ws.write(chunk);
});

rs.on('end',function(){
  ws.end();
});
```

上述代码在每一次有数据流入时都开始写入，如果写入的速度跟不上流入的速度时，文件就会被缓存。为了防止缓存爆仓，可以根据.write方法的返回值来判断数据是否已经写入完成。

```javascript
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', function (chunk) {
    if (ws.write(chunk) === false) {
        rs.pause();
    }
});

rs.on('end', function () {
    ws.end();
});

ws.on('drain', function () {
    rs.resume();
});
```

以上代码实现了数据从只读数据流到只写数据流的搬运，并包括了防爆仓控制。因为这种使用场景很多，例如上边的大文件拷贝程序，NodeJS直接提供了`.pipe`方法来做这件事情，其内部实现方式与上边的代码类似。