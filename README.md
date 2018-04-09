##使用说明

### 一、引入 paystar-js

* script 标签方式

  ```html
  <script src="/path/to/paystar.js"></script>
  ```

  ​

* Browserify 打包方式

  #### 安装

  ```shell
  npm install paystar-js
  ```

  #### 使用

  ```javascript
  var paystar = require('paystar-js');
  // or es6 
  import paystar from 'paystar-js';
  ```

### 二、使用服务端创建的 charge 发起支付

* Web 前端调用

```javascript
paystar.pay(charge, (status, error) => {
    if (status === 'success') {
        // 微信公众号(wx_pub) 支付成功的结果，其他支付结果会重定向到 extra 中对于的 Url。
    } else if (status === 'cancel') {
        // 微信公众号支付取消支付
    } else if (status === 'fail') {
		// charge 不正确 或 微信公众号支付失败时。
    }
});
```

* 微信小程序使用

```javascript
import paystar from 'paystar.js 绝对路径';

paystar.pay(charge, (status, error) => {
    if (status === 'success') {
        // success
    } else {
        console.log(`${status}：${error.msg}，${error.extra}`);
    }
})
```

