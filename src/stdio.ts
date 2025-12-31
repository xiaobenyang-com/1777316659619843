#!/usr/bin/env node

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {getServer, state} from './mcp.js';

async function waitForLoadingComplete(delay = 500) {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            // 轮询检查加载状态
            if (!state.isLoading) {
                clearInterval(checkInterval); // 清除定时器，停止轮询
                resolve(void 0);
                console.log('加载完成，停止轮询');
            } else {
                console.log('500 毫秒后执行（等待加载完成）');
            }
        }, delay);
    });
}

function getIsLoading() {
    return state.isLoading;
}

async function runMcpServer() {
    try {
        console.log("state.isLoading: " + getIsLoading());

        await waitForLoadingComplete(500);

        const transport = new StdioServerTransport();
        // 传入 mcpID（根据你的实际业务获取 mcpID）
        const serverInstance = await getServer();

        await serverInstance.connect(transport);

        console.log(`MCP server is running on stdio.`);
    } catch (error) {
        console.error(`Failed to run MCP server on stdio: `, error);
    }
}

runMcpServer();