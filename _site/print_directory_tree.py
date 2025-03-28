import os

def print_directory_tree(folder_path, indent="", prefix=""):
    # 获取文件夹中的所有文件和子文件夹
    items = sorted(os.listdir(folder_path))
    for index, item in enumerate(items):
        # 判断是否为最后一个项目
        is_last = index == len(items) - 1
        # 构建前缀符号
        current_prefix = "└── " if is_last else "├── "
        # 完整路径
        item_path = os.path.join(folder_path, item)
        # 打印当前项
        print(f"{indent}{prefix}{current_prefix}{item}")
        # 如果是文件夹，递归调用
        if os.path.isdir(item_path):
            new_indent = indent + ("    " if is_last else "│   ")
            print_directory_tree(item_path, new_indent, "")

# 示例：打印指定文件夹的文件树
folder_path = r"D:\Repositories\Koar-create.github.io"  # 替换为你的文件夹路径
print(f"{os.path.basename(folder_path)}/")
print_directory_tree(folder_path)