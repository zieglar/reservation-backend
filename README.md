## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start:backend

# watch mode
$ yarn run start:dev:backend

# production mode
$ yarn run start:prod:backend
```

## Run tests

```bash
# unit test
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Deployment

项目通过`build`以后可以将`dist/apps/backend`目录下的文件上传到服务器上运行。

命令为 `node dist/apps/backend/main.js`，也可以使用`pm2`等工具进行守护进程的管理。
部署时需要根据 `.env.sample` 文件创建 `.env` 文件，配置数据库连接信息等。

员工通过页面注册后在服务端控制台会输出4位数字验证码，员工需要联系管理员获取该验证码登录以后才能激活账号正常使用。


## 技术选型

这个项目使用了以下技术栈:

1. **后端框架**
- NestJS: 一个基于 Node.js 的渐进式框架
    - 提供了完整的企业级应用架构
    - 支持 TypeScript，提供强类型和面向对象编程
    - 内置依赖注入、模块化设计
    - 适合构建可扩展的服务端应用

2. **API 实现**
- GraphQL: 使用 `@nestjs/graphql` 实现
    - 相比 REST API 提供更灵活的数据查询
    - 避免过度获取和请求次数问题
    - 强类型定义,前后端协作更顺畅

3. **数据库操作**
- 使用自定义的 `IDataService` 接口进行数据访问
    - 提供了统一的数据访问层
    - 支持实体的 CRUD 操作
    - 便于切换不同的数据库实现

4. **项目工具**
- Yarn: 包管理工具
    - 比 npm 更快的依赖安装速度
    - 更好的依赖锁定机制
- Jest: 单元测试框架
    - 内置断言和 Mock 功能
    - 支持异步测试
    - 良好的测试覆盖率报告

这些技术选择主要基于:
1. 开发效率: TypeScript + NestJS 提供了完善的开发体验
2. 可维护性: 模块化架构和强类型系统让代码更易维护
3. 可测试性: Jest 让单元测试编写变得简单
4. 性能考虑: GraphQL 可以优化接口性能
5. 灵活性: IDataService 接口让数据访问层更灵活
6. restful API: 搭配 restful 补足 GraphQL 的授权
