# MBTI测试服务 MBIT Test

一个用于MBTI人格测试的MCP服务器，支持AI助手引导用户完成人格测试并给出结果分析。
An MCP server for the MBTI personality test, supporting AI assistants to guide users through the personality test and provide result analysis.## 工具列表 Tool List

本MCP服务封装下列工具，可让模型通过标准化接口调用以下功能。 本MCP服务封装下列工具，可让模型通过标准化接口调用以下功能。

| 工具 Tool   | 描述 Description         |
|-------|--------------------|
| start_mbti_test | 开始MBTI人格测试。用户可以选择测试类型：simplified(简化版28题)或cognitive(认知功能版48题)。返回第一道题目和测试会话状态。 |
| answer_question | 提交当前问题的答案(1-5分)，并获取下一题或测试进度。需要传入完整的测试会话状态。 |
| get_progress | 查询当前测试进度。需要传入测试会话状态。 |
| calculate_mbti_result | 根据所有答案计算最终的MBTI类型和详细结果。需要传入完整的测试会话状态。 |


## 检查服务 ## Inspector

工具在线测试： [https://mcp.xiaobenyang.com/inspector/1777316659619843](https://mcp.xiaobenyang.com/inspector/1777316659619843)

Online Tool test [https://mcp.xiaobenyang.com/inspector/1777316659619843](https://mcp.xiaobenyang.com/inspector/1777316659619843)

## 服务配置 MCP Server Config


> #### 如何获取 XBY-APIKEY ？ How to get XBY-APIKEY ?
> 访问小笨羊科技网站 [https://xiaobenyang.com](https://xiaobenyang.com)，注册用户即可获得APIKEY
> Visit XiaoBenYang website [https://xiaobenyang.com](https://xiaobenyang.com), register and get the APIKEY.

### SSE
```json
{
  "mcpServers": {
    "MBTI测试服务": {
      "headers": {
        "XBY-APIKEY": "<YOUR_XBY_APIKEY>"
      },
      "type": "sse",
      "url": "https://mcp.xiaobenyang.com/1777316659619843/sse"
    }
  }
}
```
### STREAMABLE HTTP
```json
{
  "mcpServers": {
    "MBTI测试服务": {
      "headers": {
        "XBY-APIKEY": "<YOUR_XBY_APIKEY>"
      },
      "type": "streamable_http",
      "url": "https://mcp.xiaobenyang.com/1777316659619843/mcp"
    }
  }
}
```
### STDIO
```json
{
    "mcpServers": {
        "MBTI测试服务": {
          "command": "npx",
          "args": [
            "-y",
            "xiaobenyang-mcp"
          ],
          "env": {
            "XBY_APIKEY": "<YOUR_XBY_APIKEY>",
            "mcpId": "1777316659619843",
          },
          "transport": "stdio"
        }
      }
}

```
