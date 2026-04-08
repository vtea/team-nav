package com.tuituidan.openhub.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 将历史数据中的 {@code /images/日期/文件} 请求转发到 {@code /ext-resources/images/...}，
 * 由 {@link com.tuituidan.openhub.config.WebAppConfig} 已注册的磁盘资源映射提供文件。
 * <p>
 * 使用 Controller 而非仅增加 ResourceHandler，以便优先于 Boot 默认的 {@code classpath:/static/**}，
 * 避免继续出现 {@code No static resource images/...}。
 */
@Controller
public class LegacyImageForwardController {

    /**
     * @param request  当前请求
     * @param response 响应
     * @throws ServletException 转发异常
     * @throws IOException      IO 异常
     */
    @GetMapping("/images/**")
    public void forwardToExtResources(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        if (!uri.startsWith("/images/")) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        String rest = uri.substring("/images/".length());
        RequestDispatcher dispatcher = request.getRequestDispatcher("/ext-resources/images/" + rest);
        dispatcher.forward(request, response);
    }
}
