# 数据库设置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下内容：

```
DATABASE_URL=postgres://default:{your_password}@ep-winter-water-817761-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require
```

请将 `{your_password}` 替换为你的实际数据库密码。

## 数据库表结构

确保你的 Neon 数据库中已经创建了以下表：

```sql
CREATE TABLE "user-info" (
    id UUID PRIMARY KEY,
    ip VARCHAR(64) NULL,
    salary VARCHAR(64) NULL,
    other JSON NOT NULL DEFAULT '{}'
);
```

## 功能说明

1. **薪资输入失焦保存**：当用户在年薪输入框中输入数值并失焦时，会自动保存用户IP、当前时间和薪资数据到数据库。

2. **查看报告保存**：当用户点击"查看我的工作性价比报告"按钮时，会保存用户IP、当前时间和完整的表单数据到数据库。

## API 端点

- `POST /api/save-salary` - 保存薪资数据
- `POST /api/save-form-data` - 保存完整表单数据

## 部署到 Vercel

确保在 Vercel 项目设置中添加 `DATABASE_URL` 环境变量。 