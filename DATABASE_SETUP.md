# MongoDB 数据库设置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下内容：

```
MONGODB_URI=mongodb+srv://axelrod:{your_password}@cluster0.f7mwvsp.mongodb.net/
```

请将 `{your_password}` 替换为你的实际MongoDB密码。

## 数据库结构

MongoDB会自动创建数据库和集合。项目使用以下结构：

### 数据库
- **数据库名**: `worth-calculator`

### 集合 (Collections)

1. **salary_inputs** - 薪资输入数据
   ```javascript
   {
     _id: ObjectId,
     ip: String,           // 客户端IP地址
     salary: String,        // 薪资数值
     timestamp: Date,       // 输入时间
     action: "salary_input", // 操作类型
     createdAt: Date        // 创建时间
   }
   ```

2. **form_submissions** - 完整表单提交数据
   ```javascript
   {
     _id: ObjectId,
     ip: String,           // 客户端IP地址
     salary: String,        // 薪资数值
     timestamp: Date,       // 提交时间
     action: "form_submit", // 操作类型
     formData: Object,      // 完整的表单数据
     createdAt: Date        // 创建时间
   }
   ```

## 功能说明

1. **薪资输入失焦保存**：当用户在年薪输入框中输入数值并失焦时，会自动保存用户IP、当前时间和薪资数据到 `salary_inputs` 集合。

2. **查看报告保存**：当用户点击"查看我的工作性价比报告"按钮时，会保存用户IP、当前时间和完整的表单数据到 `form_submissions` 集合。

## API 端点

- `POST /api/save-salary` - 保存薪资数据到 `salary_inputs` 集合
- `POST /api/save-form-data` - 保存完整表单数据到 `form_submissions` 集合
- `GET /api/test-mongodb` - 测试MongoDB连接和查看数据库统计信息

## 部署到 Vercel

确保在 Vercel 项目设置中添加 `MONGODB_URI` 环境变量。

## 数据查询示例

### 查询所有薪资输入
```javascript
db.salary_inputs.find().sort({createdAt: -1})
```

### 查询所有表单提交
```javascript
db.form_submissions.find().sort({createdAt: -1})
```

### 按IP地址查询
```javascript
db.salary_inputs.find({ip: "用户IP地址"})
```

### 按时间范围查询
```javascript
db.salary_inputs.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-12-31")
  }
})
``` 