# :zzz:

## 硬链接（Hard Link）

硬链接是**直接指向文件数据的不同目录项**，多个硬链接实际上共享**同一物理存储**，只要硬连接数量大于 0，文件就不会被删除。

特点：

- 硬链接文件和原文件没有区别，修改一个，所有硬链接都会反映相同的更改。

- 不能跨文件系统（分区），必须在同一分区内创建。

- 不能对目录创建硬链接（防止文件系统循环）。

- 删除任意一个硬链接不会影响其他硬链接，只有最后一个被删除时，数据才会真正从磁盘中移除。

示例：

```bash
# windows powershell / cmd
fsutil hardlink create hardlink.txt original.txt
```

## 软链接（Symbolic Link/Symlink）

软链接是**一个特殊的文件，它只包含指向目标文件的路径**。访问软链接时，操作系统会**解析路径**，然后访问原始文件。

特点：

- 类似快捷方式，本质上是一个路径引用，而非直接指向数据。

- 可以跨分区和文件系统，因为只是存储路径信息。

- 可以指向目录，所以`pnpm`等工具可以用它来管理依赖。

- 如果原始文件被删除，软链接会变成*断链*（Dangling Link），因为它指向的路径不再有效。

- 删除软链接不会影响原始文件。

示例：

```bash
# windows cmd
mklink syslink.txt original.txt

# windows powershell
New-Item -ItemType SymbolicLink -Path "syslink.txt" -Target "original.txt"
```
