# :zzz:

## MAC 通过 SMB 访问 Windows 共享文件夹

[SMB-Server Message Block](https://zh.wikipedia.org/wiki/%E4%BC%BA%E6%9C%8D%E5%99%A8%E8%A8%8A%E6%81%AF%E5%8D%80%E5%A1%8A)

## Widows 设置

1. `Win + R` 打开运行窗口，输入 `ipconfig` 查看本机 IP 地址记下来。

2. 创建一个新 Windows 用户，设置密码，记住用户名和密码。
   ![create-account](/others-img/new-local-account.png)

3. `面板控制`打开`SMB直连`，如果没打开的话。
   ![smb](/others-img/turn-on-smb.png)

4. 共享文件夹。
   ![share-folder](/others-img/share-auth.png)

## MAC 连接

1. `Finder` -> `前往` -> `连接服务器`。

2. 输入 `smb://<windows-ip>`，点击连接。

3. 输入 Windows 用户名和密码。（刚刚创建的）
