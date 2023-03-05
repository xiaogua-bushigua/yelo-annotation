upOverlap: 上层最大重叠次数

downOverlap: 下层最大重叠次数

ids: 按照出现次序排列；是每个实体的id，e为存在重叠的实体组别，s为重叠组内的各个实体，s的排列顺序为实体类别名称长度的升序

entityNames：key是实体的id，value是实体的类别名称

relations: 是一个对象数组，内层(较窄)的在前

relations.relationName：关系名

relations.relatedEntities：一个关系涉及到的实体，终点在前，起点在后

html：整段文本，实体使用span标签包裹(<span>糖尿病</span>)，内部要包含id，对于重叠的实体组，越里面的s值越小
