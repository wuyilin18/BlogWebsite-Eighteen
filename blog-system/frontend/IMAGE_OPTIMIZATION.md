# 图片处理规范

## 1. 预处理步骤

```bash
# 安装依赖工具
brew install imagemagick webp

# 批量处理脚本 (scripts/process-images.sh)
#!/bin/bash
for file in ./raw-images/*.{png,jpg}; do
  filename=$(basename -- "$file")
  extension="${filename##*.}"
  filename="${filename%.*}"

  # 步骤1: 裁剪透明区域
  convert "$file" -trim +repage "./temp/${filename}_trimmed.$extension"

  # 步骤2: 调整尺寸 (最大宽度2000px)
  convert "./temp/${filename}_trimmed.$extension" -resize 2000x -quality 90 "./processed/${filename}.webp"

  # 步骤3: 生成预览图
  convert "./temp/${filename}_trimmed.$extension" -resize 400x -quality 80 "./previews/${filename}_preview.webp"

  echo "Processed: $filename.$extension → $filename.webp"
done
```
