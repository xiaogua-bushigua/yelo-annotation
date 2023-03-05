# yelo - annotation 🚀



## 🧩 项目介绍

🪡 这是一个专门为自然语言处理 (NLP) 任务搭建的文本标注平台，支持实体标注、关系标注和嵌套实体标注；支持在线标注和后端数据渲染。

🔌本项目的初衷是前端项目练习，并为国内 NLP 工具的创造尽一些力。不管是想要学习前端标注技术的同学，还是想应用本工具的同学，希望能帮助到你。

🛠技术栈为：`vue3+ts+pinia+yelo-ui`；其中标注技术采用 svg 渲染；[yelo-ui](https://www.npmjs.com/package/yelo-ui) 提供了支持 “新手引导” 功能的组件支持。

在线使用：http://175.24.176.28:8003/



## 🧩 基本概念

### ✨ 区域

​	实体之间存在嵌套或者单个实体所占的部分，例如 “右耳偶发耳鸣” ，其中区域 1：“右耳” = “右”(方位) + “右耳”(解剖结构) 两个实体；区域2：”耳鸣“(症状)

### ✨ e、s、f

​	每个实体对应的唯一标识符的组成；e 表示实体区域；s 表示某一实体在所在区域里的出现次序（右：s = 1，右耳：s = 2）；f 表示该实体文本在整个段落中出现的次数

### ✨ id

​	每个实体的唯一标识符



## 🧩 后端数据格式

```json
{
  "text": "治疗后，右耳溢液无明显好转且伴血样分泌物，无明显痛感",
  "entities": [
    {
      "e": 1,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "右",
          "label": "方位"
        },
        {
          "s": 2,
          "f": 1,
          "text": "右耳",
          "label": "解剖结构"
        },
        {
          "s": 3,
          "f": 1,
          "text": "右耳溢液",
          "label": "临床表现"
        }
      ]
    },
    {
      "e": 2,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "无",
          "label": "否定"
        }
      ]
    },
    {
      "e": 3,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "好转",
          "label": "变化趋势"
        }
      ]
    },
    {
      "e": 4,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "血样分泌物",
          "label": "临床表现"
        }
      ]
    },
    {
      "e": 5,
      "entities": [
        {
          "s": 1,
          "f": 2,
          "text": "无",
          "label": "否定"
        }
      ]
    }
  ],
  "relations": [
    {
      "relationName": "判断",
      "relatedEntities": ["e3s1f1", "e1s3f1"]
    },
    {
      "relationName": "病情",
      "relatedEntities": ["e3s1f1", "e2s1f1"]
    }
  ]
}
```

### ✨ 字段说明

| text     | entities | relations |
| -------- | -------- | --------- |
| 原始文本 | 实体信息 | 关系信息  |

### ✨ 实体信息

| e            | s                  | f                            | text     | label    |
| ------------ | ------------------ | ---------------------------- | -------- | -------- |
| 实体所在区域 | 区域内的第几个实体 | 该实体名称在原始文本出现次序 | 实体文本 | 实体标签 |

### ✨ 关系信息

| relationName | relatedEntites[0]   | relatedEntites[1]   |
| ------------ | ------------------- | ------------------- |
| 关系名称     | 关系的终点实体的 id | 关系的起点实体的 id |

