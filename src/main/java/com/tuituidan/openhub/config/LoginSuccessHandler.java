package com.tuituidan.openhub.config;

import com.tuituidan.openhub.bean.entity.RoleUser;
import com.tuituidan.openhub.bean.entity.User;
import com.tuituidan.openhub.bean.entity.UserStar;
import com.tuituidan.openhub.repository.RoleUserRepository;
import com.tuituidan.openhub.repository.UserStarRepository;
import com.tuituidan.openhub.util.SecurityUtils;
import java.io.IOException;
import java.util.stream.Collectors;
import jakarta.annotation.Resource;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

/**
 * 登录成功：表单登录走重定向；REST {@code /api/v1/quick/login} 只写 Session，禁止 302，
 * 否则响应已提交，控制器无法返回 JSON，且会话可能未正确持久化。
 *
 * @author tuituidan
 * @version 1.0
 * @date 2022/10/26
 */
@Component
public class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Resource
    private UserStarRepository userStarRepository;

    @Resource
    private RoleUserRepository roleUserRepository;

    /**
     * 无状态实现，不注册为 Bean，避免与 {@link SecurityConfig} 形成构造期循环依赖。
     */
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();
        user.setPassword(null);
        user.setStarCardIds(userStarRepository.findByUserId(user.getId()).stream()
                .map(UserStar::getCardId).collect(Collectors.toSet()));
        user.setRoleIds(roleUserRepository.findByUserId(user.getId()).stream()
                .map(RoleUser::getRoleId).collect(Collectors.toSet()));
        if (!SecurityUtils.isAdmin(user)) {
            if (isRestQuickLogin(request)) {
                persistSession(request, response, authentication);
                return;
            }
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }
        Authentication newAuthentication = new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
                authentication.getCredentials(),
                AuthorityUtils.createAuthorityList("admin"));
        SecurityContextHolder.getContext().setAuthentication(newAuthentication);
        if (isRestQuickLogin(request)) {
            persistSession(request, response, newAuthentication);
            return;
        }
        super.onAuthenticationSuccess(request, response, newAuthentication);
    }

    /**
     * 是否为前端 Ajax 调用的快捷登录接口（与表单 {@code /login} 区分）。
     */
    private static boolean isRestQuickLogin(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri != null && uri.contains("/quick/login");
    }

    /**
     * 将当前 SecurityContext 写入 HttpSession，不发送重定向。
     */
    private void persistSession(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {
        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

}
